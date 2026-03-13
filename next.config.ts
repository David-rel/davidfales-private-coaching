import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/groupsession/:id",
        destination:
          "https://app.davidssoccertraining.com/group-sessions/:id",
        permanent: true,
      },
      {
        source: "/group-sessions/:id",
        destination:
          "https://app.davidssoccertraining.com/group-sessions/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
