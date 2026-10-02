import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PlayerStrengthDto {
  @IsString()
  playerName: string;

  @IsString()
  position: string;

  @IsNumber()
  age: number;

  @IsNumber()
  matchesPlayed: number;

  @IsNumber()
  minutesPlayed: number;

  @IsNumber()
  goals: number;

  @IsNumber()
  assists: number;

  @IsNumber()
  shots: number;

  @IsNumber()
  shotsOnTarget: number;

  @IsNumber()
  passes: number;

  @IsNumber()
  passAccuracy: number;

  @IsNumber()
  keyPasses: number;

  @IsNumber()
  tackles: number;

  @IsNumber()
  interceptions: number;

  @IsNumber()
  distanceCovered: number;

  @IsNumber()
  maxSpeed: number;

  @IsNumber()
  sprintCount: number;
}

export class ClubStrengthDto {
  @IsString()
  clubName: string;

  @IsNumber()
  matchesPlayed: number;

  @IsNumber()
  wins: number;

  @IsNumber()
  draws: number;

  @IsNumber()
  losses: number;

  @IsNumber()
  goalsScored: number;

  @IsNumber()
  goalsConceded: number;

  @IsNumber()
  possession: number;

  @IsNumber()
  passAccuracy: number;

  @IsNumber()
  shots: number;

  @IsNumber()
  shotsOnTarget: number;

  @IsNumber()
  tackles: number;

  @IsNumber()
  interceptions: number;

  @IsNumber()
  pressingMetrics: number;

  @IsNumber()
  setPieceStats: number;
}

export class PlayerRecommendationDto {
  @IsString()
  requiredPosition: string;

  @IsNumber()
  minAge: number;

  @IsNumber()
  maxAge: number;

  @IsNumber()
  budget: number;

  @IsNumber()
  minRating: number;

  @IsArray()
  @IsString({ each: true })
  requiredSkills: string[];

  @IsString()
  tacticalStyle: string;

  @IsArray()
  @IsString({ each: true })
  preferredAttributes: string[];
}

export class ScheduleItemDto {
  @IsString()
  id: string;

  @IsString()
  type: string; // "MATCH" | "TRAINING"

  @IsString()
  title: string;

  @IsString()
  startTime: string; // ISO date string

  @IsString()
  endTime: string;   // ISO date string

  @IsString()
  venue: string;

  @IsArray()
  @IsString({ each: true })
  participantIds: string[];
}

export class ScheduleOptimizationDto {
  @IsArray()
  players: string[];

  @IsArray()
  teams: string[];

  @IsArray()
  events: ScheduleItemDto[];

  @IsArray()
  venues: string[];

  @IsNumber()
  minRestHoursBetweenEvents: number;
}

export class ConflictDetectionDto {
  @IsArray()
  events: ScheduleItemDto[];
}

export class MatchPredictionDto {
  @IsString()
  homeTeam: string;

  @IsString()
  awayTeam: string;

  @IsNumber()
  homeRecentForm: number; // 0 to 100

  @IsNumber()
  awayRecentForm: number; // 0 to 100

  @IsNumber()
  homeGoalsAvg: number;

  @IsNumber()
  awayGoalsAvg: number;

  @IsNumber()
  homeConcededAvg: number;

  @IsNumber()
  awayConcededAvg: number;

  @IsNumber()
  homeKeyPlayerAvailability: number; // 0 to 100

  @IsNumber()
  awayKeyPlayerAvailability: number; // 0 to 100
}

export class HeatmapRequestDto {
  @IsString()
  heatmapType: string; // "player" | "team" | "attacking" | "defensive" | "possession" | "shot" | "pass"

  @IsOptional()
  @IsString()
  playerId?: string;

  @IsOptional()
  @IsArray()
  trackingPoints?: Array<{ x: number; y: number; weight?: number }>;
}

export class VideoProcessingDto {
  @IsString()
  videoName: string;

  @IsOptional()
  @IsNumber()
  fileSizeBytes?: number;

  @IsOptional()
  @IsString()
  analysisFocus?: string;
}
