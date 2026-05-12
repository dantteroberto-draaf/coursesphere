import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourse, createLesson, updateLesson } from "../api/api";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";

export default function LessonForm() {
  const { id: courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const isEdit   = Boolean(lessonId);

  const [form, setForm]               = useState({ title: "", status: "draft", video_url: "" });
  const [errors, setErrors]           = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]         = useState(isEdit);
  const [saving, setSaving]           = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    // Busca o curso completo (que já traz lessons) para pre-popular o form
    getCourse(courseId)
      .then(({ data }) => {
        const lesson = data.lessons?.find((l) => l.id === Number(lessonId));
        if (lesson)
          setForm({
            title:     lesson.title,
            status:    lesson.status,
            video_url: lesson.video_url || "",
          });
      })
      .catch(() => setServerError("Erro ao carregar aula."))
      .finally(() => setLoading(false));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.title.trim())            e.title = "Título é obrigatório";
    else if (form.title.trim().length < 3) e.title = "Mínimo de 3 caracteres";
    if (form.video_url && !/^https?:\/\/.+/.test(form.video_url))
                                       e.video_url = "URL inválida (deve começar com http/https)";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setSaving(true);
    setServerError("");
    try {
      if (isEdit) {
        await updateLesson(courseId, lessonId, form);
      } else {
        await createLesson(courseId, form);
      }
      navigate(`/courses/${courseId}`);
    } catch (err) {
      const msgs = err.response?.data?.errors;
      setServerError(Array.isArray(msgs) ? msgs.join(", ") : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout><LoadingSpinner /></Layout>;

  return (
    <Layout>
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEdit ? "Editar Aula" : "Nova Aula"}
          </h1>

          {serverError && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-5 border border-red-100">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título <span className="text-red-400">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="flex gap-3">
                {["draft", "published"].map((s) => (
                  <label
                    key={s}
                    className={`flex-1 flex items-center justify-center gap-2 border rounded-xl py-2.5 text-sm cursor-pointer transition ${
                      form.status === s
                        ? "border-primary bg-indigo-50 text-primary font-semibold"
                        : "border-gray-300 text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={form.status === s}
                      onChange={() => setForm({ ...form, status: s })}
                      className="sr-only"
                    />
                    {s === "draft" ? "📝 Rascunho" : "✅ Publicada"}
                  </label>
                ))}
              </div>
            </div>

            {/* URL do vídeo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL do Vídeo{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                value={form.video_url}
                onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                placeholder="https://youtube.com/..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              {errors.video_url && <p className="text-red-500 text-xs mt-1">{errors.video_url}</p>}
            </div>

            {/* Ações */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:border-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition disabled:opacity-50"
              >
                {saving ? "Salvando..." : isEdit ? "Salvar" : "Criar Aula"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}