# YONOPOD Landing Page Content Blueprint
**Dokumen Arsitektur & Salinan Konten Situs Publik YONOPOD**
*Perusahaan: PT. Alenerlverse Nexus Technology*
*Status: Production Content Source of Truth*

---

## 01 — Navigation (Bilah Navigasi Utama)
- **Tujuan**: Memberikan navigasi intuitif, memperkuat identitas brand Yonopod beserta entitas legal PT. Alenerlverse Nexus Technology, dan menyediakan akses cepat ke autentikasi pengguna.
- **Brand & Legal**:
  - Logo: **YONOPOD**
  - Sub-label Legal: `PT. Alenerlverse Nexus Technology`
- **Tautan Navigasi**:
  1. Fitur Utama (`#features`)
  2. Monitoring & Storage (`#monitoring`)
  3. Keamanan (`#security`)
  4. Kalkulator Biaya (`#pricing`)
  5. Solusi (`#use-cases`)
  6. Arsitektur (`#technology`)
  7. Roadmap (`#roadmap`)
- **Aksi Cepat (CTAs)**:
  - Masuk (`/login`) — *Ghost Button*
  - Mulai Sekarang (`/register`) — *Solid Primary Button with Accent Glow*

---

## 02 — Hero Section (Kekuatan Utama Produk)
- **Tujuan**: Menyampaikan pesan utama dalam 3 detik pertama dengan gaya editorial berkelas, membedakan Yonopod dari kompetitor lama, serta menyediakan ajakan aksi langsung.
- **Badge Kategori**: `Pengembangan Platform Cloud Storage Berbasis Web • PT. Alenerlverse Nexus Technology`
- **Headline**:
  *Penyimpanan Cloud Fleksibel, Tanpa Beban Paket Kaku.*
- **Subheadline**:
  Platform cloud storage modern berbasis web dengan skema biaya transparan bayar sesuai pemakaian (*pay-as-you-use*). Kelola berkas secara cerdas, pantau alokasi ruang secara real-time, dan simpan data penting Anda dalam infrastruktur yang aman.
- **Call-to-Action Utama**:
  - Tombol Primer: `Mulai Sekarang` → tautan ke `/register`
  - Tombol Sekunder: `Pelajari Fitur Platform` → tautan ke `#features`
- **Statistik & Metrik Hero**:
  - Skema Pemakaian: `Rp 400 / GB` (Transparan & Proporsional)
  - Aksesibilitas: `100% Web-Based` (Tanpa Instalasi Tambahan)
  - Enkripsi & Kontrol: `Private Vault & Log Audit Terintegrasi`
- **Visualisasi Interaktif Hero**:
  Komponen visual interaktif *Yonopod Live Telemetry & File Node Matrix* yang mendemonstrasikan status kuota real-time, distribusi berkas dokumen/gambar/media, serta enkripsi vault aktif.

---

## 03 — Problem vs Solution (Pernyataan Masalah & Transformasi Nilai)
- **Tujuan**: Mengedukasi pengunjung mengenai inefisiensi sistem cloud storage konvensional dan bagaimana Yonopod menghadirkan paradigma baru.
- **Headline Bagian**:
  *Mengapa Model Penyimpanan Konvensional Membebani Pengguna?*
- **Subheadline**:
  Banyak layanan cloud memaksa pengguna membeli tier paket berkapasitas besar yang sebagian besar tidak pernah terpakai.
- **3 Masalah Utama**:
  1. **Paket Langganan Kaku & Pemborosan Biaya**:
     *Pengguna dipaksa membayar paket 100 GB atau 2 TB meskipun hanya menggunakan 25 GB. Sisa kapasitas terbuang sia-sia setiap bulan.*
  2. **Struktur & Manajemen Berkas yang Tidak Efisien**:
     *Kesulitan mengidentifikasi folder berukuran raksasa, berkas duplikat, dan hilangnya visibilitas hierarki data.*
  3. **Ketiadaan Transparansi & Log Aktivitas Mendalam**:
     *Tidak adanya catatan jejak audit siapa yang mengakses berkas, kapan tautan dibagikan, dan status keamanan per folder.*
