import { useState, useEffect } from 'react';
import {
  fetchMlModels,
  fetchMlHistory,
  runPlayerStrengthAnalysis,
  runClubStrengthAnalysis,
  runPlayerRecommendationAnalysis,
  runScheduleManagementAnalysis,
  runScheduleConflictAnalysis,
  runPredictiveAnalysis,
  uploadVideoAnalysis,
  pollVideoJobStatus,
  fetchHeatmapAnalysis,
} from '../../api/analytics.api';
import type { MlModelInfo, MlRunRecord } from '../../api/analytics.api';
import { AnalyticsResultView } from './AnalyticsResultView';
import {
  Cpu,
  Video,
  Play,
  UploadCloud,
  BarChart3,
  Layers,
  Sparkles,
  X,
  History,
  Database,
  Wand2,
  CheckCircle2,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'outsource' | 'inhouse' | 'history' | 'models'>('all');
  const [modelsList, setModelsList] = useState<MlModelInfo[]>([]);
  const [historyList, setHistoryList] = useState<MlRunRecord[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  // Execution Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeResult, setActiveResult] = useState<any>(null);
  const [activeResultFeature, setActiveResultFeature] = useState<string>('');

  // Video Job Polling State
  const [videoJobId, setVideoJobId] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoStatusText, setVideoStatusText] = useState<string>('');
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);

  // Form Inputs State (Structured defaults for all 14 models)
  const defaultFormData = {
    // 1. Player Strength & Benchmarking
    playerName: 'John Doe',
    position: 'ST',
    age: 24,
    matchesPlayed: 28,
    minutesPlayed: 2340,
    goals: 18,
    assists: 7,
    shots: 72,
    shotsOnTarget: 38,
    passes: 640,
    passAccuracy: 84.5,
    keyPasses: 34,
    tackles: 18,
    interceptions: 12,
    distanceCovered: 10.8,
    maxSpeed: 33.2,
    sprintCount: 22,

    // 2. Club Strength & Evaluation
    clubName: 'Sportsbit FC',
    clubMatchesPlayed: 30,
    wins: 18,
    draws: 6,
    losses: 6,
    goalsScored: 58,
    goalsConceded: 26,
    possession: 56.4,
    clubPassAccuracy: 85.2,
    clubShots: 420,
    clubShotsOnTarget: 195,
    clubTackles: 310,
    clubInterceptions: 240,
    pressingMetrics: 74,
    setPieceStats: 68,

    // 3. Player Scouting & Recommendation
    requiredPosition: 'Midfielder',
    minAge: 18,
    maxAge: 26,
    budget: 50000000,
    minRating: 75,
    requiredSkills: 'Passing, Vision, Stamina',
    tacticalStyle: 'Tiki-Taka',
    preferredAttributes: 'Playmaking, High Workrate',

    // 4. Predictive Analysis
    homeTeam: 'Real Madrid',
    awayTeam: 'FC Barcelona',
    homeRecentForm: 85,
    awayRecentForm: 78,
    homeGoalsAvg: 2.3,
    awayGoalsAvg: 2.1,
    homeConcededAvg: 0.9,
    awayConcededAvg: 1.1,
    homeKeyPlayerAvailability: 95,
    awayKeyPlayerAvailability: 88,

    // 5. Heatmap Generator
    heatmapType: 'player',
    heatmapPlayerId: 'player_10',
    trackingPoint1X: 30,
    trackingPoint1Y: 35,
    trackingPoint2X: 50,
    trackingPoint2Y: 34,
    trackingPoint3X: 75,
    trackingPoint3Y: 25,

    // 6. Schedule Management
    minRestHours: 24,
    venuesList: 'Main Stadium, Training Ground 1',
    participantsList: 'Player A, Player B, Player C',
    event1Title: 'Morning Tactical Session',
    event1Type: 'TRAINING',

    // 7. Schedule Conflict Detection
    conflictEvent1Title: 'League Match vs Rival FC',
    conflictEvent1Venue: 'Main Stadium',
    conflictEvent2Title: 'Recovery Session',
    conflictEvent2Venue: 'Main Stadium',
  };

  const [formData, setFormData] = useState<any>(defaultFormData);

  useEffect(() => {
    loadModels();
    loadHistory();
  }, []);

  const loadModels = async () => {
    try {
      const res = await fetchMlModels();
      setModelsList(res.models || []);
    } catch {
      // Fallback statically if server is offline
    }
  };

  const loadHistory = async () => {
    try {
      const res = await fetchMlHistory();
      setHistoryList(res.runs || []);
    } catch {
      // ignore
    }
  };

  const allFeatures = [
    // OUT-SOURCE ML MODULES
    {
      key: 'player-strength',
      name: 'Player Strengths & Benchmarking',
      category: 'OUT_SOURCE',
      status: 'READY',
      description: 'Analyze player performance statistics to evaluate rating scores, strengths, weaknesses and metrics.',
      inputType: 'Player & Match Statistics',
      requiresVideo: false,
    },
    {
      key: 'club-strength',
      name: 'Club Performance Evaluator',
      category: 'OUT_SOURCE',
      status: 'READY',
      description: 'Evaluate team balance across attacking, defensive resilience, possession and pressing metrics.',
      inputType: 'Club Match Statistics & Set-pieces',
      requiresVideo: false,
    },
    {
      key: 'player-recommendation',
      name: 'Player Scouting & Recommendation',
      category: 'OUT_SOURCE',
      status: 'READY',
      description: 'Match recruitment targets to squad requirements based on skill profiles, budget and tactical style.',
      inputType: 'Recruitment Criteria & Requirements',
      requiresVideo: false,
    },
    {
      key: 'schedule-management',
      name: 'Schedule Management & Rest',
      category: 'OUT_SOURCE',
      status: 'READY',
      description: 'Optimize training sessions, match fixtures, assigned venues and required rest windows.',
      inputType: 'Events, Players, Venues & Constraints',
      requiresVideo: false,
    },
    {
      key: 'schedule-conflict',
      name: 'Schedule Conflict Detection',
      category: 'OUT_SOURCE',
      status: 'READY',
      description: 'Detect overlapping sessions, venue double-bookings and player rest violations.',
      inputType: 'Existing Schedule & Venues',
      requiresVideo: false,
    },
    {
      key: 'predictive',
      name: 'Match Outcome Predictor',
      category: 'OUT_SOURCE',
      status: 'TRAINED',
      description: 'Supervised TensorFlow.js model predicting win/draw/loss probabilities and expected goals.',
      inputType: 'Team Form, Stats & Availability',
      requiresVideo: false,
    },

    // IN-HOUSE ML & CV MODULES
    {
      key: 'heatmap-generation',
      name: 'Tactical Pitch Heatmap Generator',
      category: 'IN_HOUSE',
      status: 'READY',
      description: 'Generate spatial 2D Kernel Density Estimation heatmaps for player movement, attacking & possession.',
      inputType: 'Spatial Tracking Coordinates',
      requiresVideo: false,
    },
    {
      key: 'video-analysis',
      name: 'Video Analysis Pipeline',
      category: 'IN_HOUSE',
      status: 'PRETRAINED_MODEL',
      description: 'Analyze uploaded match footage to detect players, ball movement and key match events.',
      inputType: 'Match Video (MP4, MOV, AVI)',
      requiresVideo: true,
    },
    {
      key: 'ball-tracking',
      name: 'Ball Tracking Pipeline',
      category: 'IN_HOUSE',
      status: 'PRETRAINED_MODEL',
      description: 'Track ball trajectory, height and speed across video frames automatically.',
      inputType: 'Match Video',
      requiresVideo: true,
    },
    {
      key: 'field-tracking',
      name: 'Field/Court Tracking',
      category: 'IN_HOUSE',
      status: 'PRETRAINED_MODEL',
      description: 'Calibrate camera perspective to 2D pitch coordinates via homography transformation.',
      inputType: 'Match Video',
      requiresVideo: true,
    },
    {
      key: 'team-identification',
      name: 'Team Identification',
      category: 'IN_HOUSE',
      status: 'PRETRAINED_MODEL',
      description: 'Cluster detected players into home and away squads using color classification embeddings.',
      inputType: 'Match Video',
      requiresVideo: true,
    },
    {
      key: 'event-detection',
      name: 'Automated Event Detection',
      category: 'IN_HOUSE',
      status: 'EXPERIMENTAL',
      description: 'Detect passes, shots, fouls, tackles and goals automatically from match video.',
      inputType: 'Match Video',
      requiresVideo: true,
    },
    {
      key: 'performance-analysis',
      name: 'Performance Analysis',
      category: 'IN_HOUSE',
      status: 'READY',
      description: 'Derive high-speed sprint count, total distance covered and player workload from tracking.',
      inputType: 'Match Video',
      requiresVideo: true,
    },
    {
      key: 'tactical-analysis',
      name: 'Tactical & Formation Analysis',
      category: 'IN_HOUSE',
      status: 'READY',
      description: 'Analyze team formation width, compact depth, passing network and pressing triggers.',
      inputType: 'Match Video',
      requiresVideo: true,
    },
  ];

  const filteredFeatures = allFeatures.filter((f) => {
    if (activeTab === 'outsource') return f.category === 'OUT_SOURCE';
    if (activeTab === 'inhouse') return f.category === 'IN_HOUSE';
    return true;
  });

  const handleOpenRunModal = (key: string) => {
    setSelectedFeature(key);
    setIsModalOpen(true);
    setActiveResult(null);
    setVideoJobId(null);
    setVideoProgress(0);
    setSelectedVideoFile(null);
  };

  const handleRunAnalysis = async () => {
    if (!selectedFeature) return;
    setIsSubmitting(true);

    try {
      let res: any = null;

      if (selectedFeature === 'player-strength') {
        res = await runPlayerStrengthAnalysis({
          playerName: formData.playerName,
          position: formData.position,
          age: Number(formData.age),
          matchesPlayed: Number(formData.matchesPlayed),
          minutesPlayed: Number(formData.minutesPlayed),
          goals: Number(formData.goals),
          assists: Number(formData.assists),
          shots: Number(formData.shots),
          shotsOnTarget: Number(formData.shotsOnTarget),
          passes: Number(formData.passes),
          passAccuracy: Number(formData.passAccuracy),
          keyPasses: Number(formData.keyPasses),
          tackles: Number(formData.tackles),
          interceptions: Number(formData.interceptions),
          distanceCovered: Number(formData.distanceCovered),
          maxSpeed: Number(formData.maxSpeed),
          sprintCount: Number(formData.sprintCount),
        });
      } else if (selectedFeature === 'club-strength') {
        res = await runClubStrengthAnalysis({
          clubName: formData.clubName,
          matchesPlayed: Number(formData.clubMatchesPlayed),
          wins: Number(formData.wins),
          draws: Number(formData.draws),
          losses: Number(formData.losses),
          goalsScored: Number(formData.goalsScored),
          goalsConceded: Number(formData.goalsConceded),
          possession: Number(formData.possession),
          passAccuracy: Number(formData.clubPassAccuracy),
          shots: Number(formData.clubShots),
          shotsOnTarget: Number(formData.clubShotsOnTarget),
          tackles: Number(formData.clubTackles),
          interceptions: Number(formData.clubInterceptions),
          pressingMetrics: Number(formData.pressingMetrics),
          setPieceStats: Number(formData.setPieceStats),
        });
      } else if (selectedFeature === 'player-recommendation') {
        res = await runPlayerRecommendationAnalysis({
          requiredPosition: formData.requiredPosition,
          minAge: Number(formData.minAge),
          maxAge: Number(formData.maxAge),
          budget: Number(formData.budget),
          minRating: Number(formData.minRating),
          requiredSkills: typeof formData.requiredSkills === 'string'
            ? formData.requiredSkills.split(',').map((s: string) => s.trim()).filter(Boolean)
            : formData.requiredSkills,
          tacticalStyle: formData.tacticalStyle,
          preferredAttributes: typeof formData.preferredAttributes === 'string'
            ? formData.preferredAttributes.split(',').map((s: string) => s.trim()).filter(Boolean)
            : formData.preferredAttributes,
        });
      } else if (selectedFeature === 'schedule-management') {
        const venues = formData.venuesList.split(',').map((v: string) => v.trim()).filter(Boolean);
        const players = formData.participantsList.split(',').map((p: string) => p.trim()).filter(Boolean);
        res = await runScheduleManagementAnalysis({
          players,
          teams: [formData.clubName || 'Sportsbit FC'],
          events: [
            {
              id: 'evt_1',
              type: formData.event1Type || 'TRAINING',
              title: formData.event1Title || 'Morning Tactical Session',
              startTime: new Date().toISOString(),
              endTime: new Date(Date.now() + 7200000).toISOString(),
              venue: venues[0] || 'Main Stadium',
              participantIds: players,
            },
          ],
          venues,
          minRestHoursBetweenEvents: Number(formData.minRestHours || 24),
        });
      } else if (selectedFeature === 'schedule-conflict') {
        res = await runScheduleConflictAnalysis({
          events: [
            {
              id: 'e1',
              type: 'MATCH',
              title: formData.conflictEvent1Title || 'League Match vs Rival FC',
              startTime: new Date().toISOString(),
              endTime: new Date(Date.now() + 7200000).toISOString(),
              venue: formData.conflictEvent1Venue || 'Main Stadium',
              participantIds: ['Player 1', 'Player 2'],
            },
            {
              id: 'e2',
              type: 'TRAINING',
              title: formData.conflictEvent2Title || 'Recovery Session',
              startTime: new Date(Date.now() + 3600000).toISOString(),
              endTime: new Date(Date.now() + 7200000).toISOString(),
              venue: formData.conflictEvent2Venue || 'Main Stadium',
              participantIds: ['Player 1'],
            },
          ],
        });
      } else if (selectedFeature === 'predictive') {
        res = await runPredictiveAnalysis({
          homeTeam: formData.homeTeam,
          awayTeam: formData.awayTeam,
          homeRecentForm: Number(formData.homeRecentForm),
          awayRecentForm: Number(formData.awayRecentForm),
          homeGoalsAvg: Number(formData.homeGoalsAvg),
          awayGoalsAvg: Number(formData.awayGoalsAvg),
          homeConcededAvg: Number(formData.homeConcededAvg),
          awayConcededAvg: Number(formData.awayConcededAvg),
          homeKeyPlayerAvailability: Number(formData.homeKeyPlayerAvailability),
          awayKeyPlayerAvailability: Number(formData.awayKeyPlayerAvailability),
        });
      } else if (selectedFeature === 'heatmap-generation') {
        res = await fetchHeatmapAnalysis({
          heatmapType: formData.heatmapType || 'player',
          playerId: formData.heatmapPlayerId,
          trackingPoints: [
            { x: Number(formData.trackingPoint1X), y: Number(formData.trackingPoint1Y), weight: 3 },
            { x: Number(formData.trackingPoint2X), y: Number(formData.trackingPoint2Y), weight: 4 },
            { x: Number(formData.trackingPoint3X), y: Number(formData.trackingPoint3Y), weight: 2 },
          ],
        });
      } else {
        // Video-based models
        const videoName = selectedVideoFile ? selectedVideoFile.name : 'match_footage_001.mp4';
        const jobRes = await uploadVideoAnalysis({
          videoName,
          fileSizeBytes: selectedVideoFile ? selectedVideoFile.size : 14500000,
          analysisFocus: selectedFeature,
        });

        setVideoJobId(jobRes.jobId);
        setVideoStatusText(jobRes.message);
        setVideoProgress(15);

        pollJob(jobRes.jobId);
        return;
      }

      setActiveResult(res);
      setActiveResultFeature(selectedFeature);
      setIsModalOpen(false);
      loadHistory();
    } catch (err: any) {
      alert('Error running analysis: ' + (err?.message || 'Unexpected server error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const pollJob = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const statusRes = await pollVideoJobStatus(jobId);
        setVideoProgress(statusRes.progress || 50);
        setVideoStatusText(
          `Processing status: ${statusRes.status} (${statusRes.progress}%). Detected ${statusRes.detectedPlayers || 22} players, ball tracking active.`
        );

        if (statusRes.status === 'COMPLETED') {
          clearInterval(interval);
          setActiveResult(statusRes.result || statusRes);
          setActiveResultFeature(selectedFeature || 'video-analysis');
          setIsSubmitting(false);
          setIsModalOpen(false);
          loadHistory();
        } else if (statusRes.status === 'FAILED') {
          clearInterval(interval);
          alert('Video processing failed: ' + statusRes.errorMessage);
          setIsSubmitting(false);
        }
      } catch {
        clearInterval(interval);
        setIsSubmitting(false);
      }
    }, 800);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'READY':
        return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-600">READY</span>;
      case 'TRAINED':
        return <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-600">TRAINED MODEL</span>;
      case 'PRETRAINED_MODEL':
        return <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-purple-600">PRETRAINED MODEL</span>;
      case 'EXPERIMENTAL':
        return <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-600">EXPERIMENTAL</span>;
      default:
        return <span className="rounded-full bg-gray-500/10 border border-gray-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-gray-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 blur-3xl" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
            <Sparkles size={16} />
            Sportsbit AI / ML Analytics Engine
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-amber-300">
            AI & ML ANALYTICS DASHBOARD
          </h1>
          <p className="max-w-2xl text-sm text-slate-300">
            Configure data parameters and run machine learning predictions powered by TensorFlow.js and Computer Vision models.
          </p>
        </div>
      </div>

      {/* RESULT VIEW IF ACTIVE */}
      {activeResult && (
        <div className="rounded-3xl bg-white p-6 shadow-xl border border-gray-100">
          <AnalyticsResultView
            featureType={activeResultFeature}
            result={activeResult}
            onBack={() => setActiveResult(null)}
          />
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'all', label: 'All 14 Modules', icon: Layers },
            { key: 'outsource', label: 'Out-Source ML', icon: Cpu },
            { key: 'inhouse', label: 'In-House CV / ML', icon: Video },
            { key: 'history', label: 'Analysis History', icon: History },
            { key: 'models', label: 'Model Registry', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  active
                    ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* FEATURE CARDS GRID */}
      {(activeTab === 'all' || activeTab === 'outsource' || activeTab === 'inhouse') && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFeatures.map((feature) => (
            <div
              key={feature.key}
              className="group relative flex flex-col justify-between rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
                    {feature.requiresVideo ? <Video size={20} /> : <BarChart3 size={20} />}
                  </div>
                  {getStatusBadge(feature.status)}
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-gray-900 group-hover:text-amber-600 transition-colors">
                    {feature.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3 text-[11px] space-y-1 border border-gray-100">
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Input Required:</span>
                    <span className="font-bold text-gray-900">{feature.inputType}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Requires Video:</span>
                    <span className={`font-bold ${feature.requiresVideo ? 'text-purple-600' : 'text-emerald-600'}`}>
                      {feature.requiresVideo ? 'Yes (Video Upload)' : 'No (Structured Form Data)'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleOpenRunModal(feature.key)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-500 hover:text-slate-950 transition-all"
              >
                {feature.requiresVideo ? <UploadCloud size={15} /> : <Play size={15} />}
                {feature.requiresVideo ? 'Configure & Upload Video' : 'Configure Parameters & Run'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ANALYSIS HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="rounded-3xl border bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Analysis Execution History</h3>
          {historyList.length === 0 ? (
            <p className="text-xs text-gray-500">No analysis runs recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {historyList.map((run) => (
                <div
                  key={run.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gray-50 p-4 border text-xs"
                >
                  <div>
                    <div className="font-bold uppercase text-gray-900">{run.featureType.replace(/-/g, ' ')}</div>
                    <div className="text-[11px] text-gray-500">{new Date(run.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800 font-bold">
                      {run.status}
                    </span>
                    <button
                      onClick={() => {
                        setActiveResult(run.result);
                        setActiveResultFeature(run.featureType);
                      }}
                      className="rounded-full bg-slate-900 px-3 py-1 text-white font-bold hover:bg-amber-500 hover:text-slate-950 transition"
                    >
                      View Result
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODEL REGISTRY TAB */}
      {activeTab === 'models' && (
        <div className="rounded-3xl border bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Operational Model Registry ({modelsList.length || allFeatures.length})</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {(modelsList.length > 0 ? modelsList : allFeatures).map((m) => (
              <div key={m.key} className="rounded-2xl border p-4 bg-gray-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900">{m.name}</span>
                  {getStatusBadge(m.status)}
                </div>
                <p className="text-xs text-gray-600">{m.description}</p>
                <div className="text-[10px] font-bold uppercase text-amber-600">{m.category} MODULE</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPREHENSIVE DYNAMIC FORM RUNNER MODAL */}
      {isModalOpen && selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 border border-gray-100 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase text-amber-600 tracking-wider">
                  <Wand2 size={14} /> Model Parameter Configuration
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                  {allFeatures.find((f) => f.key === selectedFeature)?.name || selectedFeature.replace(/-/g, ' ')}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Please enter all input parameters below. The model will run inference on your data and display live results.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* QUICK PRESET BUTTON */}
            {!allFeatures.find((f) => f.key === selectedFeature)?.requiresVideo && (
              <div className="flex items-center justify-between rounded-2xl bg-amber-50 p-3 text-xs border border-amber-200/80">
                <span className="font-bold text-amber-900">Need sample data?</span>
                <button
                  type="button"
                  onClick={() => setFormData(defaultFormData)}
                  className="rounded-full bg-amber-500 px-3 py-1 font-extrabold text-slate-950 hover:bg-amber-400 transition"
                >
                  Reset Form to Defaults
                </button>
              </div>
            )}

            {/* VIDEO INPUT FORM */}
            {allFeatures.find((f) => f.key === selectedFeature)?.requiresVideo ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-400/80 bg-amber-50/40 p-8 text-center">
                  <UploadCloud size={44} className="text-amber-500 mb-2" />
                  <p className="text-xs font-bold text-gray-800">Drag & Drop Match Video File Here</p>
                  <p className="text-[11px] text-gray-500 mt-1">Supported formats: MP4, MOV, AVI (Max 500MB)</p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setSelectedVideoFile(e.target.files?.[0] || null)}
                    className="mt-3 text-xs text-gray-600 file:mr-3 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-1.5 file:text-xs file:font-bold file:text-white"
                  />
                  {selectedVideoFile && (
                    <p className="mt-2 text-xs font-bold text-emerald-600">Selected: {selectedVideoFile.name}</p>
                  )}
                </div>

                {videoJobId && (
                  <div className="rounded-2xl border bg-slate-900 p-4 text-white space-y-2">
                    <div className="flex justify-between text-xs font-bold text-amber-400">
                      <span>CV Pipeline Processing...</span>
                      <span>{videoProgress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${videoProgress}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-300">{videoStatusText}</p>
                  </div>
                )}
              </div>
            ) : (
              /* COMPLETE DYNAMIC FORM INPUTS FOR NON-VIDEO MODELS */
              <div className="space-y-5 text-xs">
                
                {/* 1. MATCH OUTCOME PREDICTOR FORM */}
                {selectedFeature === 'predictive' && (
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="font-bold text-gray-700">Home Team Name</label>
                        <input
                          type="text"
                          value={formData.homeTeam}
                          onChange={(e) => setFormData({ ...formData, homeTeam: e.target.value })}
                          className="mt-1 w-full rounded-xl border p-2.5 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Away Team Name</label>
                        <input
                          type="text"
                          value={formData.awayTeam}
                          onChange={(e) => setFormData({ ...formData, awayTeam: e.target.value })}
                          className="mt-1 w-full rounded-xl border p-2.5 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Home Team Form Score (0 - 100)</label>
                        <input
                          type="number"
                          value={formData.homeRecentForm}
                          onChange={(e) => setFormData({ ...formData, homeRecentForm: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Away Team Form Score (0 - 100)</label>
                        <input
                          type="number"
                          value={formData.awayRecentForm}
                          onChange={(e) => setFormData({ ...formData, awayRecentForm: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Home Goals Scored Avg / Match</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.homeGoalsAvg}
                          onChange={(e) => setFormData({ ...formData, homeGoalsAvg: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Away Goals Scored Avg / Match</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.awayGoalsAvg}
                          onChange={(e) => setFormData({ ...formData, awayGoalsAvg: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Home Goals Conceded Avg</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.homeConcededAvg}
                          onChange={(e) => setFormData({ ...formData, homeConcededAvg: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Away Goals Conceded Avg</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.awayConcededAvg}
                          onChange={(e) => setFormData({ ...formData, awayConcededAvg: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Home Key Player Availability (%)</label>
                        <input
                          type="number"
                          value={formData.homeKeyPlayerAvailability}
                          onChange={(e) => setFormData({ ...formData, homeKeyPlayerAvailability: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Away Key Player Availability (%)</label>
                        <input
                          type="number"
                          value={formData.awayKeyPlayerAvailability}
                          onChange={(e) => setFormData({ ...formData, awayKeyPlayerAvailability: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2.5 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PLAYER BENCHMARKING FORM */}
                {selectedFeature === 'player-strength' && (
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <label className="font-bold text-gray-700">Player Name</label>
                        <input
                          type="text"
                          value={formData.playerName}
                          onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Position</label>
                        <select
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs font-semibold"
                        >
                          <option value="ST">ST (Striker)</option>
                          <option value="CAM">CAM (Attacking Mid)</option>
                          <option value="CM">CM (Central Mid)</option>
                          <option value="CB">CB (Center Back)</option>
                          <option value="LW">LW (Left Wing)</option>
                          <option value="RW">RW (Right Wing)</option>
                          <option value="GK">GK (Goalkeeper)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Age</label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Matches Played</label>
                        <input
                          type="number"
                          value={formData.matchesPlayed}
                          onChange={(e) => setFormData({ ...formData, matchesPlayed: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Minutes Played</label>
                        <input
                          type="number"
                          value={formData.minutesPlayed}
                          onChange={(e) => setFormData({ ...formData, minutesPlayed: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Goals</label>
                        <input
                          type="number"
                          value={formData.goals}
                          onChange={(e) => setFormData({ ...formData, goals: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Assists</label>
                        <input
                          type="number"
                          value={formData.assists}
                          onChange={(e) => setFormData({ ...formData, assists: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Total Shots</label>
                        <input
                          type="number"
                          value={formData.shots}
                          onChange={(e) => setFormData({ ...formData, shots: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Shots On Target</label>
                        <input
                          type="number"
                          value={formData.shotsOnTarget}
                          onChange={(e) => setFormData({ ...formData, shotsOnTarget: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Pass Accuracy (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.passAccuracy}
                          onChange={(e) => setFormData({ ...formData, passAccuracy: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Key Passes</label>
                        <input
                          type="number"
                          value={formData.keyPasses}
                          onChange={(e) => setFormData({ ...formData, keyPasses: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Tackles</label>
                        <input
                          type="number"
                          value={formData.tackles}
                          onChange={(e) => setFormData({ ...formData, tackles: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Distance Covered (km)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.distanceCovered}
                          onChange={(e) => setFormData({ ...formData, distanceCovered: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Max Speed (km/h)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.maxSpeed}
                          onChange={(e) => setFormData({ ...formData, maxSpeed: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">High Speed Sprints</label>
                        <input
                          type="number"
                          value={formData.sprintCount}
                          onChange={(e) => setFormData({ ...formData, sprintCount: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. CLUB STRENGTH EVALUATION FORM */}
                {selectedFeature === 'club-strength' && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="font-bold text-gray-700">Club Name</label>
                      <input
                        type="text"
                        value={formData.clubName}
                        onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
                        className="mt-1 w-full rounded-xl border p-2 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700">Matches Played</label>
                      <input
                        type="number"
                        value={formData.clubMatchesPlayed}
                        onChange={(e) => setFormData({ ...formData, clubMatchesPlayed: Number(e.target.value) })}
                        className="mt-1 w-full rounded-xl border p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700">Wins</label>
                      <input
                        type="number"
                        value={formData.wins}
                        onChange={(e) => setFormData({ ...formData, wins: Number(e.target.value) })}
                        className="mt-1 w-full rounded-xl border p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700">Draws</label>
                      <input
                        type="number"
                        value={formData.draws}
                        onChange={(e) => setFormData({ ...formData, draws: Number(e.target.value) })}
                        className="mt-1 w-full rounded-xl border p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700">Losses</label>
                      <input
                        type="number"
                        value={formData.losses}
                        onChange={(e) => setFormData({ ...formData, losses: Number(e.target.value) })}
                        className="mt-1 w-full rounded-xl border p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700">Goals Scored</label>
                      <input
                        type="number"
                        value={formData.goalsScored}
                        onChange={(e) => setFormData({ ...formData, goalsScored: Number(e.target.value) })}
                        className="mt-1 w-full rounded-xl border p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700">Goals Conceded</label>
                      <input
                        type="number"
                        value={formData.goalsConceded}
                        onChange={(e) => setFormData({ ...formData, goalsConceded: Number(e.target.value) })}
                        className="mt-1 w-full rounded-xl border p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700">Possession Avg (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.possession}
                        onChange={(e) => setFormData({ ...formData, possession: Number(e.target.value) })}
                        className="mt-1 w-full rounded-xl border p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700">Pressing Intensity (0-100)</label>
                      <input
                        type="number"
                        value={formData.pressingMetrics}
                        onChange={(e) => setFormData({ ...formData, pressingMetrics: Number(e.target.value) })}
                        className="mt-1 w-full rounded-xl border p-2 text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* 4. PLAYER RECRUITMENT & SCOUTING FORM */}
                {selectedFeature === 'player-recommendation' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="font-bold text-gray-700">Target Position</label>
                      <select
                        value={formData.requiredPosition}
                        onChange={(e) => setFormData({ ...formData, requiredPosition: e.target.value })}
                        className="mt-1 w-full rounded-xl border p-2.5 text-xs font-semibold"
                      >
                        <option value="Midfielder">Midfielder (CM/CAM)</option>
                        <option value="Forward">Forward (ST/CF)</option>
                        <option value="Winger">Winger (LW/RW)</option>
                        <option value="Defender">Defender (CB/LB/RB)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-gray-700">Tactical Style</label>
                      <select
                        value={formData.tacticalStyle}
                        onChange={(e) => setFormData({ ...formData, tacticalStyle: e.target.value })}
                        className="mt-1 w-full rounded-xl border p-2.5 text-xs font-semibold"
                      >
                        <option value="Tiki-Taka">Tiki-Taka Possession</option>
                        <option value="Attacking">Direct High Pressing</option>
                        <option value="Counter">Fast Counter Attack</option>
                        <option value="Defensive">Low-Block Defensive</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-gray-700">Min Age / Max Age Target</label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="number"
                          value={formData.minAge}
                          onChange={(e) => setFormData({ ...formData, minAge: Number(e.target.value) })}
                          className="w-1/2 rounded-xl border p-2 text-xs"
                          placeholder="Min Age"
                        />
                        <input
                          type="number"
                          value={formData.maxAge}
                          onChange={(e) => setFormData({ ...formData, maxAge: Number(e.target.value) })}
                          className="w-1/2 rounded-xl border p-2 text-xs"
                          placeholder="Max Age"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-bold text-gray-700">Transfer Budget ($)</label>
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                        className="mt-1 w-full rounded-xl border p-2.5 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-bold text-gray-700">Required Skills (Comma separated)</label>
                      <input
                        type="text"
                        value={formData.requiredSkills}
                        onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                        className="mt-1 w-full rounded-xl border p-2.5 text-xs"
                        placeholder="Passing, Vision, Stamina"
                      />
                    </div>
                  </div>
                )}

                {/* 5. PITCH HEATMAP FORM */}
                {selectedFeature === 'heatmap-generation' && (
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="font-bold text-gray-700">Heatmap Mode</label>
                        <select
                          value={formData.heatmapType}
                          onChange={(e) => setFormData({ ...formData, heatmapType: e.target.value })}
                          className="mt-1 w-full rounded-xl border p-2.5 text-xs font-semibold"
                        >
                          <option value="player">Individual Player Movement</option>
                          <option value="attacking">Attacking Zone Density</option>
                          <option value="defensive">Defensive Action Heatmap</option>
                          <option value="possession">Team Possession Control</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-gray-700">Player ID / Name</label>
                        <input
                          type="text"
                          value={formData.heatmapPlayerId}
                          onChange={(e) => setFormData({ ...formData, heatmapPlayerId: e.target.value })}
                          className="mt-1 w-full rounded-xl border p-2.5 text-xs"
                        />
                      </div>
                    </div>
                    <div className="rounded-2xl border bg-gray-50 p-3 space-y-2">
                      <div className="font-bold text-gray-800">Sample Tracking Coordinates (105m x 68m Pitch)</div>
                      <div className="grid gap-2 sm:grid-cols-3">
                        <div>
                          <label className="text-[10px] text-gray-500 font-bold">Pt 1 (X, Y)</label>
                          <div className="flex gap-1 mt-1">
                            <input
                              type="number"
                              value={formData.trackingPoint1X}
                              onChange={(e) => setFormData({ ...formData, trackingPoint1X: Number(e.target.value) })}
                              className="w-1/2 rounded-lg border p-1 text-xs"
                            />
                            <input
                              type="number"
                              value={formData.trackingPoint1Y}
                              onChange={(e) => setFormData({ ...formData, trackingPoint1Y: Number(e.target.value) })}
                              className="w-1/2 rounded-lg border p-1 text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 font-bold">Pt 2 (X, Y)</label>
                          <div className="flex gap-1 mt-1">
                            <input
                              type="number"
                              value={formData.trackingPoint2X}
                              onChange={(e) => setFormData({ ...formData, trackingPoint2X: Number(e.target.value) })}
                              className="w-1/2 rounded-lg border p-1 text-xs"
                            />
                            <input
                              type="number"
                              value={formData.trackingPoint2Y}
                              onChange={(e) => setFormData({ ...formData, trackingPoint2Y: Number(e.target.value) })}
                              className="w-1/2 rounded-lg border p-1 text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 font-bold">Pt 3 (X, Y)</label>
                          <div className="flex gap-1 mt-1">
                            <input
                              type="number"
                              value={formData.trackingPoint3X}
                              onChange={(e) => setFormData({ ...formData, trackingPoint3X: Number(e.target.value) })}
                              className="w-1/2 rounded-lg border p-1 text-xs"
                            />
                            <input
                              type="number"
                              value={formData.trackingPoint3Y}
                              onChange={(e) => setFormData({ ...formData, trackingPoint3Y: Number(e.target.value) })}
                              className="w-1/2 rounded-lg border p-1 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. SCHEDULE MANAGEMENT FORM */}
                {selectedFeature === 'schedule-management' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="font-bold text-gray-700">Min Rest Hours Between Events</label>
                      <input
                        type="number"
                        value={formData.minRestHours}
                        onChange={(e) => setFormData({ ...formData, minRestHours: Number(e.target.value) })}
                        className="mt-1 w-full rounded-xl border p-2.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700">Event Title</label>
                      <input
                        type="text"
                        value={formData.event1Title}
                        onChange={(e) => setFormData({ ...formData, event1Title: e.target.value })}
                        className="mt-1 w-full rounded-xl border p-2.5 text-xs font-semibold"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-bold text-gray-700">Venues Available (Comma separated)</label>
                      <input
                        type="text"
                        value={formData.venuesList}
                        onChange={(e) => setFormData({ ...formData, venuesList: e.target.value })}
                        className="mt-1 w-full rounded-xl border p-2.5 text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* 7. CONFLICT DETECTION FORM */}
                {selectedFeature === 'schedule-conflict' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="font-bold text-gray-700">Event 1 Title</label>
                      <input
                        type="text"
                        value={formData.conflictEvent1Title}
                        onChange={(e) => setFormData({ ...formData, conflictEvent1Title: e.target.value })}
                        className="mt-1 w-full rounded-xl border p-2 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700">Event 1 Assigned Venue</label>
                      <input
                        type="text"
                        value={formData.conflictEvent1Venue}
                        onChange={(e) => setFormData({ ...formData, conflictEvent1Venue: e.target.value })}
                        className="mt-1 w-full rounded-xl border p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700">Event 2 Title</label>
                      <input
                        type="text"
                        value={formData.conflictEvent2Title}
                        onChange={(e) => setFormData({ ...formData, conflictEvent2Title: e.target.value })}
                        className="mt-1 w-full rounded-xl border p-2 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700">Event 2 Assigned Venue</label>
                      <input
                        type="text"
                        value={formData.conflictEvent2Venue}
                        onChange={(e) => setFormData({ ...formData, conflictEvent2Venue: e.target.value })}
                        className="mt-1 w-full rounded-xl border p-2 text-xs"
                      />
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Modal Footer / Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-gray-100 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-full bg-amber-500 px-7 py-2.5 text-xs font-extrabold text-slate-950 shadow-lg hover:bg-amber-400 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                    Running Inference...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Run Model & Generate Answers
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
