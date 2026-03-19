
import jwt from "jsonwebtoken";

/**
 * Middleware to authenticate JWT from Authorization Header
 * Attaches decoded user { id, role } to req.user
 */


export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};


/**
 * Middleware to enforce role-based access control
 * Must be used AFTER authenticateJWT
 * @param roles Array of allowed roles (e.g., ['admin', 'editor'])
 */
export const requireRole = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Insufficient permissions",
    });
  }

  next();
};
export const authAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
// export const requireAdmin = (req, res, next) => {
//   if (!req.user || req.user.role !== "admin") {
//     return res.status(403).json({ message: "Admin access required" });
//   }
//   next();
// };