- **Pernyataan Transformasi**:
  *Yonopod hadir mengembalikan kendali penuh kepada Anda: bayar tepat sebesar gigabyte yang Anda simpan, pantau alokasi dengan Folder Analyzer, dan amankan berkas rahasia di Private Vault.*

---

## 04 — Feature Ecosystem (Ekosistem Fitur Lengkap)
- **Tujuan**: Menjabarkan seluruh kapabilitas teknis dan fungsional yang didukung oleh platform Yonopod sesuai proposal resmi.
- **Headline**:
  *Segala yang Anda Butuhkan untuk Mengelola & Mengamankan Data.*
- **Subheadline**:
  Dirancang dari nol untuk kecepatan akses browser, keamanan data terstruktur, dan efisiensi ruang simpan.
- **6 Pilar Fitur Utama**:
  1. **File Management Lengkap**:
     - Unggah file & folder tunggal/massal
     - Preview dokumen, gambar, video, audio langsung di peramban
     - Operasi cepat: Ganti nama (*Rename*), Pindahkan (*Move*), Salin (*Copy*), Hapus (*Trash*)
  2. **Folder Management & Size Analyzer**:
     - Struktur folder bertingkat (*nested folders*) tanpa batas kedalaman
     - Analisis ukuran folder otomatis untuk mengetahui alokasi penyimpanan per subdirektori
  3. **Pencarian Cepat & Organisasi Data**:
     - Pencarian teks lengkap instan berdasarkan nama dan metadata
     - Sistem Label & Tag berwarna untuk pengelompokan lintas direktori
     - Folder Favorit dan Berkas Terakhir Diakses (*Recent Files*)
  4. **Dashboard & Telemetri Penyimpanan Real-Time**:
     - Visualisasi grafik kapasitas terpakai vs kuota tersedia
     - Rincian persentase berkas (Dokumen, Gambar, Video, Audio, Arsip)
     - Daftar berkas terbesar untuk optimasi penyimpanan berkala
  5. **Keamanan Akun & Private Vault**:
     - Brankas pribadi (*Private Vault*) berpassword untuk data sensitif
     - Manajemen sesi login dan pemantauan perangkat terhubung (*Device Management*)
  6. **Berbagi Berkas Terproteksi (*Secure Sharing*)**:
     - Pembuatan tautan publik dengan tanggal kedaluwarsa (*Expiring Links*)
     - Proteksi kata sandi pada tautan dan mode izin *Read-only*

---

## 05 — Storage Monitoring / Interactive UI Dashboard Telemetry
- **Tujuan**: Memperlihatkan secara nyata pengalaman pengguna dalam memantau kuota dan struktur berkas pada dashboard Yonopod.
- **Headline**:
  *Ketahui Secara Presisi ke Mana Setiap Gigabyte Dialokasikan.*
- **Subheadline**:
  Tidak ada lagi kapasitas misterius yang menghabiskan kuota tanpa Anda ketahui penyebabnya.
- **Komponen Dashboard yang Ditampilkan**:
  - Meteran Kapasitas Terpakai (misal: 14.8 GB digunakan dari kuota fleksibel)
  - Distribusi Tipe Berkas (45% Video HD, 30% Dokumen Proyek, 15% Gambar, 10% Arsip Zip)
  - Widget *Top Largest Folders* (misal: `/Proyek-Video-2026` 8.2 GB, `/Dokumen-Legal` 3.1 GB)
  - Widget *Storage Health & Efficiency Score*

---

## 06 — File Organization & Workflow
- **Tujuan**: Menjelaskan integrasi antara nested folders, tag & label warna, dan pencarian instan dalam mendukung produktivitas harian.
- **Headline**:
  *Navigasi Berkas Tanpa Friksi, Terstruktur Sesuai Pola Kerja Anda.*
- **Fitur Utama yang Disorot**:
  - *Multi-Color Tags*: Tandai berkas dengan label `Urgent`, `Finance`, `Design Assets`, `Legal`.
  - *Instant Search & Filter*: Temukan berkas dalam hitungan milidetik.
  - *Seamless In-Browser Preview*: Buka file PDF, audio, video, dan gambar tanpa perlu mengunduh terlebih dahulu.

