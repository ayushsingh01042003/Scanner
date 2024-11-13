import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Set entire decoded object

    next();
  } catch (error) {
    logger.error("Token verification failed", { error: error.message });
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default verifyToken;
