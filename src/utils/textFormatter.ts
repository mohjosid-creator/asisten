/**
 * Membersihkan tanda Markdown (# dan *) dan memastikan struktur jawaban
 * tersusun rapi dengan penomoran profesional.
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

  // Hilangkan sisa karakter # atau * yang masih tersisa
  text = text.replace(/[*#]/g, "");

  // Ubah bullet list (- atau •) menjadi penomoran berurutan per blok
  const lines = text.split("\n");
  const outputLines: string[] = [];
  let bulletCounter = 0;

  for (const line of lines) {
    const bulletMatch = line.match(/^(\s*)[•\-]\s+(.*)$/);
    if (bulletMatch) {
      bulletCounter += 1;
      const indent = bulletMatch[1].length >= 2 ? "   " : "";
      outputLines.push(`${indent}${bulletCounter}. ${bulletMatch[2].trim()}`);
    } else {
      if (line.trim() === "") {
        bulletCounter = 0;
      } else if (/^\d+\.\s+/.test(line.trim())) {
        bulletCounter = 0;
      }
      outputLines.push(line);
    }
  }

  return outputLines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
