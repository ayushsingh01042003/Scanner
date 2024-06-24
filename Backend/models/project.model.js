import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  lastScanAt: { type: Date },
  scans: [{ type: mongoose.Schema.Types.ObjectId, ref: "ScanReport" }],
});

const Project = mongoose.model("Project", ProjectSchema);

export default Project;
