import mongoose from "mongoose";

const ScanReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Project",
  },
  timestamp: { type: Date, default: Date.now },
  scanType: {
    type: String,
    enum: ['github', 'local', 'dynamic'],
    required: true
  },
  reportData: {
    scanDetails: mongoose.Schema.Types.Mixed,
    stats: mongoose.Schema.Types.Mixed,
    logStats: {
      totalLines: Number,
    },
    vulnerabilities: mongoose.Schema.Types.Mixed,
  },
});

const ScanReport = mongoose.model("ScanReport", ScanReportSchema);
export default ScanReport;