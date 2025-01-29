import jwt from "jsonwebtoken";
import appconfig from "../config/appConfig.js";

export const authenticate = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith("Bearer")) {
    return res.status(401).json({
      message:  "No Token, Authorization Denied",
    });
  }

  try {
    const token = authToken.split(" ")[1];

    const decoded = jwt.verify(token,appconfig.JWT_SECRET);

    req.userId = decoded.id;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token Expired",
      });
    }

    return res.status(401).json({
      message: "Token is not valid",
    });
  }
};
