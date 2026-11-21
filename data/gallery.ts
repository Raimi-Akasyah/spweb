import { teamProfiles } from "@/data/team";

type GalleryItem = {
  title: string;
  caption: string;
  image: string;
  alt: string;
  category: "acara" | "pakej" | "pasukan";
  linkUrl?: string;
  linkLabel?: string;
};

export const gallery: GalleryItem[] = [
  {
    title: "Majlis Syafiq & Izzaty",
    caption: "15 November 2026 · Emcee, wedding coordinator & audioman",
    image: "/images/event-syafiq-izzaty.jpg",
    alt: "Pasukan Senang Planners bersama pengantin di pelamin",
    category: "acara",
    linkUrl: "https://www.instagram.com/senangplanners.my/p/Dfw9vxAGY5y/",
    linkLabel: "Lihat hantaran",
  },
  {
    title: "Majlis Isma & Farhan",
    caption: "1 November 2026 · Wedding coordinator",
    image: "/images/event-ismal-farhan.jpg",
    alt: "Pasukan Senang Planners bersama pengantin di pelamin putih",
    category: "acara",
    linkUrl: "https://www.instagram.com/senangplanners.my/p/DfM6s8cmf44/",
    linkLabel: "Lihat hantaran",
  },
  {
    title: "Majlis Arisa Sofia & Hakim",
    caption: "31 Oktober 2026 · Wedding coordinator",
    image: "/images/event-arisa-hakim.jpg",
    alt: "Pasukan Senang Planners bersama pengantin di pelamin merah",
    category: "acara",
    linkUrl: "https://www.instagram.com/senangplanners.my/p/DfKV2sgmbWR/",
    linkLabel: "Lihat hantaran",
  },
  {
    title: "Majlis Pernikahan Arisa & Hakim",
    caption: "31 Oktober 2026 · Wedding coordinator",
    image: "/images/event-arisa-pernikahan.jpg",
    alt: "Pasukan Senang Planners bersama pengantin di majlis pernikahan",
    category: "acara",
    linkUrl: "https://www.instagram.com/senangplanners.my/p/DfKVRKIGSmc/",
    linkLabel: "Lihat hantaran",
  },
  {
    title: "Majlis Izzuddin & Ayu",
    caption: "24 Oktober 2026 · Emcee, wedding coordinator & PA system",
    image: "/images/event-izzuddin-ayu.jpg",
    alt: "Pasukan Senang Planners bersama pengantin di majlis malam",
    category: "acara",
    linkUrl: "https://www.instagram.com/senangplanners.my/p/De5qbBSmZzx/",
    linkLabel: "Lihat hantaran",
  },
  {
    title: "Majlis Kamalia & Hakimee",
    caption: "18 Oktober 2026 · Emcee & wedding coordinator",
    image: "/images/event-kamalia-hakimee.jpg",
    alt: "Pasukan Senang Planners bersama pengantin Kamalia dan Hakimee",
    category: "acara",
    linkUrl: "https://www.instagram.com/senangplanners.my/p/DeouYqHGbmk/",
    linkLabel: "Lihat hantaran",
  },
  {
    title: "Majlis Nurin & Muhammad",
    caption: "11 Oktober 2026 · Emcee, wedding coordinator & audioman",
    image: "/images/event-nurin-muhammad-sanding.jpg",
    alt: "Pasukan Senang Planners bersama pengantin Nurin dan Muhammad",
    category: "acara",
    linkUrl: "https://www.instagram.com/senangplanners.my/p/DeWsNF8GtQc/",
    linkLabel: "Lihat hantaran",
  },
  {
    title: "Majlis Qadrina & Ratan",
    caption: "10 Oktober 2026 · Emcee, wedding coordinator & audioman",
    image: "/images/event-qadrina-ratan.jpg",
    alt: "Pasukan Senang Planners bersama pengantin Qadrina dan Ratan",
    category: "acara",
    linkUrl: "https://www.instagram.com/senangplanners.my/p/DeT3vrzGknn/",
    linkLabel: "Lihat hantaran",
  },
  {
    title: "Majlis Nikah Shahir & Syifaa",
    caption: "10 Oktober 2026 · Emcee",
    image: "/images/event-shahir-syifaa.jpg",
    alt: "Pasukan Senang Planners bersama pengantin Shahir dan Syifaa",
    category: "acara",
    linkUrl: "https://www.instagram.com/senangplanners.my/p/DeT52fempIh/",
    linkLabel: "Lihat hantaran",
  },
  {
    title: "Majlis Pernikahan Nurin & Muhammad",
    caption: "10 Oktober 2026 · Emcee",
    image: "/images/event-nurin-muhammad-nikah.jpg",
    alt: "Pasukan Senang Planners bersama pengantin Nurin dan Muhammad",
    category: "acara",
    linkUrl: "https://www.instagram.com/senangplanners.my/p/DeUIoRvGpeC/",
    linkLabel: "Lihat hantaran",
  },
  {
    title: "Senang Wedding Package 2027",
    caption: "Semua dalam satu pakej",
    image: "/images/senang-wedding-package-2027.jpg",
    alt: "Flyer Senang Wedding Package 2027",
    category: "pakej",
  },
  ...teamProfiles.map((profile) => ({
    title: profile.name,
    caption: `Emcee · TikTok ${profile.handle}`,
    image: profile.image,
    alt: profile.name,
    category: "pasukan" as const,
    linkUrl: profile.url,
    linkLabel: "Lihat profil",
  })),
  {
    title: "Pentauliahan Senang Planners",
    caption: "Sijil rasmi daripada profil Linktree Senang Planners",
    image: "/images/senangplanner-certification.jpg",
    alt: "Sijil rasmi Senang Planners",
    category: "pasukan",
  },
];
