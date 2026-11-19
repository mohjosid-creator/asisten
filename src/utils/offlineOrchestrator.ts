import { NEURO_DOMAINS, type NeuroDomain } from "../data/neuroReposData";
import type { LocalDocument, SavedMemory, TaskItem } from "../types/jarvis";
import { formatProfessionalNumberedText } from "./textFormatter";

export function matchNeuroDomains(query: string, activeDomainIds?: string[]): NeuroDomain[] {
  const pool =
    activeDomainIds && activeDomainIds.length > 0
      ? NEURO_DOMAINS.filter((d) => activeDomainIds.includes(d.id))
      : NEURO_DOMAINS;

  const q = query.toLowerCase();
  const scored = pool
    .map((domain) => {
      let score = 0;
      for (const kw of domain.keywords) {
        if (q.includes(kw)) score += 2;
      }
      for (const repo of domain.repos) {
        if (q.includes(repo.name.toLowerCase()) || q.includes(repo.repo.toLowerCase())) {
          score += 3;
        }
        for (const rkw of repo.keywords) {
          if (q.includes(rkw)) score += 1;
        }
      }
      return { domain, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    return scored.slice(0, 3).map((s) => s.domain);
  }
  return pool.slice(0, 2);
}

export function runOfflineChat(params: {
  query: string;
  documents: LocalDocument[];
  memories: SavedMemory[];
  tasks: TaskItem[];
  activeDomainIds: string[];
}): string {
  const { query, documents, memories, tasks, activeDomainIds } = params;
  const q = query.toLowerCase();
  const terms = q.split(/\s+/).filter((w) => w.length >= 3);

  const matchedDocs = documents.filter((doc) =>
    terms.some(
      (t) =>
        doc.title.toLowerCase().includes(t) ||
        doc.content.toLowerCase().includes(t)
    )
  );

  const matchedMemories = memories.filter((mem) =>
    terms.some(
      (t) =>
        mem.title.toLowerCase().includes(t) ||
        mem.content.toLowerCase().includes(t)
    )
  );

  const matchedDomains = matchNeuroDomains(query, activeDomainIds);
  const pendingTasks = tasks.filter((t) => !t.completed);

  const lines: string[] = [
    `1. Ringkasan Pemrosesan Lokal (Mode Offline Penuh)`,
    `   1.1 Permintaan Anda: "${query.trim()}"`,
    `   1.2 Status mesin: Berjalan 100% offline menggunakan Mesin Neuro-Orkestrator Lokal tanpa koneksi internet.`,
    ``,
    `2. Analisis Bidang Keahlian Neuro yang Terpilih`,
  ];

  matchedDomains.forEach((domain, idx) => {
    const repoNames = domain.repos
      .slice(0, 3)
      .map((r) => r.repo)
      .join(", ");
    lines.push(
      `   2.${idx + 1} Bidang ${domain.name}: ${domain.orchestrationFocus} Modul relevan: ${repoNames}.`
    );
  });

  lines.push(``);
  lines.push(`3. Temuan Konteks Lokal Anda`);
  if (matchedDocs.length > 0 || matchedMemories.length > 0) {
    let refIndex = 1;
    for (const d of matchedDocs.slice(0, 3)) {
      const snippet = d.content.split("\n")[0]?.slice(0, 140) ?? "";
      lines.push(`   3.${refIndex} Dokumen ${d.title}: ${snippet}`);
      refIndex += 1;
    }
    for (const m of matchedMemories.slice(0, 3)) {
      lines.push(`   3.${refIndex} Memori ${m.title}: ${m.content}`);
      refIndex += 1;
    }
  } else {
    lines.push(
      `   3.1 Belum ada catatan dokumen yang memuat kata kunci spesifik tersebut. Anda dapat menambahkannya di menu Dokumen dan Memori.`
    );
    lines.push(
      `   3.2 Tugas aktif yang tercatat saat ini berjumlah ${pendingTasks.length} item.`
    );
  }

  lines.push(``);
  lines.push(`4. Rencana Tindakan dan Perintah yang Disarankan`);
  const topDomain = matchedDomains[0];
  if (topDomain) {
    const primaryRepo = topDomain.repos[0];
    lines.push(
      `   4.1 Tentukan ruang kerja target di Windows PowerShell lalu siapkan modul bidang ${topDomain.shortName}.`
    );
    lines.push(
      `   4.2 Perintah kloning modul utama: gh repo clone ${primaryRepo.repo}`
    );
    lines.push(
      `   4.3 Aktifkan mode online apabila Anda ingin menjabarkan analisis generatif lebih dalam menggunakan model AI cloud.`
    );
  }

  return formatProfessionalNumberedText(lines.join("\n"));
}

export function runOfflineOrchestration(params: {
  goal: string;
  selectedDomainIds: string[];
  tasks: TaskItem[];
}): string {
  const { goal, selectedDomainIds, tasks } = params;
  const domains = matchNeuroDomains(goal, selectedDomainIds);
  const openTasks = tasks.filter((t) => !t.completed).slice(0, 4);

  const lines: string[] = [
    `1. Tujuan Orkestrasi Tugas (Mode Offline Penuh)`,
    `   1.1 Sasaran utama: ${goal.trim()}`,
    `   1.2 Jumlah bidang neuro aktif: ${domains.length} bidang prioritas.`,
    ``,
    `2. Pembagian Tugas per Bidang Keahlian`,
  ];

  domains.forEach((domain, idx) => {
    const num = idx + 1;
    lines.push(`   2.${num} ${domain.name}`);
    lines.push(`       Fokus eksekusi: ${domain.orchestrationFocus}`);
    domain.repos.slice(0, 3).forEach((repo, rIdx) => {
      lines.push(
        `       Langkah 2.${num}.${rIdx + 1}: Gunakan ${repo.name} (${repo.repo}) untuk ${repo.roleInJarvis}`
      );
    });
  });

  lines.push(``);
  lines.push(`3. Daftar Perintah Siap Jalankan di PowerShell`);
  let cmdStep = 1;
  domains.forEach((domain) => {
    domain.repos.slice(0, 2).forEach((repo) => {
      lines.push(`   3.${cmdStep} gh repo clone ${repo.repo}`);
      cmdStep += 1;
    });
  });

  if (openTasks.length > 0) {
    lines.push(``);
    lines.push(`4. Sinkronisasi dengan Tugas Aktif Anda`);
    openTasks.forEach((t, idx) => {
      lines.push(
        `   4.${idx + 1} ${t.title} (Prioritas ${t.priority}, Tenggat: ${t.dueDate})`
      );
    });
  }

  return formatProfessionalNumberedText(lines.join("\n"));
}

export function runOfflineDailyPlan(params: {
  tasks: TaskItem[];
  focusMinutes: number;
  note: string;
}): string {
  const { tasks, focusMinutes, note } = params;
  const openTasks = tasks.filter((t) => !t.completed);
  const priorityOrder = { tinggi: 0, sedang: 1, rendah: 2 };
  const sorted = [...openTasks].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  const lines: string[] = [
    `1. Rencana Harian Lokal (Mode Offline Penuh)`,
    `   1.1 Total blok fokus tersedia: ${focusMinutes} menit.`,
    `   1.2 Catatan kondisi hari ini: ${note || "Tidak ada catatan tambahan"}.`,
    ``,
    `2. Urutan Eksekusi Tugas Berdasarkan Prioritas`,
  ];

  if (sorted.length === 0) {
    lines.push(`   2.1 Seluruh tugas sudah selesai. Gunakan waktu untuk meninjau memori atau dokumentasi.`);
  } else {
    const perTask = Math.max(20, Math.floor(focusMinutes / sorted.length));
    sorted.forEach((t, idx) => {
      lines.push(
        `   2.${idx + 1} ${t.title} (Prioritas ${t.priority}, estimasi ${perTask} menit, tenggat: ${t.dueDate})`
      );
    });
  }

  lines.push(``);
  lines.push(`3. Rekomendasi Ritme Kerja`);
  lines.push(`   3.1 Terapkan blok fokus 45 menit kerja diikuti jeda istirahat 10 menit.`);
  lines.push(`   3.2 Aktifkan Mode Fokus di Jarvis agar tugas berprioritas rendah ditunda sementara.`);

  return formatProfessionalNumberedText(lines.join("\n"));
}
