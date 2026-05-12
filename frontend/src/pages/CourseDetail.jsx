import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourse, deleteLesson, deleteCourse } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import GuestInstructor from "../components/GuestInstructor";

const STATUS_LABEL = { draft: "Rascunho", published: "Publicada" };
const STATUS_COLOR = {
  draft:     "bg-yellow-100 text-yellow-700 border-yellow-200",
  published: "bg-green-100  text-green-700  border-green-200",
};
const fmt = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR") : "—";

export default function CourseDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const [course, setCourse]       = useState(null);
  const [lessons, setLessons]     = useState([]);
  const [statusFilter, setFilter] = useState("all");
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    getCourse(id)
      .then(({ data }) => {
        setCourse(data);
        // O backend já embute as lessons no show: course.as_json(include: :lessons)
        setLessons(data.lessons || []);
      })
      .catch(() => setError("Erro ao carregar o curso."))
      .finally(() => setLoading(false));
  }, [id]);

  // Checa se o usuário logado é o criador do curso
  const isCreator = user && course && course.user_id === user.id;

  const handleDeleteCourse = async () => {
    if (!confirm("Deseja realmente excluir este curso?")) return;
    try {
      await deleteCourse(id);
      navigate("/dashboard");
    } catch {
      alert("Erro ao excluir o curso.");
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm("Deseja realmente excluir esta aula?")) return;
    try {
      await deleteLesson(id, lessonId);
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } catch {
      alert("Erro ao excluir a aula.");
    }
  };

  const filtered =
    statusFilter === "all" ? lessons : lessons.filter((l) => l.status === statusFilter);

  if (loading) return <Layout><LoadingSpinner message="Carregando curso..." /></Layout>;
  if (error)   return <Layout><p className="text-red-500">{error}</p></Layout>;

  return (
    <Layout>
      {/* ── Card principal do curso ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link
              to="/dashboard"
              className="text-xs text-primary hover:underline mb-2 inline-block"
            >
              ← Voltar para cursos
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{course.name}</h1>
            {course.description && (
              <p className="text-gray-500 text-sm mb-3">{course.description}</p>
            )}
            <div className="flex gap-4 text-sm text-gray-400">
              <span>📅 Início: {fmt(course.start_date)}</span>
              <span>🏁 Término: {fmt(course.end_date)}</span>
            </div>
          </div>

          {/* Botões visíveis apenas para o criador */}
          {isCreator && (
            <div className="flex gap-2 shrink-0">
              <Link
                to={`/courses/${id}/edit`}
                className="text-sm px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:border-primary hover:text-primary transition"
              >
                Editar
              </Link>
              <button
                onClick={handleDeleteCourse}
                className="text-sm px-4 py-2 border border-red-200 rounded-xl text-red-500 hover:bg-red-50 transition"
              >
                Excluir
              </button>
            </div>
          )}
        </div>

        {/* Instrutor convidado via API externa */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <GuestInstructor />
        </div>
      </div>

      {/* ── Seção de aulas ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Aulas{" "}
          <span className="text-sm font-normal text-gray-400">({filtered.length})</span>
        </h2>

        <div className="flex flex-wrap gap-2">
          {/* Filtro de status */}
          {["all", "published", "draft"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                statusFilter === s
                  ? "bg-primary text-white border-primary"
                  : "border-gray-300 text-gray-500 hover:border-primary"
              }`}
            >
              {s === "all" ? "Todas" : STATUS_LABEL[s]}
            </button>
          ))}

          {/* Só o criador vê o botão de nova aula */}
          {isCreator && (
            <Link
              to={`/courses/${id}/lessons/new`}
              className="text-xs px-4 py-1.5 bg-primary text-white rounded-full hover:bg-primary-dark transition font-semibold"
            >
              + Nova Aula
            </Link>
          )}
        </div>
      </div>

      {/* Lista de aulas */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-2">🎬</p>
          <p className="text-gray-400 text-sm">
            {statusFilter !== "all"
              ? "Nenhuma aula com esse status."
              : "Nenhuma aula cadastrada ainda."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{lesson.title}</p>
                    {lesson.video_url && (
                    <a
                        href={lesson.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline mt-0.5 inline-block"
                    >
                        🎬 Assistir vídeo
                    </a>
                    )}
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full border ${STATUS_COLOR[lesson.status]}`}
                >
                  {STATUS_LABEL[lesson.status]}
                </span>

                {isCreator && (
                  <>
                    <Link
                      to={`/courses/${id}/lessons/${lesson.id}/edit`}
                      className="text-xs text-gray-500 hover:text-primary transition"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="text-xs text-red-400 hover:text-red-600 transition"
                    >
                      Excluir
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}