---

## 07 — Security & Private Vault
- **Tujuan**: Membangun kepercayaan tinggi pengguna dengan menjelaskan pilar keamanan yang telah diimplementasikan sesuai proposal.
- **Headline**:
  *Perlindungan Tingkat Lanjut untuk Berkas Paling Sensitif Anda.*
- **Subheadline**:
  Keamanan bukan fitur tambahan, melainkan pondasi dari setiap lapis arsitektur Yonopod.
- **Poin-Poin Keamanan Resmi**:
  1. **Private Vault (Folder Lock)**: Lapisan autentikasi ekstra untuk folder finansial, data pribadi, atau dokumen rahasia.
  2. **Session & Device Management**: Pantau seluruh perangkat yang sedang login dan putus sesi mencurigakan dengan satu klik.
  3. **Enkripsi Saluran HTTPS/TLS**: Seluruh transmisi berkas diamankan menggunakan enkripsi modern.
  4. **Proteksi Akses Berkas**: Token akses berbatas waktu (*time-limited signed URL*) untuk mencegah hotlinking ilegal.
  5. **Roadmap 2FA (Two-Factor Authentication)**: Perlindungan OTP multi-faktor yang dijadwalkan pada fase ekspansi platform.

---

## 08 — Audit Log & Transparency
- **Tujuan**: Menampilkan fitur transparansi riwayat aksi berkas yang menjadi nilai tambah platform.
- **Headline**:
  *Visibilitas Penuh: Setiap Aksi Terekam dengan Jelas.*
- **Subheadline**:
  Ketahui secara rinci riwayat berkas yang diunggah, diubah namanya, dipindahkan, atau dihapus secara kronologis.
- **Simulasi Aktivitas Audit**:
  - `Laporan-Keuangan-Q2-2026.pdf` • Diunggah ke `/Finance` • 2 menit yang lalu
  - `Kontrak-Kerjasama-Vendor.docx` • Dibagikan dengan kata sandi • 15 menit yang lalu
  - `Arsip-Desain-v1.zip` • Dipindahkan ke Private Vault • 1 jam yang lalu
  - `Video-Promosi-Final.mp4` • Dipratinjau via web player • Hari ini, 09:41 WIB

---

## 09 — Use Cases (Skenario Penggunaan Nyata)
- **Tujuan**: Menunjukkan relevansi produk kepada target pengguna yang diidentifikasi dalam proposal resmi.
- **Headline**:
  *Didesain untuk Kebutuhan Pengguna Mandiri hingga Bisnis Bertumbuh.*
- **4 Skenario Penggunaan**:
  1. **Mahasiswa & Akademisi**:
     *Simpan tugas akhir, modul perkuliahan, dan referensi riset. Bayar hanya beberapa ribu rupiah sesuai kapasitas tugas tanpa komitmen langganan bulanan mahal.*
  2. **Profesional & Kreator Independen**:
     *Kelola portofolio foto, rekaman audio, dan aset desain video. Bagikan hasil kerja ke klien dengan tautan berbatas waktu yang profesional.*
  3. **Usaha Mikro, Kecil & Menengah (UMKM)**:
     *Arsipkan nota digital, invoice, laporan pajak, dan berkas operasional usaha dalam brankas aman dengan biaya operasional yang sangat terkontrol.*
  4. **Organisasi & Institusi Pendidikan**:
     *Sentralisasi data administratif dan repositori berkas publik dengan kontrol akses yang tertata rapi.*

---

## 10 — Technology & Architecture
- **Tujuan**: Menampilkan arsitektur teknologi berstandar industri yang menopang keandalan sistem Yonopod.
- **Headline**:
  *Arsitektur Cloud Tangguh, Cepat, dan Skalabel.*
- **Subheadline**:
  Dibangun dengan stack teknologi modern untuk performa transfer data maksimal dan integritas sistem tinggi.
