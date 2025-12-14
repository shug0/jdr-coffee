import type { EquipmentSlot } from "./equipment-slots.types";

/**
 * Emplacements d'équipement sur un personnage
 */

export const HEAD: EquipmentSlot = {
  id: "head",
  name: "Tête",
  exclusive: true,
  description: "Casques, chapeaux, couronnes",
};

export const NECK: EquipmentSlot = {
  id: "neck",
  name: "Cou",
  exclusive: false,
  description: "Colliers, amulettes, écharpes",
};

export const TORSO: EquipmentSlot = {
  id: "torso",
  name: "Torse",
  exclusive: true,
  description: "Armures de corps, vêtements",
};

export const HANDS: EquipmentSlot = {
  id: "hands",
  name: "Mains",
  exclusive: true,
  description: "Gants, gantelets",
};

export const MAIN_HAND: EquipmentSlot = {
  id: "main-hand",
  name: "Main principale",
  exclusive: true,
  description: "Arme ou objet tenu dans la main principale",
};

export const OFF_HAND: EquipmentSlot = {
  id: "off-hand",
  name: "Main secondaire",
  exclusive: true,
  description: "Arme ou objet tenu dans la main secondaire",
};

export const BOTH_HANDS: EquipmentSlot = {
  id: "both-hands",
  name: "Deux mains",
  exclusive: true,
  description: "Arme ou objet nécessitant les deux mains",
};

export const FEET: EquipmentSlot = {
  id: "feet",
  name: "Pieds",
  exclusive: true,
  description: "Bottes, chaussures, sandales",
};

export const FINGER: EquipmentSlot = {
  id: "finger",
  name: "Doigt",
  exclusive: false,
  description: "Anneaux, bagues (généralement limité à 2)",
};

export const BACK: EquipmentSlot = {
  id: "back",
  name: "Dos",
  exclusive: true,
  description: "Capes, manteaux, ailes",
};

export const BELT: EquipmentSlot = {
  id: "belt",
  name: "Ceinture",
  exclusive: true,
  description: "Ceintures magiques ou utilitaires",
};

export const SHOULDERS: EquipmentSlot = {
  id: "shoulders",
  name: "Épaules",
  exclusive: true,
  description: "Épaulières, spalières",
};

export const WAIST: EquipmentSlot = {
  id: "waist",
  name: "Taille",
  exclusive: true,
  description: "Ceintures, sacoches de ceinture",
};

export const LEGS: EquipmentSlot = {
  id: "legs",
  name: "Jambes",
  exclusive: true,
  description: "Jambières, pantalons renforcés",
};

export const WRIST: EquipmentSlot = {
  id: "wrist",
  name: "Poignet",
  exclusive: false,
  description: "Bracelets, manchettes",
};

/**
 * Tous les emplacements d'équipement
 */
export const EQUIPMENT_SLOTS = {
  HEAD,
  NECK,
  TORSO,
  HANDS,
  MAIN_HAND,
  OFF_HAND,
  BOTH_HANDS,
  FEET,
  FINGER,
  BACK,
  BELT,
  SHOULDERS,
  WAIST,
  LEGS,
  WRIST,
} as const;
