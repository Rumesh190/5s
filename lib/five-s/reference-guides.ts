import type { FiveSCategory, FiveSQuestion } from "@/features/five-s/types/five-s";
import type { AppLanguage } from "@/lib/ui-preferences";

type ReferenceFields = Pick<FiveSQuestion, "referenceImage" | "referenceTitleKey" | "referenceGuidanceKey" | "referenceAltKey" | "reference">;

const slugs: Record<FiveSCategory, string> = { Sort: "sort", "Set in Order": "set-in-order", Shine: "shine", Standardize: "standardize", Sustain: "sustain" };
const CATEGORY_OFFSETS: Record<FiveSCategory, number> = { Sort: 0, "Set in Order": 7, Shine: 16, Standardize: 24, Sustain: 31 };

/** Good-practice guidance in the same order as the fixed 39-question audit template. */
export const GARMENT_REFERENCE_CONTENT: ReadonlyArray<{ title: string; description: string }> = [
  { title: "Necessary items only", description: "A clean sewing workstation contains only the active garment pieces, required thread cones and essential operator tools." },
  { title: "Obsolete items controlled", description: "Unused patterns, damaged guides and obsolete trims are identified and moved to a clearly marked red-tag review area." },
  { title: "Controlled work quantity", description: "Fabric bundles, trims and consumables are kept within defined quantities for the active garment order." },
  { title: "Rejected material segregated", description: "Rejected garment panels, damaged fabric and unusable tools are identified and separated from good production material." },
  { title: "Visible quantity limits", description: "Marked minimum and maximum limits keep fabric and garment WIP controlled without congesting the production area." },
  { title: "Orderly red-tag area", description: "Red-tagged garment-factory items are dated, owned and arranged in a designated review location." },
  { title: "Clear disposition rules", description: "Operators use a visible rule to retain, return, red-tag or discard leftover fabric, trims, tools and documents." },
  { title: "A place for every item", description: "Tools, thread cones, trims and WIP bundles have labelled locations close to their point of use." },
  { title: "Clearly labelled storage", description: "Fabric racks, thread shelves and trim bins have readable labels for style, colour, size, lot and status." },
  { title: "Easy operator access", description: "Frequently used scissors, gauges, folders and work aids sit safely within the sewing operator's normal reach." },
  { title: "Storage by use frequency", description: "Daily-use garment tools are closest to the workstation while occasional items remain in identified secondary storage." },
  { title: "Visible location markings", description: "Clean floor lines, rack addresses, bundle lanes and machine positions clearly define where every item belongs." },
  { title: "Missing tools are obvious", description: "Outlined shadow boards and labelled holders make each garment-production tool's location immediately visible." },
  { title: "One approved location", description: "Every fabric roll, garment bundle, trolley and consumable is returned to one clearly labelled storage location." },
  { title: "Workstation reset", description: "After each job or shift, tools, garment pieces and documents return to their defined visual-standard positions." },
  { title: "Clear marked walkways", description: "Marked pedestrian and trolley routes remain continuous and free of garment bundles, cartons, stools and equipment." },
  { title: "Clean production area", description: "Sewing floors, cutting tables and nearby racks are free from lint, thread waste, fabric scraps and packaging." },
  { title: "Clean garment equipment", description: "Sewing machines, cutting equipment and pressing surfaces are clean and free from oil, lint and residue." },
  { title: "Abnormalities reported", description: "Leaks, damaged guards, loose cables and unusual wear found during cleaning are tagged and reported promptly." },
  { title: "Garment-contact surfaces clean", description: "Cutting, inspection and pressing surfaces are clean at the defined frequency and cannot soil garments." },
  { title: "Contamination controlled", description: "Clean drip trays and source controls prevent sewing oil, condensate, adhesive, dust or lint from reaching garments." },
  { title: "Cleaning tools organized", description: "Brooms, brushes, lint rollers and cloths are clean, identified and stored at a dedicated outlined station." },
  { title: "Clean and inspect", description: "Operators follow a clean-and-inspect checklist and escalate needle, cable, leak and machine abnormalities immediately." },
  { title: "Cleaning schedule current", description: "A visible schedule names the responsible person and records completed checks for each garment-production area." },
  { title: "Standards at point of work", description: "Current approved 5S procedures are visible and followed in cutting, sewing, finishing, inspection and packing." },
  { title: "Visual standard photographs", description: "Approved garment-workstation photographs show the correct arrangement of machines, tools, fabric and WIP." },
  { title: "Named responsibility", description: "A clear board assigns owners for machine cleaning, aisle checks, waste removal and area inspection." },
  { title: "Consistent visual controls", description: "Labels, colour codes, floor markings and storage conventions are consistent across garment-production zones." },
  { title: "Standards clearly displayed", description: "Employees can easily see the current 5S standard beside their sewing line, cutting table or support area." },
  { title: "Schedules followed", description: "Cleaning, inspection and workplace-organization schedules are current, signed and reviewed by the zone leader." },
  { title: "Deviations visibly controlled", description: "Abnormal fabric, WIP, tool or cleaning conditions are visibly flagged, owned and tracked to correction." },
  { title: "Standards sustained daily", description: "Operators consistently return tools, control garment WIP, separate waste and maintain the defined workstation standard." },
  { title: "Audits performed as planned", description: "Garment-production zones are audited at the planned frequency with clear records, findings and responsible auditors." },
  { title: "Actions verified and closed", description: "Closed 5S actions show clear evidence and confirm that the corrected garment-workplace condition is sustained." },
  { title: "Employees understand 5S", description: "Garment operators can explain and demonstrate their responsibilities for order, cleaning, WIP control and escalation." },
  { title: "Repeat findings prevented", description: "Recurring garment-workplace issues are analysed and addressed through lasting process or workplace changes." },
  { title: "Improvements communicated", description: "Completed 5S improvements are shared across garment lines and shifts using updated standards and demonstrations." },
  { title: "Visible leadership ownership", description: "Line leaders and zone owners review garment-workplace conditions, remove barriers and follow up assigned actions." },
  { title: "Improvement ideas implemented", description: "Employee ideas for garment flow, quality, cleanliness, safety and handling have owners and visible results." },
];

