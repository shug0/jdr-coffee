/**
 * Module universes - Univers de JDR et leurs devises
 */

export * from "./alien";

// Univers avec devises
export * from "./aria";
export * from "./cthulhu-1920";
export * from "./dnd";
export * from "./donjons-chatons";
export * from "./medieval-generic";
export * from "./root";
export * from "./tales-from-the-loop";
export * from "./universes.types";

import { ALIEN } from "./alien";
// Export groupé des univers
import { ARIA } from "./aria";
import { CTHULHU_1920 } from "./cthulhu-1920";
import { DND } from "./dnd";
import { DONJONS_CHATONS } from "./donjons-chatons";
import { MEDIEVAL_GENERIC } from "./medieval-generic";
import { ROOT } from "./root";
import { TALES_FROM_THE_LOOP } from "./tales-from-the-loop";

export const UNIVERSES = {
  ARIA,
  ALIEN,
  DONJONS_CHATONS,
  ROOT,
  CTHULHU_1920,
  MEDIEVAL_GENERIC,
  DND,
  TALES_FROM_THE_LOOP,
} as const;

import { ALIEN_CURRENCIES } from "./alien";
// Export groupé des devises
import { ARIA_CURRENCIES } from "./aria";
import { CTHULHU_CURRENCIES } from "./cthulhu-1920";
import { DND_CURRENCIES } from "./dnd";
import { DONJONS_CHATONS_CURRENCIES } from "./donjons-chatons";
import { MEDIEVAL_CURRENCIES } from "./medieval-generic";
import { ROOT_CURRENCIES } from "./root";
import { TALES_FROM_THE_LOOP_CURRENCIES } from "./tales-from-the-loop";

export const CURRENCIES = {
  ARIA: ARIA_CURRENCIES,
  ALIEN: ALIEN_CURRENCIES,
  CTHULHU: CTHULHU_CURRENCIES,
  MEDIEVAL: MEDIEVAL_CURRENCIES,
  DND: DND_CURRENCIES,
  DONJONS_CHATONS: DONJONS_CHATONS_CURRENCIES,
  ROOT: ROOT_CURRENCIES,
  TALES_FROM_THE_LOOP: TALES_FROM_THE_LOOP_CURRENCIES,
} as const;
