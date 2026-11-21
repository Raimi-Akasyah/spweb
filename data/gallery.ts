import { teamProfiles } from "@/data/team";

export const gallery = [
  {
    title: "Senang Wedding Package 2027",
    caption: "Semua dalam satu pakej",
    image: "/images/senang-wedding-package-2027.jpg",
    alt: "Flyer Senang Wedding Package 2027",
    category: "pakej",
    reelUrl: "",
  },
  ...teamProfiles.map((profile) => ({
    title: profile.name,
    caption: `Emcee · TikTok ${profile.handle}`,
    image: profile.image,
    alt: profile.name,
    category: "pasukan",
    reelUrl: profile.url,
  })),
  {
    title: "Pentauliahan Senang Planners",
    caption: "Sijil rasmi daripada profil Linktree Senang Planners",
    image: "/images/senangplanner-certification.jpg",
    alt: "Sijil rasmi Senang Planners",
    category: "pasukan",
    reelUrl: "",
  },
];
