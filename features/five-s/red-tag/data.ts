import type { RedTag } from "./types";

export const RED_TAG_DEMO_DATA: RedTag[] = [{
  id: "RT-EGM-ZA-001", tagNumber: "RT-EGM-ZA-001", plant: "Egmore Plant", zone: "Zone A",
  section: "Production", itemName: "Hydraulic Press 04", quantity: 1, reason: "Unclean Area",
  remarks: "Oil residue and unwanted material found around the machine base.",
  requiredAction: "Clean the machine area, remove unwanted material and inspect for leakage.",
  responsiblePersonId: "USR-SIVA", responsiblePersonName: "Siva", targetDate: "2026-08-26", status: "Open",
  createdById: "USR-LAKSHMAN", createdByName: "Lakshman", createdAt: "2026-08-25T10:30:00+05:30",
  imageUrl: "/demo-5s/not-good-example.png",
  history: [{ id: "RTH-001", type: "created", label: "Red Tag created", actor: "Lakshman", at: "2026-08-25T10:30:00+05:30" }],
}];
