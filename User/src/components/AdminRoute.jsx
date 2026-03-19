// import { Navigate } from "react-router-dom";

// const AdminRoute = ({ children }) => {
//   const isAdmin = localStorage.getItem("adminAuth");

//   if (!isAdmin) {
//     return <Navigate to="/admin/login" />;
//   }

//   return children;
// };

// export default AdminRoute;

import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;