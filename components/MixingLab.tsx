import React, { useState } from 'react';
import { ChemicalElement, ChemicalCompound } from '../types';
import { combineElements } from '../services/geminiService';
import { FlaskConical, Plus, X, Loader2, TestTube2, RotateCcw } from 'lucide-react';

interface MixingLabProps {
  selectedElements: ChemicalElement[];
  onRemoveElement: (element: ChemicalElement) => void;
  onClear: () => void;
}

export const MixingLab: React.FC<MixingLabProps> = ({ selectedElements, onRemoveElement, onClear }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ChemicalCompound | null>(null);

  const handleMix = async () => {
    if (selectedElements.length < 2) return;
    setLoading(true);
    setResult(null);
    try {
      const compound = await combineElements(selectedElements);
      setResult(compound);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetMix = () => {
      setResult(null);
      onClear();
  };

  if (selectedElements.length === 0 && !result) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="max-w-3xl mx-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
             <div className="flex items-center gap-2 text-emerald-400">
                <FlaskConical size={18} />
                <span className="font-semibold text-sm">Laboratoire de Fusion</span>
             </div>
             {selectedElements.length > 0 && (
                 <button onClick={resetMix} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                     <RotateCcw size={12} /> Réinitialiser
                 </button>
             )}
        </div>

        <div className="p-6">
            {!result ? (
                // Mixing Interface
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 flex flex-wrap gap-2 items-center justify-center md:justify-start">
                        {selectedElements.map((el, idx) => (
                            <React.Fragment key={idx}>
                                <div className="relative group animate-pop-in">
                                    <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center font-bold text-lg shadow-inner">
                                        {el.symbol}
                                    </div>
                                    <button 
                                        onClick={() => onRemoveElement(el)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                                {idx < selectedElements.length - 1 && <Plus size={16} className="text-slate-500" />}
                            </React.Fragment>
                        ))}
                         {selectedElements.length < 5 && (
                            <div className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-600">
                                <span className="text-xs text-center px-1">Ajouter</span>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleMix}
                        disabled={selectedElements.length < 2 || loading}
                        className={`
                            px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all
                            ${selectedElements.length >= 2 
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                        `}
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <TestTube2 size={20} />}
                        {loading ? 'Réaction en cours...' : 'Fusionner'}
                    </button>
                </div>
            ) : (
                // Result Interface
                <div className="animate-fade-in">
                    {result.success ? (
                        <div className="flex flex-col md:flex-row items-center gap-6">
                             <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full border-4 border-white/10 flex items-center justify-center relative shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                    {result.formula}
                                </div>
                                <div className="absolute -bottom-2 px-2 py-0.5 bg-slate-800 rounded-full text-[10px] border border-slate-600">
                                    {result.state}
                                </div>
                             </div>
                             <div className="flex-1 text-center md:text-left">
                                 <h3 className="text-2xl font-bold text-white mb-1">{result.nameFr}</h3>
                                 <h4 className="text-xl font-arabic text-emerald-400 mb-3">{result.nameAr}</h4>
                                 <p className="text-sm text-slate-300 mb-2">{result.descriptionFr}</p>
                                 <p className="text-sm text-slate-400 font-arabic" dir="rtl">{result.descriptionAr}</p>
                             </div>
                             <button onClick={resetMix} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white">
                                Nouvelle Fusion
                             </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-4">
                            <div className="p-3 bg-red-500/10 rounded-full text-red-400 mb-3">
                                <XCircleIcon size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-white">Pas de réaction notable</h3>
                            <p className="text-slate-400 text-sm mt-1">{result.errorFr || "Ces éléments ne se combinent pas facilement dans des conditions standard."}</p>
                             <p className="text-slate-500 text-sm mt-1 font-arabic">{result.errorAr}</p>
                             <button onClick={resetMix} className="mt-4 text-emerald-400 hover:underline text-sm">
                                Réessayer
                             </button>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

function XCircleIcon({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
    )
}
