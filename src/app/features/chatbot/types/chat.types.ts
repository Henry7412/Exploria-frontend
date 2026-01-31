import { ProfessionalViewEnum, VoiceToneEnum } from "../constants/chat.enums";

// ✅ src/app/features/chatbot/types/chat.types.ts
export type ChatRole = "user" | "model" | "system";

export type Recommendation = {
  name: string;
  type: string; // "ACTIVITY" | "DESTINY" | ...
  description: string;
  relevantData?: string[];
  link?: string;
  external?: boolean;
};

// value puede ser:
// - string (mensajes simples)
// - objeto user multimodal { text, image }
// - objeto model { value, actions, recommendations }
export type ChatMessageValue =
  | string
  | {
      // user multimodal
      text?: string;
      image?: {
        url?: string;
        fullUrl?: string;
        key?: string;
        mimeType?: string;
        size?: number;
      };

      // model payload
      value?: string;
      actions?: string[];
      recommendations?: Recommendation[];
    };

export type ChatMessage = {
  _id: string;
  createdAt: string;
  role: ChatRole;
  value: ChatMessageValue;

  // a veces vienen arriba (según tu normalización)
  actions?: string[];
  recommendations?: Recommendation[];
};

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
};

export type ChatHistoryResponse = {
  items: ChatMessage[];
  pagination: Pagination;
};

// ✅ Response del endpoint /landing/chat/recommendation
export type RecommendationResponse = {
  _id: string;
  value: string;
  actions: string[];
  recommendations: Recommendation[];
  createdAt: string;
};

export type ApiEnvelope<T> = {
  message?: string;
  data?: T | unknown;
};

export type ChatMemorySyncDto = {
  chatId: string;
  deviceId?: string;

  user: boolean; // 👈 importante: el backend lo tiene requerido

  funFact?: string;
  jobTitle?: string;
  favoriteFoods?: string;
  medicalConsiderations?: string;
  perspectives?: ProfessionalViewEnum[];
  voiceTones?: VoiceToneEnum[];
};

export type ChatMemorySyncResponse = {
  _id: string;
  role: ChatRole;     
  value: string;      
  createdAt: string;
};