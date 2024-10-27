import Admin from "../models/admin.model.js";
import Team from "../models/team.model.js";

const checkUserRole = async (req, res, next) => {
  const username = req.user;

  try {
    // Check if admin
    const admin = await Admin.findOne({ adminName: username });
    if (admin) {
      req.userRole = "admin";
      return next();
    }

    // Check if team
    const team = await Team.findOne({ teamName: username });
    if (team) {
      req.userRole = "team";
      req.teamName = username;
      return next();
    }

    // Must be regular user
    const user = await User.findOne({ username });
    if (user) {
      req.userRole = "user";
      req.team = user.team;
      return next();
    }

    return res.status(401).json({ message: "User not found" });
  } catch (error) {
    logger.error("Error in role verification", { error: error.message });
    return res.status(500).json({ message: "Error verifying user role" });
  }
};

export default checkUserRole;