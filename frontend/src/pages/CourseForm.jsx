import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourse, createCourse, updateCourse } from "../api/api";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CourseForm() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isEdit   = Boolean(id);

  const [form, setForm]               = useState({ name: "", description: "", start_date: "", end_date: "" });
  const [errors, setErrors]           = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]         = useState(isEdit);
  const [saving, setSaving]           = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    getCourse(id)
      .then(({ data }) =>
        setForm({
          name:        data.name,
          description: data.description || "",
          start_date:  data.start_date?.slice(0, 10) || "",
          end_date:    data.end_date?.slice(0, 10)   || "",
        })
      )
      .catch(() => setServerError("Erro ao carregar curso."))
      .finally(() => setLoading(false));
  }, [id]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())              e.name       = "Nome é obrigatório";
    else if (form.name.trim().length < 3) e.name     = "Nome deve ter ao menos 3 caracteres";
    if (!form.start_date)               e.start_date = "Data de início é obrigatória";
    if (!form.end_date)                 e.end_date   = "Data de término é obrigatória";
    else if (form.end_date < form.start_date)
                                        e.end_date   = "Deve ser igual ou posterior ao início";
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
        await updateCourse(id, form);
        navigate(`/courses/${id}`);
      } else {
        const { data } = await createCourse(form);
        navigate(`/courses/${data.id}`);
      }
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
            {isEdit ? "Editar Curso" : "Novo Curso"}
          </h1>

          {serverError && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-5 border border-red-100">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome <span className="text-red-400">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
              />
            </div>

            {/* Datas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Início <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
                {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Término <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
                {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
              </div>
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
                {saving ? "Salvando..." : isEdit ? "Salvar Alterações" : "Criar Curso"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}