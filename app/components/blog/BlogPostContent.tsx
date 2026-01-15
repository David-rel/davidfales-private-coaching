interface BlogPostContentProps {
  htmlContent: string;
}

export default function BlogPostContent({ htmlContent }: BlogPostContentProps) {
  return (
    <div
      className="blog-post-content max-w-none text-gray-900"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