- **Stack Teknologi Resmi (Berdasarkan Proposal)**:
  - **Lapisan Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
  - **Lapisan Backend**: Node.js & Express.js Engine, Multer / Busboy Streaming Pipeline, Winston & Morgan Logging
  - **Lapisan Database & ORM**: PostgreSQL, Prisma ORM / Drizzle ORM
  - **Lapisan Storage & Distribusi**: Huby Object Storage Adapter, Cloudflare Acceleration & Security

---

## 11 — Pay-As-You-Use Pricing & Interactive Calculator
- **Tujuan**: Menjadi pusat konversi dengan kalkulator interaktif yang membuktikan efisiensi biaya skema Rp 400 / GB.
- **Headline**:
  *Hanya Bayar untuk Kapasitas yang Anda Gunakan.*
- **Subheadline**:
  Tanpa biaya tersembunyi, tanpa paket bulanan yang mengunci Anda pada kuota kosong.
- **Tarif Dasar Resmi**:
  - Tarif: `Rp 400 per Gigabyte (GB)`
  - Skenario Contoh Proposal:
    - 50 GB = `Rp 20.000`
    - 250 GB = `Rp 100.000`
    - 1.000 GB (1 TB) = `Rp 400.000`
    - 5.000 GB (5 TB) = `Rp 2.000.000`
- **Fitur Kalkulator Interaktif**:
  - Slider kuota mulai 1 GB hingga 5.000 GB
  - Input angka langsung dengan tombol preset cepat (50 GB, 100 GB, 500 GB, 1 TB, 5 TB)
  - Perhitungan estimasi biaya instan dalam format Rupiah (IDR)
  - Komparasi transparansi: Tidak ada biaya hangus, tidak ada denda pembatalan

---

## 12 — Strategic Roadmap
- **Tujuan**: Memberikan gambaran rencana strategis pengembangan platform Yonopod secara kredibel.
- **Headline**:
  *Peta Jalan Pengembangan Berkelanjutan.*
- **4 Fase Resmi (Berdasarkan Proposal)**:
  - **Fase 1 (Agustus – September 2026)**:
    *MVP & Official Launch* — Peluncuran fitur dasar file & folder management, dashboard monitoring, dan skema awal pay-as-you-use.
  - **Fase 2 (Oktober – Desember 2026)**:
    *Stabilization & Monetization* — Stabilisasi infrastruktur transmisi data, integrasi gateway pembayaran, dan pencapaian target kelola 2 TB data.
  - **Fase 3 (Januari – Juni 2027)**:
    *Feature Expansion & Collaboration* — Penambahan Private Vault tingkat lanjut, integrasi 2FA, dan fitur kolaborasi tim berbagi tautan multi-user.
  - **Fase 4 (Juli 2027 ke Depan)**:
    *Infrastructure Scalability & B2B Enterprise* — Ekspansi arsitektur multi-server, SLA korporasi, integrasi API pihak ketiga, dan solusi B2B.

---

## 13 — Final Call to Action (CTA Konversi)
- **Headline**:
  *Saatnya Beralih ke Penyimpanan Cloud yang Adil & Transparan.*
- **Subheadline**:
  Daftar akun gratis hari ini, eksplorasi kemudahan manajemen berkas di peramban, dan nikmati fleksibilitas bayar sesuai kebutuhan Anda.
- **Aksi**:
  - Tombol Utama: `Buat Akun Sekarang` (`/register`)
  - Tombol Pendukung: `Masuk ke Dashboard` (`/login`)
- **Penegasan Keamanan**:
  `Aman • Berbasis Web • Tanpa Biaya Tersembunyi`

---

## 14 — Footer
- **Identitas Brand**:
  - **YONOPOD**
  - `PT. Alenerlverse Nexus Technology`
  - *Pengembangan Platform Cloud Storage Berbasis Web dengan Harga Terjangkau*
- **Navigasi Kolom**:
  - **Platform**: Fitur Utama, Manajemen Berkas, Monitoring Kuota, Private Vault, Log Aktivitas
  - **Biaya & Kalkulator**: Skema Pay-As-You-Use, Simulasi Tarif, Transparansi Biaya
  - **Arsitektur**: Teknologi & Engine, Keamanan Data, Roadmap Pengembangan
  - **Akses & Akun**: Masuk Pengguna (`/login`), Pendaftaran Baru (`/register`), Dashboard (`/dashboard`)
