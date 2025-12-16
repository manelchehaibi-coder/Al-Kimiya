import React, { useState, useMemo } from 'react';
import { ELEMENTS, CATEGORY_LABELS, ELEMENT_CATEGORIES_COLORS } from './constants';
import { ChemicalElement, ElementCategory } from './types';
import { ElementCard } from './components/ElementCard';
import { ElementModal } from './components/ElementModal';
import { MixingLab } from './components/MixingLab';
import { Search, Filter, Beaker, FlaskConical, Atom } from 'lucide-react';

const App: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ElementCategory | 'all'>('all');
  
  // New States for Lab Mode
  const [isLabMode, setIsLabMode] = useState(false);
  const [labElements, setLabElements] = useState<ChemicalElement[]>([]);

  const filteredElements = useMemo(() => {
    return ELEMENTS.filter(el => {
      const matchesSearch = 
        el.nameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.nameAr.includes(searchQuery) ||
        el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.number.toString() === searchQuery;
      
      const matchesCategory = selectedCategory === 'all' || el.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleElementClick = (element: ChemicalElement) => {
      if (isLabMode) {
          // Toggle selection for lab
          setLabElements(prev => {
              const exists = prev.find(e => e.number === element.number);
              if (exists) {
                  return prev.filter(e => e.number !== element.number);
              }
              if (prev.length >= 5) return prev; // Max 5 elements
              return [...prev, element];
          });
      } else {
          // Open details
          setSelectedElement(element);
      }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-32">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors ${isLabMode ? 'bg-purple-600' : 'bg-emerald-500'}`}>
                {isLabMode ? <FlaskConical className="text-white" size={24} /> : <Atom className="text-white" size={24} />}
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight text-white">Al-Kimiya</h1>
                <p className="text-xs text-slate-400 font-arabic">{isLabMode ? 'مختبر الاندماج' : 'الجدول الدوري التفاعلي'}</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4 flex-1 justify-end max-w-2xl">
            {/* Mode Toggle */}
            <div className="bg-slate-800 p-1 rounded-full border border-slate-700 flex mr-4">
                <button 
                    onClick={() => setIsLabMode(false)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${!isLabMode ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                    <Atom size={14} /> Explorer
                </button>
                <button 
                    onClick={() => setIsLabMode(true)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${isLabMode ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                    <FlaskConical size={14} /> Labo
                </button>
            </div>

            <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="w-full bg-slate-800 border-slate-700 border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Controls */}
      <div className="md:hidden flex flex-col gap-2 p-4 bg-slate-900 border-b border-slate-800 sticky top-20 z-30">
         <div className="flex bg-slate-800 p-1 rounded-full border border-slate-700">
             <button 
                onClick={() => setIsLabMode(false)}
                className={`flex-1 py-1.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all ${!isLabMode ? 'bg-emerald-500 text-white' : 'text-slate-400'}`}
            >
                <Atom size={14} /> Explorer
            </button>
            <button 
                onClick={() => setIsLabMode(true)}
                className={`flex-1 py-1.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all ${isLabMode ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
            >
                <FlaskConical size={14} /> Labo
            </button>
         </div>
         <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
                type="text" 
                placeholder="Rechercher..." 
                className="w-full bg-slate-800 border-slate-700 border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
            <Filter size={16} className="text-slate-400 mr-2" />
            <button 
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${selectedCategory === 'all' ? 'bg-white text-slate-900 border-white' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}
            >
                Tout
            </button>
            {Object.values(ElementCategory).map(cat => (
                <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border whitespace-nowrap flex items-center gap-2
                        ${selectedCategory === cat ? 'ring-2 ring-offset-2 ring-offset-slate-950 ring-white' : 'opacity-70 hover:opacity-100'}
                        ${ELEMENT_CATEGORIES_COLORS[cat].replace('text-slate-900', 'text-white')}
                    `}
                    style={{ backgroundColor: selectedCategory === cat ? undefined : '' }} 
                >
                   <span className={`w-2 h-2 rounded-full bg-current`}></span>
                   {CATEGORY_LABELS[cat].fr}
                </button>
            ))}
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-x-auto">
        <div className="min-w-[800px] relative"> 
            <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1 sm:gap-2 auto-rows-min">
                {filteredElements.length === ELEMENTS.length ? (
                    ELEMENTS.map(element => (
                        <ElementCard 
                            key={element.number} 
                            element={element} 
                            onClick={handleElementClick}
                            isSelected={isLabMode && labElements.some(e => e.number === element.number)}
                        />
                    ))
                ) : (
                    <div className="col-span-18 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                         {filteredElements.map(element => (
                            <div key={element.number} onClick={() => handleElementClick(element)} className="cursor-pointer">
                                <div className={`
                                    ${ELEMENT_CATEGORIES_COLORS[element.category]}
                                    p-4 rounded-xl shadow-lg transition-transform
                                    flex flex-col items-center justify-center aspect-square
                                    ${isLabMode && labElements.some(e => e.number === element.number) 
                                        ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-slate-900 scale-105' 
                                        : 'hover:scale-105'}
                                `}>
                                    <span className="text-sm opacity-70 mb-1">{element.number}</span>
                                    <span className="text-3xl font-bold mb-2">{element.symbol}</span>
                                    <span className="text-xs font-medium truncate w-full text-center">{element.nameFr}</span>
                                    <span className="text-xs font-arabic opacity-90 truncate w-full text-center">{element.nameAr}</span>
                                </div>
                            </div>
                        ))}
                        {filteredElements.length === 0 && (
                            <div className="col-span-full text-center py-20 text-slate-500">
                                Aucun élément trouvé pour "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </main>

      {/* Modals & Lab Interface */}
      <ElementModal 
        element={selectedElement} 
        onClose={() => setSelectedElement(null)} 
      />

      {isLabMode && (
          <MixingLab 
            selectedElements={labElements} 
            onRemoveElement={(el) => setLabElements(prev => prev.filter(e => e.number !== el.number))}
            onClear={() => setLabElements([])}
          />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12 py-8 text-center text-slate-500 text-sm">
        <p>Développé avec React, Tailwind et Gemini AI.</p>
        <p className="font-arabic mt-2">تم تطويره باستخدام React و Tailwind و Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;