export interface VoiceOption {
  name: string;
  lang: string;
  localService: boolean;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionResultEvent {
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      0: { transcript: string };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

export function isGoogleSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  const win = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };
  return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
}

export function startGoogleIndonesianVoiceCommand(callbacks: {
  onInterim?: (text: string) => void;
  onFinal: (text: string) => void;
  onError: (message: string) => void;
  onEnd: () => void;
}): () => void {
  const win = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };

  const RecognitionCtor = win.SpeechRecognition || win.webkitSpeechRecognition;
  if (!RecognitionCtor) {
    callbacks.onError(
      "Browser Anda tidak mendukung Google Web Speech Recognition. Gunakan Chrome atau Edge saat mode online."
    );
    callbacks.onEnd();
    return () => {};
  }

  const recognition = new RecognitionCtor();
  recognition.lang = "id-ID";
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  let finalTranscript = "";

  recognition.onresult = (event) => {
    let interim = "";
    for (let i = 0; i < event.results.length; i += 1) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript;
      } else {
        interim += result[0].transcript;
      }
    }
    if (interim && callbacks.onInterim) {
      callbacks.onInterim(interim.trim());
    }
    if (finalTranscript.trim()) {
      callbacks.onFinal(finalTranscript.trim());
    }
  };

  recognition.onerror = (event) => {
    const errorMap: Record<string, string> = {
      "not-allowed": "Izin mikrofon ditolak. Aktifkan akses mikrofon pada browser.",
      "no-speech": "Tidak ada suara yang terdeteksi. Silakan bicara lebih dekat ke mikrofon.",
      network: "Koneksi Google Voice Speech terganggu. Periksa jaringan internet Anda.",
      aborted: "Perekaman suara dibatalkan.",
    };
    callbacks.onError(
      errorMap[event.error] ?? `Gangguan pengenalan suara (${event.error}).`
    );
  };

  recognition.onend = () => {
    callbacks.onEnd();
  };

  try {
    recognition.start();
  } catch (err) {
    callbacks.onError(
      err instanceof Error ? err.message : "Gagal memulai mikrofon perintah suara."
    );
    callbacks.onEnd();
  }

  return () => {
    try {
      recognition.stop();
    } catch {
      // Abaikan jika sudah berhenti
    }
  };
}

export function getIndonesianSpeechVoices(): VoiceOption[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }
  const voices = window.speechSynthesis.getVoices();
  const mapped = voices.map((v) => ({
    name: v.name,
    lang: v.lang,
    localService: v.localService,
  }));

  const indonesian = mapped.filter(
    (v) =>
      v.lang.toLowerCase().startsWith("id") ||
      v.name.toLowerCase().includes("indonesia")
  );
  return indonesian.length > 0 ? indonesian : mapped;
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function playOfflineAcousticCue(): void {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Abaikan jika audio context tidak tersedia
  }
}

export function speakIndonesianText(
  rawText: string,
  options?: {
    preferredVoiceName?: string;
    rate?: number;
    preferLocalOnly?: boolean;
    onStart?: () => void;
    onEnd?: () => void;
    onFallbackNotice?: (notice: string) => void;
  }
): void {
  const cleanText = rawText
    .replace(/[*#`]/g, "")
    .replace(/\n+/g, ". ")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (!cleanText) {
    options?.onEnd?.();
    return;
  }

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    playOfflineAcousticCue();
    options?.onFallbackNotice?.(
      "Browser ini belum mendukung SpeechSynthesis bawaan. Aktifkan paket suara Indonesia di Windows atau gunakan Google Chrome/Edge."
    );
    options?.onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();
  const voices = window.speechSynthesis.getVoices();

  const localIndonesian = voices.find(
    (v) =>
      v.localService &&
      (v.lang.toLowerCase().startsWith("id") ||
        v.name.toLowerCase().includes("indonesia"))
  );

  const anyIndonesian = voices.find(
    (v) =>
      v.lang.toLowerCase().startsWith("id") ||
      v.name.toLowerCase().includes("indonesia")
  );

  const preferred = options?.preferredVoiceName
    ? voices.find((v) => v.name === options.preferredVoiceName)
    : undefined;

  const chosenVoice = options?.preferLocalOnly
    ? preferred?.localService
      ? preferred
      : localIndonesian ?? anyIndonesian
    : preferred ?? anyIndonesian ?? voices[0];

  if (voices.length === 0) {
    playOfflineAcousticCue();
    options?.onFallbackNotice?.(
      "Suara TTS sistem belum terdeteksi di lingkungan browser ini. Di Windows 11, instal paket suara Bahasa Indonesia pada Settings > Time & language > Speech untuk suara offline penuh."
    );
    options?.onEnd?.();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = chosenVoice?.lang || "id-ID";
  if (chosenVoice) {
    utterance.voice = chosenVoice;
  }
  utterance.rate = options?.rate ?? 1.0;
  utterance.pitch = 1.0;

  if (options?.preferLocalOnly && chosenVoice && !chosenVoice.localService) {
    options?.onFallbackNotice?.(
      `Memakai suara ${chosenVoice.name}. Untuk suara offline murni di Windows 11, pasang paket suara lokal Bahasa Indonesia.`
    );
  }

  utterance.onstart = () => options?.onStart?.();
  utterance.onend = () => options?.onEnd?.();
  utterance.onerror = () => {
    playOfflineAcousticCue();
    options?.onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}
