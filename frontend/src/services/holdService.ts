import apiClient from "../api/apiClient";
import type { ConfirmHoldResponse, CreateHoldResponse, Hold, MyHold } from "../interfaces";

export async function createHold(classId: string): Promise<CreateHoldResponse> {
  const { data } = await apiClient.post<CreateHoldResponse>(`/classes/${classId}/holds`);
  return data;
}

export async function getHoldById(holdId: string): Promise<Hold> {
  const { data } = await apiClient.get<Hold>(`/holds/${holdId}`);
  return data;
}

export async function confirmHold(holdId: string): Promise<ConfirmHoldResponse> {
  const { data } = await apiClient.post<ConfirmHoldResponse>(`/holds/${holdId}/confirm`);
  return data;
}

export async function cancelHold(holdId: string): Promise<void> {
  await apiClient.delete(`/holds/${holdId}`);
}

export async function getMyHolds(): Promise<MyHold[]> {
  const { data } = await apiClient.get<MyHold[]>("/me/holds");
  return data;
}
