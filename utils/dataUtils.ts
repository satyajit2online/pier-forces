import { PierData, Metric } from '../types';
import { STORY_ORDER } from '../constants';

// Helper to parse number or return 0
const parseNum = (val: string) => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

export const parseCSV = (csvText: string): PierData[] => {
  const lines = csvText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const data: PierData[] = [];

  // Skip header lines. Usually the data starts after the line containing "Story" or units.
  // Based on prompt: Line 1 is Title, Line 2 is Headers, Line 3 is Units.
  let startIndex = 0;
  for(let i=0; i<lines.length; i++) {
    if (lines[i].startsWith('Terrace') || lines[i].startsWith('Floor') || lines[i].startsWith('STILT') || lines[i].startsWith('BASEMENT')) {
      startIndex = i;
      break;
    }
  }

  for (let i = startIndex; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (cols.length < 11) continue;

    // Specific format from prompt:
    // 0: Story, 1: Pier, 2: Output Case, 3: Case Type, 4: Location, 5: P, 6: V2, 7: V3, 8: T, 9: M2, 10: M3
    const row: PierData = {
      Story: cols[0],
      Pier: cols[1],
      OutputCase: cols[2],
      CaseType: cols[3],
      Location: cols[4],
      P: parseNum(cols[5]),
      V2: parseNum(cols[6]),
      V3: parseNum(cols[7]),
      T: parseNum(cols[8]),
      M2: parseNum(cols[9]),
      M3: parseNum(cols[10]),
    };

    // We only care about Bottom forces for column load analysis usually
    if (row.Location === 'Bottom') {
      data.push(row);
    }
  }

  return data;
};

export const getSortedStories = (data: PierData[]): string[] => {
  const uniqueStories = Array.from(new Set(data.map(d => d.Story)));
  
  return uniqueStories.sort((a, b) => {
    const indexA = STORY_ORDER.indexOf(a);
    const indexB = STORY_ORDER.indexOf(b);
    
    // If not found in predefined list, push to end
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    
    return indexA - indexB;
  });
};

export const getSortedPiers = (data: PierData[]): string[] => {
  const uniquePiers = Array.from(new Set(data.map(d => d.Pier)));
  
  return uniquePiers.sort((a, b) => {
    // Extract number from "C1", "C12"
    const numA = parseInt(a.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.replace(/\D/g, '')) || 0;
    return numA - numB;
  });
};

export const getHeatmapValue = (data: PierData[], story: string, pier: string, metric: Metric): number | null => {
  const entry = data.find(d => d.Story === story && d.Pier === pier);
  return entry ? entry[metric] : null;
};
