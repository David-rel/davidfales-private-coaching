import Link from "next/link";
import MainHeader from "@/app/components/layout/MainHeader";
import MainFooter from "@/app/components/layout/MainFooter";
import { getUpcomingGroupSessions } from "@/app/lib/db/queries";

export const dynamic = "force-dynamic";
const GROUP_TIME_ZONE = "America/Phoenix";

const comparisonRows = [
  {
    label: "Session style",
    private: "Fully individualized plan",
    group: "Competitive and collaborative training",
  },
  {
    label: "Coaching level",
    private: "Top coaching",
    group: "Top coaching",
  },
  {
    label: "Best for",
    private: "Specific player goals and detailed corrections",
    group: "Decision speed, pressure, and game-like reps",
  },
];

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

function getWeekdayLabel(input: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: GROUP_TIME_ZONE,
  }).format(new Date(input));
}

export default async function GroupSessionsPage() {
  const upcomingSessions = await getUpcomingGroupSessions(100);

  const prices = upcomingSessions
    .map((s) => Number(s.price))
    .filter((p) => Number.isFinite(p) && p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

  const weekdays = Array.from(
    new Set(upcomingSessions.map((session) => getWeekdayLabel(session.session_date)))
  );

  const locations = Array.from(
    new Set(
      upcomingSessions
        .map((session) => session.location)
        .filter((location): location is string => Boolean(location))
    )
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-emerald-50">
      <MainHeader />

      <section className="relative overflow-hidden min-h-[72vh] md:min-h-[78vh] px-6 py-16 bg-linear-to-br from-emerald-700 via-emerald-600 to-emerald-800 text-white">
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-80 w-80 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-emerald-900/30 blur-3xl" />

        <div className="container relative mx-auto max-w-6xl min-h-[72vh] md:min-h-[78vh] flex items-center">
          <div className="w-full text-center">
            <p className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-semibold tracking-wide">
              Group Training
            </p>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight mt-5 mb-5">
              Group Sessions
            </h1>

            <p className="text-xl md:text-3xl text-emerald-50 leading-relaxed max-w-4xl mx-auto">
              High-level technical coaching in a competitive team environment with top standards.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-9">
              <a
                href="#upcoming"
                className="inline-flex items-center justify-center bg-white text-emerald-800 px-6 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors shadow-lg"
              >
                Choose a Session
              </a>
              <a
                href="#session-details"
                className="inline-flex items-center justify-center bg-emerald-900/35 text-white px-6 py-3 rounded-full font-semibold border border-white/35 hover:bg-emerald-900/55 transition-colors"
              >
                View Session Details
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Group Sessions Work
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Players improve faster when quality coaching meets healthy competition.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-linear-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border border-emerald-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Team Energy</h3>
              <p className="text-gray-700 leading-relaxed">
                Training with other players increases intensity, focus, and accountability while
                keeping sessions fun.
              </p>
            </div>

            <div className="bg-linear-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border border-emerald-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Top Coaching Quality</h3>
              <p className="text-gray-700 leading-relaxed">
                Premium-level coaching and detail. The price reflects serious training standards.
              </p>
            </div>

            <div className="bg-linear-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border border-emerald-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Real Soccer Pressure</h3>
              <p className="text-gray-700 leading-relaxed">
                Players make decisions under pressure, compete for space, and build confidence that
                transfers to games.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-linear-to-b from-emerald-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Group vs Private Training
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Both formats are high-level. Many players get the best results by combining both.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border-2 border-emerald-200 overflow-hidden">
            <div className="grid grid-cols-3 bg-emerald-600 text-white font-semibold text-sm md:text-base">
              <div className="p-4">Category</div>
              <div className="p-4">Private Training</div>
              <div className="p-4">Group Sessions</div>
            </div>
            {comparisonRows.map((row) => (
              <div key={row.label} className="grid grid-cols-3 border-t border-emerald-100">
                <div className="p-4 font-semibold text-gray-900 bg-emerald-50/60">{row.label}</div>
                <div className="p-4 text-gray-700">{row.private}</div>
                <div className="p-4 text-gray-700">{row.group}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="session-details" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Session Details
            </h2>
            <p className="text-xl text-gray-600">
              Live details pulled from upcoming sessions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
              <p className="text-sm text-emerald-700 font-semibold">Price</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {minPrice === null
                  ? "TBD"
                  : minPrice === maxPrice
                    ? formatPrice(minPrice)
                    : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`}
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
              <p className="text-sm text-emerald-700 font-semibold">Upcoming Sessions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{upcomingSessions.length}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
              <p className="text-sm text-emerald-700 font-semibold">Days Running</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {weekdays.length > 0 ? weekdays.join(", ") : "TBD"}
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
              <p className="text-sm text-emerald-700 font-semibold">Locations</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {locations.length > 0 ? `${locations.length} active` : "TBD"}
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
              <p className="text-sm text-emerald-700 font-semibold">Sign Up</p>
              <p className="text-lg font-bold text-gray-900 mt-1">Per session checkout</p>
            </div>
          </div>
        </div>
      </section>

      <section id="upcoming" className="py-20 px-6 bg-linear-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Upcoming Sessions</h2>
            <p className="text-xl text-emerald-100">
              Pick any session and continue to details, player info, and checkout.
            </p>
          </div>

          {upcomingSessions.length === 0 ? (
            <div className="rounded-2xl border border-white/25 bg-white/10 p-6 text-center text-emerald-50">
              No upcoming sessions are posted yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm overflow-hidden"
                >
                  {session.image_url ? (
                    <div className="aspect-video bg-emerald-900/40">
                      <img
                        src={session.image_url}
                        alt={session.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : null}

                  <div className="p-5">
                    <h3 className="text-2xl font-bold mt-1 mb-2">{session.title}</h3>
                    <p className="text-emerald-100 text-sm mb-1">
                      {formatSessionDate(session.session_date)}
                    </p>
                    <p className="text-emerald-100 text-sm mb-4">
                      Time:{" "}
                      {formatSessionTimeRange(
                        session.session_date,
                        session.session_date_end
                      )}
                    </p>

                    <div className="space-y-2 text-sm text-emerald-50 mb-5">
                      <p>Location: {session.location || "TBD"}</p>
                      <p>Price: {formatPrice(session.price)}</p>
                      <p>{formatSpotsRemaining(session.spots_left)}</p>
                    </div>

                    <Link
                      href={`/group-sessions/${session.id}`}
                      className="inline-flex items-center justify-center rounded-full bg-white text-emerald-800 px-5 py-2.5 font-semibold hover:bg-emerald-50 transition-colors"
                    >
                      View Details & Sign Up
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-linear-to-br from-emerald-50 to-white p-7 rounded-2xl border-2 border-emerald-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Questions</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Not sure which session fits best? Reach out and I will help place your player.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Placement is flexible for players near age and level boundaries.
              </p>
            </div>

            <div className="bg-linear-to-br from-emerald-50 to-white p-7 rounded-2xl border-2 border-emerald-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Contact</h3>
              <div className="space-y-3 text-gray-700">
                <p className="font-semibold">Text/Call: (720) 612-2979</p>
                <p className="font-semibold">Email: davidfalesct@gmail.com</p>
                <p>Questions about schedule, placement, or checkout are welcome.</p>
              </div>
            </div>

            <div className="bg-linear-to-br from-emerald-50 to-white p-7 rounded-2xl border-2 border-emerald-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Refund / Cancellation Policy</h3>
              <ul className="space-y-2 text-gray-700">
                <li>Cancel 24+ hours before start: full credit or refund.</li>
                <li>Cancel under 24 hours: no refund, one-time credit may be offered.</li>
                <li>Coach/weather cancellation: full credit or refund.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  );
}
