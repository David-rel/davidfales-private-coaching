"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const GROUP_TIME_ZONE = "America/Phoenix";

type GroupSessionPreview = {
  id: number;
  title: string;
  image_url: string | null;
  session_date: string;
  session_date_end: string | null;
  location: string | null;
  price: number | null;
  spots_left: number;
  max_players: number;
};

function addMinutes(input: string | Date, minutes: number) {
  return new Date(new Date(input).getTime() + minutes * 60_000);
}

function formatSessionDateOnly(input: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
    timeZone: GROUP_TIME_ZONE,
  }).format(new Date(input));
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

export default function GroupSessionsPreview() {
  const [sessions, setSessions] = useState<GroupSessionPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/group-sessions?limit=4", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as {
          sessions?: GroupSessionPreview[];
        };
        setSessions(payload.sessions || []);
      } catch (error) {
        console.error("Failed to load group session preview", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="py-20 px-6 bg-linear-to-b from-emerald-50 to-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-emerald-700 font-semibold mb-3">New: Group Sessions</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
             Upcoming Group Sessions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Click any session to view details, enter player info, and sign up.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-600">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            No upcoming group sessions posted yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/group-sessions/${session.id}`}
                className="bg-white rounded-2xl border-2 border-emerald-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                {session.image_url ? (
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={session.image_url}
                      alt={session.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : null}

                <div className="p-5">
                  <p className="text-sm text-emerald-700 font-semibold">
                    {formatSessionDateOnly(session.session_date)}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3 line-clamp-2">
                    {session.title}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      Time:{" "}
                      {formatSessionTimeRange(
                        session.session_date,
                        session.session_date_end
                      )}
                    </p>
                    <p>Price: {formatPrice(session.price)}</p>
                    <p>Location: {session.location || "TBD"}</p>
                    <p>{formatSpotsRemaining(session.spots_left)}</p>
                  </div>

                  <p className="text-emerald-700 font-semibold text-sm mt-4">
                    View details & sign up →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/group-sessions"
            className="inline-flex items-center justify-center bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-lg"
          >
            View More Group Sessions
          </Link>
        </div>
      </div>
    </section>
  );
}
