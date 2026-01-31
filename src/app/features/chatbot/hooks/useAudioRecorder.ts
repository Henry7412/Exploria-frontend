// ✅ src/app/features/chatbot/hooks/useAudioRecorder.ts
import { useCallback, useRef, useState } from "react";

export function useAudioRecorder() {
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const start = useCallback(async () => {
    if (recording) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const mimeType =
      MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";

    const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    mediaRecorderRef.current = mr;
    chunksRef.current = [];

    mr.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };

    mr.start();
    setRecording(true);
  }, [recording]);

  const stop = useCallback(async (): Promise<Blob | null> => {
    const mr = mediaRecorderRef.current;
    if (!mr) return null;

    return new Promise((resolve) => {
      mr.onstop = () => {
        setRecording(false);

        const blob = new Blob(chunksRef.current, {
          type: mr.mimeType || "audio/webm",
        });

        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        mediaRecorderRef.current = null;

        resolve(blob);
      };

      mr.stop();
    });
  }, []);

  const cancel = useCallback(() => {
    try {
      mediaRecorderRef.current?.stop();
    } catch {}

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setRecording(false);
  }, []);

  return { recording, start, stop, cancel };
}
