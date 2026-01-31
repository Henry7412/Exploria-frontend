import { VoiceToneEnum, ProfessionalViewEnum } from "./chat.enums";

export const VOICE_TONE_LABELS: Record<VoiceToneEnum, string> = {
  [VoiceToneEnum.NEUTRAL]: "Neutral",
  [VoiceToneEnum.FRIENDLY]: "Amigable",
  [VoiceToneEnum.HUMOROUS]: "Divertido",
  [VoiceToneEnum.ENTHUSIASTIC]: "Entusiasta",
  [VoiceToneEnum.SERIOUS]: "Serio",
  [VoiceToneEnum.CASUAL]: "Casual",
};

export const PERSPECTIVE_LABELS: Record<ProfessionalViewEnum, string> = {
  [ProfessionalViewEnum.LOCAL_GUIDE]: "Guía local",
  [ProfessionalViewEnum.SCIENTIST]: "Científico",
  [ProfessionalViewEnum.FOOD_CRITIC]: "Gastronómico",
  [ProfessionalViewEnum.HISTORIAN]: "Histórico / cultural",
  [ProfessionalViewEnum.ENVIRONMENTALIST]: "Ambientalista",
  [ProfessionalViewEnum.RELIGIOUS_SCHOLAR]: "Religioso",
  [ProfessionalViewEnum.TRAVEL_BLOGGER]: "Aventura / viajero",
};
