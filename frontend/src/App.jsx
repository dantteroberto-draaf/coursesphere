import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login        from "./pages/Login";
import Register     from "./pages/Register";
import Dashboard    from "./pages/Dashboard";
import CourseDetail from "./pages/CourseDetail";
import CourseForm   from "./pages/CourseForm";
import LessonForm   from "./pages/LessonForm";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redireciona raiz para dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Rotas públicas */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotas protegidas */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/courses/new" element={
            <ProtectedRoute><CourseForm /></ProtectedRoute>
          } />
          <Route path="/courses/:id" element={
            <ProtectedRoute><CourseDetail /></ProtectedRoute>
          } />
          <Route path="/courses/:id/edit" element={
            <ProtectedRoute><CourseForm /></ProtectedRoute>
          } />
          <Route path="/courses/:id/lessons/new" element={
            <ProtectedRoute><LessonForm /></ProtectedRoute>
          } />
          <Route path="/courses/:id/lessons/:lessonId/edit" element={
            <ProtectedRoute><LessonForm /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}