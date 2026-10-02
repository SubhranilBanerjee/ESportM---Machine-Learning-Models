# Datasets & Training Data Specifications

## Public Dataset Integrations & Adapters
Sportsbit supports mapping public open sports datasets into standard internal schemas (`PlayerStats`, `MatchStats`, `MatchEvent`, `PlayerTrackingPoint`, `BallTrackingPoint`).

### 1. SoccerNet / SoccerNet Tracking / Game State
- **URL:** https://www.soccer-net.org/
- **License:** Open Research Dataset License (Non-commercial)
- **Dataset Type:** Computer Vision, Ball & Player Tracking, Action Spotting
- **Relevant Models:** Video Analysis, Ball Tracking, Event Detection, Team Identification

### 2. StatsBomb Open Data
- **URL:** https://github.com/statsbomb/open-data
- **License:** StatsBomb Open Data License
- **Dataset Type:** Event Data, Shot Coordinates, Pass Matrix
- **Relevant Models:** Player Strength, Club Strength, Predictive Analysis, Tactical Heatmaps

### 3. Synthetic Correlated Dataset Generator
- **Location:** `apps/api/src/modules/analytics/scripts/generate-synthetic-data.ts`
- **Output:** `data/synthetic-dataset.json`
- **Distribution:** Correlated metrics for Strikers (higher shots/goals), Midfielders (higher passes/assists/key passes), Defenders (higher tackles/interceptions/clearances), Physical (distance, speed, sprints).
- **Seed:** Fixed seed (42) for reproducible data validation.
