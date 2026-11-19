import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const MODEL_NAME = "gemini-4-hydrogen";

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function formatProfessionalResponse(raw: string): string {
  if (!raw) return "";

  let text = raw.replace(/\r\n/g, "\n");
  text = text.replace(/^\s*#{1,6}\s+/gm, "");
  text = text.replace(/\*\*\*([^*\n]+)\*\*\*/g, "$1");
  text = text.replace(/\*\*([^*\n]+)\*\*/g, "$1");
  text = text.replace(/\*([^*\n]+)\*/g, "$1");

  const lines = text.split("\n");
  const outputLines: string[] = [];

  for (const line of lines) {
    const bulletMatch = line.match(/^(\s*)[*\-•]\s+(.*)$/);
    if (bulletMatch) {
      const indent = bulletMatch[1].length >= 2 ? "   " : "";
      const cleanBody = bulletMatch[2].replace(/[*#]/g, "").trim();
      outputLines.push(`${indent}• ${cleanBody}`);
    } else {
      outputLines.push(line.replace(/[*#]/g, ""));
    }
  }

  return outputLines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

const PROFESSIONAL_FORMAT_RULE = `ATURAN PENULISAN PROFESIONAL BAHASA INDONESIA:
1. Susun jawaban secara rapi dan alami mengikuti standar penulisan profesional Bahasa Indonesia (EYD/PUEBI): awali dengan pengantar atau ringkasan singkat yang lugas jika relevan.
2. Gunakan penomoran (1., 2., 3.) khusus untuk langkah berurutan, prosedur, atau pokok bahasan utama, serta gunakan poin (•) hanya untuk merinci bagian penting atau sub-poin pendukung—jangan memaksakan penomoran pada setiap kalimat.
3. DILARANG menggunakan tanda pagar (#, ##, ###) dan tanda bintang (*, **, ***) di mana pun dalam jawaban.`;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "2mb" }));

  app.get("/api/health", (_req, res) => {
    const client = getGeminiClient();
    res.json({
      ok: true,
      configured: Boolean(client),
      model: MODEL_NAME,
      provider: "server-side",
      language: "id-ID",
      assistant: "SISTER",
    });
  });

  app.post("/api/chat", async (req, res) => {
    const client = getGeminiClient();
    if (!client) {
      return res.status(503).json({
        error:
          "Kunci API server belum dikonfigurasi. Periksa panel Settings > Secrets untuk mengaktifkan mode online.",
      });
    }

    try {
      const {
        messages = [],
        skillPrompt = "",
        memories = [],
        attachedDocs = [],
        activeDomains = [],
        userName = "Pengguna",
      } = req.body ?? {};

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Pesan tidak boleh kosong." });
      }

      const contextBlocks: string[] = [];

      if (Array.isArray(activeDomains) && activeDomains.length > 0) {
        const domainText = activeDomains
          .map(
            (d: { name?: string; orchestrationFocus?: string; repos?: string[] }) =>
              `- ${d.name ?? "Bidang"}: ${d.orchestrationFocus ?? ""} (Modul: ${(d.repos ?? []).join(", ")})`
          )
          .join("\n");
        contextBlocks.push(`BIDANG KEMAMPUAN NEURO-ORKESTRATOR AKTIF:\n${domainText}`);
      }

      if (Array.isArray(memories) && memories.length > 0) {
        const memText = memories
          .map(
            (m: { title?: string; content?: string; source?: string }) =>
              `- [${m.title ?? "Memori"}] ${m.content ?? ""} (Sumber: ${m.source ?? "Lokal"})`
          )
          .join("\n");
        contextBlocks.push(`MEMORI TERSIMPAN PENGGUNA:\n${memText}`);
      }

      if (Array.isArray(attachedDocs) && attachedDocs.length > 0) {
        const docText = attachedDocs
          .map(
            (d: { title?: string; content?: string; hash?: string }) =>
              `--- Dokumen: ${d.title ?? "Tanpa Judul"} (Hash: ${d.hash ?? "-"}) ---\n${(d.content ?? "").slice(0, 6000)}`
          )
          .join("\n\n");
        contextBlocks.push(`DOKUMEN TERLAMPIR:\n${docText}`);
      }

      const systemInstruction = [
        `Anda adalah SISTER, asisten pribadi cerdas berbahasa Indonesia yang dilengkapi kemampuan orkestrator multi-bidang.`,
        `Nama pengguna saat ini: ${userName}.`,
        `Selalu jawab dalam Bahasa Indonesia yang jelas, profesional, santun, dan langsung dapat ditindaklanjuti.`,
        PROFESSIONAL_FORMAT_RULE,
        `Jika dokumen atau memori terlampir diberikan, rujuk fakta dari sumber tersebut secara akurat dan sebutkan nama dokumennya.`,
        skillPrompt ? `Instruksi Skill Aktif: ${skillPrompt}` : "",
        contextBlocks.length > 0 ? contextBlocks.join("\n\n") : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      const formattedConversation = messages
        .slice(-12)
        .map((m: { role?: string; content?: string }) =>
          `${m.role === "assistant" ? "SISTER" : "Pengguna"}: ${m.content ?? ""}`
        )
        .join("\n\n");

      const response = await client.models.generateContent({
        model: MODEL_NAME,
        contents: formattedConversation,
        config: {
          systemInstruction,
        },
      });

      const rawReply = response.text?.trim();
      if (!rawReply) {
        return res.status(502).json({
          error: "Model tidak mengembalikan teks jawaban. Silakan coba lagi.",
        });
      }

      return res.json({ reply: formatProfessionalResponse(rawReply) });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan server.";
      return res.status(500).json({
        error: `Gagal memproses percakapan: ${message}`,
      });
    }
  });

  app.post("/api/neuro-orchestrate", async (req, res) => {
    const client = getGeminiClient();
    if (!client) {
      return res.status(503).json({
        error:
          "Kunci API server belum dikonfigurasi. Beralih ke Mode Offline untuk menjalankan orkestrator lokal, atau periksa panel Settings > Secrets.",
      });
    }

    try {
      const { goal = "", domains = [], tasks = [] } = req.body ?? {};
      if (!String(goal).trim()) {
        return res.status(400).json({ error: "Tujuan atau perintah orkestrasi tidak boleh kosong." });
      }

      const domainCatalog = Array.isArray(domains)
        ? domains
            .map(
              (d: { name?: string; orchestrationFocus?: string; repos?: { repo: string; roleInJarvis: string }[] }) =>
                `Bidang: ${d.name}\nFokus: ${d.orchestrationFocus}\nRepositori:\n${(d.repos ?? [])
                  .map((r) => `  - ${r.repo}: ${r.roleInJarvis}`)
                  .join("\n")}`
            )
            .join("\n\n")
        : "";

      const taskBlock =
        Array.isArray(tasks) && tasks.length > 0
          ? tasks
              .map(
                (t: { title?: string; priority?: string; dueDate?: string; completed?: boolean }) =>
                  `- [${t.completed ? "Selesai" : "Belum"}] ${t.title} (Prioritas: ${t.priority}, Tenggat: ${t.dueDate})`
              )
              .join("\n")
          : "Tidak ada tugas tambahan.";

      const response = await client.models.generateContent({
        model: MODEL_NAME,
        contents: `Tujuan / Permintaan Orkestrasi:\n${goal}\n\nBidang & Repositori Neuro Tersedia:\n${domainCatalog}\n\nTugas Pengguna Saat Ini:\n${taskBlock}`,
        config: {
          systemInstruction: [
            `Anda adalah Mesin Neuro-Orkestrator SISTER berbahasa Indonesia.`,
            `Tugas Anda adalah memecah tujuan pengguna menjadi rencana eksekusi terstruktur, memisahkan langkah sesuai bidang keahlian repositori yang paling relevan, dan menyertakan perintah CLI/PowerShell nyata (misalnya gh repo clone <owner/repo> atau perintah konfigurasi yang dibutuhkan).`,
            PROFESSIONAL_FORMAT_RULE,
          ].join("\n\n"),
        },
      });

      const rawPlan = response.text?.trim();
      if (!rawPlan) {
        return res.status(502).json({ error: "Model tidak mengembalikan hasil orkestrasi." });
      }

      return res.json({ result: formatProfessionalResponse(rawPlan) });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Kesalahan internal.";
      return res.status(500).json({
        error: `Gagal melakukan orkestrasi neuro: ${message}`,
      });
    }
  });

  app.post("/api/draft", async (req, res) => {
    const client = getGeminiClient();
    if (!client) {
      return res.status(503).json({
        error:
          "Kunci API server belum dikonfigurasi. Periksa panel Settings > Secrets untuk membuat draf otomatis.",
      });
    }

    try {
      const {
        kind = "email",
        brief = "",
        inputText = "",
        styleProfile = "",
        samples = [],
        attachedDocs = [],
        wordTarget = "350",
        outline = "",
      } = req.body ?? {};

      if (!String(brief).trim()) {
        return res.status(400).json({ error: "Instruksi penulisan (brief) harus diisi." });
      }

      const kindLabels: Record<string, string> = {
        email: "Email Profesional",
        teks: "Teks / Pesan Singkat",
        jawaban: "Jawaban Berbasis Sumber",
        esai: "Esai Terstruktur",
      };

      const sourceBlock =
        Array.isArray(attachedDocs) && attachedDocs.length > 0
          ? attachedDocs
              .map(
                (d: { title?: string; content?: string }) =>
                  `[Sumber: ${d.title ?? "Dokumen"}]\n${(d.content ?? "").slice(0, 4000)}`
              )
              .join("\n\n")
          : "Tidak ada dokumen sumber terlampir.";

      const sampleBlock =
        Array.isArray(samples) && samples.length > 0
          ? samples
              .map((s: { name?: string; text?: string }) => `Contoh (${s.name ?? "Gaya"}):\n${s.text ?? ""}`)
              .join("\n\n")
          : "";

      const systemInstruction = [
        `Anda adalah penulis draf SISTER dalam Bahasa Indonesia.`,
        `Jenis Draf: ${kindLabels[kind] ?? "Teks"}.`,
        styleProfile ? `Profil Gaya Penulisan:\n${styleProfile}` : "",
        sampleBlock ? `Contoh Gaya Penulis Pengguna:\n${sampleBlock}` : "",
        kind === "esai" && outline ? `Kerangka yang diminta:\n${outline}` : "",
        kind === "esai" ? `Target panjang sekitar ${wordTarget} kata.` : "",
        `Aturan ketat: Tulis dalam Bahasa Indonesia yang natural dan rapi sesuai kaidah penulisan standar tanpa simbol markdown # atau *. Jika ada sumber terlampir, pertahankan semua angka, tanggal, dan fakta dari sumber secara akurat. Untuk format email, sertakan baris "Subjek: ..." di awal.`,
      ]
        .filter(Boolean)
        .join("\n\n");

      const prompt = [
        `Instruksi Penulisan:\n${brief}`,
        inputText ? `Pesan / Konteks Masuk:\n${inputText}` : "",
        `Dokumen Sumber:\n${sourceBlock}`,
      ]
        .filter(Boolean)
        .join("\n\n");

      const response = await client.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      const content = response.text?.trim();
      if (!content) {
        return res.status(502).json({
          error: "Model tidak menghasilkan teks draf. Silakan coba lagi.",
        });
      }

      return res.json({ content: formatProfessionalResponse(content) });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Kesalahan internal.";
      return res.status(500).json({
        error: `Gagal membuat draf: ${message}`,
      });
    }
  });

  app.post("/api/plan", async (req, res) => {
    const client = getGeminiClient();
    if (!client) {
      return res.status(503).json({
        error:
          "Kunci API server belum dikonfigurasi. Periksa panel Settings > Secrets untuk menyusun rencana harian.",
      });
    }

    try {
      const { tasks = [], focusMinutes = 90, note = "" } = req.body ?? {};
      if (!Array.isArray(tasks) || tasks.length === 0) {
        return res.status(400).json({ error: "Tambahkan minimal satu tugas terlebih dahulu." });
      }

      const taskList = tasks
        .map(
          (t: { title?: string; priority?: string; dueDate?: string; completed?: boolean }) =>
            `- [${t.completed ? "Selesai" : "Belum"}] ${t.title} (Prioritas: ${t.priority ?? "sedang"}, Tenggat: ${t.dueDate || "Fleksibel"})`
        )
        .join("\n");

      const response = await client.models.generateContent({
        model: MODEL_NAME,
        contents: `Daftar Tugas Saat Ini:\n${taskList}\n\nDurasi Blok Fokus Tersedia: ${focusMinutes} menit\nCatatan Tambahan: ${note || "Tidak ada"}`,
        config: {
          systemInstruction: [
            "Anda adalah perencana produktivitas SISTER. Susun rencana kerja/harian yang realistis dalam Bahasa Indonesia, mengutamakan tugas yang belum selesai berdasarkan prioritas dan tenggat, dibagi ke dalam blok waktu yang jelas beserta jeda istirahat singkat.",
            PROFESSIONAL_FORMAT_RULE,
          ].join("\n\n"),
        },
      });

      const planText = response.text?.trim();
      if (!planText) {
        return res.status(502).json({ error: "Model tidak mengembalikan rencana." });
      }

      return res.json({ planText: formatProfessionalResponse(planText) });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Kesalahan internal.";
      return res.status(500).json({
        error: `Gagal menyusun rencana harian: ${message}`,
      });
    }
  });

  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      const indexFile = path.join(distPath, "index.html");
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send("Build produksi tidak ditemukan.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SISTER Asisten Lokal berjalan di http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Gagal menjalankan server:", err);
  process.exit(1);
});
