export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiFetchOptions = RequestInit & {
  showErrorToast?: boolean;
};

const getErrorMessage = async (response: Response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      const payload = await response.clone().json();

      if (typeof payload === "string") return payload;
      if (payload && typeof payload === "object") {
        const data = payload as { message?: unknown; error?: unknown; detail?: unknown };
        if (typeof data.message === "string" && data.message.trim()) return data.message;
        if (typeof data.error === "string" && data.error.trim()) return data.error;
        if (typeof data.detail === "string" && data.detail.trim()) return data.detail;
      }
    } catch {
      // fall through to text parsing
    }
  }

  try {
    const text = await response.clone().text();
    if (text.trim()) return text;
  } catch {
    // ignore
  }

  return `Erro na requisição (${response.status})`;
};

export async function apiFetch(
  url: string,
  options: ApiFetchOptions = {}
) {
  const token = useAuthStore.getState().token;  
  const { showErrorToast = true, ...requestOptions } = options;

  const headers = new Headers(requestOptions.headers || {});

  const isFormData = requestOptions.body instanceof FormData;

  if (!isFormData) {
    headers.set("Content-Type", "application/json");
  } 

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      ...requestOptions,
      headers,
    });

    if (!res.ok) {
      const message = await getErrorMessage(res);

      if (showErrorToast) {
        toast.error(message, {
          position: "top-right",
          autoClose: 4500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }

      throw new ApiError(message, res.status);
    }

    return res.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Erro de conexão com a API";

    if (showErrorToast) {
      toast.error(message, {
        position: "top-right",
        autoClose: 4500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }

    throw new ApiError(message, 0);
  }
}