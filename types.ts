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
  audioFr?: string; // Base64 encoded audio for name
  audioAr?: string; // Base64 encoded audio for name
  descriptionFrAudio?: string; // Base64 encoded audio for description
  descriptionArAudio?: string; // Base64 encoded audio for description
  funFactFrAudio?: string; // Base64 encoded audio for fun fact
  funFactArAudio?: string; // Base64 encoded audio for fun fact
}

export interface ChemicalCompound {
  success: boolean;
  nameFr: string;
  nameAr: string;
  formula: string;
  descriptionFr: string;
  descriptionAr: string;
  state: string; // e.g., "Liquid", "Gas"
  color?: string; // Hex code or generic name
  errorFr?: string; // If no reaction is possible
  errorAr?: string;
}