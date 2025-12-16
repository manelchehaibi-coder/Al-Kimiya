import React from 'react';
import { ChemicalElement, ElementCategory } from '../types';
import { ELEMENT_CATEGORIES_COLORS } from '../constants';
import { Check } from 'lucide-react';

interface ElementCardProps {
  element: ChemicalElement;
  onClick: (element: ChemicalElement) => void;
  isSelected?: boolean; // Prop added for lab mode
}

export const ElementCard: React.FC<ElementCardProps> = ({ element, onClick, isSelected = false }) => {
  const colorClass = ELEMENT_CATEGORIES_COLORS[element.category] || ELEMENT_CATEGORIES_COLORS[ElementCategory.UNKNOWN];

  const style: React.CSSProperties = {
    gridColumn: element.group,
    gridRow: element.period,
  };

  if (element.category === ElementCategory.LANTHANIDE) {
     style.gridRow = 8;
     style.gridColumn = (element.number - 57) + 3; 
  }
  if (element.category === ElementCategory.ACTINIDE) {
     style.gridRow = 9;
     style.gridColumn = (element.number - 89) + 3; 
  }

  return (
    <button
      onClick={() => onClick(element)}
      style={style}
      className={`
        ${colorClass}
        relative p-1 sm:p-2 rounded-md 
        transition-all duration-200 flex flex-col items-center justify-between
        aspect-square cursor-pointer border 
        min-w-[40px] min-h-[40px]
        ${isSelected 
            ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-slate-900 border-emerald-300 scale-105 z-20 shadow-[0_0_15px_rgba(52,211,153,0.5)]' 
            : 'border-white/10 hover:scale-110 hover:z-10 hover:shadow-lg shadow-sm'
        }
      `}
      aria-label={`Element ${element.nameFr}`}
    >
      {isSelected && (
          <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-0.5 shadow-md z-30">
              <Check size={10} />
          </div>
      )}
      <span className="absolute top-0.5 left-1 text-[0.5rem] sm:text-xs font-mono opacity-80">{element.number}</span>
      <span className="text-xs sm:text-lg font-bold mt-1 sm:mt-0">{element.symbol}</span>
      <div className="hidden sm:flex flex-col items-center w-full">
        <span className="text-[0.5rem] truncate w-full text-center leading-tight">{element.nameFr}</span>
        <span className="text-[0.5rem] font-arabic truncate w-full text-center leading-tight opacity-90">{element.nameAr}</span>
      </div>
    </button>
  );
};