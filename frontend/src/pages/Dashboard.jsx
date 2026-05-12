import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../api/api";
import Layout from "../components/Layout";
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";

const PER_PAGE = 6;

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);

  useEffect(() => {
    getCourses()
      .then(({ data }) => setCourses(data))
      .catch(() => setError("Erro ao carregar cursos. Verifique se o backend está rodando."))
      .finally(() => setLoading(false));
  }, []);

  const filtered  = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <Layout>
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Cursos</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {courses.length} curso{courses.length !== 1 ? "s" : ""} cadastrado{courses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/courses/new"
          className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition text-center"
        >
          + Novo Curso
        </Link>
      </div>

      {/* Busca */}
      <div className="relative mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Buscar curso por nome..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full sm:w-80 border border-gray-300 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
        />
      </div>

      {/* Conteúdo */}
      {loading && <LoadingSpinner message="Carregando cursos..." />}

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {paginated.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-3">📚</p>
              <p className="text-gray-500 text-sm">
                {search ? "Nenhum curso encontrado para essa busca." : "Nenhum curso ainda. Crie o primeiro!"}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:border-primary transition"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 text-sm rounded-lg font-medium transition ${
                    p === page
                      ? "bg-primary text-white"
                      : "border border-gray-300 text-gray-600 hover:border-primary"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:border-primary transition"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}