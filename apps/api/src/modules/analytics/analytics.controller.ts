import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AnalyticsService } from './analytics.service';
import {
  PlayerStrengthDto,
  ClubStrengthDto,
  PlayerRecommendationDto,
  ScheduleOptimizationDto,
  ConflictDetectionDto,
  MatchPredictionDto,
  HeatmapRequestDto,
  VideoProcessingDto,
} from './dto/analytics.dto';

@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('models')
  async getModels() {
    const models = await this.analyticsService.getModels();
    return { models };
  }

  @Get('history')
  async getHistory(@Req() req: any) {
    const userId = req.user?.sub;
    return this.analyticsService.getHistory(userId);
  }

  @Get('history/:id')
  async getRunById(@Req() req: any, @Param('id') runId: string) {
    const userId = req.user?.sub;
    return this.analyticsService.getRunById(userId, runId);
  }

  @Get('status/:jobId')
  async getJobStatus(@Req() req: any, @Param('jobId') jobId: string) {
    const userId = req.user?.sub;
    return this.analyticsService.getVideoJobStatus(userId, jobId);
  }

  // OUT-SOURCE ML MODULES
  @Post('player-strength')
  async playerStrength(
    @Req() req: any,
    @Headers('x-club-id') clubId: string,
    @Body() dto: PlayerStrengthDto,
  ) {
    const userId = req.user?.sub;
    return this.analyticsService.runPlayerStrength(userId, clubId, dto);
  }

  @Post('club-strength')
  async clubStrength(
    @Req() req: any,
    @Headers('x-club-id') clubId: string,
    @Body() dto: ClubStrengthDto,
  ) {
    const userId = req.user?.sub;
    return this.analyticsService.runClubStrength(userId, clubId, dto);
  }

  @Post('player-recommendation')
  async playerRecommendation(
    @Req() req: any,
    @Headers('x-club-id') clubId: string,
    @Body() dto: PlayerRecommendationDto,
  ) {
    const userId = req.user?.sub;
    return this.analyticsService.runPlayerRecommendation(userId, clubId, dto);
  }

  @Post('schedule')
  async scheduleManagement(
    @Req() req: any,
    @Headers('x-club-id') clubId: string,
    @Body() dto: ScheduleOptimizationDto,
  ) {
    const userId = req.user?.sub;
    return this.analyticsService.runScheduleManagement(userId, clubId, dto);
  }

  @Post('schedule-conflict')
  async scheduleConflict(
    @Req() req: any,
    @Headers('x-club-id') clubId: string,
    @Body() dto: ConflictDetectionDto,
  ) {
    const userId = req.user?.sub;
    return this.analyticsService.runScheduleConflict(userId, clubId, dto);
  }

  @Post('predictive')
  async predictiveAnalysis(
    @Req() req: any,
    @Headers('x-club-id') clubId: string,
    @Body() dto: MatchPredictionDto,
  ) {
    const userId = req.user?.sub;
    return this.analyticsService.runPredictive(userId, clubId, dto);
  }

  // IN-HOUSE COMPUTER VISION & ML MODULES
  @Post('video')
  async videoAnalysis(
    @Req() req: any,
    @Headers('x-club-id') clubId: string,
    @Body() dto: VideoProcessingDto,
  ) {
    const userId = req.user?.sub;
    return this.analyticsService.startVideoJob(userId, clubId, dto);
  }

  @Post('ball-tracking')
  async ballTracking(
    @Req() req: any,
    @Headers('x-club-id') clubId: string,
    @Body() dto: VideoProcessingDto,
  ) {
    const userId = req.user?.sub;
    return this.analyticsService.startVideoJob(userId, clubId, { ...dto, analysisFocus: 'ball-tracking' });
  }

  @Post('field-tracking')
  async fieldTracking(
    @Req() req: any,
    @Headers('x-club-id') clubId: string,
    @Body() dto: VideoProcessingDto,
  ) {
    const userId = req.user?.sub;
    return this.analyticsService.startVideoJob(userId, clubId, { ...dto, analysisFocus: 'field-tracking' });
  }

  @Post('team-identification')
  async teamIdentification(
    @Req() req: any,
    @Headers('x-club-id') clubId: string,
    @Body() dto: VideoProcessingDto,
  ) {
    const userId = req.user?.sub;
    return this.analyticsService.startVideoJob(userId, clubId, { ...dto, analysisFocus: 'team-identification' });
  }

  @Post('event-detection')
  async eventDetection(
    @Req() req: any,
    @Headers('x-club-id') clubId: string,
    @Body() dto: VideoProcessingDto,
  ) {
    const userId = req.user?.sub;
    return this.analyticsService.startVideoJob(userId, clubId, { ...dto, analysisFocus: 'event-detection' });
  }

  @Post('performance')
  async performanceAnalysis(
    @Req() req: any,
    @Headers('x-club-id') clubId: string,
    @Body() dto: VideoProcessingDto,
  ) {
    const userId = req.user?.sub;
    return this.analyticsService.startVideoJob(userId, clubId, { ...dto, analysisFocus: 'performance' });
  }

  @Post('tactical')
  async tacticalAnalysis(
    @Req() req: any,
    @Headers('x-club-id') clubId: string,
    @Body() dto: VideoProcessingDto,
  ) {
    const userId = req.user?.sub;
    return this.analyticsService.startVideoJob(userId, clubId, { ...dto, analysisFocus: 'tactical' });
  }

  @Post('heatmap')
  async generateHeatmap(
    @Req() req: any,
    @Headers('x-club-id') clubId: string,
    @Body() dto: HeatmapRequestDto,
  ) {
    const userId = req.user?.sub;
    return this.analyticsService.runHeatmap(userId, clubId, dto);
  }
}
