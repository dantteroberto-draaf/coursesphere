import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Injeta o token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
// POST /api/v1/users  →  { user: { name, email, password } }
export const register = (data) => api.post("/users", { user: data });

// POST /api/v1/login  →  { email, password }
export const login = (data) => api.post("/login", data);

// Courses
export const getCourses = () => api.get("/courses");
export const getCourse  = (id) => api.get(`/courses/${id}`);
export const createCourse = (data) => api.post("/courses", { course: data });
export const updateCourse = (id, data) => api.put(`/courses/${id}`, { course: data });
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// Lessons
export const getLessons   = (courseId) => api.get(`/courses/${courseId}/lessons`);
export const createLesson = (courseId, data) =>
  api.post(`/courses/${courseId}/lessons`, { lesson: data });
export const updateLesson = (courseId, lessonId, data) =>
  api.put(`/courses/${courseId}/lessons/${lessonId}`, { lesson: data });
export const deleteLesson = (courseId, lessonId) =>
  api.delete(`/courses/${courseId}/lessons/${lessonId}`);

// API Externa: RandomUser
export const getRandomUser = () =>
  fetch("https://randomuser.me/api/?nat=br")
    .then((r) => r.json())
    .then((d) => d.results[0]);

export default api;