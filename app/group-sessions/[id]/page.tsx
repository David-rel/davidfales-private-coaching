import { notFound } from "next/navigation";
import Link from "next/link";
import MainHeader from "@/app/components/layout/MainHeader";
import MainFooter from "@/app/components/layout/MainFooter";
import { getGroupSessionById } from "@/app/lib/db/queries";
import SessionCheckoutForm from "./SessionCheckoutForm";
import CheckoutStatusModal from "./CheckoutStatusModal";

export const dynamic = "force-dynamic";
const GROUP_TIME_ZONE = "America/Phoenix";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatSessionDate(input: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: GROUP_TIME_ZONE,
  }).format(new Date(input));
}

function addMinutes(input: string | Date, minutes: number) {
  return new Date(new Date(input).getTime() + minutes * 60_000);
}

function formatSessionTimeRange(startInput: string, endInput: string | null) {
  const start = new Date(startInput);
  const end = endInput ? new Date(endInput) : addMinutes(start, 75);
  const format = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: GROUP_TIME_ZONE,
  });
  return `${format.format(start)} - ${format.format(end)}`;
}

function formatPrice(input: number | null) {
  if (!input || Number.isNaN(Number(input))) return "TBD";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(input));
}

function formatSpotsRemaining(spots: number) {
  return `${spots} ${spots === 1 ? "spot" : "spots"} remaining`;
}

export default async function GroupSessionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const sessionId = Number(id);

  if (!Number.isInteger(sessionId) || sessionId <= 0) {
    notFound();
  }

  const session = await getGroupSessionById(sessionId);

  if (!session) {
    notFound();
  }

  const isFull = session.spots_left <= 0;

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-emerald-50">
      <MainHeader />
      <CheckoutStatusModal />

      <section className="py-14 md:py-20 px-6 bg-linear-to-b from-emerald-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <Link
            href="/group-sessions"
            className="inline-flex items-center text-emerald-700 font-semibold hover:text-emerald-800 transition-colors"
          >
            ← Back to all group sessions
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 mt-6">
            <div className="bg-white rounded-3xl border-2 border-emerald-100 shadow-xl p-6 md:p-8">
              {session.image_url ? (
                <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-emerald-50 border border-emerald-100">
                  <img
                    src={session.image_url}
                    alt={session.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}

              <p className="text-emerald-700 font-semibold">Session #{session.id}</p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
                {session.title}
              </h1>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {session.description || "No description posted yet."}
              </p>

              <div className="space-y-3 text-gray-800">
                <p>
                  <span className="font-semibold">Date:</span> {formatSessionDate(session.session_date)}
                </p>
                <p>
                  <span className="font-semibold">Time:</span>{" "}
                  {formatSessionTimeRange(
                    session.session_date,
                    session.session_date_end
                  )}
                </p>
                <p>
                  <span className="font-semibold">Location:</span> {session.location || "TBD"}
                </p>
                <p>
                  <span className="font-semibold">Price:</span> {formatPrice(session.price)}
                </p>
                <p>
                  {formatSpotsRemaining(session.spots_left)}
                </p>
              </div>

              {session.curriculum ? (
                <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <p className="text-sm font-semibold text-emerald-700 mb-1">Curriculum</p>
                  <p className="text-gray-700">{session.curriculum}</p>
                </div>
              ) : null}
            </div>

            <div>
              <SessionCheckoutForm sessionId={session.id} isFull={isFull} />
            </div>
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  );
}
