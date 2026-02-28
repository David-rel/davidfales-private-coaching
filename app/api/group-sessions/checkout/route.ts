import { NextRequest, NextResponse } from "next/server";
import {
  createPlayerSignup,
  getGroupSessionById,
  provisionParentAndPlayerForGroupSignup,
  updatePlayerSignupCheckout,
} from "@/app/lib/db/queries";
import { getStripe } from "@/app/lib/stripe";

export const dynamic = "force-dynamic";
const GROUP_TIME_ZONE = "America/Phoenix";

type CheckoutBody = {
  groupSessionId?: number | string;
  firstName?: string;
  lastName?: string;
  birthday?: string;
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

function getSessionIdFromPath(pathname: string) {
  const match = pathname.match(/\/group-sessions\/(\d+)(?:\/)?$/);
  if (!match) return null;
  return Number(match[1]);
}

function parseGroupSessionInput(input: unknown) {
  const raw = cleanText(input);
  if (!raw) return { id: null as number | null, query: null as URLSearchParams | null };

  const fromRaw = Number(raw);
  if (Number.isInteger(fromRaw) && fromRaw > 0) {
    return { id: fromRaw, query: null as URLSearchParams | null };
  }

  try {
    const url = new URL(raw);
    const id = getSessionIdFromPath(url.pathname);
    return { id, query: url.searchParams };
  } catch {
    return { id: null as number | null, query: null as URLSearchParams | null };
  }
}

function cleanTextFromBodyOrQuery(
  bodyValue: unknown,
  query: URLSearchParams | null,
  queryKey: string
) {
  return cleanText(bodyValue || query?.get(queryKey) || "");
}

function parseBirthday(input: unknown) {
  const raw = cleanText(input);
  if (!raw) return null;

  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const utcDate = new Date(Date.UTC(year, month - 1, day));
    if (
      utcDate.getUTCFullYear() !== year ||
      utcDate.getUTCMonth() + 1 !== month ||
      utcDate.getUTCDate() !== day
    ) {
      return null;
    }
    return { year, month, day, dateOnly: raw };
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;

  const year = parsed.getUTCFullYear();
  const month = parsed.getUTCMonth() + 1;
  const day = parsed.getUTCDate();
  const dateOnly = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return { year, month, day, dateOnly };
}

function getAgeFromBirthdayParts(birthday: {
  year: number;
  month: number;
  day: number;
}) {
  const now = new Date();
  let age = now.getFullYear() - birthday.year;
  const monthDelta = now.getMonth() + 1 - birthday.month;
  if (
    monthDelta < 0 ||
    (monthDelta === 0 && now.getDate() < birthday.day)
  ) {
    age -= 1;
  }
  if (!Number.isInteger(age) || age < 1 || age > 99) return null;
  return age;
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

    const parsedGroupSession = parseGroupSessionInput(body.groupSessionId);
    const groupSessionId = parsedGroupSession.id;
    const firstName = cleanTextFromBodyOrQuery(
      body.firstName,
      parsedGroupSession.query,
      "kidFirstName"
    );
    const lastName = cleanTextFromBodyOrQuery(
      body.lastName,
      parsedGroupSession.query,
      "kidLastName"
    );
    const emergencyContact = cleanTextFromBodyOrQuery(
      body.emergencyContact,
      parsedGroupSession.query,
      "parentName"
    );
    const contactPhone = cleanTextFromBodyOrQuery(
      body.contactPhone,
      parsedGroupSession.query,
      "phone"
    );
    const contactEmail = cleanTextFromBodyOrQuery(
      body.contactEmail,
      parsedGroupSession.query,
      "email"
    ).toLowerCase();
    const foot = cleanTextFromBodyOrQuery(
      body.foot,
      parsedGroupSession.query,
      "preferredFoot"
    );
    const team = cleanTextFromBodyOrQuery(body.team, parsedGroupSession.query, "team");
    const notes = cleanTextFromBodyOrQuery(body.notes, parsedGroupSession.query, "notes");
    const birthday = cleanTextFromBodyOrQuery(
      body.birthday,
      parsedGroupSession.query,
      "birthday"
    );
    const parsedBirthday = parseBirthday(birthday);
    const playerAge = parsedBirthday ? getAgeFromBirthdayParts(parsedBirthday) : null;

    if (groupSessionId === null) {
      return NextResponse.json(
        { error: "Invalid group session id" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(groupSessionId) || groupSessionId <= 0) {
      return NextResponse.json(
        { error: "Invalid group session id" },
        { status: 400 }
      );
    }
    const resolvedGroupSessionId = groupSessionId;

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
    if (!parsedBirthday) {
      return NextResponse.json(
        { error: "A valid birthday is required" },
        { status: 400 }
      );
    }
    if (playerAge === null) {
      return NextResponse.json(
        { error: "A valid player age is required" },
        { status: 400 }
      );
    }

    const session = await getGroupSessionById(resolvedGroupSessionId);

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

    const crmContextNote = `Session booked via group checkout (${session.title} on ${new Date(
      session.session_date
    ).toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: GROUP_TIME_ZONE,
    })})`;

    const accountProvision = await provisionParentAndPlayerForGroupSignup({
      contactEmail,
      contactPhone: contactPhone || null,
      parentName: emergencyContact || null,
      firstName,
      lastName,
      playerAge,
      playerBirthdate: parsedBirthday.dateOnly,
      foot: foot || null,
      team: team || null,
      notes: notes || null,
      crmContextNote,
    });

    const signup = await createPlayerSignup({
      group_session_id: resolvedGroupSessionId,
      first_name: firstName,
      last_name: lastName,
      emergency_contact: emergencyContact,
      contact_phone: contactPhone || null,
      contact_email: contactEmail,
      birthday: parsedBirthday.dateOnly,
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
        parent_portal_email: accountProvision.parentEmail,
        parent_portal_password: accountProvision.generatedPassword || "",
        parent_portal_is_new: accountProvision.parentWasCreated ? "true" : "false",
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