export function referenceFields(category: FiveSCategory, index: number): ReferenceFields {
  const keyRoot = `questions.${slugs[category]}.q${index + 1}`;
  const globalNumber = CATEGORY_OFFSETS[category] + index + 1;
  const content = GARMENT_REFERENCE_CONTENT[globalNumber - 1];
  const image = `/5s/references/garment/q${String(globalNumber).padStart(2, "0")}.webp`;
  return { referenceImage: image, referenceTitleKey: `${keyRoot}.referenceTitle`, referenceGuidanceKey: `${keyRoot}.referenceGuidance`, referenceAltKey: `${keyRoot}.referenceAlt`, reference: { image, title: content.title, description: content.description } };
}

const keyPattern = /^questions\.(sort|set-in-order|shine|standardize|sustain)\.q(\d+)\.(referenceTitle|referenceGuidance|referenceAlt)$/;
const categoryBySlug = Object.fromEntries(Object.entries(slugs).map(([category, slug]) => [slug, category])) as Record<string, FiveSCategory>;
const languageLead: Record<Exclude<AppLanguage, "en">, string> = { hi: "अच्छी स्थिति: ", ta: "நல்ல நிலை: ", bn: "ভালো অবস্থা: ", ja: "良い状態：" };

export function referenceText(language: AppLanguage, key: string | undefined): string {
  const match = key?.match(keyPattern);
  if (!match) return "";
  const category = categoryBySlug[match[1]];
  const content = GARMENT_REFERENCE_CONTENT[CATEGORY_OFFSETS[category] + Number(match[2]) - 1];
  if (!content) return "";
  if (match[3] === "referenceTitle") return content.title;
  return language === "en" ? content.description : `${languageLead[language]}${content.description}`;
}

export const REFERENCE_COUNTS = { Sort: 7, "Set in Order": 9, Shine: 8, Standardize: 7, Sustain: 8 } as const;
