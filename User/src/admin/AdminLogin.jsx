// import React, { useState } from "react";
// import axios from "axios";

// const AdminLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("/api/admin/login", { email, password });
//       localStorage.setItem("token", res.data.token);
//       // Redirect to dashboard
//       window.location.href = "/admin/dashboard";
//     } catch (err) {
//       alert("Login failed");
//     }
//   };

//   return (
//     <div>
//       <h1>Admin Login</h1>
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           required
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           required
//         />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// // export default AdminLogin;
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../utils/config";

// const AdminLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate(); // <-- initialize

//   const handleLogin = (e) => {
//     console.log("Entered:", email, password);
//     console.log("ENV:", ADMIN_EMAIL, ADMIN_PASSWORD);
//     e.preventDefault();

//     if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
//       localStorage.setItem("adminToken", "hardcoded-token");
//       navigate("/admin/dashboard"); // <-- use navigate instead of window.location.href
//     } else {
//       alert("Login failed");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <form
//         onSubmit={handleLogin}
//         className="p-8 bg-white rounded shadow-md w-96"

//       >
//         <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           required
//           className="w-full mb-3 p-2 border rounded"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           required
//           className="w-full mb-4 p-2 border rounded"
//         />
//         <button
//           type="submit"
//           className="w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AdminLogin;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/services/admin";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    

    try {
      const data = await loginAdmin(email, password);
       console.log("LOGIN SUCCESS", data);

      localStorage.setItem("adminToken", data.token);

      navigate("/admin/dashboard");
    } catch (err) {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="p-8 bg-white rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full p-2 bg-purple-600 text-white rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;