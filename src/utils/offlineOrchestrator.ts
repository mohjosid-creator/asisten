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
    `Ringkasan Pemrosesan Lokal SISTER (Mode Offline Penuh)`,
    `Permintaan "${query.trim()}" diproses sepenuhnya secara lokal melalui Mesin Neuro-Orkestrator SISTER tanpa koneksi internet.`,
    ``,
    `1. Bidang Keahlian Neuro yang Relevan`,
  ];

  matchedDomains.forEach((domain) => {
    const repoNames = domain.repos
      .slice(0, 3)
      .map((r) => r.repo)
      .join(", ");
    lines.push(
      `   • ${domain.name}: ${domain.orchestrationFocus} (Modul: ${repoNames})`
    );
  });

  lines.push(``);
  lines.push(`2. Konteks Lokal yang Ditemukan`);
  if (matchedDocs.length > 0 || matchedMemories.length > 0) {
    for (const d of matchedDocs.slice(0, 3)) {
      const snippet = d.content.split("\n")[0]?.slice(0, 140) ?? "";
      lines.push(`   • Dokumen ${d.title}: ${snippet}`);
    }
    for (const m of matchedMemories.slice(0, 3)) {
      lines.push(`   • Memori ${m.title}: ${m.content}`);
    }
  } else {
    lines.push(
      `   • Belum ditemukan catatan dokumen dengan kata kunci terkait; terdapat ${pendingTasks.length} tugas aktif pada daftar kerja Anda.`
    );
  }

  lines.push(``);
  lines.push(`3. Langkah Tindak Lanjut yang Disarankan`);
  const topDomain = matchedDomains[0];
  if (topDomain) {
    const primaryRepo = topDomain.repos[0];
    lines.push(
      `   1. Siapkan direktori kerja di Windows PowerShell untuk bidang ${topDomain.shortName}.`
    );
    lines.push(
      `   2. Jalankan perintah kloning modul utama: gh repo clone ${primaryRepo.repo}`
    );
    lines.push(
      `   3. Beralih ke Mode Online kapan saja jika memerlukan penjabaran analisis mendalam.`
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
    `Rencana Orkestrasi SISTER (Mode Offline Penuh)`,
    `Sasaran utama: ${goal.trim()}. SISTER memetakan ${domains.length} bidang keahlian prioritas untuk menyusun langkah kerja dan perintah eksekusi.`,
    ``,
    `1. Pembagian Kemampuan per Bidang`,
  ];

  domains.forEach((domain, idx) => {
    lines.push(`   ${idx + 1}. ${domain.name}`);
    lines.push(`      Fokus: ${domain.orchestrationFocus}`);
    domain.repos.slice(0, 3).forEach((repo) => {
      lines.push(
        `      • ${repo.name} (${repo.repo}): ${repo.roleInJarvis}`
      );
    });
  });

  lines.push(``);
  lines.push(`2. Urutan Perintah Siap Jalankan di PowerShell`);
  let cmdStep = 1;
  domains.forEach((domain) => {
    domain.repos.slice(0, 2).forEach((repo) => {
      lines.push(`   ${cmdStep}. gh repo clone ${repo.repo}`);
      cmdStep += 1;
    });
  });

  if (openTasks.length > 0) {
    lines.push(``);
    lines.push(`3. Keterkaitan dengan Tugas Aktif`);
    openTasks.forEach((t) => {
      lines.push(
        `   • ${t.title} (Prioritas ${t.priority}, Tenggat: ${t.dueDate})`
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
    `Rencana Harian SISTER (Mode Offline Penuh)`,
    `Alokasi blok fokus tersedia sebesar ${focusMinutes} menit dengan catatan kondisi: ${note || "Tidak ada catatan tambahan"}.`,
    ``,
    `1. Urutan Prioritas Tugas`,
  ];

  if (sorted.length === 0) {
    lines.push(
      `   • Seluruh tugas telah selesai. Anda dapat meninjau dokumen atau memperbarui memori proyek.`
    );
  } else {
    const perTask = Math.max(20, Math.floor(focusMinutes / sorted.length));
    sorted.forEach((t, idx) => {
      lines.push(
        `   ${idx + 1}. ${t.title} (Prioritas ${t.priority}, estimasi ${perTask} menit, tenggat: ${t.dueDate})`
      );
    });
  }

  lines.push(``);
  lines.push(`2. Catatan Ritme Kerja`);
  lines.push(`   • Terapkan sesi fokus 45 menit diikuti jeda istirahat 10 menit.`);
  lines.push(`   • Aktifkan Mode Fokus di SISTER agar pengingat berprioritas rendah ditunda sementara.`);

  return formatProfessionalNumberedText(lines.join("\n"));
}
