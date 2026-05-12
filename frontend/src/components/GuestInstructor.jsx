import { useEffect, useState } from "react";
import { getRandomUser } from "../api/api";

export default function GuestInstructor() {
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    getRandomUser()
      .then(setInstructor)
      .catch(() => setInstructor(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <p className="text-sm text-indigo-400 animate-pulse">
        Buscando instrutor convidado...
      </p>
    );

  if (!instructor) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
      <img
        src={instructor.picture.medium}
        alt="Instrutor convidado"
        className="w-14 h-14 rounded-full ring-2 ring-primary ring-offset-2"
      />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-0.5">
          Instrutor Convidado
        </p>
        <p className="font-semibold text-gray-700">
          {instructor.name.first} {instructor.name.last}
        </p>
        <p className="text-xs text-gray-500">{instructor.email}</p>
      </div>
    </div>
  );
}