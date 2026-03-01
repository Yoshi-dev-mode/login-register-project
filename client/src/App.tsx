import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        <section className="h-screen w-full flex justify-center items-center ">
          <div className="shadow-md p-5">
            <Login />
          </div>
        </section>
      } />
      <Route path="/register" element={
        <section className="h-screen w-full flex justify-center items-center ">
          <div className="shadow-md p-5">
            <Register />
          </div>
        </section>
        } />

      {/* Protected routes */}
      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <div className="min-h-screen w-full bg-gray-100 p-8">
              <About />
            </div>
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}


export default App;
