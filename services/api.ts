export const BASE_URL = "http://localhost:5000/api";

import { useAuthStore } from "@/store/authStore";

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = useAuthStore.getState().token;  

  const headers = new Headers(options.headers || {});

  const isFormData = options.body instanceof FormData;

  if (!isFormData) {
    headers.set("Content-Type", "application/json");
  } 

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error("Erro na requisição");
  }

  return res.json();
}