// Members in the same tier sit on the same row.
// heading: optional big white title shown above that tier.
// photo: path under /public (the folder name must match exactly, including capital T in "Team").
// slug: lowercase, no spaces or symbols (it is used as an HTML id and a React key).
// id is optional (faculty have none).
export const tiers = [
  { level: 0, label: "faculty", heading: "Faculty" },
  { level: 1, label: "executive_committee", heading: "ExCom" },
  { level: 3, label: "department_heads" },
];

export const teamMembers = [
  { slug: "faculty-head", tier: 0, name: "Sir Jahanzaib", role: "Faculty Head", photo: "/images/Team/faculty_head.png" },
  { slug: "faculty-co-head", tier: 0, name: "Sir Atif Luqman", role: "Faculty Co-Head", photo: "/images/Team/faculty_cohead.png" },

  { slug: "general-secretary", tier: 1, name: "Syeda Samana Zehra Rizvi (CS)", id: "24K-0710", role: "General Secretary", photo: "/images/Team/fizza_batool.png" },
  { slug: "president", tier: 1, name: "Fizza Batool (CS)", id: "24K-0587", role: "President", photo: "/images/Team/fizza_batool.png" },
  { slug: "vice-president", tier: 1, name: "Aazan Noor Khuwaja (CS)", id: "24P-0706", role: "Vice President", photo: "/images/Team/aazan-noor-khuwaja.png" },
  { slug: "treasurer", tier: 1, name: "Talha Yousuf (DS)", id: "25K-2533", role: "Treasurer", photo: "/images/Team/fizza_batool.png" },

  { slug: "technical-head", tier: 3, name: "Hunza Shahzadi (DS)", id: "25K-2536", role: "Technical Head", photo: "/images/Team/fizza_batool.png" },
  { slug: "event-manager", tier: 3, name: "Aryaan Taimur Saeed (DS)", id: "25K-2540", role: "Event Manager", photo: "/images/Team/Aryaan_Taimur.png" },
  { slug: "media-promotions-head", tier: 3, name: "Isbah Rani Abbasi (CS)", id: "24K-0698", role: "Media & Promotions Head", photo: "/images/Team/isbah_rani_abbasi.png" },
  { slug: "guest-relations-head", tier: 3, name: "Mahrukh Siddiqui (AI)", id: "25K-0147", role: "Guest Relations Head", photo: "/images/Team/fizza_batool.png" },
  { slug: "sop-compliance-head", tier: 3, name: "Syeda Maha Fatima (CS)", id: "24K-0624", role: "SOP Compliance Head", photo: "/images/Team/syeda_maha_fatima.png" },
];
