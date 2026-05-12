import { Link } from "react-router-dom";

const fmt = (d) => new Date(d + "T00:00:00").toLocaleDateString("pt-BR");

export default function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all p-5"
    >
      <h2 className="text-base font-semibold text-gray-800 mb-2 truncate group-hover:text-primary transition-colors">
        {course.name}
      </h2>

      {course.description && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{course.description}</p>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>📅 {fmt(course.start_date)}</span>
        <span>→</span>
        <span>{fmt(course.end_date)}</span>
      </div>
    </Link>
  );
}