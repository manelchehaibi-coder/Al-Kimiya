import React, { useEffect, useState } from 'react';
import { ChemicalElement, GeminiElementDetails } from '../types';
import { ELEMENT_CATEGORIES_COLORS, CATEGORY_LABELS } from '../constants';
import { fetchElementDetails } from '../services/geminiService';
import { X, Atom, Sparkles, FlaskConical, BookOpen } from 'lucide-react';

interface ElementModalProps {
  element: ChemicalElement | null;
  onClose: () => void;
}

export const ElementModal: React.FC<ElementModalProps> = ({ element, onClose }) => {
  const [details, setDetails] = useState<GeminiElementDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!element) return;
    setDetails(null);
    setError(null);
    setLoading(false);
  }, [element]);

  const handleGenerateAI = async () => {
    if (!element) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchElementDetails(element);
      setDetails(data);
    } catch (err) {
      setError("Erreur lors de la génération des données. Veuillez vérifier votre clé API.");
    } finally {
      setLoading(false);
    }
  };

  if (!element) return null;

  const categoryColor = ELEMENT_CATEGORIES_COLORS[element.category];
  const categoryLabel = CATEGORY_LABELS[element.category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition z-10 text-white"
        >
          <X size={20} />
        </button>

        {/* Left Side: Visual & Basic Info */}
        <div className={`w-full md:w-1/3 p-8 flex flex-col items-center justify-center text-white relative overflow-hidden ${categoryColor}`}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="z-10 text-center">
                <span className="text-6xl font-mono opacity-50">{element.number}</span>
                <h1 className="text-9xl font-bold my-4">{element.symbol}</h1>
                <div className="text-2xl font-medium">{element.nameFr}</div>
                <div className="text-3xl font-arabic mt-2">{element.nameAr}</div>
                <div className="mt-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold">
                    {element.atomicMass} u
                </div>
            </div>
        </div>

        {/* Right Side: Details & AI */}
        <div className="w-full md:w-2/3 p-8 text-slate-200">
            <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-slate-800 text-sm border border-slate-700">
                    {categoryLabel.fr} / <span className="font-arabic">{categoryLabel.ar}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-sm border border-slate-700">
                    Période {element.period}, Groupe {element.group || '-'}
                </span>
            </div>

            {!details && !loading && (
                <div className="flex flex-col items-center justify-center h-64 space-y-4 border-2 border-dashed border-slate-700 rounded-xl p-6">
                    <Sparkles size={48} className="text-emerald-400" />
                    <p className="text-center text-slate-400">
                        Obtenez des descriptions détaillées, l'histoire et des faits amusants grâce à l'intelligence artificielle.
                    </p>
                    <button 
                        onClick={handleGenerateAI}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-emerald-500/20"
                    >
                        <Sparkles size={18} />
                        Générer les infos avec Gemini
                    </button>
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    <p className="text-slate-400 animate-pulse">Consultation de l'oracle chimique...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {details && (
                <div className="space-y-8 animate-fade-in">
                    {/* Description Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="text-emerald-400 font-semibold flex items-center gap-2">
                                <BookOpen size={18} /> Description (FR)
                            </h3>
                            <p className="text-sm leading-relaxed text-slate-300">{details.descriptionFr}</p>
                        </div>
                        <div className="space-y-2 text-right md:text-right" dir="rtl">
                            <h3 className="text-emerald-400 font-semibold flex items-center gap-2 justify-end font-arabic">
                                الوصف (AR) <BookOpen size={18} className="ml-2"/>
                            </h3>
                            <p className="text-sm leading-relaxed text-slate-300 font-arabic">{details.descriptionAr}</p>
                        </div>
                    </div>

                    {/* Applications Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                             <h3 className="text-blue-400 font-semibold flex items-center gap-2 mb-3">
                                <FlaskConical size={18} /> Applications
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                                {details.applicationsFr.map((app, i) => <li key={i}>{app}</li>)}
                            </ul>
                        </div>
                         <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-right" dir="rtl">
                             <h3 className="text-blue-400 font-semibold flex items-center gap-2 mb-3 justify-end font-arabic">
                                الاستخدامات <FlaskConical size={18} className="ml-2" />
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 font-arabic">
                                {details.applicationsAr.map((app, i) => <li key={i}>{app}</li>)}
                            </ul>
                        </div>
                    </div>

                     {/* Fun Fact */}
                     <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl flex flex-col md:flex-row items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-full text-purple-300">
                            <Atom size={24} />
                        </div>
                        <div className="flex-1 space-y-2 text-center md:text-left">
                            <p className="text-sm text-purple-100 italic">"{details.funFactFr}"</p>
                            <div className="w-full h-px bg-purple-500/30 my-2"></div>
                            <p className="text-sm text-purple-100 font-arabic italic" dir="rtl">"{details.funFactAr}"</p>
                        </div>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
