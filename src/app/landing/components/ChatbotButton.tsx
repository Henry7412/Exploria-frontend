"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { X, ImagePlus, Mic, ArrowUp, Plus, SlidersHorizontal } from "lucide-react";

import { getOrCreateDeviceId, isLoggedIn } from "@/src/app/features/chatbot/api/chat.helpers";
import {
  getOrCreateChat,
  getChatMessages,
  sendChatMessage,
  sendChatMessageMultipart,
  newChat,
  sendAudioMessage,
  requestRecommendation,
  chatMemorySync,
} from "@/src/app/features/chatbot/api/chat.api";

import type { ChatRole, Recommendation } from "@/src/app/features/chatbot/types/chat.types";
import { useAudioRecorder } from "@/src/app/features/chatbot/hooks/useAudioRecorder";
import { ProfessionalViewEnum, VoiceToneEnum } from "../../features/chatbot/constants/chat.enums";
import { PERSPECTIVE_LABELS, VOICE_TONE_LABELS } from "../../features/chatbot/constants/chat.labels";

type UiMsg = {
  id: string;
  role: ChatRole;
  text: string;
  createdAt?: string;
  actions?: string[];
  imageUrl?: string;
  recommendations?: Recommendation[];
};

const DEFAULT_ACTIONS: string[] = [
  "DESTINY_FIND_BEST_VIEWS",
  "DESTINY_DISCOVER_BEST_PLACES",
  "ACTIVITY_DISCOVER_FUN_EXPERIENCES",
  "EVENT_CALENDAR_UPCOMING_MAIN",
  "BUSINESS_BEST_PLACES_TO_EAT",
  "BUSINESS_TYPICAL_DISHES_TO_TRY",
];

const WELCOME: UiMsg = {
  id: "welcome",
  role: "model",
  text: "👋 Hola, ¿en qué te puedo ayudar?",
  actions: DEFAULT_ACTIONS,
};

const ACTION_LABELS: Record<string, string> = {
  DESTINY_FIND_BEST_VIEWS: "Lugares con las mejores vistas",
  DESTINY_DISCOVER_BEST_PLACES: "Mejores lugares para conocer",
  DESTINY_RECOMMEND_FIRST_TIME_VISITS: "Para tu primera visita",
  ACTIVITY_DISCOVER_FUN_EXPERIENCES: "Actividades divertidas",
  ACTIVITY_FAMILY_FRIENDLY_OPTIONS: "Planes en familia",
  ACTIVITY_ADVENTURE_FOR_TRAVELERS: "Aventura para viajeros",
  FESTIVITY_MAIN_TRADITIONAL_CELEBRATIONS: "Celebraciones tradicionales",
  FESTIVITY_MUSIC_DANCE_TRADITIONS: "Música y danzas típicas",
  FESTIVITY_RELIGIOUS_FAITH_FESTIVALS: "Festividades religiosas",
  EVENT_CALENDAR_UPCOMING_MAIN: "Próximos eventos",
  EVENT_CULTURAL_FOR_VISITORS: "Eventos culturales",
  EVENT_FAIRS_LOCAL_PRODUCTS: "Ferias y productos locales",
  BUSINESS_COFFEE_SHOPS_WITH_VIEW: "Cafés con buena vista",
  BUSINESS_BEST_PLACES_TO_EAT: "Dónde comer bien",
  BUSINESS_TYPICAL_DISHES_TO_TRY: "Platos típicos que debes probar",
};

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function toUiMsg(m: Record<string, unknown>): UiMsg {
  const maybeData = (m as { data?: unknown }).data;
  if (maybeData && typeof maybeData === "object" && !Array.isArray(maybeData)) {
    return toUiMsg(maybeData as Record<string, unknown>);
  }

  const maybeItems = (m as { items?: unknown }).items;
  if (
    Array.isArray(maybeItems) &&
    maybeItems.length > 0 &&
    typeof maybeItems[0] === "object" &&
    maybeItems[0] !== null
  ) {
    return toUiMsg(maybeItems[0] as Record<string, unknown>);
  }

  let text = "";
  let imageUrl: string | undefined;

  let actions: string[] = Array.isArray((m as { actions?: unknown }).actions)
    ? (((m as { actions?: unknown }).actions as unknown[]).filter((x) => typeof x === "string") as string[])
    : [];

  let recommendations: Recommendation[] | undefined = Array.isArray((m as { recommendations?: unknown }).recommendations)
    ? ((m as { recommendations?: unknown }).recommendations as Recommendation[])
    : undefined;

  const v = (m as { value?: unknown }).value;

  if (typeof v === "string") {
    text = v;
  } else if (v && typeof v === "object") {
    const vObj = v as Record<string, unknown>;

    text =
      typeof vObj.value === "string"
        ? (vObj.value as string)
        : typeof vObj.text === "string"
        ? (vObj.text as string)
        : "";

    const img = vObj.image as Record<string, unknown> | undefined;
    imageUrl =
      typeof img?.fullUrl === "string"
        ? (img.fullUrl as string)
        : typeof img?.url === "string"
        ? (img.url as string)
        : undefined;

    if (!actions.length && Array.isArray(vObj.actions)) {
      actions = (vObj.actions as unknown[]).filter((x) => typeof x === "string") as string[];
    }

    if (!recommendations && Array.isArray(vObj.recommendations)) {
      recommendations = vObj.recommendations as Recommendation[];
    }
  }

  const createdAt =
    typeof (m as { createdAt?: unknown }).createdAt === "string"
      ? ((m as { createdAt?: unknown }).createdAt as string)
      : (m as { createdAt?: unknown }).createdAt instanceof Date
      ? ((m as { createdAt?: Date }).createdAt as Date).toISOString()
      : undefined;

  return {
    id: typeof (m as { _id?: unknown })._id === "string" ? ((m as { _id: string })._id as string) : crypto.randomUUID(),
    role: ((m as { role?: unknown }).role as ChatRole) ?? "model",
    text,
    createdAt,
    actions,
    imageUrl,
    recommendations,
  };
}

