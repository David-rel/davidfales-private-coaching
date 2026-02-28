"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Props = {
  sessionId: number;
  isFull: boolean;
};

function normalizeBirthdayForInput(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";

  const isoDateMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateMatch) return trimmed;

  const birthday = new Date(trimmed);
  if (Number.isNaN(birthday.getTime())) return "";
  return birthday.toISOString().slice(0, 10);
}

export default function SessionCheckoutForm({ sessionId, isFull }: Props) {
  const searchParams = useSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [foot, setFoot] = useState("");
  const [team, setTeam] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const kidFirstName = (searchParams.get("kidFirstName") || "").trim();
    const kidLastName = (searchParams.get("kidLastName") || "").trim();
    const preferredFoot = (searchParams.get("preferredFoot") || "").trim();
    const teamName = (searchParams.get("team") || "").trim();
    const playerNotes = (searchParams.get("notes") || "").trim();
    const parentName = (searchParams.get("parentName") || "").trim();
    const email = (searchParams.get("email") || "").trim();
    const phone = (searchParams.get("phone") || "").trim();
    const birthdayParam = (searchParams.get("birthday") || "").trim();
    const normalizedBirthday = normalizeBirthdayForInput(birthdayParam);

    if (kidFirstName) {
      setFirstName((current) => current || kidFirstName);
    }
    if (kidLastName) {
      setLastName((current) => current || kidLastName);
    }
    if (normalizedBirthday) {
      setBirthday((current) => current || normalizedBirthday);
    }
    if (parentName) {
      setEmergencyContact((current) => current || parentName);
    }
    if (email) {
      setContactEmail((current) => current || email);
    }
    if (phone) {
      setContactPhone((current) => current || phone);
    }
    if (preferredFoot) {
      setFoot((current) => current || preferredFoot);
    }
    if (teamName) {
      setTeam((current) => current || teamName);
    }
    if (playerNotes) {
      setNotes((current) => current || playerNotes);
    }
  }, [searchParams]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isFull || isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/group-sessions/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupSessionId: sessionId,
          firstName,
          lastName,
          birthday,
          emergencyContact,
          contactPhone,
          contactEmail,
          foot,
          team,
          notes,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || "Unable to start checkout.");
        return;
      }

      if (!payload.checkoutUrl) {
        setError("Missing checkout URL.");
        return;
      }

      window.location.href = payload.checkoutUrl;
    } catch {
      setError("Something went wrong starting checkout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-3xl border-2 border-emerald-100 shadow-xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Player Signup + Checkout</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">First name *</span>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 caret-black outline-none focus:border-emerald-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Last name *</span>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 caret-black outline-none focus:border-emerald-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Birthday *</span>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 caret-black outline-none focus:border-emerald-500"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-gray-700">Emergency contact *</span>
          <input
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            required
            placeholder="Parent/guardian name + phone"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 caret-black outline-none focus:border-emerald-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Contact email *</span>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
            placeholder="Parent/guardian email"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 caret-black outline-none focus:border-emerald-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Contact phone</span>
          <input
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="Best number for updates"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 caret-black outline-none focus:border-emerald-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Preferred foot</span>
          <input
            value={foot}
            onChange={(e) => setFoot(e.target.value)}
            placeholder="Right / Left / Both"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 caret-black outline-none focus:border-emerald-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Team</span>
          <input
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            placeholder="Club/team name"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 caret-black outline-none focus:border-emerald-500"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-gray-700">Notes</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Anything Coach David should know"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 caret-black outline-none focus:border-emerald-500"
          />
        </label>
      </div>

      {error ? <p className="text-red-600 text-sm mt-4">{error}</p> : null}

      <div className="mt-6">
        <button
          type="submit"
          disabled={isFull || isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isFull ? "Session Full" : isSubmitting ? "Starting Checkout..." : "Continue to Checkout"}
        </button>
      </div>
    </form>
  );
}
