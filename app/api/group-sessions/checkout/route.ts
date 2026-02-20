import { NextRequest, NextResponse } from "next/server";
import {
  createPlayerSignup,
  getGroupSessionById,
  updatePlayerSignupCheckout,
} from "@/app/lib/db/queries";
import { getStripe } from "@/app/lib/stripe";

export const dynamic = "force-dynamic";
const GROUP_TIME_ZONE = "America/Phoenix";

type CheckoutBody = {
  groupSessionId?: number;
  firstName?: string;
  lastName?: string;
  emergencyContact?: string;
  contactPhone?: string;
  contactEmail?: string;
  foot?: string;
  team?: string;
  notes?: string;
};

function cleanText(input: unknown) {
  return (input || "").toString().trim();
}

function addMinutes(input: string | Date, minutes: number) {
  return new Date(new Date(input).getTime() + minutes * 60_000);
}

function formatTimeRange(startInput: string, endInput: string | null) {
  const start = new Date(startInput);
  const end = endInput ? new Date(endInput) : addMinutes(start, 75);
  const format = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: GROUP_TIME_ZONE,
  });
  return `${format.format(start)} - ${format.format(end)}`;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      );
    }
    const stripe = getStripe();

    const body = (await request.json()) as CheckoutBody;

    const groupSessionId = Number(body.groupSessionId);
    const firstName = cleanText(body.firstName);
    const lastName = cleanText(body.lastName);
    const emergencyContact = cleanText(body.emergencyContact);
    const contactPhone = cleanText(body.contactPhone);
    const contactEmail = cleanText(body.contactEmail).toLowerCase();
    const foot = cleanText(body.foot);
    const team = cleanText(body.team);
    const notes = cleanText(body.notes);

    if (!Number.isInteger(groupSessionId) || groupSessionId <= 0) {
      return NextResponse.json(
        { error: "Invalid group session id" },
        { status: 400 }
      );
    }

    if (!firstName || !lastName || !emergencyContact || !contactEmail) {
      return NextResponse.json(
        { error: "Missing required player information" },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return NextResponse.json(
        { error: "A valid contact email is required" },
        { status: 400 }
      );
    }

    const session = await getGroupSessionById(groupSessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (new Date(session.session_date).getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Session has already passed" },
        { status: 400 }
      );
    }

    if (session.spots_left <= 0) {
      return NextResponse.json(
        { error: "This session is fully booked" },
        { status: 400 }
      );
    }

    const price = Number(session.price || 0);
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: "Session price is not configured" },
        { status: 400 }
      );
    }

    const signup = await createPlayerSignup({
      group_session_id: groupSessionId,
      first_name: firstName,
      last_name: lastName,
      emergency_contact: emergencyContact,
      contact_phone: contactPhone || null,
      contact_email: contactEmail,
      foot: foot || null,
      team: team || null,
      notes: notes || null,
    });

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      request.headers.get("origin") ||
      "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteUrl}/group-sessions/${session.id}?checkout=success`,
      cancel_url: `${siteUrl}/group-sessions/${session.id}?checkout=cancelled`,
      customer_email: contactEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(price * 100),
            product_data: {
              name: session.title,
              description: `${new Date(session.session_date).toLocaleString("en-US", {
                dateStyle: "full",
                timeStyle: "short",
                timeZone: GROUP_TIME_ZONE,
              })} (${formatTimeRange(session.session_date, session.session_date_end)})${
                session.location ? ` • ${session.location}` : ""
              }`,
            },
          },
        },
      ],
      metadata: {
        group_session_id: String(session.id),
        player_signup_id: String(signup.id),
      },
    });

    await updatePlayerSignupCheckout(
      signup.id,
      checkoutSession.id,
      typeof checkoutSession.payment_intent === "string"
        ? checkoutSession.payment_intent
        : null
    );

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Failed to create checkout URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ checkoutUrl: checkoutSession.url }, { status: 200 });
  } catch (error) {
    console.error("Failed to create checkout session", error);
    return NextResponse.json(
      { error: "Failed to start checkout" },
      { status: 500 }
    );
  }
}
