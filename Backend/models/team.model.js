import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    teamMembers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

const teamModel = mongoose.model('Team', teamSchema);

export default teamModel;