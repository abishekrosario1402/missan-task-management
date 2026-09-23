// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// import Login from "./pages/Login";
// import Register from "./pages/Register";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         <Route path="/" element={<Navigate to="/login" replace />} />

//         <Route path="/login" element={<Login />} />

//         <Route path="/register" element={<Register />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/projects/:projectId"
          element={<ProjectDetails />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;