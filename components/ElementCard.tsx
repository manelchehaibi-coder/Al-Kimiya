import React from 'react';
import { ChemicalElement, ElementCategory } from '../types';
import { ELEMENT_CATEGORIES_COLORS } from '../constants';

interface ElementCardProps {
  element: ChemicalElement;
  onClick: (element: ChemicalElement) => void;
}

export const ElementCard: React.FC<ElementCardProps> = ({ element, onClick }) => {
  const colorClass = ELEMENT_CATEGORIES_COLORS[element.category] || ELEMENT_CATEGORIES_COLORS[ElementCategory.UNKNOWN];

  // Determine grid position
  // Since we are using a CSS grid with 18 columns.
  // Group corresponds to column. Period corresponds to row.
  // Special handling for Lanthanides/Actinides would go here in a full app.
  // For this simplified rendering, we trust the grid placement style if we used grid-column/row directly,
  // but here we will render them in a flat list mapped to a grid in the parent for simplicity,
  // OR we pass style props for gridColumn/gridRow.
  
  const style: React.CSSProperties = {
    gridColumn: element.group,
    gridRow: element.period,
  };

  // Lanthanides and Actinides adjustments for visualization if they don't have a group
  // This is a simplified visualization hack.
  if (element.category === ElementCategory.LANTHANIDE) {
     style.gridRow = 8;
     style.gridColumn = (element.number - 57) + 3; // Offset
  }
  if (element.category === ElementCategory.ACTINIDE) {
     style.gridRow = 9;
     style.gridColumn = (element.number - 89) + 3; // Offset
  }

  return (
    <button
      onClick={() => onClick(element)}
      style={style}
      className={`
        ${colorClass}
        relative p-1 sm:p-2 rounded-md shadow-sm hover:scale-110 hover:z-10 hover:shadow-lg 
        transition-all duration-200 flex flex-col items-center justify-between
        aspect-square cursor-pointer border border-white/10
        min-w-[40px] min-h-[40px]
      `}
      aria-label={`Element ${element.nameFr}`}
    >
      <span className="absolute top-0.5 left-1 text-[0.5rem] sm:text-xs font-mono opacity-80">{element.number}</span>
      <span className="text-xs sm:text-lg font-bold mt-1 sm:mt-0">{element.symbol}</span>
      <div className="hidden sm:flex flex-col items-center w-full">
        <span className="text-[0.5rem] truncate w-full text-center leading-tight">{element.nameFr}</span>
        <span className="text-[0.5rem] font-arabic truncate w-full text-center leading-tight opacity-90">{element.nameAr}</span>
      </div>
    </button>
  );
};
