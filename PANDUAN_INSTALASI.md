# Panduan Instalasi Jarvis Local Assistant (Bahasa Indonesia)

Panduan ini menjelaskan cara mengunduh, menginstal, dan menjalankan repositori **`mschr703/jarvis-local-assistant`** di laptop atau PC Windows 11 secara lokal dan privat.

Secara default, Jarvis berjalan **100% lokal** di komputer Anda menggunakan **Ollama** (`qwen3:4b-instruct`), tanpa memerlukan kunci API berbayar. Semua data, riwayat chat, memori, dan indeks dokumen disimpan secara lokal di folder `%LOCALAPPDATA%\JarvisLocal`.

---

## 1. Persyaratan Sistem & Aplikasi

Pastikan komputer Windows Anda sudah memenuhi syarat berikut sebelum memulai:

1. **Sistem Operasi**: Windows 11 (disarankan).
2. **Ruang Penyimpanan Kosong**: Minimal **3–5 GB** ruang kosong (untuk model lokal `qwen3:4b-instruct` dan dependensi).
3. **Git** atau **GitHub CLI (`gh`)**:
   - Git untuk Windows: https://git-scm.com/download/win
   - GitHub CLI (opsional, jika memakai `gh repo clone`): https://cli.github.com/
4. **Python 3.13 atau lebih baru**: https://www.python.org/downloads/windows/
   *(Saat instalasi Python, centang opsi **"Add Python to PATH"**).*
5. **uv (Manajer Paket Python Cepat)**: https://docs.astral.sh/uv/getting-started/installation/
   Atau instal lewat PowerShell:
   ```powershell
   powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```
6. **Node.js versi 24+**: https://nodejs.org/en/download
7. **pnpm versi 11+**: https://pnpm.io/installation
   Atau aktifkan lewat PowerShell:
   ```powershell
   corepack enable
   corepack prepare pnpm@latest --activate
   ```
8. **Ollama untuk Windows**: https://ollama.com/download/windows
9. **Microsoft Edge**: Digunakan oleh alat browser Playwright (Jarvis memakai profil terpisah di `%LOCALAPPDATA%\JarvisLocal\browser-profile`).

---

## 2. Langkah Instalasi Utama

Buka **Windows PowerShell** (atau Terminal Windows), lalu jalankan langkah-langkah berikut secara berurutan.

### Langkah 1: Kloning Repositori
Pilih salah satu perintah berikut:

Menggunakan **GitHub CLI (`gh`)**:
```powershell
gh repo clone mschr703/jarvis-local-assistant
Set-Location jarvis-local-assistant
```

Atau menggunakan **Git biasa**:
```powershell
git clone https://github.com/mschr703/jarvis-local-assistant.git
Set-Location jarvis-local-assistant
```

### Langkah 2: Jalankan Skrip Instalasi Otomatis
Skrip `setup.ps1` akan memeriksa seluruh versi aplikasi yang dibutuhkan, membuat file `.env` dari `.env.example`, menginstal dependensi backend & frontend, serta mengunduh model Ollama `qwen3:4b-instruct`.

```powershell
.\scripts\setup.ps1
```

> **Opsional (Pencarian Semantik / Makna):**
> Jika Anda ingin mengaktifkan pencarian berbasis makna (*semantic search*) selain pencarian kata kunci, gunakan parameter `-IncludeSearchModel` agar skrip juga mengunduh model `embeddinggemma:300m`:
> ```powershell
> .\scripts\setup.ps1 -IncludeSearchModel
> ```

> **Jika Skrip PowerShell Diblokir (`ExecutionPolicy`):**
> Jalankan perintah ini sekali untuk sesi PowerShell saat ini, lalu ulangi `.\scripts\setup.ps1`:
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> ```

#### Alternatif Langkah Manual (Jika Tidak Menggunakan `setup.ps1`)
```powershell
Copy-Item .env.example .env
python -m uv sync --project backend
pnpm --dir frontend install --frozen-lockfile
ollama pull qwen3:4b-instruct
```

---

## 3. Pengaturan File `.env` (Opsional tapi Disarankan)

Setelah `setup.ps1` selesai, file `.env` akan dibuat di folder utama proyek. Anda bisa membukanya dengan Notepad dan menyesuaikan zona waktu agar sesuai dengan lokasi Anda di Indonesia:

```env
JARVIS_TIMEZONE=Asia/Jakarta
JARVIS_PROVIDER=ollama
JARVIS_OLLAMA_URL=http://127.0.0.1:11434
JARVIS_OLLAMA_MODEL=qwen3:4b-instruct
JARVIS_HOTKEY=CTRL+ALT+J
```

- Gunakan `Asia/Jakarta` (WIB), `Asia/Makassar` (WITA), atau `Asia/Jayapura` (WIT).
- Biarkan `JARVIS_PROVIDER=ollama` jika Anda ingin memakai model lokal gratis tanpa API key.
- Jika `CTRL+ALT+J` bentrok dengan aplikasi lain di Windows, ubah ke kombinasi lain seperti `CTRL+SHIFT+J`.

---

## 4. Pemeriksaan Kesehatan Sistem (`doctor.py`)

Sebelum menjalankan Jarvis untuk pertama kali, pastikan seluruh komponen sudah siap dengan menjalankan:

```powershell
python scripts/doctor.py
```

Jika semua persyaratan wajib tercentang hijau/siap dan Ollama berjalan di `127.0.0.1:11434`, Anda siap menjalankan Jarvis.

---

## 5. Menjalankan & Menghentikan Jarvis

### Menjalankan Aplikasi
Pastikan aplikasi **Ollama** sudah berjalan di latar belakang, lalu jalankan:

```powershell
python scripts/dev.py
```

Setelah server siap, buka browser dan kunjungi:
- **Antarmuka Web Jarvis**: `http://127.0.0.1:5173`
- **Cek Kesehatan API Backend**: `http://127.0.0.1:8765/health`

