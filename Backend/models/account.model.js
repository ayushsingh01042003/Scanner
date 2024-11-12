import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    enum: ['personal', 'team', 'admin'],
    required: true
  },
  // For team accounts
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  }],
  // For personal accounts that belong to teams
  memberOf: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Account = mongoose.model('Account', AccountSchema);
export default Account;