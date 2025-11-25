import React, { useState, useMemo, useEffect } from 'react';
import { PierData, Metric, GeminiAnalysisResponse } from './types';
import { DEFAULT_CSV_DATA } from './constants';
import { parseCSV, getSortedStories } from './utils/dataUtils';
import { UploadSection } from './components/UploadSection';
import { Heatmap } from './components/Heatmap';
import { analyzeDataWithGemini } from './services/geminiService';
import { Activity, BarChart3, BrainCircuit, Loader2, AlertCircle, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [rawData, setRawData] = useState<string>(DEFAULT_CSV_DATA);
  const [selectedMetric, setSelectedMetric] = useState<Metric>('P');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<GeminiAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parsedData = useMemo(() => parseCSV(rawData), [rawData]);
  const allStories = useMemo(() => getSortedStories(parsedData), [parsedData]);

  // Floor Range State
  const [topStory, setTopStory] = useState<string>('');
  const [bottomStory, setBottomStory] = useState<string>('');

  // Reset range when data changes
  useEffect(() => {
    if (allStories.length > 0) {
      setTopStory(allStories[0]);
      setBottomStory(allStories[allStories.length - 1]);
    } else {
      setTopStory('');
      setBottomStory('');
    }
  }, [allStories]);

  // Filter data based on range
  const filteredData = useMemo(() => {
    if (!topStory || !bottomStory || allStories.length === 0) return parsedData;

    const startIdx = allStories.indexOf(topStory);
    const endIdx = allStories.indexOf(bottomStory);

    if (startIdx === -1 || endIdx === -1) return parsedData;

    // Handle if user selects bottom as top or vice versa
    const min = Math.min(startIdx, endIdx);
    const max = Math.max(startIdx, endIdx);

    const allowedStories = allStories.slice(min, max + 1);
    return parsedData.filter(d => allowedStories.includes(d.Story));
  }, [parsedData, allStories, topStory, bottomStory]);

  const handleFileUpload = (content: string) => {
    setRawData(content);
    setAnalysis(null); // Reset analysis on new data
  };

  const handleAnalyze = async () => {
    if (!process.env.API_KEY) {
      setError("API Key is missing. Please check your environment variables.");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeDataWithGemini(filteredData, selectedMetric);
      setAnalysis({
        analysis: result,
        timestamp: Date.now()
      });
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unexpected error occurred during analysis.");
        }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <Activity className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">PierForce Analytics</h1>
          </div>
          <div className="text-sm text-slate-500">
            Visualizing {filteredData.length} data points
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls & Upload */}
        <UploadSection onFileUpload={handleFileUpload} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column: Controls and Stats */}
          <div className="lg:col-span-1 space-y-6">
             {/* Story Range Selector */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Layers size={18} className="text-blue-600" />
                    Story Range
                </h3>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="text-xs text-slate-500 font-medium mb-1 block">Start Floor</label>
                        <div className="relative">
                            <select 
                                value={topStory} 
                                onChange={(e) => setTopStory(e.target.value)}
                                className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none text-slate-700"
                            >
                                {allStories.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                        </div>
                    </div>
                     <div>
                        <label className="text-xs text-slate-500 font-medium mb-1 block">End Floor</label>
                        <div className="relative">
                            <select 
                                value={bottomStory} 
                                onChange={(e) => setBottomStory(e.target.value)}
                                className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none text-slate-700"
                            >
                                {allStories.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                        </div>
                    </div>
                </div>
             </div>

             {/* Metric Selector */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <BarChart3 size={18} className="text-indigo-600" />
                    Visualization Metric
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {(['P', 'V2', 'V3', 'T', 'M2', 'M3'] as Metric[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => setSelectedMetric(m)}
                            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                                selectedMetric === m 
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 border shadow-sm ring-2 ring-indigo-100' 
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-slate-400 mt-4">
                    Select a force component to update the heatmap. 'P' typically represents Axial Force.
                </p>
             </div>

             {/* AI Analysis Panel */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                        <BrainCircuit size={18} className="text-emerald-600" />
                        AI Insights
                    </h3>
                 </div>
                 
                 {!analysis && !isAnalyzing && (
                     <div className="text-center py-6">
                         <p className="text-sm text-slate-500 mb-4">
                             Generate an engineering summary of the critical loads using Gemini AI.
                         </p>
                         <button 
                            onClick={handleAnalyze}
                            disabled={!filteredData.length}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                             <BrainCircuit size={16} />
                             Analyze Critical Loads
                         </button>
                         {error && (
                             <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg flex items-start gap-2 text-left border border-red-100">
                                 <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                                 {error}
                             </div>
                         )}
                     </div>
                 )}

                 {isAnalyzing && (
                     <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                         <Loader2 className="animate-spin mb-2 text-emerald-500" size={24} />
                         <span className="text-sm">Analyzing structure data...</span>
                     </div>
                 )}

                 {analysis && (
                     <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <div className="prose prose-sm prose-slate max-w-none text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100 max-h-[400px] overflow-y-auto custom-scrollbar">
                             <div dangerouslySetInnerHTML={{ __html: analysis.analysis.replace(/\n/g, '<br/>') }} />
                         </div>
                         <div className="mt-4 flex justify-end">
                             <button 
                                onClick={() => setAnalysis(null)}
                                className="text-xs text-slate-400 hover:text-slate-600 underline"
                             >
                                Clear Analysis
                             </button>
                         </div>
                     </div>
                 )}
             </div>
          </div>

          {/* Right Column: Heatmap (Spans 2 cols) */}
          <div className="lg:col-span-2 min-h-[600px]">
            <Heatmap data={filteredData} metric={selectedMetric} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;