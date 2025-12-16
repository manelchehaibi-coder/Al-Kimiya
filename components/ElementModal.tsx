import React, { useEffect, useState, useRef } from 'react';
import { ChemicalElement, GeminiElementDetails } from '../types';
import { ELEMENT_CATEGORIES_COLORS, CATEGORY_LABELS } from '../constants';
import { fetchElementDetails, fetchAudioForText } from '../services/geminiService';
import { X, Atom, Sparkles, FlaskConical, BookOpen, Volume1, Volume2, Loader2, BookAudio, Play, Pause, XCircle } from 'lucide-react';

// --- AUDIO HELPER FUNCTIONS ---
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(1, frameCount, ctx.sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

// --- IMMERSIVE READER COMPONENT ---
interface ImmersiveReaderProps {
  text: string;
  audioData: string;
  lang: 'fr' | 'ar';
  onClose: () => void;
}

const ImmersiveReaderOverlay: React.FC<ImmersiveReaderProps> = ({ text, audioData, lang, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    useEffect(() => {
        let isMounted = true;
        const play = async () => {
            try {
                const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                audioContextRef.current = ctx;
                
                const decodedBytes = decode(audioData);
                const audioBuffer = await decodeAudioData(decodedBytes, ctx);
                
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                source.onended = () => {
                    if (isMounted) {
                        onClose();
                    }
                };
                source.start();
                audioSourceRef.current = source;
            } catch (err) {
                console.error("Failed to play immersive audio:", err);
                if (isMounted) onClose();
            }
        };

        play();

        return () => {
            isMounted = false;
            if (audioSourceRef.current) {
                try { audioSourceRef.current.stop(); } catch(e) {}
                audioSourceRef.current.disconnect();
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, [audioData, onClose]);

    const togglePlayPause = () => {
        if (!audioContextRef.current) return;
        if (isPlaying) {
            audioContextRef.current.suspend();
        } else {
            audioContextRef.current.resume();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-lg animate-fade-in" onClick={onClose}>
            <div className="relative bg-slate-900 p-8 md:p-12 rounded-2xl shadow-2xl max-w-3xl w-[90%] border border-slate-700" onClick={(e) => e.stopPropagation()}>
                <p 
                    className={`text-2xl md:text-3xl leading-relaxed text-slate-100 ${lang === 'ar' ? 'font-arabic text-right' : ''}`} 
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                >
                    {text}
                </p>
                <div className="mt-8 flex items-center justify-center gap-4">
                    <button onClick={togglePlayPause} className="p-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-400 transition-transform hover:scale-110">
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                     <button onClick={onClose} className="p-3 bg-red-600 text-white rounded-full hover:bg-red-500 transition-transform hover:scale-110">
                        <XCircle size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- ELEMENT MODAL COMPONENT ---
interface ElementModalProps {
  element: ChemicalElement | null;
  onClose: () => void;
}

type AudioContentKey = 'descriptionFrAudio' | 'descriptionArAudio' | 'funFactFrAudio' | 'funFactArAudio';

export const ElementModal: React.FC<ElementModalProps> = ({ element, onClose }) => {
  const [details, setDetails] = useState<GeminiElementDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<'fr' | 'ar' | null>(null);
  const [loadingAudioSection, setLoadingAudioSection] = useState<AudioContentKey | null>(null);
  const [readerState, setReaderState] = useState<{ active: boolean; text: string; audioData: string; lang: 'fr' | 'ar' | null }>({ active: false, text: '', audioData: '', lang: null});

  const nameAudioContextRef = useRef<AudioContext | null>(null);
  const nameAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    if (!element) return;
    setDetails(null);
    setError(null);
    setLoading(false);
    setReaderState({ active: false, text: '', audioData: '', lang: null });

    return () => {
      if (nameAudioSourceRef.current) {
        try { nameAudioSourceRef.current.stop(); } catch(e) {}
        nameAudioSourceRef.current.disconnect();
        nameAudioSourceRef.current = null;
      }
      if (nameAudioContextRef.current && nameAudioContextRef.current.state !== 'closed') {
        nameAudioContextRef.current.close();
        nameAudioContextRef.current = null;
      }
      setPlayingAudio(null);
    };
  }, [element]);

  const handleGenerateAI = async () => {
    if (!element) return;
    setLoading(true);
    setError(null);
    try {
        const [detailsResult, audioFrResult, audioArResult] = await Promise.allSettled([
            fetchElementDetails(element),
            fetchAudioForText(`Prononce: ${element.nameFr}`),
            fetchAudioForText(`انطق: ${element.nameAr}`),
        ]);

        if (detailsResult.status === 'rejected') throw new Error("Failed to fetch element details.");
        
        const data = detailsResult.value;
        if (audioFrResult.status === 'fulfilled') data.audioFr = audioFrResult.value;
        if (audioArResult.status === 'fulfilled') data.audioAr = audioArResult.value;
      
        setDetails(data);
    } catch (err) {
      setError("Erreur lors de la génération des données. Veuillez vérifier votre clé API.");
    } finally {
      setLoading(false);
    }
  };

  const playNameAudio = async (lang: 'fr' | 'ar') => {
    if (!details) return;
    const audioData = lang === 'fr' ? details.audioFr : details.audioAr;
    if (!audioData) return;

    if (nameAudioSourceRef.current) {
        try { nameAudioSourceRef.current.stop(); } catch(e) {}
        nameAudioSourceRef.current.disconnect();
        nameAudioSourceRef.current = null;
    }

    if (playingAudio === lang) {
        setPlayingAudio(null);
        return;
    }

    try {
        if (!nameAudioContextRef.current || nameAudioContextRef.current.state === 'closed') {
             nameAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        
        const decodedBytes = decode(audioData);
        const audioBuffer = await decodeAudioData(decodedBytes, nameAudioContextRef.current);

        const source = nameAudioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(nameAudioContextRef.current.destination);
        source.onended = () => {
            setPlayingAudio(null);
            nameAudioSourceRef.current = null;
        };
        source.start();
        
        nameAudioSourceRef.current = source;
        setPlayingAudio(lang);
    } catch (err) {
        console.error("Failed to play name audio:", err);
        setError("Erreur de lecture audio.");
    }
  };

  const handleReadSection = async (lang: 'fr' | 'ar', contentKey: 'description' | 'funFact', text: string) => {
      const audioKey: AudioContentKey = `${contentKey}${lang === 'fr' ? 'Fr' : 'Ar'}Audio` as AudioContentKey;
      if (details?.[audioKey]) {
          setReaderState({ active: true, text, audioData: details[audioKey]!, lang });
          return;
      }

      setLoadingAudioSection(audioKey);
      try {
          const audioData = await fetchAudioForText(text);
          setDetails(prev => prev ? { ...prev, [audioKey]: audioData } : null);
          setReaderState({ active: true, text, audioData, lang });
      } catch (err) {
          console.error(`Failed to fetch audio for ${audioKey}`, err);
          setError("Erreur de génération de la lecture audio.");
      } finally {
          setLoadingAudioSection(null);
      }
  };


  if (!element) return null;

  const categoryColor = ELEMENT_CATEGORIES_COLORS[element.category];
  const categoryLabel = CATEGORY_LABELS[element.category];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div 
          className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row" 
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition z-10 text-white"><X size={20} /></button>

          <div className={`w-full md:w-1/3 p-8 flex flex-col items-center justify-center text-white relative overflow-hidden ${categoryColor}`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="z-10 text-center">
                  <span className="text-6xl font-mono opacity-50">{element.number}</span>
                  <h1 className="text-9xl font-bold my-4">{element.symbol}</h1>
                  <div className="text-2xl font-medium flex items-center justify-center gap-2">
                      {element.nameFr}
                      {details?.audioFr && <button onClick={() => playNameAudio('fr')} disabled={loading} className="p-1 rounded-full hover:bg-white/30 transition-colors disabled:opacity-50">{playingAudio === 'fr' ? <Volume2 size={22} className="animate-pulse" /> : <Volume1 size={22} />}</button>}
                  </div>
                  <div className="text-3xl font-arabic mt-2 flex items-center justify-center gap-2">
                      {element.nameAr}
                      {details?.audioAr && <button onClick={() => playNameAudio('ar')} disabled={loading} className="p-1 rounded-full hover:bg-white/30 transition-colors disabled:opacity-50">{playingAudio === 'ar' ? <Volume2 size={22} className="animate-pulse"/> : <Volume1 size={22} />}</button>}
                  </div>
                  <div className="mt-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold">{element.atomicMass} u</div>
              </div>
          </div>

          <div className="w-full md:w-2/3 p-8 text-slate-200">
              <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-sm border border-slate-700">{categoryLabel.fr} / <span className="font-arabic">{categoryLabel.ar}</span></span>
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-sm border border-slate-700">Période {element.period}, Groupe {element.group || '-'}</span>
              </div>

              {!details && !loading && (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4 border-2 border-dashed border-slate-700 rounded-xl p-6">
                      <Sparkles size={48} className="text-emerald-400" />
                      <p className="text-center text-slate-400">Obtenez des descriptions détaillées, l'histoire et des faits amusants grâce à l'intelligence artificielle.</p>
                      <button onClick={handleGenerateAI} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-emerald-500/20"><Sparkles size={18} /> Générer les infos avec Gemini</button>
                  </div>
              )}

              {loading && <div className="flex flex-col items-center justify-center h-64 space-y-4"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div><p className="text-slate-400 animate-pulse">Consultation de l'oracle chimique...</p></div>}
              {error && <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-4">{error}</div>}

              {details && (
                  <div className="space-y-8 animate-fade-in">
                      <div className="grid md:grid-cols-2 gap-6">
                          <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-emerald-400 font-semibold flex items-center gap-2"><BookOpen size={18} /> Description (FR)</h3>
                                <button disabled={!!loadingAudioSection} onClick={() => handleReadSection('fr', 'description', details.descriptionFr)} className="text-emerald-400 hover:text-emerald-300 disabled:opacity-50 disabled:cursor-wait">{loadingAudioSection === 'descriptionFrAudio' ? <Loader2 size={18} className="animate-spin"/> : <BookAudio size={18} />}</button>
                              </div>
                              <p className="text-sm leading-relaxed text-slate-300">{details.descriptionFr}</p>
                          </div>
                          <div dir="rtl">
                               <div className="flex items-center gap-2 mb-2 justify-end">
                                <h3 className="text-emerald-400 font-semibold flex items-center gap-2 font-arabic">الوصف (AR) <BookOpen size={18} className="ml-2"/></h3>
                                <button disabled={!!loadingAudioSection} onClick={() => handleReadSection('ar', 'description', details.descriptionAr)} className="text-emerald-400 hover:text-emerald-300 disabled:opacity-50 disabled:cursor-wait">{loadingAudioSection === 'descriptionArAudio' ? <Loader2 size={18} className="animate-spin"/> : <BookAudio size={18} />}</button>
                              </div>
                              <p className="text-sm leading-relaxed text-slate-300 font-arabic text-right">{details.descriptionAr}</p>
                          </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                               <h3 className="text-blue-400 font-semibold flex items-center gap-2 mb-3"><FlaskConical size={18} /> Applications</h3>
                              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">{details.applicationsFr.map((app, i) => <li key={i}>{app}</li>)}</ul>
                          </div>
                           <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-right" dir="rtl">
                               <h3 className="text-blue-400 font-semibold flex items-center gap-2 mb-3 justify-end font-arabic">الاستخدامات <FlaskConical size={18} className="ml-2" /></h3>
                              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 font-arabic">{details.applicationsAr.map((app, i) => <li key={i}>{app}</li>)}</ul>
                          </div>
                      </div>

                       <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl">
                           <div className="flex items-center gap-4">
                               <div className="p-3 bg-purple-500/20 rounded-full text-purple-300 hidden md:block"><Atom size={24} /></div>
                               <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm text-purple-100 italic flex-1">"{details.funFactFr}"</p>
                                    <button disabled={!!loadingAudioSection} onClick={() => handleReadSection('fr', 'funFact', details.funFactFr)} className="text-purple-300 hover:text-purple-200 disabled:opacity-50 disabled:cursor-wait">{loadingAudioSection === 'funFactFrAudio' ? <Loader2 size={18} className="animate-spin"/> : <BookAudio size={18} />}</button>
                                  </div>
                                  <div className="w-full h-px bg-purple-500/30 my-2"></div>
                                  <div className="flex items-center gap-2" dir="rtl">
                                    <p className="text-sm text-purple-100 font-arabic italic flex-1 text-right">"{details.funFactAr}"</p>
                                    <button disabled={!!loadingAudioSection} onClick={() => handleReadSection('ar', 'funFact', details.funFactAr)} className="text-purple-300 hover:text-purple-200 disabled:opacity-50 disabled:cursor-wait">{loadingAudioSection === 'funFactArAudio' ? <Loader2 size={18} className="animate-spin"/> : <BookAudio size={18} />}</button>
                                  </div>
                               </div>
                           </div>
                       </div>
                  </div>
              )}
          </div>
        </div>
      </div>
      {readerState.active && (
        <ImmersiveReaderOverlay 
          text={readerState.text}
          audioData={readerState.audioData}
          lang={readerState.lang!}
          onClose={() => setReaderState({ active: false, text: '', audioData: '', lang: null })}
        />
      )}
    </>
  );
};