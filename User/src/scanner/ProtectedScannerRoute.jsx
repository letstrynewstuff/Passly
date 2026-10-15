// // src/scnner/ProtectedScannerRoute.jsx
// import { Navigate } from "react-router-dom";

// const ProtectedScannerRoute = ({ children }) => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const admin = localStorage.getItem("adminAuth");

//   // Allow admin
//   if (admin) return children;

//   // Allow planner only
//   if (user && user.role === "planner") return children;

//   return <Navigate to="/login" />;
// };

// export default ProtectedScannerRoute;


// src/scnner/ProtectedScannerRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedScannerRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const scannerRole = localStorage.getItem("scannerRole"); // set by the scanner login
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const admin = localStorage.getItem("adminAuth");

  // Signed in through the scanner login (master, admin or planner)
  if (token && scannerRole) return children;

  // Existing rules still work
  if (admin) return children;
  if (user && user.role === "planner") return children;

  return <Navigate to="/scanner-login" replace />;
};

export default ProtectedScannerRoute;