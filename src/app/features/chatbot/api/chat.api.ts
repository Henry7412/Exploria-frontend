// ✅ src/app/features/chatbot/api/chat.api.ts  (SIN any)
import type {
  ApiEnvelope,
  ChatHistoryResponse,
  ChatMemorySyncDto,
  ChatMemorySyncResponse,
  ChatMessage,
  RecommendationResponse,
} from "../types/chat.types";
import { getAuthHeaders, unwrap } from "./chat.helpers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function assertApiUrl() {
  if (!API_URL)
    throw new Error("NEXT_PUBLIC_API_URL no está definido en .env.local");
}

// POST /landing/chat  -> crea/obtiene chat
export async function getOrCreateChat(deviceId: string) {
  assertApiUrl();

  const res = await fetch(`${API_URL}/api/v1/landing/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ deviceId }),
  });

  const json: ApiEnvelope<{ chat: { _id: string } }> | null =
    await res.json().catch(() => null);

  if (!res.ok) throw new Error(json?.message || "No se pudo iniciar el chat.");

  const { data } = unwrap<{ chat: { _id: string } }>(json ?? {});
  return data.chat;
}

// GET /landing/chat/:chatId/messages?page=1&pageSize=50
export async function getChatMessages(chatId: string, page = 1, pageSize = 50) {
  assertApiUrl();

  const qs = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  const res = await fetch(
    `${API_URL}/api/v1/landing/chat/${chatId}/messages?${qs}`,
    {
      method: "GET",
      headers: { ...getAuthHeaders() },
    }
  );

  const json: ApiEnvelope<ChatHistoryResponse> | null =
    await res.json().catch(() => null);

  if (!res.ok)
    throw new Error(json?.message || "No se pudo cargar el historial.");

  const { data } = unwrap<ChatHistoryResponse>(json ?? {});
  return data;
}

// ✅ TEXTO (multipart)
export async function sendChatMessage(
  chatId: string,
  deviceId: string,
  value: string
) {
  assertApiUrl();

  const form = new FormData();
  form.append("deviceId", deviceId);
  form.append("value", value);

  const res = await fetch(`${API_URL}/api/v1/landing/chat/${chatId}/message`, {
    method: "POST",
    headers: { ...getAuthHeaders() }, // ⚠️ NO Content-Type
    body: form,
  });

  const json: ApiEnvelope<ChatMessage> | null = await res
    .json()
    .catch(() => null);

  if (!res.ok)
    throw new Error(json?.message || "No se pudo enviar el mensaje.");

  const { data } = unwrap<ChatMessage>(json ?? {});
  return data;
}

// ✅ IMAGEN + (opcional) TEXTO (multipart)
export async function sendChatMessageMultipart(
  chatId: string,
  deviceId: string,
  value?: string,
  file?: File
) {
  assertApiUrl();

  const form = new FormData();
  form.append("deviceId", deviceId);
  if (value && value.trim()) form.append("value", value.trim());
  if (file) form.append("file", file);

  const res = await fetch(`${API_URL}/api/v1/landing/chat/${chatId}/message`, {
    method: "POST",
    headers: { ...getAuthHeaders() }, // ⚠️ NO Content-Type
    body: form,
  });

  const json: ApiEnvelope<ChatMessage> | null = await res
    .json()
    .catch(() => null);

  if (!res.ok)
    throw new Error(
      json?.message || "No se pudo enviar el mensaje con imagen."
    );

  const { data } = unwrap<ChatMessage>(json ?? {});
  return data;
}

// POST /landing/chat/new -> crea un chat nuevo y devuelve chat._id
export async function newChat(deviceId: string) {
  assertApiUrl();

  const res = await fetch(`${API_URL}/api/v1/landing/chat/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ deviceId }),
  });

  const json: ApiEnvelope<{ chat: { _id: string } }> | null =
    await res.json().catch(() => null);

  if (!res.ok)
    throw new Error(json?.message || "No se pudo crear un nuevo chat.");

  const { data } = unwrap<{ chat: { _id: string } }>(json ?? {});
  return data.chat._id;
}

// ✅ STT (audio) -> { transcript }
export async function sendAudioMessage(file: File) {
  assertApiUrl();

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_URL}/api/v1/landing/message/audio`, {
    method: "POST",
    headers: { ...getAuthHeaders() },
    body: form,
  });

  const json: ApiEnvelope<{ transcript: string }> | null = await res
    .json()
    .catch(() => null);

  if (!res.ok)
    throw new Error(json?.message || "No se pudo transcribir el audio.");

  const { data } = unwrap<{ transcript: string }>(json ?? {});
  return data;
}

// ✅ NUEVO: POST /landing/chat/recommendation
export async function requestRecommendation(
  chatId: string,
  deviceId: string,
  action: string
) {
  assertApiUrl();

  const res = await fetch(`${API_URL}/api/v1/landing/chat/recommendation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ chatId, deviceId, action }),
  });

  const json: ApiEnvelope<{ items: RecommendationResponse[] }> | null =
    await res.json().catch(() => null);

  if (!res.ok)
    throw new Error(json?.message || "No se pudo generar la recomendación.");

  const { data } = unwrap<{ items: RecommendationResponse[] }>(json ?? {});
  return data.items?.[0];
}


export async function chatMemorySync(payload: ChatMemorySyncDto) {
  assertApiUrl();

  const res = await fetch(`${API_URL}/api/v1/landing/chat/memory-sync`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const json: ApiEnvelope<ChatMemorySyncResponse> | null =
    await res.json().catch(() => null);

  if (!res.ok) throw new Error(json?.message || "No se pudo guardar preferencias.");

  const { data } = unwrap<ChatMemorySyncResponse>(json ?? {});
  return data;
}
