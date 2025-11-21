import { ChemicalElement, ElementCategory } from './types';

export const ELEMENT_CATEGORIES_COLORS: Record<ElementCategory, string> = {
  [ElementCategory.ALKALI_METAL]: 'bg-red-500 text-white',
  [ElementCategory.ALKALINE_EARTH_METAL]: 'bg-orange-400 text-white',
  [ElementCategory.TRANSITION_METAL]: 'bg-yellow-500 text-white',
  [ElementCategory.POST_TRANSITION_METAL]: 'bg-green-400 text-slate-900',
  [ElementCategory.METALLOID]: 'bg-teal-500 text-white',
  [ElementCategory.NONMETAL]: 'bg-blue-500 text-white',
  [ElementCategory.HALOGEN]: 'bg-indigo-500 text-white',
  [ElementCategory.NOBLE_GAS]: 'bg-purple-500 text-white',
  [ElementCategory.LANTHANIDE]: 'bg-pink-400 text-slate-900',
  [ElementCategory.ACTINIDE]: 'bg-rose-400 text-slate-900',
  [ElementCategory.UNKNOWN]: 'bg-slate-600 text-white',
};

export const CATEGORY_LABELS: Record<ElementCategory, { fr: string; ar: string }> = {
  [ElementCategory.ALKALI_METAL]: { fr: "Métaux alcalins", ar: "فلزات قلوية" },
  [ElementCategory.ALKALINE_EARTH_METAL]: { fr: "Métaux alcalino-terreux", ar: "فلزات قلوية ترابية" },
  [ElementCategory.TRANSITION_METAL]: { fr: "Métaux de transition", ar: "فلزات انتقالية" },
  [ElementCategory.POST_TRANSITION_METAL]: { fr: "Métaux pauvres", ar: "فلزات بعد انتقالية" },
  [ElementCategory.METALLOID]: { fr: "Métalloïdes", ar: "أشباه الفلزات" },
  [ElementCategory.NONMETAL]: { fr: "Non-métaux", ar: "اللافلزات" },
  [ElementCategory.HALOGEN]: { fr: "Halogènes", ar: "الهالوجينات" },
  [ElementCategory.NOBLE_GAS]: { fr: "Gaz nobles", ar: "الغازات النبيلة" },
  [ElementCategory.LANTHANIDE]: { fr: "Lanthanides", ar: "اللانثanides" },
  [ElementCategory.ACTINIDE]: { fr: "Actinides", ar: "الأكتينيدات" },
  [ElementCategory.UNKNOWN]: { fr: "Inconnu", ar: "غير معروف" },
};

