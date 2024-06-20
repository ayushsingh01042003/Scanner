import mongoose from "mongoose";

const scanningActivitySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  repoScanned: [{
    repository: [{
      name: {
        type: String,
        required: true
      },
      filesPiiData: {
        type: Object
      },
      pdfReport: {
        type: String
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }]
});

const ScanningActivity = mongoose.model('ScanningActivity', scanningActivitySchema);

export { ScanningActivity };
