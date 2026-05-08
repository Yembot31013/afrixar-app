export type DiscoverCategory = "All" | "Home" | "Tech" | "Delivery" | "Creative"

export interface WorkerTaskCard {
  id: string
  kind: "task"
  title: string
  category: Exclude<DiscoverCategory, "All">
  location: string
  budgetLabel: string
  duration: string
  summary: string
  posterName: string
  urgency: "today" | "flexible"
}

export interface ClientTalentCard {
  id: string
  kind: "talent"
  name: string
  headline: string
  skillTags: string[]
  sectors: Exclude<DiscoverCategory, "All">[]
  rating: number
  jobsDone: number
  responseMins: number
  neighborhood: string
  badge?: string
}

export type DiscoverCard = WorkerTaskCard | ClientTalentCard

export const MOCK_TASKS: WorkerTaskCard[] = [
  {
    id: "t1",
    kind: "task",
    title: "Same-day apartment deep clean",
    category: "Home",
    location: "Kilimani · 1.8 km",
    budgetLabel: "KES 3,200 – 4,000",
    duration: "~3 hrs",
    summary: "Needs eco-friendly supplies. Keys left with concierge.",
    posterName: "Wanjiku N.",
    urgency: "today",
  },
  {
    id: "t2",
    kind: "task",
    title: "Wall-mount TV + cable tidy",
    category: "Home",
    location: "Westlands · 3.1 km",
    budgetLabel: "KES 2,000 – 2,800",
    duration: "~90 min",
    summary: "Bracket included. Bring drill + level.",
    posterName: "Eric O.",
    urgency: "flexible",
  },
  {
    id: "t3",
    kind: "task",
    title: "Basic Shopify section tweak",
    category: "Tech",
    location: "Remote · Nairobi TZ",
    budgetLabel: "KES 5,500 flat",
    duration: "~2 hrs",
    summary: "Adjust hero banner + mobile spacing only.",
    posterName: "ALCHE Studio",
    urgency: "flexible",
  },
  {
    id: "t4",
    kind: "task",
    title: "Pickup dry-cleaning + drop-off",
    category: "Delivery",
    location: "CBD → Kilimani",
    budgetLabel: "KES 800 – 1,000",
    duration: "~45 min",
    summary: "Receipt QR in chat. Parking reimbursed.",
    posterName: "David K.",
    urgency: "today",
  },
  {
    id: "t5",
    kind: "task",
    title: "Logo polish + export pack",
    category: "Creative",
    location: "Remote",
    budgetLabel: "KES 12,000 – 15,000",
    duration: "~1 day",
    summary: "Vector source exists — tighten curves + brand sheet.",
    posterName: "Njeri L.",
    urgency: "flexible",
  },
]

export const MOCK_TALENTS: ClientTalentCard[] = [
  {
    id: "p1",
    kind: "talent",
    name: "Amina Otieno",
    headline: "Cleaning · Organization",
    skillTags: ["Deep clean", "Move-out"],
    sectors: ["Home"],
    rating: 4.95,
    jobsDone: 186,
    responseMins: 6,
    neighborhood: "South B",
    badge: "Top rated",
  },
  {
    id: "p2",
    kind: "talent",
    name: "Brian Kimani",
    headline: "Electrician · Smart installs",
    skillTags: ["Lighting", "TV mount"],
    sectors: ["Home"],
    rating: 4.84,
    jobsDone: 142,
    responseMins: 9,
    neighborhood: "Karen",
  },
  {
    id: "p3",
    kind: "talent",
    name: "Teresia M.",
    headline: "Frontend · Shopify",
    skillTags: ["React", "Liquid"],
    sectors: ["Tech", "Creative"],
    rating: 4.92,
    jobsDone: 74,
    responseMins: 14,
    neighborhood: "Remote",
    badge: "Fast replies",
  },
]

export function filterDiscoverCards(
  mode: "worker" | "client",
  category: DiscoverCategory,
): DiscoverCard[] {
  if (category === "All") {
    return mode === "worker" ? [...MOCK_TASKS] : [...MOCK_TALENTS]
  }
  if (mode === "worker") {
    return MOCK_TASKS.filter((t) => t.category === category)
  }
  return MOCK_TALENTS.filter((t) => t.sectors.includes(category))
}