// Simplified dataset for the demo. In a production app, this would be a complete JSON.
// Covering main groups + some transition metals to demonstrate layout.
// Full layout logic is handled in the component.
export const ELEMENTS: ChemicalElement[] = [
  { number: 1, symbol: 'H', nameFr: 'Hydrogène', nameAr: 'هيدروجين', atomicMass: '1.008', category: ElementCategory.NONMETAL, group: 1, period: 1 },
  { number: 2, symbol: 'He', nameFr: 'Hélium', nameAr: 'هيليوم', atomicMass: '4.0026', category: ElementCategory.NOBLE_GAS, group: 18, period: 1 },
  
  { number: 3, symbol: 'Li', nameFr: 'Lithium', nameAr: 'ليثيوم', atomicMass: '6.94', category: ElementCategory.ALKALI_METAL, group: 1, period: 2 },
  { number: 4, symbol: 'Be', nameFr: 'Béryllium', nameAr: 'بيريليوم', atomicMass: '9.0122', category: ElementCategory.ALKALINE_EARTH_METAL, group: 2, period: 2 },
  { number: 5, symbol: 'B', nameFr: 'Bore', nameAr: 'بورون', atomicMass: '10.81', category: ElementCategory.METALLOID, group: 13, period: 2 },
  { number: 6, symbol: 'C', nameFr: 'Carbone', nameAr: 'كربون', atomicMass: '12.011', category: ElementCategory.NONMETAL, group: 14, period: 2 },
  { number: 7, symbol: 'N', nameFr: 'Azote', nameAr: 'نيتروجين', atomicMass: '14.007', category: ElementCategory.NONMETAL, group: 15, period: 2 },
  { number: 8, symbol: 'O', nameFr: 'Oxygène', nameAr: 'أكسجين', atomicMass: '15.999', category: ElementCategory.NONMETAL, group: 16, period: 2 },
  { number: 9, symbol: 'F', nameFr: 'Fluor', nameAr: 'فلور', atomicMass: '18.998', category: ElementCategory.HALOGEN, group: 17, period: 2 },
  { number: 10, symbol: 'Ne', nameFr: 'Néon', nameAr: 'نيون', atomicMass: '20.180', category: ElementCategory.NOBLE_GAS, group: 18, period: 2 },

  { number: 11, symbol: 'Na', nameFr: 'Sodium', nameAr: 'صوديوم', atomicMass: '22.990', category: ElementCategory.ALKALI_METAL, group: 1, period: 3 },
  { number: 12, symbol: 'Mg', nameFr: 'Magnésium', nameAr: 'مغنيسيوم', atomicMass: '24.305', category: ElementCategory.ALKALINE_EARTH_METAL, group: 2, period: 3 },
  { number: 13, symbol: 'Al', nameFr: 'Aluminium', nameAr: 'ألومنيوم', atomicMass: '26.982', category: ElementCategory.POST_TRANSITION_METAL, group: 13, period: 3 },
  { number: 14, symbol: 'Si', nameFr: 'Silicium', nameAr: 'سيليكون', atomicMass: '28.085', category: ElementCategory.METALLOID, group: 14, period: 3 },
  { number: 15, symbol: 'P', nameFr: 'Phosphore', nameAr: 'فوسفور', atomicMass: '30.974', category: ElementCategory.NONMETAL, group: 15, period: 3 },
  { number: 16, symbol: 'S', nameFr: 'Soufre', nameAr: 'كبريت', atomicMass: '32.06', category: ElementCategory.NONMETAL, group: 16, period: 3 },
  { number: 17, symbol: 'Cl', nameFr: 'Chlore', nameAr: 'كلور', atomicMass: '35.45', category: ElementCategory.HALOGEN, group: 17, period: 3 },
  { number: 18, symbol: 'Ar', nameFr: 'Argon', nameAr: 'أرجون', atomicMass: '39.948', category: ElementCategory.NOBLE_GAS, group: 18, period: 3 },

  // Period 4 (Selection)
  { number: 19, symbol: 'K', nameFr: 'Potassium', nameAr: 'بوتاسيوم', atomicMass: '39.098', category: ElementCategory.ALKALI_METAL, group: 1, period: 4 },
  { number: 20, symbol: 'Ca', nameFr: 'Calcium', nameAr: 'كالسيوم', atomicMass: '40.078', category: ElementCategory.ALKALINE_EARTH_METAL, group: 2, period: 4 },
  { number: 21, symbol: 'Sc', nameFr: 'Scandium', nameAr: 'سكانديوم', atomicMass: '44.956', category: ElementCategory.TRANSITION_METAL, group: 3, period: 4 },
  { number: 22, symbol: 'Ti', nameFr: 'Titane', nameAr: 'تيتانيوم', atomicMass: '47.867', category: ElementCategory.TRANSITION_METAL, group: 4, period: 4 },
  { number: 26, symbol: 'Fe', nameFr: 'Fer', nameAr: 'حديد', atomicMass: '55.845', category: ElementCategory.TRANSITION_METAL, group: 8, period: 4 },
  { number: 29, symbol: 'Cu', nameFr: 'Cuivre', nameAr: 'نحاس', atomicMass: '63.546', category: ElementCategory.TRANSITION_METAL, group: 11, period: 4 },
  { number: 30, symbol: 'Zn', nameFr: 'Zinc', nameAr: 'زنك', atomicMass: '65.38', category: ElementCategory.TRANSITION_METAL, group: 12, period: 4 },
  { number: 35, symbol: 'Br', nameFr: 'Brome', nameAr: 'بروم', atomicMass: '79.904', category: ElementCategory.HALOGEN, group: 17, period: 4 },
  { number: 36, symbol: 'Kr', nameFr: 'Krypton', nameAr: 'كريبتون', atomicMass: '83.798', category: ElementCategory.NOBLE_GAS, group: 18, period: 4 },

  // Period 5 (Selection)
  { number: 47, symbol: 'Ag', nameFr: 'Argent', nameAr: 'فضة', atomicMass: '107.87', category: ElementCategory.TRANSITION_METAL, group: 11, period: 5 },
  { number: 53, symbol: 'I', nameFr: 'Iode', nameAr: 'يود', atomicMass: '126.90', category: ElementCategory.HALOGEN, group: 17, period: 5 },
  { number: 54, symbol: 'Xe', nameFr: 'Xénon', nameAr: 'زينون', atomicMass: '131.29', category: ElementCategory.NOBLE_GAS, group: 18, period: 5 },

  // Period 6 (Selection including Au, Hg)
  { number: 79, symbol: 'Au', nameFr: 'Or', nameAr: 'ذهب', atomicMass: '196.97', category: ElementCategory.TRANSITION_METAL, group: 11, period: 6 },
  { number: 80, symbol: 'Hg', nameFr: 'Mercure', nameAr: 'زئبق', atomicMass: '200.59', category: ElementCategory.TRANSITION_METAL, group: 12, period: 6 },
  { number: 86, symbol: 'Rn', nameFr: 'Radon', nameAr: 'رادون', atomicMass: '222', category: ElementCategory.NOBLE_GAS, group: 18, period: 6 },

  // Period 7 (Selection including U)
  { number: 92, symbol: 'U', nameFr: 'Uranium', nameAr: 'يورانيوم', atomicMass: '238.03', category: ElementCategory.ACTINIDE, group: 3, period: 7 }, // Placed in actinide block usually
];

// Helper to get element by atomic number
export const getElementByNumber = (z: number) => ELEMENTS.find(e => e.number === z);
