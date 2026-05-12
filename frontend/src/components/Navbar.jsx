import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-primary shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="text-white text-xl font-bold tracking-tight">
          CourseSphere
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-indigo-200 text-sm hidden sm:block">
              Olá, <strong>{user.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-primary text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-indigo-50 transition"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}