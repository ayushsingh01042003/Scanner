import mongoose from "mongoose";

const ScanReportSchema = new mongoose.Schema({
  username: { type: String, required: true },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  reportData: {
    scanDetails: mongoose.Schema.Types.Mixed,
    stats: mongoose.Schema.Types.Mixed,
  },
});

const ScanReport = mongoose.model("ScanReport", ScanReportSchema);

export default ScanReport ;