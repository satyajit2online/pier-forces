import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { PierData, Metric } from '../types';
import { getSortedStories, getSortedPiers, getHeatmapValue } from '../utils/dataUtils';
import { Info } from 'lucide-react';

interface HeatmapProps {
  data: PierData[];
  metric: Metric;
}

export const Heatmap: React.FC<HeatmapProps> = ({ data, metric }) => {
  const [hoveredCell, setHoveredCell] = useState<{story: string, pier: string, value: number} | null>(null);

  const sortedStories = useMemo(() => getSortedStories(data), [data]);
  const sortedPiers = useMemo(() => getSortedPiers(data), [data]);

  // Calculate extent for color scale
  const extent = useMemo(() => {
    const values = data.map(d => d[metric]);
    const absValues = values.map(v => Math.abs(v));
    return [Math.min(...absValues), Math.max(...absValues)] as [number, number];
  }, [data, metric]);

  // Color scale: White -> Inferno Dark/Red
  const colorScale = d3.scaleSequential()
    .domain([0, extent[1]]) 
    .interpolator(d3.interpolateInferno); 

  const formatValue = (val: number) => {
      if (Math.abs(val) < 10) return val.toFixed(1);
      return Math.round(val).toString();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            Load Distribution Heatmap
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                |{metric}| (Absolute Magnitude)
            </span>
        </h2>
        <div className="text-xs text-slate-400 flex items-center gap-1">
            <Info size={14} />
            <span>Bottom Forces • Select range to zoom</span>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar pb-4 flex-1">
        <div className="inline-block min-w-full">
          <div className="grid" style={{ 
              gridTemplateColumns: `auto repeat(${sortedPiers.length}, minmax(40px, 1fr))`,
              gap: '1px',
          }}>
            {/* Header Row: Pier Names */}
            <div className="sticky left-0 z-10 bg-slate-50 p-2 font-medium text-slate-500 text-xs text-right border-b border-r border-slate-200">Story \ Pier</div>
            {sortedPiers.map(pier => (
              <div key={pier} className="bg-slate-50 p-2 text-center text-[10px] font-semibold text-slate-600 min-w-[40px] border-b border-slate-200">
                {pier}
              </div>
            ))}

            {/* Data Rows */}
            {sortedStories.map(story => (
              <React.Fragment key={story}>
                {/* Row Label */}
                <div className="sticky left-0 z-10 bg-white border-r border-slate-100 p-2 text-xs font-medium text-slate-700 whitespace-nowrap flex items-center justify-end">
                    {story}
                </div>
                
                {/* Cells */}
                {sortedPiers.map(pier => {
                  const rawValue = getHeatmapValue(data, story, pier, metric);
                  const absValue = rawValue !== null ? Math.abs(rawValue) : 0;
                  const color = rawValue !== null ? colorScale(absValue) : '#f8fafc';
                  
                  // Simple contrast check: if value is high (darker color in inferno), use white text
                  // Inferno goes from Dark (low) to Light (high)? No, d3.interpolateInferno goes from Dark Purple/Black (0) to Yellow (1).
                  // Wait, standard interpolateInferno: 0 is black, 1 is yellow.
                  // If we want high load = high attention (red/yellow), we map 0->0 and Max->1.
                  // In Inferno: 0 is Dark, 1 is Light Yellow. 
                  // If we want heatmap style where High = Hot (Red/Yellow), then 1 is bright.
                  // Text on bright yellow (1) needs to be black.
                  // Text on dark purple (0) needs to be white.
                  
                  // Let's use a simpler threshold based on value relative to max.
                  // Start (0.0): Dark -> White text.
                  // End (1.0): Bright Yellow -> Black text.
                  const normalized = extent[1] > 0 ? absValue / extent[1] : 0;
                  const textColor = normalized > 0.6 ? 'text-slate-900' : 'text-white/90';

                  return (
                    <div
                      key={`${story}-${pier}`}
                      className="h-10 relative group transition-all duration-150 hover:z-20 hover:scale-105 hover:shadow-lg cursor-pointer border border-transparent hover:border-white/20"
                      style={{ backgroundColor: color }}
                      onMouseEnter={() => rawValue !== null && setHoveredCell({ story, pier, value: rawValue })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div className={`flex items-center justify-center w-full h-full ${textColor}`}>
                        <span className="text-[9px] font-medium leading-none">
                           {rawValue !== null ? formatValue(rawValue) : ''}
                        </span>
                      </div>

                      {/* Tooltip */}
                      {hoveredCell?.story === story && hoveredCell?.pier === pier && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs rounded py-1.5 px-2.5 whitespace-nowrap z-30 pointer-events-none shadow-xl">
                          <div className="font-semibold mb-0.5">{story} - {pier}</div>
                          <div>{metric}: {rawValue?.toFixed(3)}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="flex items-center gap-4 w-full max-w-md">
            <span className="text-xs text-slate-600 font-medium min-w-[3rem] text-right">0</span>
            <div className="h-3 flex-1 rounded-full shadow-inner" style={{ background: `linear-gradient(to right, ${colorScale(0)}, ${colorScale(extent[1] * 0.5)}, ${colorScale(extent[1])})` }}></div>
            <span className="text-xs text-slate-600 font-medium min-w-[3rem]">{extent[1].toFixed(0)}</span>
        </div>
        <span className="text-[10px] text-slate-400">Values shown are absolute magnitudes</span>
      </div>
    </div>
  );
};