- **Hak Cipta**:
  `© 2026 YONOPOD by PT. Alenerlverse Nexus Technology. Hak Cipta Dilindungi Undang-Undang.`







# YONOPOD

Pengembangan Platform Cloud Storage Berbasis Web dengan Harga Terjangkau.

---

## Hero

### Cloud storage yang membayar sesuai penggunaan

Yonopod adalah platform cloud storage berbasis web yang menawarkan penyimpanan fleksibel dengan skema **pay-as-you-use**.

Pengguna membayar berdasarkan kapasitas penyimpanan yang benar-benar digunakan, sehingga tidak perlu mengambil paket kapasitas yang lebih besar dari kebutuhan.

**Primary CTA:** Mulai Menggunakan Yonopod

**Secondary CTA:** Lihat Cara Kerja

---

## The Problem

### Penyimpanan digital semakin besar. Biaya tidak harus ikut membesar.

Kebutuhan ruang penyimpanan terus meningkat seiring pertumbuhan data digital. Namun banyak layanan cloud storage masih menggunakan paket berlangganan dengan kapasitas tetap.

Akibatnya, pengguna dapat membayar kapasitas yang sebenarnya tidak mereka gunakan.

Selain persoalan harga, terdapat beberapa masalah lain:

- Struktur penyimpanan yang sulit diorganisir
- File mudah tercecer atau terduplikasi
- Sulit mengetahui penggunaan storage secara real-time
- Tidak selalu tersedia riwayat perubahan file yang detail
- Privasi dan pengelolaan file membutuhkan perlindungan tambahan

---

## The Solution

### Penyimpanan yang lebih fleksibel

Yonopod menghadirkan cloud storage berbasis web dengan model pembayaran sesuai kapasitas yang digunakan.

Pengguna dapat menyimpan, mengorganisir, mencari, memantau, mengamankan, dan membagikan file melalui satu platform.

Model ini dirancang agar lebih relevan untuk:

- Pelajar
- Mahasiswa
- Individu
- UMKM

---

## Feature Overview

### File Management

Kelola file dari satu tempat.

- Upload File
- Download File
- Preview Gambar & Video
- Rename File
- Delete File
- Copy & Move File
- Upload Folder

---

### Folder Management

Bangun struktur penyimpanan yang lebih rapi.

- Membuat Folder
- Rename Folder
- Delete Folder
- Nested Folder
- Copy & Move Folder
- Folder Size Analyzer

---

### Search & Organization

Temukan file tanpa harus mencari folder satu per satu.

- Full-Text Search
- Filtering
- Tag & Label
- Favorite File
- Recent File

Tag dan label dapat digunakan untuk mengelompokkan file berdasarkan kategori seperti pekerjaan, pribadi, dokumen penting, atau arsip.

---

### Storage Monitoring

Ketahui bagaimana ruang penyimpanan digunakan.

Dashboard monitoring menyediakan:

- Total Storage
- Used Storage
- Remaining Storage
- Persentase Penggunaan
- Statistik Berdasarkan Tipe File
- Folder Terbesar
- File Terbesar
- Aktivitas Terbaru
- Grafik Penggunaan Storage

Sistem juga dapat memberikan notifikasi ketika kapasitas penyimpanan mendekati batas tertentu.

---

### Security & Private Vault

File penting membutuhkan lapisan perlindungan tambahan.

Yonopod menyediakan:

- Folder Lock / Private Vault
- Audit Log
- Session Management
- Login Activity
- Device Management
- HTTPS
- Proteksi tambahan untuk file dan folder privat

Audit Log mencatat aktivitas seperti upload, delete, move, rename, pembaruan isi, dan akses file.

---

### Sharing

Bagikan file sesuai kebutuhan.

- Share File melalui Link
- Share File melalui Form
- Share Folder
- Expired Link
- Password Protected Link
- Download Limit
- Read Only Permission

---

## How Yonopod Works

### 01 — Simpan

Upload file atau folder ke Yonopod melalui antarmuka web.