function toggleInArray<T extends string>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

type Props = {
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

export default function ChatbotButton(props: Props) {
  // ✅ controlado desde afuera (LandingPage) o modo interno
  const controlled = typeof props.isOpen === "boolean";
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlled ? (props.isOpen as boolean) : internalOpen;

  const setOpen = (v: boolean) => {
    if (controlled) {
      if (v) props.onOpen?.();
      else props.onClose?.();
    } else {
      setInternalOpen(v);
    }
  };

  const [chatId, setChatId] = useState<string | null>(null);
  const deviceId = useMemo(() => getOrCreateDeviceId(), []);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<UiMsg[]>([WELCOME]);

  const bodyRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // audio
  const { recording, start, stop, cancel } = useAudioRecorder();

  // preferencias modal
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsUserMode, setPrefsUserMode] = useState(false);

  const [prefs, setPrefs] = useState({
    jobTitle: "",
    favoriteFoods: "",
    medicalConsiderations: "",
    funFact: "",
    perspectives: [] as ProfessionalViewEnum[],
    voiceTones: [] as VoiceToneEnum[],
  });

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      bodyRef.current?.scrollTo({
        top: bodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        setLoading(true);

        const chat = await getOrCreateChat(deviceId);
        setChatId(chat._id);

        const history = await getChatMessages(chat._id, 1, 50);
        const mapped = history.items.map(toUiMsg);

        if (mapped.length) {
          setMessages(mapped);
        } else {
          setMessages([{ ...WELCOME, actions: DEFAULT_ACTIONS }]);
        }
      } catch (e) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "system",
            text: e instanceof Error ? e.message : "Error al iniciar el chat.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, deviceId]);

  const sendText = useCallback(async () => {
    const value = input.trim();
    if (!value || loading) return;
    if (!chatId) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text: value }]);
    setInput("");

    try {
      setLoading(true);
      const resp = await sendChatMessage(chatId, deviceId, value);
      setMessages((prev) => [...prev, toUiMsg(resp)]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "system",
          text: e instanceof Error ? e.message : "No se pudo enviar el mensaje.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [chatId, deviceId, input, loading]);

  const sendAction = useCallback(
    async (action: string) => {
      if (!chatId || loading) return;

      const human = ACTION_LABELS[action] ?? action;
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text: human }]);

      try {
        setLoading(true);
        const resp = await requestRecommendation(chatId, deviceId, action);
        setMessages((prev) => [...prev, toUiMsg(resp)]);
      } catch (e) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "system",
            text: e instanceof Error ? e.message : "No se pudo generar la recomendación.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [chatId, deviceId, loading]
  );

  const handleNewChat = useCallback(async () => {
    if (loading) return;
    if (recording) cancel();

    try {
      setLoading(true);

      const newChatId = await newChat(deviceId);
      setChatId(newChatId);

      setInput("");
      setMessages([{ ...WELCOME, actions: DEFAULT_ACTIONS }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "system",
          text: e instanceof Error ? e.message : "No se pudo crear un nuevo chat.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [deviceId, loading, recording, cancel]);

  const handlePickImage = useCallback(() => {
    if (loading) return;

    if (!isLoggedIn()) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "system", text: "🔒 Para enviar imágenes debes iniciar sesión." },
      ]);
      return;
    }

    if (!chatId) {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "system", text: "Aún no se inició el chat." }]);
      return;
    }

    fileInputRef.current?.click();
  }, [chatId, loading]);

  const handleSendImage = useCallback(
    async (file: File) => {
      if (!chatId || loading) return;

      if (!isLoggedIn()) {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "system", text: "🔒 Inicia sesión para enviar imágenes." }]);
        return;
      }

      if (!file.type.startsWith("image/")) {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "system", text: "Solo se permiten imágenes." }]);
        return;
      }

      const text = input.trim();
      setInput("");

      const previewUrl = URL.createObjectURL(file);

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", text: text || "📷 Imagen enviada", imageUrl: previewUrl },
      ]);

      try {
        setLoading(true);
        const resp = await sendChatMessageMultipart(chatId, deviceId, text || undefined, file);
        setMessages((prev) => [...prev, toUiMsg(resp)]);
      } catch (e) {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "system", text: e instanceof Error ? e.message : "No se pudo enviar la imagen." },
        ]);
      } finally {
        setLoading(false);
        URL.revokeObjectURL(previewUrl);
      }
    },
    [chatId, deviceId, input, loading]
  );

  const handleMic = useCallback(async () => {
    if (loading) return;

    if (!isLoggedIn()) {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "system", text: "🔒 Inicia sesión para usar el micrófono." }]);
      return;
    }

    if (!chatId) {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "system", text: "Aún no se inició el chat." }]);
      return;
    }

    try {
      if (recording) {
        setLoading(true);

        const blob = await stop();
        if (!blob || blob.size === 0) {
          setLoading(false);
          return;
        }

        const file = new File([blob], `audio_${Date.now()}.webm`, { type: blob.type || "audio/webm" });

        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "system", text: "🎤 Procesando audio..." }]);

        const { transcript } = await sendAudioMessage(file);

        const text = (transcript || "").trim();
        if (!text) {
          setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "system", text: "No se detectó voz en el audio." }]);
          return;
        }

        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text }]);

        const resp = await sendChatMessage(chatId, deviceId, text);
        setMessages((prev) => [...prev, toUiMsg(resp)]);
        return;
      }

      await start();
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "system", text: "🎙️ Grabando... pulsa el micrófono otra vez para enviar." }]);
    } catch (e) {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "system", text: e instanceof Error ? e.message : "No se pudo usar el micrófono." }]);
    } finally {
      setLoading(false);
    }
  }, [chatId, deviceId, loading, recording, start, stop, cancel]);

  const handleSavePreferences = useCallback(async () => {
    if (!chatId || savingPrefs) return;

    try {
      setSavingPrefs(true);

      const logged = isLoggedIn();
      const saveInProfile = logged && prefsUserMode;

      const payload = {
        chatId,
        deviceId,
        user: saveInProfile,

        funFact: saveInProfile ? undefined : prefs.funFact || undefined,
        jobTitle: saveInProfile ? undefined : prefs.jobTitle || undefined,
        favoriteFoods: saveInProfile ? undefined : prefs.favoriteFoods || undefined,
        medicalConsiderations: saveInProfile ? undefined : prefs.medicalConsiderations || undefined,

        perspectives: prefs.perspectives,
        voiceTones: prefs.voiceTones,
      };

      await chatMemorySync(payload);

      setPrefsOpen(false);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "system", text: "✅ Preferencias guardadas." },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "system", text: e instanceof Error ? e.message : "No se pudo guardar preferencias." },
      ]);
    } finally {
      setSavingPrefs(false);
    }
  }, [chatId, deviceId, prefs, prefsUserMode, savingPrefs]);

  const canSendText = !!input.trim() && !loading && !!chatId;

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          e.currentTarget.value = "";
          handleSendImage(f);
        }}
      />

      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir chatbot"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "56px",
            height: "56px",
            zIndex: 9999,
            border: "none",
            outline: "none",
          }}
          className="bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <Image src="/assets/LogoChat/logoChat.png" alt="Chatbot" width={80} height={80} className="object-contain" priority />
        </button>
      )}

      {open && (
        <div
          style={{
            position: "fixed",
            zIndex: 9999,
            borderRadius: 24,
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 18px 50px rgba(0,0,0,0.12)",
          }}
          className="
            flex flex-col
            w-[calc(100vw-32px)] h-[calc(100vh-120px)]
            bottom-[96px] right-4
            sm:w-[460px] sm:h-[720px] sm:bottom-[88px] sm:right-6
            lg:w-[512px] lg:h-[768px]
            max-w-[560px]
            rounded-[24px]
          "
        >
          {/* HEADER */}
          <div
            style={{
              height: 48,
              padding: "0 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                aria-label="Nuevo chat"
                title="Nuevo chat"
                onClick={handleNewChat}
                disabled={loading}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  border: "none",
                  background: "transparent",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
                className="hover:bg-black/5 flex items-center justify-center"
              >
                <Plus className="h-5 w-5 text-black/70" />
              </button>

              <button
                type="button"
                aria-label="Adjuntar imagen"
                title="Adjuntar imagen"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
                className="hover:bg-black/5 flex items-center justify-center"
                onClick={handlePickImage}
                disabled={loading}
              >
                <ImagePlus className="h-5 w-5 text-black/70" />
              </button>

              <button
                type="button"
                aria-label="Micrófono"
                title={recording ? "Enviar audio" : "Grabar audio"}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  border: "none",
                  background: "transparent",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
                className="hover:bg-black/5 flex items-center justify-center"
                onClick={handleMic}
                disabled={loading}
              >
                <Mic className="h-5 w-5" style={{ color: recording ? "#ef4444" : "rgba(0,0,0,0.7)" }} />
              </button>

              <button
                type="button"
                aria-label="Preferencias"
                title="Preferencias"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  border: "none",
                  background: "transparent",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
                className="hover:bg-black/5 flex items-center justify-center"
                onClick={() => setPrefsOpen(true)}
                disabled={loading || !chatId}
              >
                <SlidersHorizontal className="h-5 w-5 text-black/70" />
              </button>
            </div>

            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar chatbot"
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              className="hover:bg-black/5 flex items-center justify-center"
            >
              <X className="h-5 w-5 text-black/70" />
            </button>
          </div>

          <div style={{ height: 1, backgroundColor: "#E5E7EB", marginLeft: 16, marginRight: 16 }} />

          {/* BODY */}
          <div
            ref={bodyRef}
            style={{
              flex: 1,
              padding: "28px 24px",
              overflowY: "auto",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div>
              {messages.map((m) => {
                const isUser = m.role === "user";
                const isSystem = m.role === "system";
                const isModel = m.role === "model";

                const parts = splitParagraphs(m.text);
                const actionsToRender = m.actions ?? [];

                return (
                  <div key={m.id} style={{ marginBottom: 26 }}>
                    {isUser && (
                      <div style={{ display: "flex", justifyContent: "flex-end", flexDirection: "column" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <div
                            style={{
                              maxWidth: "62%",
                              padding: "10px 16px",
                              borderRadius: 999,
                              background: "#ECEDEF",
                              color: "#111",
                              fontSize: 13,
                              lineHeight: 1.6,
                              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {m.text}
                          </div>
                        </div>

                        {m.imageUrl && (
                          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                            <div
                              style={{
                                maxWidth: "62%",
                                borderRadius: 16,
                                overflow: "hidden",
                                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                              }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={m.imageUrl} alt="Imagen enviada" style={{ width: "100%", height: "auto", display: "block" }} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {!isUser && (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", justifyContent: "flex-start" }}>
                          <div
                            style={{
                              maxWidth: "84%",
                              padding: isSystem ? "10px 14px" : "14px 18px",
                              borderRadius: isSystem ? 16 : 22,
                              background: isSystem ? "rgba(0,0,0,0.05)" : "#F3F4F6",
                              color: isSystem ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.8)",
                              fontStyle: isSystem ? "italic" : "normal",
                              fontSize: 13,
                              lineHeight: 1.8,
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {parts.map((p, idx) => (
                              <p key={idx} style={{ marginBottom: idx === parts.length - 1 ? 0 : 12 }}>
                                {p}
                              </p>
                            ))}
                          </div>
                        </div>

                        {isModel && Array.isArray(m.recommendations) && m.recommendations.length > 0 && (
                          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                            {m.recommendations.slice(0, 6).map((r, idx) => (
                              <div
                                key={`${m.id}_rec_${idx}`}
                                style={{
                                  border: "1px solid rgba(0,0,0,0.12)",
                                  borderRadius: 16,
                                  padding: "10px 12px",
                                  background: "#fff",
                                  boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
                                  maxWidth: "84%",
                                }}
                              >
                                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{r.name}</div>
                                <div style={{ fontSize: 12, opacity: 0.8, lineHeight: 1.6 }}>{r.description}</div>

                                {Array.isArray(r.relevantData) && r.relevantData.length > 0 && (
                                  <ul style={{ marginTop: 8, paddingLeft: 16, fontSize: 12, opacity: 0.85 }}>
                                    {r.relevantData.slice(0, 4).map((d, i) => (
                                      <li key={i}>{d}</li>
                                    ))}
                                  </ul>
                                )}

                                {r.link && (
                                  <a href={r.link} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 8, fontSize: 12 }}>
                                    Ver más
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {isModel && actionsToRender.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14, paddingLeft: 6 }}>
                            {actionsToRender.slice(0, 8).map((a) => (
                              <button
                                key={a}
                                type="button"
                                onClick={() => sendAction(a)}
                                style={{
                                  padding: "8px 14px",
                                  borderRadius: 999,
                                  background: "#fff",
                                  border: "1px solid rgba(0,0,0,0.2)",
                                  fontSize: 11,
                                  color: "rgba(0,0,0,0.7)",
                                  boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
                                  cursor: "pointer",
                                }}
                              >
                                {ACTION_LABELS[a] ?? a}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {loading && <div className="text-[12px] text-black/50 mt-3">Escribiendo...</div>}
          </div>

          {/* INPUT */}
          <div style={{ padding: "10px 16px 16px", backgroundColor: "#FFFFFF" }}>
            <div
              style={{
                height: 48,
                borderRadius: 999,
                backgroundColor: "#F3F4F6",
                padding: "0 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendText();
                  }
                }}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 13,
                  color: "#111",
                }}
              />

              <button
                type="button"
                aria-label="Enviar mensaje"
                onClick={sendText}
                disabled={!canSendText}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  border: "none",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.16)",
                  cursor: canSendText ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: canSendText ? 1 : 0.6,
                }}
              >
                <ArrowUp className="h-4 w-4 text-black" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PREFERENCIAS */}
      {prefsOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => !savingPrefs && setPrefsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 520,
              maxWidth: "100%",
              borderRadius: 18,
              background: "#fff",
              boxShadow: "0 18px 50px rgba(0,0,0,0.20)",
              overflow: "hidden",
            }}
          >
            {/* header modal */}
            <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700 }}>Preferencias del chat</div>

              <button
                type="button"
                onClick={() => !savingPrefs && setPrefsOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  border: "none",
                  background: "transparent",
                  cursor: savingPrefs ? "not-allowed" : "pointer",
                  opacity: savingPrefs ? 0.6 : 1,
                }}
                className="hover:bg-black/5 flex items-center justify-center"
              >
                <X className="h-5 w-5 text-black/70" />
              </button>
            </div>

            <div style={{ height: 1, background: "#E5E7EB" }} />

            <div style={{ padding: 16, display: "grid", gap: 12 }}>
              {/* si está logueado, permite guardar en perfil */}
              {isLoggedIn() && (
                <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13 }}>
                  <input type="checkbox" checked={prefsUserMode} onChange={(e) => setPrefsUserMode(e.target.checked)} />
                  Guardar en mi perfil (para próximas sesiones)
                </label>
              )}

              {/* campos solo si NO guardas en perfil (guest/chat) */}
              {!(isLoggedIn() && prefsUserMode) && (
                <>
                  <input
                    placeholder="Profesión / Rol (ej: estudiante, turista, fotógrafo...)"
                    value={prefs.jobTitle}
                    onChange={(e) => setPrefs((p) => ({ ...p, jobTitle: e.target.value }))}
                    style={{ height: 42, borderRadius: 12, border: "1px solid #E5E7EB", padding: "0 12px", fontSize: 13 }}
                  />
                  <input
                    placeholder="Comidas favoritas (ej: ceviche, lomo saltado...)"
                    value={prefs.favoriteFoods}
                    onChange={(e) => setPrefs((p) => ({ ...p, favoriteFoods: e.target.value }))}
                    style={{ height: 42, borderRadius: 12, border: "1px solid #E5E7EB", padding: "0 12px", fontSize: 13 }}
                  />
                  <input
                    placeholder="Consideraciones médicas (opcional)"
                    value={prefs.medicalConsiderations}
                    onChange={(e) => setPrefs((p) => ({ ...p, medicalConsiderations: e.target.value }))}
                    style={{ height: 42, borderRadius: 12, border: "1px solid #E5E7EB", padding: "0 12px", fontSize: 13 }}
                  />
                  <input
                    placeholder="Dato curioso (opcional)"
                    value={prefs.funFact}
                    onChange={(e) => setPrefs((p) => ({ ...p, funFact: e.target.value }))}
                    style={{ height: 42, borderRadius: 12, border: "1px solid #E5E7EB", padding: "0 12px", fontSize: 13 }}
                  />
                </>
              )}

              {/* Voice tones */}
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Tono de voz</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {Object.values(VoiceToneEnum).map((tone) => (
                    <label key={tone} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
                      <input
                        type="checkbox"
                        checked={prefs.voiceTones.includes(tone)}
                        onChange={() =>
                          setPrefs((p) => ({
                            ...p,
                            voiceTones: toggleInArray(p.voiceTones, tone),
                          }))
                        }
                      />
                      {VOICE_TONE_LABELS[tone]}
                    </label>
                  ))}
                </div>
              </div>

              {/* Perspective */}
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Perspectiva</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {Object.values(ProfessionalViewEnum).map((pv) => (
                    <label key={pv} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
                      <input
                        type="checkbox"
                        checked={prefs.perspectives.includes(pv)}
                        onChange={() =>
                          setPrefs((p) => ({
                            ...p,
                            perspectives: toggleInArray(p.perspectives, pv),
                          }))
                        }
                      />
                      {PERSPECTIVE_LABELS[pv]}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: "#E5E7EB" }} />

            {/* footer modal */}
            <div style={{ padding: 16, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => !savingPrefs && setPrefsOpen(false)}
                disabled={savingPrefs}
                style={{
                  height: 40,
                  padding: "0 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.15)",
                  background: "#fff",
                  cursor: savingPrefs ? "not-allowed" : "pointer",
                  opacity: savingPrefs ? 0.7 : 1,
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSavePreferences}
                disabled={savingPrefs || !chatId}
                style={{
                  height: 40,
                  padding: "0 14px",
                  borderRadius: 12,
                  border: "none",
                  background: "#111",
                  color: "#fff",
                  cursor: savingPrefs ? "not-allowed" : "pointer",
                  opacity: savingPrefs ? 0.7 : 1,
                }}
              >
                {savingPrefs ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
