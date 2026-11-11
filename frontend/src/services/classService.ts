import apiClient from "../api/apiClient";
import type { ClassOptions, ClassSummary, CreateClassRequest, CreateClassResponse } from "../interfaces";

export async function getClasses(): Promise<ClassSummary[]> {
  const { data } = await apiClient.get<ClassSummary[]>("/classes");
  return data;
}

export async function getClassById(classId: string): Promise<ClassSummary> {
  const { data } = await apiClient.get<ClassSummary>(`/classes/${classId}`);
  return data;
}

export async function createClass(request: CreateClassRequest): Promise<CreateClassResponse> {
  const { data } = await apiClient.post<CreateClassResponse>("/classes", request);
  return data;
}

export async function getClassOptions(): Promise<ClassOptions> {
  const { data } = await apiClient.get<ClassOptions>("/class-options");
  return data;
}