### 02 — Organisir

Gunakan folder, nested folder, tag, label, favorite, dan search untuk menjaga data tetap teratur.

### 03 — Monitor

Pantau penggunaan storage secara real-time dan identifikasi file atau folder yang paling banyak menggunakan kapasitas.

### 04 — Protect

Gunakan Private Vault, Folder Lock, Audit Log, dan pengelolaan sesi untuk meningkatkan keamanan data.

### 05 — Pay for what you use

Kapasitas penyimpanan dihitung berdasarkan penggunaan aktual.

---

## Fitur Utama

### File Management

Kelola file melalui fitur upload, download, preview gambar dan video, rename, delete, copy & move, serta upload folder.

### Folder Management

Buat dan kelola folder, nested folder, rename, delete, copy & move folder, serta gunakan Folder Size Analyzer untuk mengetahui penggunaan kapasitas berdasarkan folder.

### Search & Organization

Cari dan organisir file menggunakan Full-Text Search, Filtering, Tag & Label, Favorite File, dan Recent File.

### Dashboard Monitoring

Pantau Total Storage, Used Storage, Remaining Storage, persentase penggunaan, statistik berdasarkan tipe file, folder terbesar, file terbesar, aktivitas terbaru, dan grafik penggunaan storage.

### Security

Lindungi data menggunakan Folder Lock / Private Vault, HTTPS, Audit Log, Session Management, Login Activity, Device Management, serta Two Factor Authentication sebagai target pengembangan.

### Sharing

Bagikan file dan folder melalui link atau form dengan dukungan Expired Link, Password Protected Link, Download Limit, dan Read Only Permission.

---

## Technology & Architecture

### Three-Tier Architecture

Yonopod menggunakan arsitektur tiga lapis:

#### Presentation Layer

- Next.js
- Tailwind CSS
- Shadcn UI / Radix UI
- Lucide React
- Axios / Fetch API

#### Application Layer

- Node.js
- Express.js
- Multer / Busboy
- Huby Adapter
- Winston / Morgan

#### Data Layer

- PostgreSQL 17+
- Prisma ORM / Drizzle ORM
- Huby Object Storage

---

## Security Architecture

### Authentication

- OAuth 2.0 & OIDC
- Google Auth
- JWT
- HTTP-Only Cookie

### Data Protection

- Private Vault
- AES-256
- HTTPS / SSL
- Cloudflare

---

## Pay-as-you-use Pricing

### Rp 400 / GB

Yonopod menggunakan model penyimpanan fleksibel berdasarkan kapasitas yang digunakan.

### Storage Calculator

**500 GB**

Rp 200.000

**1 TB**

Rp 400.000

**5 TB**

Rp 2.000.000

### Calculation

Biaya penyimpanan bulanan:

`Kapasitas Storage × Rp 400 / GB`

Masukkan kapasitas yang dibutuhkan untuk mendapatkan estimasi biaya.

---

## Why Yonopod

### Lebih fleksibel

Bayar berdasarkan kapasitas yang benar-benar digunakan.

### Lebih terjangkau

Model pay-as-you-use dirancang sebagai alternatif terhadap paket penyimpanan tetap.

### Lebih terorganisir

Folder, tag, label, favorite, recent file, dan full-text search membantu pengelolaan data.

### Lebih transparan

Audit Log memberikan riwayat aktivitas file secara detail.

### Lebih aman

Private Vault, HTTPS, session management, dan pengamanan tambahan membantu melindungi data.

### Berbasis web

Akses melalui browser tanpa memerlukan instalasi aplikasi tambahan.

---

## About / Contact

### Simpan lebih fleksibel dengan Yonopod.

Yonopod dikembangkan sebagai platform cloud storage berbasis web yang menggabungkan penyimpanan fleksibel, pengelolaan file, monitoring, keamanan, dan sharing dalam satu platform.

**CTA:** Get Started

---

## Footer

### YONOPOD

Platform

- Features
- Pricing
- How It Works

Company

- About
- Contact

Legal

- Privacy
- Terms

PT. ALENAVERSE NEXUS TECHNOLOGY

© 2026 YONOPOD