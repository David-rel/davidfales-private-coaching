#!/usr/bin/env node

const { put } = require('@vercel/blob');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config();

// Create database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Helper function to get image dimensions
async function getImageDimensions(filePath) {
  try {
    const { default: sizeOf } = await import('image-size');
    const dimensions = sizeOf(filePath);
    return {
      width: dimensions.width,
      height: dimensions.height
    };
  } catch (error) {
    console.error(`Error getting dimensions for ${filePath}:`, error.message);
    return { width: null, height: null };
  }
}

// Helper function to generate a descriptive title
function generateTitle(index, total) {
  const titles = [
    "Private Training Session - Ball Control",
    "One-on-One Soccer Training",
    "Private Coaching Session - Dribbling",
    "Individual Soccer Training",
    "Personal Soccer Coaching",
    "Private Training - Technical Skills",
    "One-on-One Training Session",
    "Private Soccer Practice",
    "Individual Training - Ball Mastery",
    "Private Coaching - Footwork",
    "Personal Training Session",
    "Private Soccer Development",
    "One-on-One Technical Training",
    "Individual Skill Development",
    "Private Training - Movement",
    "Personal Soccer Session",
    "Private Coaching Moment",
    "Individual Soccer Practice",
    "Private Training Excellence",
    "One-on-One Development Session",
    "Private Soccer Training Action",
    "Individual Coaching Session",
    "Private Training Focus"
  ];
  
  return titles[index] || `Private Soccer Training Session ${index + 1}`;
}

// Helper function to create slug
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

// Check if slug exists in database
async function checkSlugExists(slug) {
  const result = await pool.query(
    'SELECT id FROM photos WHERE slug = $1',
    [slug]
  );
  return result.rows.length > 0;
}

// Generate unique slug
async function generateUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;
  
  while (await checkSlugExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

// Main function to process and upload photos
async function processPhotos() {
  const photosDir = path.join(__dirname, '../photos');
  
  // Check if photos directory exists
  if (!fs.existsSync(photosDir)) {
    console.error('Photos directory not found!');
    process.exit(1);
  }

  // Get all image files
  const files = fs.readdirSync(photosDir)
    .filter(file => /\.(jpe?g|png|gif|webp)$/i.test(file))
    .sort();

  console.log(`Found ${files.length} photos to process\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const filePath = path.join(photosDir, filename);
    
    try {
      console.log(`[${i + 1}/${files.length}] Processing: ${filename}`);

      // Get file stats
      const stats = fs.statSync(filePath);
      const fileSize = stats.size;

      // Get image dimensions
      const { width, height } = await getImageDimensions(filePath);

      // Read file as buffer
      const fileBuffer = fs.readFileSync(filePath);
      
      // Create a File-like object for Vercel Blob
      const file = new File([fileBuffer], filename, {
        type: `image/${path.extname(filename).slice(1)}`
      });

      // Upload to Vercel Blob
      console.log('  → Uploading to Vercel Blob Storage...');
      const blob = await put(`gallery/${filename}`, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN
      });

      console.log('  ✓ Uploaded to:', blob.url);

      // Generate title and slug
      const title = generateTitle(i, files.length);
      const baseSlug = slugify(title);
      const slug = await generateUniqueSlug(baseSlug);
      const altText = title;

      // Insert into database
      console.log('  → Adding to database...');
      const id = crypto.randomUUID();
      await pool.query(
        `INSERT INTO photos (
          id, title, description, slug, image_url, alt_text,
          meta_title, meta_description, keywords,
          photo_date, photographer, location, category,
          width, height, file_size,
          featured, published, display_order
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
        )`,
        [
          id,
          title,
          'Private one-on-one soccer training session in Mesa/Gilbert area.',
          slug,
          blob.url,
          altText,
          `${title} - Private Soccer Training`,
          'Professional private soccer coaching session focusing on individual skill development and technical training.',
          ['private training', 'soccer coaching', 'one-on-one training', 'mesa', 'gilbert', 'arizona'],
          null, // photo_date
          'David Fales', // photographer
          'Mesa/Gilbert, Arizona', // location
          'Private Training Sessions', // category
          width,
          height,
          fileSize,
          false, // featured
          true, // published
          i // display_order
        ]
      );

      console.log(`  ✓ Added to database with ID: ${id}`);
      console.log(`  ✓ Slug: ${slug}\n`);
      
      successCount++;
    } catch (error) {
      console.error(`  ✗ Error processing ${filename}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n========================================');
  console.log(`Processing complete!`);
  console.log(`✓ Success: ${successCount}`);
  console.log(`✗ Errors: ${errorCount}`);
  console.log(`Total: ${files.length}`);
  console.log('========================================\n');

  await pool.end();
}

// Run the script
processPhotos().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