### Menghentikan Aplikasi
Tekan `Ctrl + C` di jendela terminal tempat `dev.py` berjalan.
Jika ada proses yang masih tertinggal di latar belakang, jalankan skrip penghenti aman:

```powershell
.\scripts\stop.ps1
```

---

## 6. Fitur Tambahan (Opsional)

### A. OCR Lokal untuk PDF Hasil Scan (Tesseract 5)
Jika Anda ingin Jarvis membaca teks dari file PDF yang berupa gambar/scan:
1. Instal Tesseract 5:
   ```powershell
   winget install --id tesseract-ocr.tesseract -e
   ```
2. Buka PowerShell baru, lalu pasang data bahasa untuk OCR:
   ```powershell
   .\scripts\setup_ocr_languages.ps1
   tesseract --list-langs
   ```

### B. Asisten Suara Lokal (Whisper & LiveKit)
Untuk mengaktifkan transkripsi suara secara lokal:
```powershell
python -m uv sync --project integrations/livekit --python 3.13
```

---

## 7. Pemecahan Masalah Umum (Troubleshooting)

1. **Perintah `ollama` tidak dikenali di PowerShell**
   Tutup PowerShell dan buka jendela baru, atau jalankan langsung:
   ```powershell
   & "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe" pull qwen3:4b-instruct
   ```
2. **Perintah `uv` tidak ditemukan saat memakai `python -m uv`**
   Jika Anda menginstal `uv` sebagai program terpisah (*standalone*), cukup ganti `python -m uv` dengan `uv` langsung, misalnya `uv sync --project backend --frozen`.
3. **Antarmuka menampilkan status model belum siap saat pertama dibuka**
   Tunggu beberapa detik hingga Ollama selesai memuat `qwen3:4b-instruct`, lalu klik tombol cek status ulang di halaman Ringkasan.

---

## 8. Pengaturan Voice TTS Offline Bahasa Indonesia & Modul Neuro-Orkestrator

### A. Mengaktifkan Voice TTS Offline Bahasa Indonesia di Windows 11
1. Buka **Settings** Windows 11, masuk ke **Time & language** lalu pilih **Speech**.
2. Pada bagian **Manage voices**, klik **Add voices**.
3. Cari **Indonesian (Indonesia)**, klik **Add**, dan tunggu instalasi paket suara selesai.
4. Setelah terpasang, fitur **Bacakan TTS Offline (ID)** di Mode Offline Penuh akan berbicara memakai suara lokal sistem tanpa internet.

### B. Kloning Modul Pendukung Neuro-Orkestrator Sesuai Bidang
Di dalam aplikasi tersedia menu **Neuro-Orkestrator** yang memisahkan **41 repositori** ke dalam **8 bidang keahlian**:
1. Orkestrasi Agen & Perencanaan Tugas
2. Rekayasa Perangkat Lunak & Otomasi Kode
3. Keamanan Siber, Privasi & OSINT
4. Simulasi Neuro, Jaringan Terdistribusi & Observabilitas
5. Otomasi Desktop Windows, Suara (`VocalFlow-windows`) & Basis Data MySQL
6. Persona AI (`personaforge`, `forge-skill`), Media & Presentasi (`ppt-master`)
7. Riset Berita, Radar AI & Layanan Publik (`MAYA-AI`)
8. Otomasi Bot & Ekosistem Telegram

Anda dapat menyalin perintah `gh repo clone <owner/repo>` per bidang langsung dari menu **Neuro-Orkestrator** sesuai kebutuhan proyek Anda.

