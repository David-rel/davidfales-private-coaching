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
