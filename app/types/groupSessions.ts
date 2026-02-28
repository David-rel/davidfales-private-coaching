export type GroupSession = {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  session_date: string;
  session_date_end: string | null;
  location: string | null;
  price: number | null;
  curriculum: string | null;
  max_players: number;
  created_at: string;
  updated_at: string;
};

export type GroupSessionWithAvailability = GroupSession & {
  paid_signups: number;
  spots_left: number;
};

export type PlayerSignup = {
  id: number;
  group_session_id: number;
  first_name: string;
  last_name: string;
  emergency_contact: string;
  contact_phone: string | null;
  contact_email: string;
  birthday: string | null;
  foot: string | null;
  team: string | null;
  notes: string | null;
  has_paid: boolean;
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  stripe_charge_id: string | null;
  stripe_receipt_url: string | null;
  created_at: string;
  updated_at: string;
};
