import { http } from './http';

export interface MlModelInfo {
  key: string;
  name: string;
  category: 'OUT_SOURCE' | 'IN_HOUSE';
  status: 'READY' | 'PRETRAINED_MODEL' | 'EXPERIMENTAL' | 'TRAINED';
  description: string;
}

export interface MlRunRecord {
  id: string;
  userId: string;
  clubId?: string;
  featureType: string;
  inputParams: any;
  result: any;
  confidence?: number;
  dataSource: string;
  status: string;
  createdAt: string;
}

export async function fetchMlModels(): Promise<{ models: MlModelInfo[] }> {
  const res = await http.get('/analytics/models');
  return res.data;
}

export async function fetchMlHistory(): Promise<{ runs: MlRunRecord[] }> {
  const res = await http.get('/analytics/history');
  return res.data;
}

export async function fetchMlRunById(id: string): Promise<MlRunRecord> {
  const res = await http.get(`/analytics/history/${id}`);
  return res.data;
}

export async function pollVideoJobStatus(jobId: string) {
  const res = await http.get(`/analytics/status/${jobId}`);
  return res.data;
}

export async function runPlayerStrengthAnalysis(data: any) {
  const res = await http.post('/analytics/player-strength', data);
  return res.data;
}

export async function runClubStrengthAnalysis(data: any) {
  const res = await http.post('/analytics/club-strength', data);
  return res.data;
}

export async function runPlayerRecommendationAnalysis(data: any) {
  const res = await http.post('/analytics/player-recommendation', data);
  return res.data;
}

export async function runScheduleManagementAnalysis(data: any) {
  const res = await http.post('/analytics/schedule', data);
  return res.data;
}

export async function runScheduleConflictAnalysis(data: any) {
  const res = await http.post('/analytics/schedule-conflict', data);
  return res.data;
}

export async function runPredictiveAnalysis(data: any) {
  const res = await http.post('/analytics/predictive', data);
  return res.data;
}

export async function uploadVideoAnalysis(data: { videoName: string; fileSizeBytes?: number; analysisFocus?: string }) {
  const res = await http.post('/analytics/video', data);
  return res.data;
}

export async function fetchHeatmapAnalysis(data: {
  heatmapType: string;
  playerId?: string;
  trackingPoints?: Array<{ x: number; y: number; weight?: number }>;
}) {
  const res = await http.post('/analytics/heatmap', data);
  return res.data;
}

