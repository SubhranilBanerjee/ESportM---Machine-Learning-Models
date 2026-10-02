# Sportsbit Machine Learning & Computer Vision Architecture

## Technical Stack
- **Inference Engine:** TensorFlow.js (`@tensorflow/tfjs`)
- **Backend API:** NestJS 11 + Prisma ORM + PostgreSQL
- **Frontend SPA:** Vite + React 19 + Tailwind CSS + Canvas Pitch Renderer
- **Computer Vision:** Pretrained Object Detection (COCO-SSD / MoveNet) + Homography Perspective Transformation + Color Embedding Clustering.

## Architecture Flow

```
                  SPORTSbit
                     |
                     v
                USER LOGIN
                     |
                     v
                 DASHBOARD
                     |
                     v
                [ANALYTICS]
                     |
          +----------+----------+
          |                     |
          v                     v
    STRUCTURED DATA          VIDEO
          |                     |
          v                     v
    INPUT FORMS            VIDEO UPLOAD
          |                     |
          v                     v
    DATA VALIDATION       VIDEO PROCESSING
          |                     |
          +----------+----------+
                     |
                     v
              ML / ANALYTICS ENGINE
                     |
       +-------------+-------------+
       |             |             |
       v             v             v
   PLAYER         CLUB         PREDICTION
   ANALYSIS      ANALYSIS       ANALYSIS
       |
       v
  RECOMMENDATION

VIDEO PIPELINE
       |
       +--> Player Detection
       +--> Ball Tracking
       +--> Field Tracking
       +--> Team Identification
       +--> Event Detection
       +--> Performance Analysis
       +--> Tactical Analysis
       +--> Heatmap Generation
```

## Database Models (Prisma)
- `MlModel`: Operational model registry & status tracking.
- `MlRun`: Stores execution history per user with input parameters, result JSON, confidence score, and data source tag.
- `MlVideoJob`: Handles asynchronous video processing background jobs, progress percentage, frame counts, and detected entities.
