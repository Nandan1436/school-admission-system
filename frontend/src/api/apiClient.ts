import axios, { type AxiosError } from "axios";
import { API_BASE_URL } from "../config/env";
import {
  NETWORK_ERROR_MESSAGE,
  STATUS_ERROR_MESSAGES,
  STUDENT_HEADER,
  STUDENT_STORAGE_KEY,
  UNEXPECTED_ERROR_MESSAGE,
} from "../constants";
import type { ProblemDetails } from "../interfaces";
import { ApiError } from "../utils/apiError";

const apiClient = axios.create({ baseURL: API_BASE_URL, timeout: 15_000 });

function readStudentId(): string | null {
  try {
    return window.localStorage.getItem(STUDENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

function firstValidationMessage(errors: ProblemDetails["errors"]): string | null {
  if (!errors) return null;
  const first = Object.values(errors).flat()[0];
  return first ?? null;
}

function toApiError(error: AxiosError<ProblemDetails>): ApiError {
  if (!error.response) {
    return new ApiError(NETWORK_ERROR_MESSAGE, "NETWORK_ERROR", null);
  }
  const { status, data } = error.response;
  const problem = typeof data === "object" && data !== null ? data : {};
  const message =
    problem.detail ??
    firstValidationMessage(problem.errors) ??
    STATUS_ERROR_MESSAGES[status] ??
    UNEXPECTED_ERROR_MESSAGE;
  return new ApiError(message, problem.code ?? null, status);
}

apiClient.interceptors.request.use((config) => {
  const studentId = readStudentId();
  if (studentId) config.headers.set(STUDENT_HEADER, studentId);
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ProblemDetails>) => Promise.reject(toApiError(error)),
);

export default apiClient;
