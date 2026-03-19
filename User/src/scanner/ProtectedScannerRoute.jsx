import { Navigate } from "react-router-dom";

const ProtectedScannerRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = localStorage.getItem("adminAuth");

  // Allow admin
  if (admin) return children;

  // Allow planner only
  if (user && user.role === "planner") return children;

  return <Navigate to="/login" />;
};

export default ProtectedScannerRoute;
