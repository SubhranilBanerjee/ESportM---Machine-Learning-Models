# Sportsbit AI/ML Analytics System

## Overview
The **Sportsbit AI/ML Analytics System** is a unified sports intelligence suite seamlessly integrated into the Sportsbit platform. It equips players, coaches, managers, and analysts with real-time data-driven insights powered by **TensorFlow.js**, statistical benchmarking, constraint optimization engines, and computer vision pipelines.

---

## Access & Authentication
- **Route:** `/dashboard/analytics` or `/analytics`
- **Security:** Authenticated users only via JWT bearer token. Unauthenticated users are barred from running model inference or accessing job endpoints.

---

## 14 ML & Analytics Features

### Out-Source ML Modules
1. **Player Strengths & Weaknesses (`/api/analytics/player-strength`)**
   - **Inputs:** Player stats (matches, minutes, goals, assists, shots, pass accuracy, key passes, tackles, interceptions, distance covered, max speed, sprint count).
   - **Outputs:** Overall performance score, Attacking, Passing, Defending, Physical, Positioning scores, Strengths list, Weaknesses list, Improvement recommendations, Model confidence.
2. **Club Strengths & Weaknesses (`/api/analytics/club-strength`)**
   - **Inputs:** Matches played, wins/draws/losses, goals scored/conceded, possession %, pass accuracy %, pressing metrics, set-piece stats.
   - **Outputs:** Club performance score, Attacking strengths, Defensive strengths, Vulnerabilities, Tactical recommendations, Confidence.
3. **Player Recommendations (`/api/analytics/player-recommendation`)**
   - **Inputs:** Position requirement, min/max age, max budget, min rating, required skills, tactical style, preferred attributes.
   - **Outputs:** Ranked candidate table with compatibility score %, performance score, skill match %, tactical fit, salary estimates.
4. **Schedule Management (`/api/analytics/schedule`)**
   - **Inputs:** Players, teams, events, dates/times, venues, minimum rest hours constraint.
   - **Outputs:** Constraint-optimized schedule, venue assignment, rest period warning alerts.
5. **Schedule Conflict Detection (`/api/analytics/schedule-conflict`)**
   - **Inputs:** Existing schedule items, venues, participant IDs.
   - **Outputs:** Conflict boolean, conflict type (VENUE_OVERLAP / DOUBLE_BOOKING), severity, resolution suggestion.
6. **Predictive Analysis (`/api/analytics/predictive`)**
   - **Inputs:** Home/Away team form, goals avg, conceded avg, key player availability.
   - **Outputs:** Home win probability, Draw probability, Away win probability, Expected Goals (xG), Disclaimer.

### In-House Computer Vision & ML Modules
7. **Video Analysis (`/api/analytics/video`)**
   - **Pipeline:** Video upload -> Frame extraction -> Player detection -> Ball detection -> Tracking -> Team ID -> Event logging -> Final report.
8. **Ball Tracking (`/api/analytics/ball-tracking`)**
   - **Output:** Ball trajectory, velocity, height estimation.
9. **Field/Court Tracking (`/api/analytics/field-tracking`)**
   - **Output:** Homography camera calibration to 105m x 68m 2D pitch coordinates.
10. **Team Identification (`/api/analytics/team-identification`)**
    - **Output:** Color clustering & squad assignment.
11. **Event Detection (`/api/analytics/event-detection`)**
    - **Output:** Automatic event timeline (Kickoff, Pass, Tackle, Shot, Goal).
12. **Performance Analysis (`/api/analytics/performance`)**
    - **Output:** Total distance, sprint count, top speed, workload index.
13. **Tactical Analysis (`/api/analytics/tactical`)**
    - **Output:** Formation lines, team width, compact depth, pressing density.
14. **Heatmap Generation (`/api/analytics/heatmap`)**
    - **Output:** 2D Grid aggregation / KDE matrix rendered on standard Football Pitch.

---

## Data Source Transparency
Every result displays an explicit data source badge:
- `REAL_DATA`
- `SYNTHETIC_DATA`
- `PRETRAINED_MODEL`
- `TRAINED_SPORTSbit_MODEL`
- `DETERMINISTIC_ANALYTICS`
