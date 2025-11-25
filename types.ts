export interface PierData {
  Story: string;
  Pier: string;
  OutputCase: string;
  CaseType: string;
  Location: string;
  P: number;
  V2: number;
  V3: number;
  T: number;
  M2: number;
  M3: number;
}

export type Metric = 'P' | 'V2' | 'V3' | 'T' | 'M2' | 'M3';

export interface HeatmapCell {
  story: string;
  pier: string;
  value: number;
}

export interface GeminiAnalysisResponse {
  analysis: string;
  timestamp: number;
}
