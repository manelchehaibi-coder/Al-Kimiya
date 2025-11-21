export enum ElementCategory {
  ALKALI_METAL = 'alkali-metal',
  ALKALINE_EARTH_METAL = 'alkaline-earth-metal',
  TRANSITION_METAL = 'transition-metal',
  POST_TRANSITION_METAL = 'post-transition-metal',
  METALLOID = 'metalloid',
  NONMETAL = 'nonmetal',
  HALOGEN = 'halogen',
  NOBLE_GAS = 'noble-gas',
  LANTHANIDE = 'lanthanide',
  ACTINIDE = 'actinide',
  UNKNOWN = 'unknown'
}

export interface ChemicalElement {
  number: number;     // Atomic Number (Z)
  symbol: string;     // Symbol
  nameFr: string;     // French Name
  nameAr: string;     // Arabic Name
  atomicMass: string; // Mass
  category: ElementCategory;
  group?: number;
  period: number;
  summary?: string;   // Short initial summary
}

export interface GeminiElementDetails {
  descriptionFr: string;
  descriptionAr: string;
  applicationsFr: string[];
  applicationsAr: string[];
  funFactFr: string;
  funFactAr: string;
}
