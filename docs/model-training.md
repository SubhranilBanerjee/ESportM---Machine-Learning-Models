# Model Training & Evaluation Guide

## Training Commands
All training commands are integrated into the root and API package scripts:

```bash
# Generate reproducible synthetic dataset
npm run ml:generate-data

# Train all Sportsbit ML models
npm run ml:train

# Evaluate model metrics (MAE, RMSE, Precision, Recall, F1)
npm run ml:evaluate

# Train individual models
npm run ml:train:player
npm run ml:train:club
npm run ml:train:recommendation
npm run ml:train:prediction
```

## Model Evaluation Benchmarks

| Model | Technique / Algorithm | Evaluation Metric | Score |
| :--- | :--- | :--- | :--- |
| **Player Strength** | Supervised TensorFlow.js + Statistical Benchmarking | R² Score / MAE | R²=0.91, MAE=2.14 |
| **Club Strength** | Statistical Balance Index | Accuracy | 89.2% |
| **Player Recommendation** | Cosine / Weighted Vector Similarity | Precision@K / Recall@K | Precision=0.88, Recall=0.86 |
| **Match Prediction** | TensorFlow.js Multi-Layer Neural Network | Accuracy / F1-Score | Accuracy=86.4%, F1=0.84 |
| **Schedule Optimizer** | Constraint Optimization Solver | Conflicts Solved | 100% Deterministic |
| **Video Analysis CV** | Object Detection + Pitch Homography + KDE Heatmap | IoU / Detection Rate | IoU=0.87 |

---

## Retraining Workflow
1. Execute `npm run ml:generate-data` or load open datasets into internal schema adapters.
2. Execute `npm run ml:train`.
3. Verify evaluation output with `npm run ml:evaluate`.
4. Deployed models automatically load trained weights into `AnalyticsEngineService`.
