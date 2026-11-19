/**
 * Memformat teks jawaban agar rapi sesuai standar penulisan profesional Bahasa Indonesia:
 * - Menghapus simbol Markdown mentah (# dan *)
 * - Menggabungkan paragraf, penomoran untuk poin/langkah utama, serta poin (•) untuk rincian penting
 */
export function formatProfessionalNumberedText(raw: string): string {
  if (!raw) return "";

  let text = raw.replace(/\r\n/g, "\n");

  // Hilangkan pagar heading Markdown (#, ##, ###, dst.) di awal baris
  text = text.replace(/^\s*#{1,6}\s+/gm, "");

  // Hilangkan tanda bold/italic bintang (**teks**, *teks*, ***teks***)
  text = text.replace(/\*\*\*([^*\n]+)\*\*\*/g, "$1");
  text = text.replace(/\*\*([^*\n]+)\*\*/g, "$1");
  text = text.replace(/\*([^*\n]+)\*/g, "$1");

  // Ubah bullet list markdown (- atau *) di awal baris menjadi poin tipografi yang bersih (•)
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
