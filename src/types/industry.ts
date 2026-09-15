import type { IndustryId } from "./company";
import type { ContentStatus, Revision } from "./revision";
import type { Source, Sourced } from "./source";

/**
 * One stage (for a value chain) or one grouping (for a parallel industry).
 *
 * `companyIds` places companies within the industry's structure. It is the
 * industry's claim, so it is sourced. Which companies belong to the industry at
 * all is NOT stored here: it is derived from each company's `industries`, so
 * Company → Industry and Industry → Company can never disagree.
 */
export type IndustryCategory = Sourced & {
  id: string;
  name: string;
  /** Rich text. */
  description: string;
  companyIds: string[];
  /**
   * In a `chain` industry: `stage` (default) is a step in the sequence and is
   * drawn with arrows; `input` is an industry the steps depend on (equipment,
   * materials) and is drawn beside the chain, not inside it. Without this, an
   * arrow from 設計 to 製造装置 would teach an order that does not exist —
   * 経済産業省 describes equipment and materials as what manufacturing needs,
   * not as steps after design.
   */
  role?: "stage" | "input";
};

export type Industry = Sourced & {
  id: IndustryId;
  name: string;
  nameEn: string;
  /** What the industry does, before any company is listed. Rich text. */
  description: string;
  /**
   * `chain`: categories are sequential stages (設計 → 製造装置 → 材料 → …) and are
   * drawn with arrows. `segments`: categories are parallel and drawn as a group.
   */
  structure: "chain" | "segments";
  categories: IndustryCategory[];
  sources: Source[];
  status: ContentStatus;
  revisions: Revision[];
  /** YYYY-MM-DD */
  updatedAt: string;
};
