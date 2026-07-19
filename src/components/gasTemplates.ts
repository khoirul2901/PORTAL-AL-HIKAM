import { AppItem, SchoolData } from '../types';
import { ExtendedAppConfig } from '../defaultData';

export function getCodeGsTemplate(
  config: ExtendedAppConfig,
  apps: AppItem[],
  schoolData: SchoolData,
  adminPassword: string
): string {
  return `/**
 * Portal Aplikasi Sekolah - Code.gs
 * Backend Google Apps Script untuk melayani halaman Portal Launcher Utama.
 * Menggunakan PropertiesService untuk persistensi data dinamis dan Admin Dashboard.
 * 
 * Penggunaan:
 * 1. Tempel kode ini di file Code.gs pada Google Apps Script editor Anda.
 * 2. Simpan, buat rilis baru (Deploy as Web App), lalu akses URL web app Anda.
 */

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  return template.evaluate()
      .setTitle('${config.SCHOOL_NAME || "Portal Digital Sekolah"}')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setFaviconUrl('https://www.gstatic.com/images/branding/product/1x/scis_512dp.png')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Helper untuk menyisipkan file HTML lain (CSS / JS) ke dalam template utama.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Mengambil seluruh data portal (Config, Apps, SchoolData) dari PropertiesService atau default.
 */
function getPortalData() {
  var props = PropertiesService.getScriptProperties();
  
  var savedConfig = props.getProperty('portal_config');
  if (!savedConfig) {
    savedConfig = JSON.stringify(getDefaultConfig());
    props.setProperty('portal_config', savedConfig);
  }
  
  var savedApps = props.getProperty('portal_apps');
  if (!savedApps) {
    savedApps = JSON.stringify(getDefaultApps());
    props.setProperty('portal_apps', savedApps);
  }
  
  var savedSchoolData = props.getProperty('portal_school_data');
  if (!savedSchoolData) {
    savedSchoolData = JSON.stringify(getDefaultSchoolData());
    props.setProperty('portal_school_data', savedSchoolData);
  }
  
  var savedPassword = props.getProperty('portal_admin_password');
  if (!savedPassword) {
    savedPassword = getDefaultAdminPassword();
    props.setProperty('portal_admin_password', savedPassword);
  }
  
  return {
    config: JSON.parse(savedConfig),
    apps: JSON.parse(savedApps),
    schoolData: JSON.parse(savedSchoolData)
  };
}

/**
 * Verifikasi sandi administrator.
 */
function verifyAdminPassword(password) {
  var props = PropertiesService.getScriptProperties();
  var saved = props.getProperty('portal_admin_password') || getDefaultAdminPassword();
  return password === saved;
}

/**
 * Simpan data portal yang diperbarui oleh admin.
 */
function updatePortalData(password, payload) {
  if (!verifyAdminPassword(password)) {
    throw new Error('Autentikasi gagal. Kata sandi salah.');
  }
  
  var props = PropertiesService.getScriptProperties();
  if (payload.config) {
    props.setProperty('portal_config', JSON.stringify(payload.config));
  }
  if (payload.apps) {
    props.setProperty('portal_apps', JSON.stringify(payload.apps));
  }
  if (payload.schoolData) {
    props.setProperty('portal_school_data', JSON.stringify(payload.schoolData));
  }
  return true;
}

/**
 * Perbarui sandi administrator.
 */
function updateAdminPassword(oldPass, newPass) {
  if (!verifyAdminPassword(oldPass)) {
    throw new Error('Kata sandi lama salah.');
  }
  if (newPass.length < 4) {
    throw new Error('Kata sandi baru minimal 4 karakter.');
  }
  
  var props = PropertiesService.getScriptProperties();
  props.setProperty('portal_admin_password', newPass);
  return true;
}

// Fungsi pembantu data bawaan (diambil dari generator saat ekspor)
function getDefaultConfig() {
  return ${JSON.stringify(config, null, 2)};
};
}

function getDefaultApps() {
  return ${JSON.stringify(apps, null, 2)};
},
    {
      "title": "Manajemen Surat",
      "icon": "mail",
      "description": "Pencatatan, pengarsipan, dan disposisi surat masuk dan surat keluar sekolah.",
      "url": "https://script.google.com/macros/s/example-surat/exec"
    },
    {
      "title": "Keuangan Sekolah",
      "icon": "payments",
      "description": "Administrasi pembayaran SPP, kas, dan pelaporan keuangan anggaran sekolah.",
      "url": "https://script.google.com/macros/s/example-keuangan/exec"
    },
    {
      "title": "Absensi Elektronik",
      "icon": "fact_check",
      "description": "Rekapitulasi absensi kehadiran harian guru, staf kependidikan, dan siswa.",
      "url": "https://script.google.com/macros/s/example-absensi/exec"
    },
    {
      "title": "Inventaris Barang",
      "icon": "inventory_2",
      "description": "Pencatatan aset sarana prasarana sekolah beserta monitoring kondisinya.",
      "url": "https://script.google.com/macros/s/example-inventaris/exec"
    },
    {
      "title": "Perpustakaan Digital",
      "icon": "menu_book",
      "description": "Katalog buku digital, pendaftaran peminjaman, dan sirkulasi pustaka.",
      "url": "https://script.google.com/macros/s/example-perpustakaan/exec"
    },
    {
      "title": "Absensi Monitoring",
      "icon": "browse_activity",
      "description": "Sistem monitoring absensi waktu nyata (real-time) dan rekap laporan bulanan.",
      "url": "https://script.google.com/macros/s/example-monitoring/exec"
    },
    {
      "title": "Download Aplikasi",
      "icon": "download",
      "description": "Unduh aplikasi pendukung portal sekolah versi Android APK melalui Google Drive.",
      "url": "https://drive.google.com/drive/folders/example-apk-folder"
    }
  ];
}

function getDefaultSchoolData() {
  return ${JSON.stringify(schoolData, null, 2)};
},
      {
        "id": 2,
        "title": "Ujian Tengah Semester (UTS) Genap Mandiri",
        "date": "28 Juni 2026",
        "content": "Diberitahukan kepada seluruh siswa kelas VII, VIII, dan IX bahwa pelaksanaan UTS Genap akan dimulai tanggal 10 Juli 2026 secara digital mandiri.",
        "category": "Akademik",
        "badgeColor": "#3b82f6"
      },
      {
        "id": 3,
        "title": "Pemeliharaan Server Portal Berkala",
        "date": "25 Juni 2026",
        "content": "Akan dilakukan maintenance sistem berkala pada hari Sabtu malam pukul 22.00 WIB untuk meningkatkan kecepatan dan keamanan akses portal utama.",
        "category": "Sistem",
        "badgeColor": "#f59e0b"
      }
    ],
    "agenda": [
      {
        "id": 1,
        "title": "Rapat Pleno Komite & Wali Murid",
        "date": "05 Juli 2026",
        "time": "09:00 - selesai",
        "location": "Aula Pertemuan Utama"
      },
      {
        "id": 2,
        "title": "Pembagian Rapor Hasil Belajar Siswa",
        "date": "12 Juli 2026",
        "time": "08:00 - 14:00",
        "location": "Ruang Kelas Masing-masing"
      },
      {
        "id": 3,
        "title": "Masa Pengenalan Lingkungan Sekolah (MPLS)",
        "date": "20-22 Juli 2026",
        "time": "07:30 - 13:00",
        "location": "Lingkungan Sekolah"
      }
    ],
    "news": [
      {
        "id": 1,
        "title": "Siswa Sekolah Kita Meraih Juara I Olimpiade Sains Nasional",
        "date": "01 Juli 2026",
        "summary": "Prestasi gemilang kembali diraih oleh ananda Rian Aditya yang berhasil membawa pulang medali emas bidang Fisika di tingkat Nasional tahun ini.",
        "image": "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400"
      },
      {
        "id": 2,
        "title": "Gerakan Go Green School: Penanaman 100 Bibit Pohon",
        "date": "26 Juni 2026",
        "summary": "Dalam rangka Hari Lingkungan Hidup, sekolah mengadakan gerakan penghijauan bersama komite dan siswa untuk menanam pohon pelindung di sekitar area sekolah.",
        "image": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400"
      }
    ]
  };
}

function getDefaultAdminPassword() {
  return "${adminPassword}";
}
`;
}

export function getIndexHtmlTemplate(config: ExtendedAppConfig): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO & Meta Tags Utama -->
  <title id="metaTitle">${config.SCHOOL_NAME || "Portal Digital Sekolah"} - Launcher Terpadu</title>
  <meta name="description" content="Selamat datang di Portal Digital & Website Resmi AL-HIKAM SCHOOL. Pusat layanan akademik, administrasi, dan informasi digital terintegrasi untuk guru, siswa, dan wali murid.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://sekolahkita.sch.id">
  <meta name="theme-color" content="#f0f4f9">
  <link rel="icon" type="image/png" href="https://www.gstatic.com/images/branding/product/1x/scis_512dp.png">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="AL-HIKAM SCHOOL - Portal Digital & Website Resmi">
  <meta property="og:description" content="Pusat layanan akademik, administrasi, dan informasi digital terintegrasi AL-HIKAM SCHOOL.">
  <meta property="og:image" content="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:title" content="AL-HIKAM SCHOOL - Portal Digital & Website Resmi">
  <meta property="twitter:description" content="Pusat layanan akademik, administrasi, dan informasi digital terintegrasi AL-HIKAM SCHOOL.">
  <meta property="twitter:image" content="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200">

  <!-- JSON-LD Schema.org Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "School",
    "name": "AL-HIKAM SCHOOL",
    "url": "https://sekolahkita.sch.id",
    "logo": "https://www.gstatic.com/images/branding/product/1x/scis_512dp.png",
    "image": "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200",
    "description": "Lembaga pendidikan menengah pertama unggulan yang mengintegrasikan seluruh sistem informasi akademik dan administrasi dalam satu platform digital.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Raya Sendang Mulyo",
      "addressLocality": "Sendang Mulyo",
      "addressRegion": "Lampung Tengah",
      "postalCode": "34174",
      "addressCountry": "ID"
    },
    "telephone": "(031) 892-1234",
    "email": "info@smpalhikam.sch.id",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "07:00",
      "closes": "15:00"
    }
  }
  </script>

  <!-- 1. INCLUDE ASSET EKSTERNAL (FONTS & CDN) -->
  <?!= include('include'); ?>

  <!-- 2. INCLUDE LEMBAR GAYA CSS UTAMA -->
  <?!= include('css'); ?>
</head>
<body>

  <!-- LOADING SCREEN LAYER -->
  <div id="loadingOverlay" class="loading-overlay">
    <div class="spinner"></div>
    <p>Menghubungkan ke Google Workspace Cloud...</p>
  </div>

  <!-- ADMIN CONTROL BAR (IF LOGGED IN) -->
  <div id="adminBar" class="admin-bar">
    <div class="admin-bar-left">
      <span class="pulse-dot"></span>
      <span>MODE ADMIN AKTIF — Kelola Seluruh Data & Tampilan Portal</span>
    </div>
    <div class="admin-bar-right">
      <button class="admin-bar-btn" onclick="openProfileModal()">
        <span class="material-symbols-rounded">settings</span> Profil & Tautan
      </button>
      <button class="admin-bar-btn" onclick="openAppModal()">
        <span class="material-symbols-rounded">add_box</span> Tambah Aplikasi
      </button>
      <button class="admin-bar-btn" onclick="openPasswordModal()">
        <span class="material-symbols-rounded">lock_reset</span> Ganti Sandi
      </button>
      <button class="admin-bar-btn logout" onclick="logoutAdmin()">
        <span class="material-symbols-rounded">logout</span> Keluar Admin
      </button>
    </div>
  </div>

  <!-- HEADER UTAMA (STICKY & RESPONSIVE) -->
  <header role="banner" id="mainHeader">
    <div class="container header-content">
      
      <!-- Sisi Kiri: Identitas Sekolah -->
      <a href="#heroSection" class="logo-area" style="text-decoration: none; color: inherit;">
        <div id="schoolLogoCircle" class="logo-circle" aria-hidden="true">A</div>
        <div class="school-meta">
          <div id="schoolNameHeader" class="school-name">AL-HIKAM SCHOOL</div>
          <span id="schoolSubtitleHeader" class="system-title">Portal Akademik & Layanan Digital</span>
        </div>
      </a>

      <!-- Sisi Kanan: Jam Realtime, Kontrol Tema & Login -->
      <div class="header-right">
        <!-- Widget Jam Indonesia -->
        <div id="clockDisplay" class="time-widget" aria-live="polite">
          Memuat tanggal & waktu...
        </div>

        <!-- Tombol Terang / Gelap -->
        <div class="theme-controls" role="group" aria-label="Pengaturan Tema Tampilan">
          <button id="lightThemeBtn" class="theme-btn active" title="Mode Terang" aria-label="Mode Terang">
            <span class="material-symbols-rounded">light_mode</span>
          </button>
          <button id="darkThemeBtn" class="theme-btn" title="Mode Gelap" aria-label="Mode Gelap">
            <span class="material-symbols-rounded">dark_mode</span>
          </button>
        </div>

        <!-- Tombol Login Admin -->
        <button id="loginBtn" class="login-action-btn" onclick="openLoginModal()" title="Login Administrator">
          <span class="material-symbols-rounded">lock</span>
          <span>Admin Login</span>
        </button>
      </div>

    </div>
  </header>

  <!-- KONTEN UTAMA HALAMAN -->
  <main style="flex: 1;">
    
    <!-- 1. HERO SECTION -->
    <section id="heroSection" class="hero-section animate-slideup" aria-labelledby="welcome-heading">
      <div class="container hero-content">
        <div class="hero-badge">
          <span class="material-symbols-rounded" style="font-size: 16px;">verified_user</span> Portal Resmi Terverifikasi
        </div>
        <h1 id="welcome-heading" class="hero-title">AL-HIKAM SCHOOL<br><span>Portal Digital Sekolah</span></h1>
        
        <p class="hero-subtitle">
          Selamat datang di platform integrasi digital AL-HIKAM SCHOOL. Portal ini memudahkan guru, tenaga kependidikan, siswa, orang tua, dan masyarakat dalam mengakses berbagai layanan akademik, keuangan, dan administrasi sekolah secara cepat, aman, dan efisien dari mana saja.
        </p>

        <p class="hero-subtitle-sub">
          Dirancang khusus untuk menghadirkan ekosistem pembelajaran modern abad ke-21 berlandaskan iman, taqwa, dan keunggulan teknologi digital.
        </p>

        <!-- Action Buttons -->
        <div class="hero-actions">
          <a href="#appsSection" class="hero-btn primary-btn" onclick="smoothScroll(event, 'appsSection')">
            <span class="material-symbols-rounded">explore</span> Jelajahi Portal
          </a>
          <a href="#profilSection" class="hero-btn secondary-btn" onclick="smoothScroll(event, 'profilSection')">
            <span class="material-symbols-rounded">school</span> Tentang Sekolah
          </a>
        </div>

        <!-- Kotak Pencarian Aplikasi (Real-time Filter) -->
        <div class="search-wrapper" role="search">
          <input type="text" id="searchInput" class="search-box" placeholder="Cari aplikasi atau layanan..." aria-label="Cari aplikasi atau layanan sekolah">
          <span class="material-symbols-rounded search-icon">search</span>
          <span id="clearSearch" class="material-symbols-rounded clear-icon" title="Bersihkan pencarian">close</span>
        </div>
      </div>
    </section>

    <!-- 2. DESKRIPSI PORTAL -->
    <section id="deskripsiSection" class="portal-desc-section animate-slideup">
      <div class="container">
        <div class="section-title-wrapper text-center">
          <span class="section-badge">Platform Terpadu</span>
          <h2 class="section-main-title">Kenapa Menggunakan Portal Digital?</h2>
          <p class="section-subtitle-text">Menghadirkan efisiensi total dalam manajemen sekolah melalui teknologi modern.</p>
        </div>

        <div class="desc-grid">
          <div class="desc-card hover-lift">
            <div class="desc-icon-box" style="background: rgba(59, 130, 246, 0.15); color: #3b82f6;">
              <span class="material-symbols-rounded">grid_view</span>
            </div>
            <h3>Satu Pintu Layanan</h3>
            <p>Akses semua sistem administrasi, kearsipan, perpustakaan, absensi, hingga keuangan dalam satu dasbor pintar terpadu.</p>
          </div>

          <div class="desc-card hover-lift">
            <div class="desc-icon-box" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">
              <span class="material-symbols-rounded">cloud_done</span>
            </div>
            <h3>Keandalan Cloud GCP</h3>
            <p>Terintegrasi langsung dengan ekosistem Google Workspace for Education yang stabil, cepat, dan aman untuk data sekolah.</p>
          </div>

          <div class="desc-card hover-lift">
            <div class="desc-icon-box" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">
              <span class="material-symbols-rounded">flash_on</span>
            </div>
            <h3>Efisiensi Operasional</h3>
            <p>Memangkas birokrasi manual dengan sistem digitalisasi surat menyurat, pengumuman instan, serta pelaporan real-time.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- QUICK ACCESS SECTION (TAUTAN CEPAT - PERTAHANKAN STRUKTUR) -->
    <section class="quick-access-section animate-slideup">
      <div class="container">
        <div class="quick-access-card">
          <div class="quick-access-wrapper">
            <div class="quick-label">
              <span class="material-symbols-rounded">link</span> Tautan Cepat:
            </div>
            <div id="quickLinksContainer" class="quick-links">
              <!-- Diisi secara dinamis dari config -->
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. DASHBOARD APLIKASI (LAUNCHER GRID) -->
    <section id="appsSection" class="launcher-section">
      <div class="container">
        <div class="section-header">
          <div class="section-title-wrapper">
            <span class="section-badge">Pusat Aplikasi</span>
            <h2 class="section-main-title flex-title">
              <span class="material-symbols-rounded" style="font-size: 28px;">apps</span> Dashboard Aplikasi Sekolah
            </h2>
          </div>
          <button id="addNewAppBtnHeader" class="admin-add-section-btn" onclick="openAppModal()" style="display:none;">
            <span class="material-symbols-rounded">add</span> Tambah Aplikasi
          </button>
        </div>

        <!-- Grid tempat menampung kartu aplikasi secara dinamis -->
        <div id="appsGrid" class="apps-grid">
          <!-- Kartu-kartu aplikasi akan di-render di sini secara dinamis menggunakan JS looping -->
        </div>

        <!-- Placeholder pencarian tidak ditemukan -->
        <div id="noResults" class="no-results" role="alert" aria-live="assertive">
          <span class="material-symbols-rounded no-results-icon">search_off</span>
          <h4>Layanan Tidak Ditemukan</h4>
          <p>
            Maaf, tidak ada aplikasi sekolah yang cocok dengan kata kunci pencarian Anda. Silakan coba kata kunci lain.
          </p>
        </div>
      </div>
    </section>

    <!-- 4. STATISTIK SEKOLAH -->
    <section id="statistikSection" class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stats-card">
            <div class="stats-icon-box">
              <span class="material-symbols-rounded">groups</span>
            </div>
            <div class="stats-number">650+</div>
            <div class="stats-label">Siswa Aktif</div>
          </div>

          <div class="stats-card">
            <div class="stats-icon-box">
              <span class="material-symbols-rounded">co_present</span>
            </div>
            <div class="stats-number">45</div>
            <div class="stats-label">Guru & Staf</div>
          </div>

          <div class="stats-card">
            <div class="stats-icon-box">
              <span class="material-symbols-rounded">meeting_room</span>
            </div>
            <div class="stats-number">18</div>
            <div class="stats-label">Rombongan Belajar</div>
          </div>

          <div class="stats-card">
            <div class="stats-icon-box">
              <span class="material-symbols-rounded">integration_instructions</span>
            </div>
            <div class="stats-number">12+</div>
            <div class="stats-label">Aplikasi Terintegrasi</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. BERITA & PENGUMUMAN (SECTION UTAMA) -->
    <section id="beritaSection" class="berita-section">
      <div class="container">
        <div class="info-grid">
          
          <!-- Kolom Kiri: Tab Pengumuman & Berita -->
          <div class="info-card">
            <div class="tabs-header" role="tablist">
              <div style="display: flex; gap: 20px;">
                <h3 class="tab-title active" data-tab="announcementsTab" role="tab" aria-selected="true" aria-controls="announcementsTab">
                  Pengumuman Terbaru
                </h3>
                <h3 class="tab-title" data-tab="newsTab" role="tab" aria-selected="false" aria-controls="newsTab">
                  Berita & Prestasi
                </h3>
              </div>
              <button id="addInfoBtn" class="admin-add-section-btn text-xs" onclick="handleAddInfoClick()" style="display:none;">
                <span class="material-symbols-rounded" style="font-size:14px;">add</span> Tambah Data
              </button>
            </div>

            <!-- Isi Tab Pengumuman -->
            <div id="announcementsTab" class="tab-content active" role="tabpanel">
              <div id="announcementsList" class="announcements-flex-list">
                <div style="text-align: center; color: var(--text-muted); padding: 24px;">Memuat pengumuman...</div>
              </div>
            </div>

            <!-- Isi Tab Berita -->
            <div id="newsTab" class="tab-content" role="tabpanel">
              <div id="newsList" class="news-container">
                <div style="text-align: center; color: var(--text-muted); padding: 24px; grid-column: 1/-1;">Memuat berita...</div>
              </div>
              <div class="text-center" style="margin-top: 24px;">
                <button class="view-all-btn" onclick="showAllNewsModal()">
                  <span>Lihat Semua Berita</span>
                  <span class="material-symbols-rounded">arrow_right_alt</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- 6. AGENDA SEKOLAH (SECTION UTAMA) -->
    <section id="agendaSection" class="agenda-section">
      <div class="container">
        <div class="agenda-card-full">
          <div class="section-header" style="margin-bottom: 24px;">
            <div class="section-title-wrapper">
              <span class="section-badge">Kalender Pendidikan</span>
              <h2 class="section-main-title flex-title">
                <span class="material-symbols-rounded">calendar_month</span> Agenda Terdekat Sekolah
              </h2>
            </div>
            <button id="addAgendaBtnHeader" class="admin-add-section-btn text-xs" onclick="openAgendaModal()" style="display:none;">
              <span class="material-symbols-rounded" style="font-size:14px;">add</span> Tambah Agenda
            </button>
          </div>
          
          <div id="agendaList" class="agenda-list-grid">
            <div style="text-align: center; color: var(--text-muted); padding: 40px; grid-column: 1/-1;">Memuat agenda kegiatan...</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. PROFIL SEKOLAH (SEO FRIENDLY) -->
    <section id="profilSection" class="profil-section">
      <div class="container">
        <div class="section-title-wrapper text-center">
          <span class="section-badge">Profil Lembaga</span>
          <h2 class="section-main-title">Mengenal AL-HIKAM SCHOOL</h2>
          <p class="section-subtitle-text">Lembaga pendidikan unggulan berbasis teknologi dan pembentukan karakter mulia.</p>
        </div>

        <div class="profil-grid">
          <div class="profil-main-card">
            <h3>Tentang Kami</h3>
            <div id="schoolAboutContent">
              <p>AL-HIKAM SCHOOL adalah sekolah menengah yang berdedikasi tinggi melahirkan generasi yang cerdas secara akademik, mantap dalam spiritual, dan tangkas dalam menguasai teknologi informasi di era digital.</p>
              <p>Dengan menerapkan kurikulum nasional yang dipadukan dengan kurikulum kepesantrenan dan literasi digital, kami berkomitmen membentuk siswa yang tidak hanya unggul dalam prestasi intelektual namun juga memiliki karakter akhlakul karimah yang kokoh.</p>
            </div>
            
            <div class="visimisi-box">
              <div class="visimisi-item">
                <h4>Visi Sekolah</h4>
                <p id="schoolVisi">"Unggul dalam Prestasi, Terdepan dalam Teknologi, Berlandaskan Iman dan Taqwa."</p>
              </div>
              <div class="visimisi-item">
                <h4>Misi Utama</h4>
                <ul id="schoolMisiList">
                  <li>Menyelenggarakan pembelajaran berkualitas berbasis ICT (Information and Communication Technology).</li>
                  <li>Membiasakan nilai-nilai islami dan ibadah harian secara istiqomah.</li>
                  <li>Mengembangkan minat bakat siswa di bidang riset, bahasa, olahraga, dan seni.</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="profil-sidebar">
            <div class="sidebar-info-card">
              <div class="accreditation-badge">
                <span class="material-symbols-rounded">workspace_premium</span>
                <div>
                  <strong id="schoolAccreditation">Akreditasi A</strong>
                  <span id="schoolAccreditationDetail">Sangat Memuaskan (BAN-S/M)</span>
                </div>
              </div>
            </div>

            <div class="sidebar-programs-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3>Program Unggulan</h3>
                <button id="addProgramBtn" class="admin-add-section-btn text-xs" onclick="openProgramModal()" style="display:none; padding: 4px 8px; border-radius: 6px; font-size: 11px;">
                  <span class="material-symbols-rounded" style="font-size:12px;">add</span> Tambah
                </button>
              </div>
              <ul id="schoolProgramList" class="program-list">
                <!-- Diisi secara dinamis -->
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. GALERI SEKOLAH -->
    <section id="galeriSection" class="galeri-section">
      <div class="container">
        <div class="section-header" style="margin-bottom: 24px;">
          <div class="section-title-wrapper">
            <span class="section-badge">Dokumentasi</span>
            <h2 class="section-main-title">Galeri Kegiatan Sekolah</h2>
            <p class="section-subtitle-text" style="margin-top:4px;">Dokumentasi momen-momen terbaik, fasilitas modern, dan aktivitas santri AL-HIKAM SCHOOL.</p>
          </div>
          <button id="addGalleryBtn" class="admin-add-section-btn text-xs" onclick="openGalleryModal()" style="display:none; padding: 6px 12px; border-radius: 8px;">
            <span class="material-symbols-rounded" style="font-size:14px;">add</span> Tambah Foto
          </button>
        </div>

        <div id="schoolGalleryGrid" class="galeri-grid">
          <!-- Diisi secara dinamis -->
        </div>
      </div>
    </section>

    <!-- 9. FAQ SECTION (ACCORDION ACCESSIBLE) -->
    <section id="faqSection" class="faq-section">
      <div class="container">
        <div class="section-header" style="margin-bottom: 24px;">
          <div class="section-title-wrapper">
            <span class="section-badge">Tanya Jawab</span>
            <h2 class="section-main-title">Pertanyaan Sering Diajukan (FAQ)</h2>
            <p class="section-subtitle-text" style="margin-top:4px;">Informasi cepat mengenai pengoperasian portal dan layanan digital sekolah.</p>
          </div>
          <button id="addFaqBtn" class="admin-add-section-btn text-xs" onclick="openFaqModal()" style="display:none; padding: 6px 12px; border-radius: 8px;">
            <span class="material-symbols-rounded" style="font-size:14px;">add</span> Tambah FAQ
          </button>
        </div>

        <div id="schoolFaqAccordion" class="faq-accordion-container">
          <!-- Diisi secara dinamis -->
        </div>
      </div>
    </section>

    <!-- 10. GOOGLE MAPS & DETAIL LOKASI -->
    <section id="lokasiSection" class="lokasi-section">
      <div class="container">
        <div class="section-title-wrapper text-center">
          <span class="section-badge">Lokasi Kami</span>
          <h2 class="section-main-title">Alamat & Jam Operasional</h2>
          <p class="section-subtitle-text">Kunjungi kampus kami atau hubungi kami pada jam pelayanan kerja.</p>
        </div>

        <div class="lokasi-grid">
          <div class="lokasi-info-card hover-lift">
            <div class="contact-card-header">
              <span class="material-symbols-rounded">contact_mail</span>
              <h3>Kontak Informasi</h3>
            </div>
            
            <div class="lokasi-detail-item">
              <span class="material-symbols-rounded" style="color: #ef4444;">location_on</span>
              <div>
                <strong>Alamat Sekolah</strong>
                <span id="lokasiAddress">Jl. Raya Sendang Mulyo, Kec. sendang Agung, Kab. Lampung tengah, Prov. Lampung</span>
              </div>
            </div>

            <div class="lokasi-detail-item">
              <span class="material-symbols-rounded" style="color: #f59e0b;">schedule</span>
              <div>
                <strong>Jam Operasional Kantor</strong>
                <span>Senin - Jumat | 07:00 - 15:00 WIB</span>
              </div>
            </div>

            <div class="lokasi-detail-item">
              <span class="material-symbols-rounded" style="color: #3b82f6;">call</span>
              <div>
                <strong>Nomor Telepon</strong>
                <span id="lokasiPhone">(031) 892-1234</span>
              </div>
            </div>

            <div class="lokasi-detail-item">
              <span class="material-symbols-rounded" style="color: #10b981;">mail</span>
              <div>
                <strong>Email Resmi</strong>
                <span id="lokasiEmail">info@smpalhikam.sch.id</span>
              </div>
            </div>
          </div>

          <div class="maps-iframe-container hover-lift">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.133168858014!2d104.9009293749829!3d-5.241765794736102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e47374aa1d19079%3A0xc5cb4778e22edb04!2sSMP%20AL%20HIKAM%20SENDANG%20MULYO!5e0!3m2!1sid!2sid!4v1784486318512!5m2!1sid!2sid" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" 
              width="100%" 
              height="100%" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade"
              title="Peta Lokasi Kampus AL-HIKAM SCHOOL">
            </iframe>
          </div>
        </div>
      </div>
    </section>

  </main>

  <!-- FOOTER HALAMAN (RESPONSIVE & BRANDED) -->
  <footer role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        
        <!-- Sisi Kiri: Deskripsi & Hak Cipta -->
        <div class="footer-brand">
          <div class="footer-logo">
            <div id="footerLogoCircle" class="logo-circle" style="width: 38px; height: 38px; font-size: 20px; border-radius: 8px;" aria-hidden="true">A</div>
            <span id="footerSchoolName" class="footer-logo-text"> AL-HIKAM SCHOOL</span>
          </div>
          <p class="footer-desc">
            Sistem portal digital resmi AL-HIKAM SCHOOL. Menghubungkan seluruh layanan sekolah dalam satu pintu pintar berbasis komputasi awan.
          </p>
          
          <div class="footer-legal-links">
            <a href="#" onclick="alert('Kebijakan Privasi Portal AL-HIKAM SCHOOL: Seluruh data yang disimpan melalui PropertiesService dienkripsi dan hanya diakses oleh administrator resmi sekolah.')">Privacy Policy</a>
            <span class="divider">•</span>
            <a href="#" onclick="alert('Syarat & Ketentuan Penggunaan: Layanan portal ini disediakan khusus untuk penunjang akademik civitas akademika AL-HIKAM SCHOOL.')">Terms of Service</a>
          </div>
        </div>

        <!-- Sisi Tengah: Quick Links Navigasi Website -->
        <div class="footer-nav">
          <h4 class="footer-title">Navigasi Portal</h4>
          <ul class="footer-menu">
            <li><a href="#heroSection" onclick="smoothScroll(event, 'heroSection')">Halaman Depan</a></li>
            <li><a href="#appsSection" onclick="smoothScroll(event, 'appsSection')">Dashboard Aplikasi</a></li>
            <li><a href="#profilSection" onclick="smoothScroll(event, 'profilSection')">Profil AL-HIKAM SCHOOL</a></li>
            <li><a href="#beritaSection" onclick="smoothScroll(event, 'beritaSection')">Berita & Kegiatan</a></li>
            <li><a href="#faqSection" onclick="smoothScroll(event, 'faqSection')">Pertanyaan (FAQ)</a></li>
            <li><a href="#lokasiSection" onclick="smoothScroll(event, 'lokasiSection')">Alamat & Lokasi</a></li>
          </ul>
        </div>

        <!-- Sisi Kanan: Detail Kontak & Info Lokasi -->
        <div class="footer-contact">
          <div class="contact-col">
            <h4 class="footer-title">Hubungi Kami</h4>
            <div class="contact-item">
              <span class="material-symbols-rounded">location_on</span>
              <span id="footerAddress">Jl. Raya Sendang Mulyo, Kec. sendang Agung, Kab. Lampung tengah, Prov. Lampung</span>
            </div>
            <div class="contact-item">
              <span class="material-symbols-rounded">call</span>
              <span id="footerPhone">(031) 892-1234</span>
            </div>
            <div class="contact-item">
              <span class="material-symbols-rounded">mail</span>
              <span id="footerEmail">info@smpalhikam.sch.id</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Baris Bawah: Hak Cipta & Info Teknis -->
      <div class="footer-bottom">
        <div id="footerCopyright">
          &copy; 2026 AL-HIKAM SCHOOL. Hak Cipta Dilindungi Undang-Undang.
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 11px; opacity: 0.7;">Operasional Cloud G-Suite</span>
          <span class="version-tag" id="footerVersionTag" onclick="handleFooterVersionClick()" style="cursor:pointer;">Portal v2.2.0</span>
        </div>
      </div>
    </div>
  </footer>

  <!-- ==========================================================================
       MODAL POPUPS FOR ADMIN DASHBOARD & OTHER FUNCTIONS
       ========================================================================== -->

  <!-- LIGHTBOX GALLERY POPUP -->
  <div id="lightboxModal" class="lightbox-modal" onclick="closeLightbox()">
    <span class="lightbox-close">&times;</span>
    <img id="lightboxImage" class="lightbox-content" src="" alt="Tampilan Galeri Diperbesar">
    <div id="lightboxCaption" class="lightbox-caption"></div>
  </div>

  <!-- ALL NEWS MODAL POPUP -->
  <div id="allNewsModal" class="modal-overlay">
    <div class="modal-card modal-large">
      <button class="modal-close" onclick="closeModal('allNewsModal')">
        <span class="material-symbols-rounded">close</span>
      </button>
      <h3 class="modal-title">Seluruh Berita & Kegiatan</h3>
      <p class="modal-subtitle" style="margin-bottom: 20px;">Menampilkan semua liputan kegiatan dan rilis pers resmi sekolah</p>
      
      <div id="allNewsListContainer" class="news-container grid-2">
        <!-- Diisi salinan berita dinamis oleh JS -->
      </div>
    </div>
  </div>

  <!-- 1. LOGIN MODAL -->
  <div id="loginModal" class="modal-overlay">
    <div class="modal-card">
      <button class="modal-close" onclick="closeModal('loginModal')">
        <span class="material-symbols-rounded">close</span>
      </button>
      <div class="modal-header-icon" style="background: rgba(99, 102, 241, 0.15); color: #6366f1;">
        <span class="material-symbols-rounded">security</span>
      </div>
      <h3 class="modal-title">Login Administrator</h3>
      <p class="modal-subtitle">Verifikasi akses pengelola portal sekolah</p>
      
      <div id="loginError" class="modal-error-alert" style="display: none;"></div>
      
      <form onsubmit="submitLogin(event)">
        <div class="form-group">
          <label class="form-label">Username</label>
          <input type="text" id="loginUsername" required class="form-input" placeholder="Masukkan admin" value="admin">
        </div>
        <div class="form-group">
          <label class="form-label">Sandi Administrator</label>
          <input type="password" id="loginPassword" required class="form-input" placeholder="Masukkan kata sandi">
        </div>
        <button type="submit" class="modal-submit-btn">Masuk Ke Dashboard</button>
      </form>
    </div>
  </div>

  <!-- 2. APPLICATION MODAL -->
  <div id="appModal" class="modal-overlay">
    <div class="modal-card">
      <button class="modal-close" onclick="closeModal('appModal')">
        <span class="material-symbols-rounded">close</span>
      </button>
      <h3 class="modal-title" id="appModalTitle">Tambah Aplikasi Baru</h3>
      <p class="modal-subtitle">Konfigurasi tautan menu aplikasi sekolah</p>
      
      <form onsubmit="submitAppForm(event)">
        <input type="hidden" id="appFormIndex">
        <div class="form-group">
          <label class="form-label">Nama Aplikasi / Layanan</label>
          <input type="text" id="appFormTitle" required class="form-input" placeholder="Contoh: Perpustakaan Online">
        </div>
        <div class="form-group">
          <label class="form-label">Nama Ikon Material Rounded</label>
          <input type="text" id="appFormIcon" required class="form-input" placeholder="folder, payments, school, menu_book" value="folder">
          <span style="font-size: 10px; color: var(--text-muted); margin-top: 4px; display: block;">Masukkan kata kunci ikon dari Google Material Symbols</span>
        </div>
        <div class="form-group">
          <label class="form-label">Deskripsi Layanan</label>
          <textarea id="appFormDesc" required class="form-input" rows="3" placeholder="Tulis penjelasan singkat fungsi aplikasi ini..."></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">URL / Link Tujuan Aplikasi</label>
          <input type="text" id="appFormUrl" required class="form-input" placeholder="https://script.google.com/macros/s/.../exec">
        </div>
        <button type="submit" class="modal-submit-btn">Simpan Aplikasi</button>
      </form>
    </div>
  </div>

  <!-- 3. ANNOUNCEMENT MODAL -->
  <div id="announcementModal" class="modal-overlay">
    <div class="modal-card">
      <button class="modal-close" onclick="closeModal('announcementModal')">
        <span class="material-symbols-rounded">close</span>
      </button>
      <h3 class="modal-title" id="announcementModalTitle">Tambah Pengumuman</h3>
      <p class="modal-subtitle">Tulis rilis pengumuman resmi sekolah</p>
      
      <form onsubmit="submitAnnouncementForm(event)">
        <input type="hidden" id="announcementFormId">
        <div class="form-group">
          <label class="form-label">Judul Pengumuman</label>
          <input type="text" id="announcementFormTitle" required class="form-input" placeholder="Contoh: Libur Hari Raya">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Kategori</label>
            <select id="announcementFormCategory" class="form-input" onchange="autoColorBadge()">
              <option value="Penting">Penting</option>
              <option value="Akademik">Akademik</option>
              <option value="Sistem">Sistem</option>
              <option value="Umum">Umum</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Warna Tag</label>
            <input type="color" id="announcementFormColor" class="form-input" style="height: 42px; padding: 2px;" value="#ef4444">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Tanggal Rilis</label>
          <input type="text" id="announcementFormDate" required class="form-input" placeholder="Contoh: 05 Juli 2026">
        </div>
        <div class="form-group">
          <label class="form-label">Konten Pengumuman</label>
          <textarea id="announcementFormContent" required class="form-input" rows="4" placeholder="Tulis pengumuman secara rinci di sini..."></textarea>
        </div>
        <button type="submit" class="modal-submit-btn">Simpan Pengumuman</button>
      </form>
    </div>
  </div>

  <!-- 4. NEWS MODAL -->
  <div id="newsModal" class="modal-overlay">
    <div class="modal-card">
      <button class="modal-close" onclick="closeModal('newsModal')">
        <span class="material-symbols-rounded">close</span>
      </button>
      <h3 class="modal-title" id="newsModalTitle">Tambah Berita & Prestasi</h3>
      <p class="modal-subtitle">Unggah kabar gembira dan prestasi sekolah</p>
      
      <form onsubmit="submitNewsForm(event)">
        <input type="hidden" id="newsFormId">
        <div class="form-group">
          <label class="form-label">Judul Berita</label>
          <input type="text" id="newsFormTitle" required class="form-input" placeholder="Contoh: Juara 1 Nasional Karya Ilmiah">
        </div>
        <div class="form-group">
          <label class="form-label">Tanggal Berita</label>
          <input type="text" id="newsFormDate" required class="form-input" placeholder="Contoh: 04 Juli 2026">
        </div>
        <div class="form-group">
          <label class="form-label">URL Gambar Sampul</label>
          <input type="text" id="newsFormImage" required class="form-input" placeholder="https://images.unsplash.com/... atau Drive">
        </div>
        <div class="form-group">
          <label class="form-label">Ringkasan Berita</label>
          <textarea id="newsFormSummary" required class="form-input" rows="3" placeholder="Tulis intisari singkat berita ini..."></textarea>
        </div>
        <button type="submit" class="modal-submit-btn">Simpan Berita</button>
      </form>
    </div>
  </div>

  <!-- 5. AGENDA MODAL -->
  <div id="agendaModal" class="modal-overlay">
    <div class="modal-card">
      <button class="modal-close" onclick="closeModal('agendaModal')">
        <span class="material-symbols-rounded">close</span>
      </button>
      <h3 class="modal-title" id="agendaModalTitle">Tambah Agenda Terdekat</h3>
      <p class="modal-subtitle">Buat agenda kegiatan sekolah terbaru</p>
      
      <form onsubmit="submitAgendaForm(event)">
        <input type="hidden" id="agendaFormId">
        <div class="form-group">
          <label class="form-label">Nama Kegiatan / Acara</label>
          <input type="text" id="agendaFormTitle" required class="form-input" placeholder="Contoh: Pembagian Rapor Semester">
        </div>
        <div class="form-group">
          <label class="form-label">Tanggal Pelaksanaan</label>
          <input type="text" id="agendaFormDate" required class="form-input" placeholder="Contoh: 12 Juli 2026">
          <span style="font-size: 10px; color: var(--text-muted); margin-top: 4px; display: block;">Gunakan format "ANGKA BULAN TAHUN", contoh: "12 Juli 2026"</span>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Waktu Pelaksanaan</label>
            <input type="text" id="agendaFormTime" required class="form-input" placeholder="08:00 - 12:00">
          </div>
          <div class="form-group">
            <label class="form-label">Lokasi</label>
            <input type="text" id="agendaFormLocation" required class="form-input" placeholder="Aula Utama">
          </div>
        </div>
        <button type="submit" class="modal-submit-btn">Simpan Agenda</button>
      </form>
    </div>
  </div>

  <!-- 6. GENERAL PROFILE CONFIG MODAL -->
  <div id="profileModal" class="modal-overlay">
    <div class="modal-card" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
      <button class="modal-close" onclick="closeModal('profileModal')">
        <span class="material-symbols-rounded">close</span>
      </button>
      <h3 class="modal-title">Profil & Tampilan Portal</h3>
      <p class="modal-subtitle">Konfigurasi nama sekolah, akreditasi, visi misi, & footer</p>
      
      <form onsubmit="submitProfileForm(event)">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nama Sekolah</label>
            <input type="text" id="profSchoolName" required class="form-input" placeholder="SMA NEGERI DIGITAL">
          </div>
          <div class="form-group">
            <label class="form-label">Sub-Judul</label>
            <input type="text" id="profSchoolSubtitle" required class="form-input" placeholder="Sistem Informasi Digital">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Akreditasi Rating</label>
            <input type="text" id="profAccreditationRating" required class="form-input" placeholder="Contoh: Akreditasi A">
          </div>
          <div class="form-group">
            <label class="form-label">Akreditasi Detail</label>
            <input type="text" id="profAccreditationDetail" required class="form-input" placeholder="Sangat Memuaskan (BAN-S/M)">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Tentang Kami / Profil Lembaga</label>
          <textarea id="profAboutContent" required class="form-input" rows="4" placeholder="Tulis deskripsi profil sekolah..."></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Visi Sekolah</label>
            <input type="text" id="profVisi" required class="form-input" placeholder="Masukkan visi sekolah">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Misi Utama (Satu per baris)</label>
          <textarea id="profMisi" required class="form-input" rows="3" placeholder="Tuliskan misi utama..."></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Website Sekolah</label>
            <input type="text" id="profWebsite" required class="form-input" placeholder="https://...">
          </div>
          <div class="form-group">
            <label class="form-label">Email Hubungi Kami (mailto:...)</label>
            <input type="text" id="profEmail" required class="form-input" placeholder="mailto:...">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">WhatsApp Link</label>
            <input type="text" id="profWhatsapp" required class="form-input" placeholder="https://wa.me/...">
          </div>
          <div class="form-group">
            <label class="form-label">Instagram Link</label>
            <input type="text" id="profInstagram" required class="form-input" placeholder="https://instagram.com/...">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">YouTube Link</label>
            <input type="text" id="profYoutube" required class="form-input" placeholder="https://youtube.com/...">
          </div>
          <div class="form-group">
            <label class="form-label">Alamat Footer / Lokasi</label>
            <input type="text" id="profFooterAddress" required class="form-input" placeholder="Alamat lengkap">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Telepon Sekolah</label>
            <input type="text" id="profFooterPhone" required class="form-input" placeholder="Nomor telepon">
          </div>
          <div class="form-group">
            <label class="form-label">Email Sekolah</label>
            <input type="text" id="profFooterEmail" required class="form-input" placeholder="Email resmi sekolah">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Versi Sistem</label>
            <input type="text" id="profFooterVersion" required class="form-input" placeholder="Portal v2.2.0">
          </div>
        </div>

        <button type="submit" class="modal-submit-btn">Simpan Perubahan Tampilan</button>
      </form>
    </div>
  </div>

  <!-- 8. PROGRAM MODAL -->
  <div id="programModal" class="modal-overlay">
    <div class="modal-card">
      <button class="modal-close" onclick="closeModal('programModal')">
        <span class="material-symbols-rounded">close</span>
      </button>
      <h3 class="modal-title" id="programModalTitle">Program Unggulan</h3>
      <p class="modal-subtitle">Konfigurasi program unggulan sekolah</p>
      
      <form onsubmit="submitProgramForm(event)">
        <input type="hidden" id="programFormIndex">
        <div class="form-group">
          <label class="form-label">Nama Program</label>
          <input type="text" id="programFormTitle" required class="form-input" placeholder="Contoh: Tahfidz Al-Qur'an">
        </div>
        <div class="form-group">
          <label class="form-label">Ikon (Material Symbol)</label>
          <input type="text" id="programFormIcon" required class="form-input" placeholder="star, school, menu_book, workspace_premium" value="star">
        </div>
        <div class="form-group">
          <label class="form-label">Deskripsi Singkat</label>
          <textarea id="programFormDesc" required class="form-input" rows="3" placeholder="Deskripsikan program unggulan..."></textarea>
        </div>
        <button type="submit" class="modal-submit-btn">Simpan Program</button>
      </form>
    </div>
  </div>

  <!-- 9. GALLERY MODAL -->
  <div id="galleryModal" class="modal-overlay">
    <div class="modal-card">
      <button class="modal-close" onclick="closeModal('galleryModal')">
        <span class="material-symbols-rounded">close</span>
      </button>
      <h3 class="modal-title" id="galleryModalTitle">Dokumentasi Galeri</h3>
      <p class="modal-subtitle">Konfigurasi foto dokumentasi kegiatan</p>
      
      <form onsubmit="submitGalleryForm(event)">
        <input type="hidden" id="galleryFormIndex">
        <div class="form-group">
          <label class="form-label">Judul Foto / Kegiatan</label>
          <input type="text" id="galleryFormTitle" required class="form-input" placeholder="Contoh: Upacara Kemerdekaan">
        </div>
        <div class="form-group">
          <label class="form-label">URL Link Gambar</label>
          <input type="text" id="galleryFormImage" required class="form-input" placeholder="https://images.unsplash.com/... atau link Drive">
        </div>
        <button type="submit" class="modal-submit-btn">Simpan Galeri</button>
      </form>
    </div>
  </div>

  <!-- 10. FAQ MODAL -->
  <div id="faqModal" class="modal-overlay">
    <div class="modal-card">
      <button class="modal-close" onclick="closeModal('faqModal')">
        <span class="material-symbols-rounded">close</span>
      </button>
      <h3 class="modal-title" id="faqModalTitle">Isian FAQ</h3>
      <p class="modal-subtitle">Konfigurasi pertanyaan yang sering diajukan</p>
      
      <form onsubmit="submitFaqForm(event)">
        <input type="hidden" id="faqFormIndex">
        <div class="form-group">
          <label class="form-label">Pertanyaan</label>
          <input type="text" id="faqFormQuestion" required class="form-input" placeholder="Contoh: Bagaimana cara mendaftar PPDB?">
        </div>
        <div class="form-group">
          <label class="form-label">Jawaban</label>
          <textarea id="faqFormAnswer" required class="form-input" rows="4" placeholder="Tulis jawaban lengkap..."></textarea>
        </div>
        <button type="submit" class="modal-submit-btn">Simpan FAQ</button>
      </form>
    </div>
  </div>

  <!-- 7. GANTI PASSWORD MODAL -->
  <div id="passwordModal" class="modal-overlay">
    <div class="modal-card">
      <button class="modal-close" onclick="closeModal('passwordModal')">
        <span class="material-symbols-rounded">close</span>
      </button>
      <h3 class="modal-title">Ganti Sandi Administrator</h3>
      <p class="modal-subtitle">Ubah sandi untuk mengamankan akses admin panel</p>
      
      <div id="passwordError" class="modal-error-alert" style="display: none; background: rgba(239, 68, 68, 0.15); color: #f87171;"></div>
      <div id="passwordSuccess" class="modal-error-alert" style="display: none; background: rgba(16, 185, 129, 0.15); color: #34d399;"></div>
 
      <form onsubmit="submitPasswordForm(event)">
        <div class="form-group">
          <label class="form-label">Sandi Lama</label>
          <input type="password" id="passOld" required class="form-input" placeholder="Masukkan sandi saat ini">
        </div>
        <div class="form-group">
          <label class="form-label">Sandi Baru</label>
          <input type="password" id="passNew" required class="form-input" placeholder="Sandi baru (min 4 karakter)">
        </div>
        <div class="form-group">
          <label class="form-label">Konfirmasi Sandi Baru</label>
          <input type="password" id="passConfirm" required class="form-input" placeholder="Ketik ulang sandi baru">
        </div>
        <button type="submit" class="modal-submit-btn">Perbarui Sandi</button>
      </form>
    </div>
  </div>

  <!-- TOAST NOTIFICATION CONTAINER -->
  <div id="toastContainer" class="toast-container"></div>

  <!-- 3. INCLUDE LOGIKA JAVASCRIPT UTAMA -->
  <?!= include('javascript'); ?>
</body>
</html>
`;
}

export function getCssHtmlTemplate(): string {
  return `<!--
  Portal Aplikasi Sekolah - css.html
  Lembar gaya CSS lengkap dengan variabel CSS untuk mendukung mode Gelap/Terang,
  grid yang responsif, glassmorphism, serta transisi dan animasi yang halus.
-->
<style>
  /* Reset Dasar & Pengaturan Font */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    -webkit-tap-highlight-color: transparent;
  }

  /* Definisikan Variabel Mode Terang sebagai Default */
  :root {
    --bg-primary: #1e40af;
    --bg-gradient: linear-gradient(135deg, #101f42 0%, #1e3a8a 40%, #3b82f6 100%);
    --bg-accent-gradient: radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 80%);
    
    --surface: rgba(255, 255, 255, 0.12);
    --surface-border: rgba(255, 255, 255, 0.22);
    --surface-solid: rgba(255, 255, 255, 0.18);
    --surface-hover: rgba(255, 255, 255, 0.24);
    
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.85);
    --text-muted: rgba(255, 255, 255, 0.65);
    
    --accent: #ffffff;
    --accent-light: rgba(255, 255, 255, 0.15);
    --accent-hover: rgba(255, 255, 255, 0.3);
    --accent-rgb: 255, 255, 255;
    
    --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
    --shadow-card-hover: 0 20px 30px rgba(0, 0, 0, 0.3);
    
    --card-border-radius: 24px;
    --badge-radius: 100px;
    --transition-speed: 0.35s;
    
    --scrollbar-track: rgba(0, 0, 0, 0.15);
    --scrollbar-thumb: rgba(255, 255, 255, 0.25);
    --scrollbar-thumb-hover: rgba(255, 255, 255, 0.4);
  }

  /* Definisikan Variabel Mode Gelap */
  [data-theme="dark"] {
    --bg-primary: #030712;
    --bg-gradient: linear-gradient(135deg, #030712 0%, #0b1329 50%, #111827 100%);
    --bg-accent-gradient: radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 80%);
    
    --surface: rgba(0, 0, 0, 0.35);
    --surface-border: rgba(255, 255, 255, 0.12);
    --surface-solid: rgba(0, 0, 0, 0.55);
    --surface-hover: rgba(0, 0, 0, 0.65);
    
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.75);
    --text-muted: rgba(255, 255, 255, 0.55);
    
    --accent: #6366f1;
    --accent-light: rgba(99, 102, 241, 0.15);
    --accent-hover: rgba(99, 102, 241, 0.3);
    --accent-rgb: 99, 102, 241;
    
    --shadow-sm: 0 2px 6px rgba(0, 0, 0, 0.25);
    --shadow-md: 0 6px 20px rgba(0, 0, 0, 0.45);
    --shadow-lg: 0 15px 35px rgba(0, 0, 0, 0.65);
    --shadow-card-hover: 0 15px 30px rgba(99, 102, 241, 0.1);
    
    --scrollbar-track: rgba(0, 0, 0, 0.3);
    --scrollbar-thumb: rgba(255, 255, 255, 0.12);
    --scrollbar-thumb-hover: rgba(255, 255, 255, 0.25);
  }

  /* Pengaturan Scrollbar Kustom */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: var(--scrollbar-track);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover);
  }

  /* Struktur Tubuh Utama */
  body {
    background: var(--bg-gradient);
    background-attachment: fixed;
    color: var(--text-primary);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    scroll-behavior: smooth;
    transition: background var(--transition-speed) ease, color var(--transition-speed) ease;
  }

  /* Container Utama */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  /* Shared Utility Classes */
  .text-center {
    text-align: center;
  }
  
  .flex-title {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .hover-lift {
    transition: transform var(--transition-speed) cubic-bezier(0.16, 1, 0.3, 1), 
                box-shadow var(--transition-speed) ease, 
                border-color var(--transition-speed) ease,
                background-color var(--transition-speed) ease;
  }
  .hover-lift:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
    border-color: rgba(255, 255, 255, 0.35);
  }

  /* SEO-Optimized Section Structures */
  .section-title-wrapper {
    margin-bottom: 40px;
  }
  
  .section-badge {
    display: inline-block;
    padding: 6px 14px;
    background: var(--surface-solid);
    border: 1px solid var(--surface-border);
    border-radius: var(--badge-radius);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-secondary);
    margin-bottom: 12px;
  }

  .section-main-title {
    font-size: 30px;
    font-weight: 800;
    letter-spacing: -0.5px;
    margin-bottom: 10px;
    line-height: 1.2;
  }

  .section-subtitle-text {
    font-size: 14px;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* ==========================================================================
     HEADER SECTION (Sticky Glassmorphism)
     ========================================================================== */
  header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--surface);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--surface-border);
    padding: 16px 0;
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-speed) cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  header.header-scrolled {
    padding: 10px 0;
    background: rgba(16, 24, 48, 0.85);
    border-bottom-color: rgba(255, 255, 255, 0.15);
    box-shadow: var(--shadow-lg);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  .logo-area {
    display: flex;
    align-items: center;
    gap: 14px;
    transition: transform 0.2s;
  }
  
  .logo-area:hover {
    transform: scale(1.02);
  }

  .logo-circle {
    width: 44px;
    height: 44px;
    background: var(--accent-light);
    border: 2px solid var(--surface-border);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 800;
    color: var(--text-primary);
    box-shadow: var(--shadow-md);
  }

  .school-meta {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .school-name {
    font-size: 16px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.2px;
    text-transform: uppercase;
  }

  .system-title {
    font-size: 11px;
    color: var(--text-secondary);
    font-weight: 500;
    margin-top: 2px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  /* Widget Jam Indonesia */
  .time-widget {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--surface-border);
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  }

  .time-widget span {
    color: var(--text-primary);
    font-family: monospace;
    font-weight: bold;
    font-size: 12px;
  }

  /* Kontrol Tema Terang/Gelap */
  .theme-controls {
    display: flex;
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid var(--surface-border);
    padding: 2px;
    border-radius: 100px;
  }

  .theme-btn {
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    border-radius: 50%;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-speed) ease;
  }

  .theme-btn.active {
    background: var(--surface-solid);
    color: var(--text-primary);
    box-shadow: var(--shadow-sm);
  }

  .theme-btn .material-symbols-rounded {
    font-size: 16px;
  }

  /* Action Button Login */
  .login-action-btn {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid var(--surface-border);
    color: white;
    font-size: 11px;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: 100px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .login-action-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }

  /* ==========================================================================
     HERO SECTION (SPACIOUS & ENGAGING)
     ========================================================================== */
  .hero-section {
    text-align: center;
    padding: 80px 0 60px 0;
    background: var(--bg-accent-gradient);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .hero-content {
    max-width: 900px;
    margin: 0 auto;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--surface-solid);
    border: 1px solid var(--surface-border);
    padding: 6px 14px;
    border-radius: var(--badge-radius);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 24px;
    backdrop-filter: blur(8px);
  }

  .hero-title {
    font-size: 46px;
    font-weight: 900;
    letter-spacing: -1.5px;
    margin-bottom: 20px;
    line-height: 1.2;
    text-shadow: 0 4px 10px rgba(0,0,0,0.2);
  }

  .hero-title span {
    background: linear-gradient(to right, #60a5fa, #ffffff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero-subtitle {
    font-size: 16px;
    color: var(--text-secondary);
    line-height: 1.7;
    margin-bottom: 16px;
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
    font-weight: 500;
  }

  .hero-subtitle-sub {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 34px;
    font-weight: 400;
  }

  /* Hero Action Buttons */
  .hero-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 40px;
    flex-wrap: wrap;
  }
  
  .hero-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 26px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 700;
    text-decoration: none;
    transition: all var(--transition-speed) cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  .hero-btn.primary-btn {
    background: #ffffff;
    color: #1e3a8a;
    box-shadow: var(--shadow-md);
  }
  .hero-btn.primary-btn:hover {
    background: #f3f4f6;
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
  }

  .hero-btn.secondary-btn {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border: 1px solid var(--surface-border);
  }
  .hero-btn.secondary-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
    border-color: rgba(255, 255, 255, 0.4);
  }

  /* Pencarian Real-time */
  .search-wrapper {
    position: relative;
    max-width: 480px;
    margin: 0 auto;
  }

  .search-box {
    width: 100%;
    padding: 16px 48px 16px 50px;
    background: var(--surface);
    border: 1px solid var(--surface-border);
    border-radius: 100px;
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 500;
    outline: none;
    box-shadow: var(--shadow-lg);
    backdrop-filter: blur(10px);
    transition: all var(--transition-speed) ease;
  }

  .search-box:focus {
    background: var(--surface-solid);
    box-shadow: 0 10px 25px rgba(0,0,0,0.25);
    border-color: rgba(255,255,255,0.4);
  }

  .search-box::placeholder {
    color: var(--text-muted);
  }

  .search-icon {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 22px;
    pointer-events: none;
  }

  .clear-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 20px;
    cursor: pointer;
    display: none;
    transition: color 0.2s;
  }

  .clear-icon:hover {
    color: var(--text-primary);
  }

  /* ==========================================================================
     DESKRIPSI PORTAL SECTION (New)
     ========================================================================== */
  .portal-desc-section {
    padding: 70px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .desc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }

  .desc-card {
    background: var(--surface);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--surface-border);
    border-radius: var(--card-border-radius);
    padding: 34px;
    text-align: left;
    box-shadow: var(--shadow-md);
  }

  .desc-icon-box {
    width: 54px;
    height: 54px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    box-shadow: var(--shadow-sm);
  }

  .desc-icon-box .material-symbols-rounded {
    font-size: 28px;
  }

  .desc-card h3 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.3px;
  }

  .desc-card p {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  /* ==========================================================================
     QUICK ACCESS SECTION
     ========================================================================== */
  .quick-access-section {
    margin: 40px 0;
  }

  .quick-access-card {
    background: var(--surface);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--surface-border);
    border-radius: var(--card-border-radius);
    padding: 16px 24px;
    box-shadow: var(--shadow-md);
  }

  .quick-access-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .quick-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-secondary);
  }

  .quick-label .material-symbols-rounded {
    color: #60a5fa;
  }

  .quick-links {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .quick-link {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: var(--surface-solid);
    border: 1px solid var(--surface-border);
    border-radius: 100px;
    color: var(--text-primary);
    text-decoration: none;
    font-size: 12px;
    font-weight: 600;
    transition: all var(--transition-speed) ease;
  }

  .quick-link:hover {
    background: var(--surface-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }

  .quick-link.whatsapp {
    border-color: rgba(16, 185, 129, 0.4);
    background: rgba(16, 185, 129, 0.15);
  }
  .quick-link.whatsapp:hover {
    background: rgba(16, 185, 129, 0.25);
  }

  .quick-link.instagram {
    border-color: rgba(236, 72, 153, 0.4);
    background: rgba(236, 72, 153, 0.15);
  }
  .quick-link.instagram:hover {
    background: rgba(236, 72, 153, 0.25);
  }

  .quick-link.youtube {
    border-color: rgba(239, 68, 68, 0.4);
    background: rgba(239, 68, 68, 0.15);
  }
  .quick-link.youtube:hover {
    background: rgba(239, 68, 68, 0.25);
  }

  /* ==========================================================================
     LAUNCHER GRID SECTION (GRID MENU UTAMA)
     ========================================================================== */
  .launcher-section {
    padding: 40px 0;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 16px;
  }

  .admin-add-section-btn {
    background: rgba(16, 185, 129, 0.2);
    border: 1px solid rgba(16, 185, 129, 0.4);
    color: #34d399;
    font-size: 12px;
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 100px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.25s;
  }

  .admin-add-section-btn:hover {
    background: rgba(16, 185, 129, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
  }

  .apps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }

  /* App Card */
  .app-card {
    background: var(--surface);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--surface-border);
    border-radius: var(--card-border-radius);
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    text-decoration: none;
    color: var(--text-primary);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    transition: transform var(--transition-speed) cubic-bezier(0.16, 1, 0.3, 1), 
                box-shadow var(--transition-speed) ease, 
                border-color var(--transition-speed) ease;
  }

  .app-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.08), transparent 60%);
    pointer-events: none;
  }

  .app-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
    border-color: rgba(255, 255, 255, 0.35);
  }

  .app-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: var(--surface-solid);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    border: 1px solid var(--surface-border);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .app-card:hover .app-icon-wrapper {
    transform: scale(1.1) rotate(4deg);
    background: #ffffff;
    color: #1e3a8a;
  }

  .app-icon-wrapper .material-symbols-rounded {
    font-size: 24px;
  }

  .app-title {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 6px;
    letter-spacing: -0.2px;
    line-height: 1.3;
  }

  .app-desc {
    font-size: 11px;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 12px;
  }

  /* Admin Buttons Overlay on Cards */
  .admin-actions-overlay {
    position: absolute;
    top: 12px;
    right: 12px;
    display: none; /* diaktifkan dinamis lewat JS */
    gap: 6px;
    z-index: 5;
  }

  .admin-action-mini-btn {
    width: 26px;
    height: 26px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    color: white;
  }

  .admin-action-mini-btn.edit {
    background: rgba(59, 130, 246, 0.8);
  }
  .admin-action-mini-btn.edit:hover {
    background: #3b82f6;
  }

  .admin-action-mini-btn.delete {
    background: rgba(239, 68, 68, 0.8);
  }
  .admin-action-mini-btn.delete:hover {
    background: #ef4444;
  }

  .admin-action-mini-btn .material-symbols-rounded {
    font-size: 14px;
  }

  /* Status Badge On Cards */
  .app-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    background: rgba(52, 211, 153, 0.15);
    color: #34d399;
    padding: 2px 8px;
    border-radius: 100px;
    margin-top: auto;
  }
  
  .app-category-tag {
    font-size: 9px;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-secondary);
    padding: 2px 8px;
    border-radius: 100px;
    margin-right: 6px;
  }

  /* ==========================================================================
     STATISTIK SEKOLAH SECTION (New)
     ========================================================================== */
  .stats-section {
    padding: 60px 0;
    background: rgba(0, 0, 0, 0.1);
    border-top: 1px solid rgba(255, 255, 255, 0.04);
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
  }

  .stats-card {
    background: var(--surface);
    backdrop-filter: blur(10px);
    border: 1px solid var(--surface-border);
    border-radius: var(--card-border-radius);
    padding: 28px;
    text-align: center;
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;
  }

  .stats-icon-box {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 14px auto;
    color: #60a5fa;
  }
  
  .stats-icon-box .material-symbols-rounded {
    font-size: 24px;
  }

  .stats-number {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 4px;
  }

  .stats-label {
    font-size: 11px;
    color: var(--text-secondary);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* ==========================================================================
     BERITA & PENGUMUMAN SECTION
     ========================================================================== */
  .berita-section {
    padding: 60px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .info-card {
    background: var(--surface);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--surface-border);
    border-radius: var(--card-border-radius);
    padding: 28px;
    box-shadow: var(--shadow-md);
  }

  .tabs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid rgba(255,255,255,0.1);
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;
  }

  .tab-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-muted);
    cursor: pointer;
    padding-bottom: 12px;
    position: relative;
    transition: all 0.3s;
  }

  .tab-title.active {
    color: var(--text-primary);
  }

  .tab-title.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--text-primary);
    border-radius: 10px;
  }

  .tab-content {
    display: none;
  }

  .tab-content.active {
    display: block;
    animation: fadeIn 0.4s ease;
  }

  /* List Pengumuman */
  .announcements-flex-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .announcement-item {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid var(--surface-border);
    border-radius: 16px;
    padding: 20px;
    position: relative;
    transition: all 0.25s;
  }

  .announcement-item:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255,255,255,0.3);
  }

  .announcement-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  .announcement-badge {
    font-size: 9px;
    font-weight: 700;
    color: white;
    padding: 2px 10px;
    border-radius: var(--badge-radius);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .announcement-date {
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 500;
  }

  .announcement-title {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 6px;
    line-height: 1.3;
  }

  .announcement-body {
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  /* List Berita & Prestasi */
  .news-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .news-container.grid-2 {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }

  .news-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--surface-border);
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
  }

  .news-card:hover {
    transform: translateY(-4px);
    border-color: rgba(255,255,255,0.3);
    background: rgba(255, 255, 255, 0.08);
  }

  .news-img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    transition: transform 0.4s;
  }
  
  .news-card:hover .news-img {
    transform: scale(1.04);
  }

  .news-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .news-meta-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 10px;
    color: var(--text-muted);
    font-weight: 600;
  }
  
  .news-cat-badge {
    background: var(--accent-light);
    color: var(--text-primary);
    padding: 1px 8px;
    border-radius: 100px;
    font-size: 8px;
    text-transform: uppercase;
  }

  .news-date {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .news-title {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 8px;
    line-height: 1.4;
  }

  .news-desc {
    font-size: 11px;
    color: var(--text-secondary);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .view-all-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid var(--surface-border);
    color: white;
    font-size: 12px;
    font-weight: 600;
    padding: 10px 22px;
    border-radius: 100px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
  }
  .view-all-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  /* ==========================================================================
     AGENDA SEKOLAH SECTION (New Design Grid)
     ========================================================================== */
  .agenda-section {
    padding: 60px 0;
  }

  .agenda-card-full {
    background: var(--surface);
    backdrop-filter: blur(10px);
    border: 1px solid var(--surface-border);
    border-radius: var(--card-border-radius);
    padding: 28px;
    box-shadow: var(--shadow-md);
  }

  .agenda-list-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }

  .agenda-item {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--surface-border);
    border-radius: 16px;
    padding: 18px;
    display: flex;
    gap: 14px;
    align-items: center;
    position: relative;
    transition: all 0.25s;
  }

  .agenda-item:hover {
    background: rgba(255, 255, 255, 0.09);
    border-color: rgba(255,255,255,0.3);
    transform: translateY(-2px);
  }

  .agenda-date-box {
    width: 58px;
    height: 58px;
    background: var(--surface-solid);
    border: 1px solid var(--surface-border);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .agenda-day {
    font-size: 20px;
    font-weight: 800;
    line-height: 1;
  }

  .agenda-month {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-secondary);
  }

  .agenda-details {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .agenda-title {
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 4px;
    line-height: 1.3;
  }

  .agenda-time {
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .agenda-countdown-badge {
    position: absolute;
    top: -10px;
    right: 12px;
    font-size: 8px;
    font-weight: 800;
    text-transform: uppercase;
    background: #f59e0b;
    color: #000;
    padding: 2px 10px;
    border-radius: 100px;
    box-shadow: var(--shadow-sm);
  }

  /* ==========================================================================
     PROFIL SEKOLAH SECTION (New)
     ========================================================================== */
  .profil-section {
    padding: 70px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.04);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .profil-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 28px;
  }

  @media (max-width: 900px) {
    .profil-grid {
      grid-template-columns: 1fr;
    }
  }

  .profil-main-card {
    background: var(--surface);
    backdrop-filter: blur(10px);
    border: 1px solid var(--surface-border);
    border-radius: var(--card-border-radius);
    padding: 34px;
    box-shadow: var(--shadow-md);
  }

  .profil-main-card h3 {
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 16px;
    letter-spacing: -0.5px;
  }

  .profil-main-card p {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.7;
    margin-bottom: 16px;
  }

  .visimisi-box {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  .visimisi-item {
    margin-bottom: 16px;
  }

  .visimisi-item h4 {
    font-size: 14px;
    font-weight: 700;
    color: #60a5fa;
    margin-bottom: 6px;
    text-transform: uppercase;
  }

  .visimisi-item ul {
    list-style-type: none;
  }

  .visimisi-item ul li {
    font-size: 12px;
    color: var(--text-secondary);
    margin-bottom: 6px;
    padding-left: 14px;
    position: relative;
  }

  .visimisi-item ul li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #60a5fa;
    font-weight: bold;
  }

  .sidebar-info-card {
    background: var(--surface);
    backdrop-filter: blur(10px);
    border: 1px solid var(--surface-border);
    border-radius: var(--card-border-radius);
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: var(--shadow-md);
  }

  .accreditation-badge {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .accreditation-badge .material-symbols-rounded {
    font-size: 38px;
    color: #f59e0b;
  }

  .accreditation-badge strong {
    font-size: 15px;
    display: block;
  }

  .accreditation-badge span {
    font-size: 11px;
    color: var(--text-muted);
  }

  .sidebar-programs-card {
    background: var(--surface);
    backdrop-filter: blur(10px);
    border: 1px solid var(--surface-border);
    border-radius: var(--card-border-radius);
    padding: 28px;
    box-shadow: var(--shadow-md);
  }

  .sidebar-programs-card h3 {
    font-size: 16px;
    font-weight: 800;
    margin-bottom: 16px;
  }

  .program-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    list-style-type: none;
  }

  .program-list li {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  .program-list li .material-symbols-rounded {
    padding: 6px;
    border-radius: 8px;
    background: rgba(255,255,255,0.08);
    font-size: 18px;
  }

  .program-list li strong {
    font-size: 12px;
    display: block;
    margin-bottom: 2px;
  }

  .program-list li span {
    font-size: 10px;
    color: var(--text-secondary);
    line-height: 1.4;
    display: block;
  }

  /* ==========================================================================
     GALERI SEKOLAH SECTION (New)
     ========================================================================== */
  .galeri-section {
    padding: 70px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .galeri-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }

  .galeri-item {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    height: 160px;
    cursor: pointer;
    border: 1px solid var(--surface-border);
    box-shadow: var(--shadow-sm);
  }

  .galeri-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-speed) ease;
  }

  .galeri-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(16, 24, 48, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    opacity: 0;
    transition: opacity var(--transition-speed) ease;
  }

  .galeri-item:hover img {
    transform: scale(1.08);
  }

  .galeri-item:hover .galeri-overlay {
    opacity: 1;
  }

  .galeri-overlay .material-symbols-rounded {
    font-size: 26px;
    transform: scale(0.8);
    transition: transform var(--transition-speed) cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .galeri-item:hover .galeri-overlay .material-symbols-rounded {
    transform: scale(1);
  }

  .galeri-overlay span:not(.material-symbols-rounded) {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  /* ==========================================================================
     FAQ SECTION (ACCORDION)
     ========================================================================== */
  .faq-section {
    padding: 70px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .faq-accordion-container {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .faq-item {
    background: var(--surface);
    backdrop-filter: blur(10px);
    border: 1px solid var(--surface-border);
    border-radius: 16px;
    overflow: hidden;
  }

  .faq-question {
    padding: 20px 24px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style: none;
    outline: none;
    user-select: none;
  }

  .faq-question::-webkit-details-marker {
    display: none;
  }

  .faq-arrow {
    font-size: 18px;
    color: var(--text-muted);
    transition: transform var(--transition-speed) ease;
  }

  .faq-item[open] .faq-arrow {
    transform: rotate(180deg);
  }

  .faq-answer {
    padding: 0 24px 20px 24px;
    border-top: 1px solid rgba(255,255,255,0.08);
    font-size: 12px;
    line-height: 1.6;
    color: var(--text-secondary);
    animation: fadeIn 0.3s ease;
  }

  /* ==========================================================================
     LOKASI (GOOGLE MAPS & CONTACT)
     ========================================================================== */
  .lokasi-section {
    padding: 70px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .lokasi-grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 28px;
  }

  @media (max-width: 900px) {
    .lokasi-grid {
      grid-template-columns: 1fr;
    }
  }

  .lokasi-info-card {
    background: var(--surface);
    backdrop-filter: blur(10px);
    border: 1px solid var(--surface-border);
    border-radius: var(--card-border-radius);
    padding: 28px;
    box-shadow: var(--shadow-md);
  }

  .contact-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 16px;
    margin-bottom: 20px;
  }

  .contact-card-header .material-symbols-rounded {
    font-size: 28px;
    color: #60a5fa;
  }

  .contact-card-header h3 {
    font-size: 16px;
    font-weight: 800;
  }

  .lokasi-detail-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 18px;
  }

  .lokasi-detail-item .material-symbols-rounded {
    font-size: 20px;
    padding-top: 2px;
  }

  .lokasi-detail-item strong {
    font-size: 12px;
    display: block;
    margin-bottom: 2px;
  }

  .lokasi-detail-item span {
    font-size: 11px;
    color: var(--text-secondary);
    line-height: 1.5;
    display: block;
  }

  .maps-iframe-container {
    height: 320px;
    border-radius: var(--card-border-radius);
    overflow: hidden;
    border: 1px solid var(--surface-border);
    box-shadow: var(--shadow-md);
  }

  /* ==========================================================================
     FOOTER SECTION (Branded & Rich)
     ========================================================================== */
  footer {
    background: rgba(10, 15, 30, 0.9);
    border-top: 1px solid var(--surface-border);
    padding: 60px 0 30px 0;
    color: rgba(255,255,255,0.8);
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
  }

  @media (max-width: 900px) {
    .footer-grid {
      grid-template-columns: 1fr;
    }
  }

  .footer-brand {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }

  .footer-logo-text {
    font-size: 16px;
    font-weight: 800;
    letter-spacing: -0.3px;
    text-transform: uppercase;
  }

  .footer-desc {
    font-size: 11px;
    line-height: 1.6;
    color: var(--text-muted);
    margin-bottom: 18px;
  }

  .footer-legal-links {
    font-size: 10px;
    color: var(--text-muted);
  }
  
  .footer-legal-links a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s;
  }
  
  .footer-legal-links a:hover {
    color: #fff;
  }
  
  .footer-legal-links .divider {
    margin: 0 6px;
    opacity: 0.3;
  }

  .footer-nav {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-title {
    font-size: 13px;
    font-weight: 700;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
  }

  .footer-menu {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .footer-menu a {
    font-size: 12px;
    color: var(--text-muted);
    text-decoration: none;
    transition: all 0.2s;
  }

  .footer-menu a:hover {
    color: white;
    padding-left: 4px;
  }

  .footer-contact {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .contact-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .contact-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 11px;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .contact-item .material-symbols-rounded {
    font-size: 16px;
    margin-top: 2px;
  }

  .footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    font-size: 11px;
    color: var(--text-muted);
  }

  .version-tag {
    background: var(--surface-solid);
    border: 1px solid var(--surface-border);
    padding: 2px 10px;
    border-radius: 100px;
    color: white;
    font-weight: 700;
  }

  /* ==========================================================================
     MODALS & POPUPS
     ========================================================================== */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 200;
    display: none; /* dinonaktifkan default */
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: fadeIn 0.3s ease;
  }

  .modal-card {
    background: #111827; /* Mode gelap permanen untuk modal agar andal & terbaca */
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: var(--card-border-radius);
    padding: 28px;
    width: 100%;
    max-width: 440px;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    color: white;
  }
  
  .modal-card.modal-large {
    max-width: 800px;
    max-height: 85vh;
    overflow-y: auto;
  }

  .modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    color: rgba(255,255,255,0.5);
    cursor: pointer;
    transition: color 0.2s;
  }

  .modal-close:hover {
    color: white;
  }

  .modal-header-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .modal-title {
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 6px;
  }

  .modal-subtitle {
    font-size: 11px;
    color: rgba(255,255,255,0.6);
    margin-bottom: 24px;
  }

  .modal-error-alert {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    padding: 10px;
    font-size: 11px;
    color: #fca5a5;
    margin-bottom: 16px;
    text-align: center;
  }

  /* Elemen Formulir */
  .form-group {
    margin-bottom: 16px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .form-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    margin-bottom: 6px;
  }

  .form-input {
    width: 100%;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 10px;
    padding: 10px 14px;
    color: white;
    font-size: 12px;
    outline: none;
    transition: all 0.2s;
  }

  .form-input:focus {
    border-color: #6366f1;
    background: rgba(255,255,255,0.1);
  }

  .modal-submit-btn {
    width: 100%;
    background: #6366f1;
    border: none;
    padding: 12px;
    border-radius: 10px;
    color: white;
    font-weight: 700;
    font-size: 12px;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: 10px;
  }

  .modal-submit-btn:hover {
    background: #4f46e5;
  }

  /* Admin Control Bar */
  .admin-bar {
    position: sticky;
    top: 0;
    z-index: 101;
    background: #000000;
    border-bottom: 1px solid #111827;
    padding: 10px 24px;
    display: none; /* dinonaktifkan bawaan */
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    color: #ffffff;
    font-weight: 600;
  }

  .admin-bar-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pulse-dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }

  .admin-bar-right {
    display: flex;
    gap: 8px;
  }

  .admin-bar-btn {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: background 0.2s;
  }

  .admin-bar-btn:hover {
    background: rgba(255,255,255,0.2);
  }

  .admin-bar-btn.logout {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.3);
    color: #ef4444;
  }
  
  .admin-bar-btn.logout:hover {
    background: rgba(239, 68, 68, 0.3);
  }

  /* Loading screen */
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #101f42;
    z-index: 999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    transition: opacity 0.5s ease;
  }

  .spinner {
    width: 44px;
    height: 44px;
    border: 3px solid rgba(255,255,255,0.1);
    border-top: 3px solid #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  /* Toast Notification */
  .toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 999;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .toast {
    background: #111827;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 12px;
    padding: 12px 20px;
    color: white;
    font-size: 11px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: var(--shadow-lg);
    animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* LIGHTBOX STYLING */
  .lightbox-modal {
    display: none;
    position: fixed;
    z-index: 300;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
  }

  .lightbox-content {
    margin: auto;
    display: block;
    width: 80%;
    max-width: 700px;
    max-height: 70vh;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 4px 30px rgba(0,0,0,0.5);
    animation: zoomEffect 0.3s ease;
  }

  .lightbox-caption {
    margin: auto;
    display: block;
    width: 80%;
    max-width: 700px;
    text-align: center;
    color: #ccc;
    padding: 14px 0;
    font-size: 12px;
  }

  .lightbox-close {
    position: absolute;
    top: 40px;
    right: 40px;
    color: #f1f1f1;
    font-size: 40px;
    font-weight: bold;
    transition: 0.3s;
    cursor: pointer;
  }

  .lightbox-close:hover,
  .lightbox-close:focus {
    color: #bbb;
    text-decoration: none;
    cursor: pointer;
  }

  /* ==========================================================================
     ANIMASI-ANIMASI UTAMA
     ========================================================================== */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0% { transform: scale(0.9); opacity: 0.8; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(0.9); opacity: 0.8; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes zoomEffect {
    from {transform: scale(0.85); opacity: 0;}
    to {transform: scale(1); opacity: 1;}
  }

  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .animate-slideup {
    animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  /* Efek click ripple */
  .ripple {
    border-radius: 50%;
    transform: scale(0);
    animation: ripple-anim 0.5s linear;
    background-color: rgba(255, 255, 255, 0.3);
    pointer-events: none;
  }

  @keyframes ripple-anim {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  /* ==========================================================================
     RESPONSIVE LAYOUT (MEDIA QUERIES)
     ========================================================================== */
  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      gap: 12px;
    }
    
    .header-right {
      width: 100%;
      justify-content: center;
    }
    
    .hero-title {
      font-size: 32px;
    }
    
    .hero-subtitle {
      font-size: 14px;
    }
    
    .desc-grid {
      grid-template-columns: 1fr;
    }
    
    .apps-grid {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    }
    
    .app-card {
      padding: 16px;
    }
    
    .stats-grid {
      grid-template-columns: 1fr 1fr;
    }
    
    .news-container {
      grid-template-columns: 1fr;
    }
    
    .agenda-list-grid {
      grid-template-columns: 1fr;
    }
    
    .galeri-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 480px) {
    .container {
      padding: 0 16px;
    }
    
    .apps-grid {
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .galeri-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
`;
}

export function getJavascriptHtmlTemplate(): string {
  return `<!--
  Portal Aplikasi Sekolah - javascript.html
  Logika pemrograman sisi klien lengkap untuk memuat data dari PropertiesService,
  melakukan visual looping, filter pencarian, login administrator, 
  hingga CRUD dinamis langsung dari dashboard web app.
-->
<script>
  // State Utama Client-side
  let currentConfig = {};
  let currentApps = [];
  let currentSchoolData = { announcements: [], news: [], agenda: [] };
  
  let isLoggedIn = false;
  let adminPasswordInput = "";

  // 1. Inisialisasi Jam
  function startClock() {
    const clockElement = document.getElementById('clockDisplay');
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    function updateTime() {
      const now = new Date();
      const dayName = days[now.getDay()];
      const dayNum = String(now.getDate()).padStart(2, '0');
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();
      
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      if (clockElement) {
        clockElement.innerHTML = \`\${dayName}, \${dayNum} \${monthName} \${year} • <span>\${hours}:\${minutes}:\${seconds} WIB</span>\`;
      }
    }

    updateTime();
    setInterval(updateTime, 1000);
  }

  // 2. Load Data Utama dari Google Apps Script
  function initPortal() {
    startClock();
    setupTheme();
    setupTabs();
    setupSearch();
    setupScrollEffect();
    
    // Tarik data dari Code.gs
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler(function(data) {
          currentConfig = data.config;
          currentApps = data.apps;
          currentSchoolData = data.schoolData;
          
          applyPortalData();
          hideLoadingOverlay();
        })
        .withFailureHandler(function(err) {
          showToast("Gagal memuat data cloud. Menggunakan data cadangan.", "error");
          loadFallbackLocalData();
        })
        .getPortalData();
    } else {
      console.log("Di luar environment GAS. Melakukan simulasi local.");
      loadFallbackLocalData();
    }
  }

  function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 500);
    }
  }

  // 3. Aplikasikan Data Ke UI
  function applyPortalData() {
    // Profil Sekolah
    document.getElementById('metaTitle').textContent = currentConfig.SCHOOL_NAME + " - Portal Digital & Website Resmi";
    document.getElementById('schoolNameHeader').textContent = currentConfig.SCHOOL_NAME;
    document.getElementById('schoolSubtitleHeader').textContent = currentConfig.SCHOOL_SUBTITLE;
    
    document.getElementById('schoolLogoCircle').textContent = currentConfig.SCHOOL_NAME ? currentConfig.SCHOOL_NAME.charAt(0) : "S";
    document.getElementById('footerLogoCircle').textContent = currentConfig.SCHOOL_NAME ? currentConfig.SCHOOL_NAME.charAt(0) : "S";
    
    document.getElementById('footerSchoolName').textContent = currentConfig.SCHOOL_NAME;
    document.getElementById('footerCopyright').innerHTML = \`&copy; 2026 \${currentConfig.SCHOOL_NAME}. Hak Cipta Dilindungi Undang-Undang.\`;

    // Profil, Visi, Misi, Akreditasi Dinamis
    if (document.getElementById('schoolAboutContent')) {
      const about = currentConfig.ABOUT_CONTENT || "Sistem portal digital resmi AL-HIKAM SCHOOL. Menghubungkan seluruh layanan sekolah dalam satu pintu pintar berbasis komputasi awan.";
      document.getElementById('schoolAboutContent').innerHTML = about.split('\n\n').map(p => \`<p>\${p}</p>\`).join('');
    }
    if (document.getElementById('schoolVisi')) {
      document.getElementById('schoolVisi').textContent = currentConfig.VISI || '"Unggul dalam Prestasi, Terdepan dalam Teknologi, Berlandaskan Iman dan Taqwa."';
    }
    if (document.getElementById('schoolMisiList')) {
      const misi = currentConfig.MISI || "- Menyelenggarakan pendidikan holistik berbasis nilai islam.\\n- Meningkatkan literasi dan kemampuan teknologi informasi.\\n- Membina kemandirian dan jiwa kepemimpinan siswa.";
      document.getElementById('schoolMisiList').innerHTML = misi.split('\n').filter(line => line.trim()).map(line => \`<li>\${line.replace(/^- /, '')}</li>\`).join('');
    }
    if (document.getElementById('schoolAccreditation')) {
      document.getElementById('schoolAccreditation').textContent = currentConfig.ACCREDITATION_RATING || 'Akreditasi A';
    }
    if (document.getElementById('schoolAccreditationDetail')) {
      document.getElementById('schoolAccreditationDetail').textContent = currentConfig.ACCREDITATION_DETAIL || 'Sangat Memuaskan (BAN-S/M)';
    }

    // Alamat, Telp, Email Dinamis
    if (document.getElementById('lokasiAddress')) {
      document.getElementById('lokasiAddress').textContent = currentConfig.FOOTER_ADDRESS || 'Jl. Raya Sendang Mulyo, Kec. sendang Agung, Kab. Lampung tengah, Prov. Lampung';
    }
    if (document.getElementById('footerAddress')) {
      document.getElementById('footerAddress').textContent = currentConfig.FOOTER_ADDRESS || 'Jl. Raya Sendang Mulyo, Kec. sendang Agung, Kab. Lampung tengah, Prov. Lampung';
    }
    if (document.getElementById('lokasiPhone')) {
      document.getElementById('lokasiPhone').textContent = currentConfig.FOOTER_PHONE || '(031) 892-1234';
    }
    if (document.getElementById('footerPhone')) {
      document.getElementById('footerPhone').textContent = currentConfig.FOOTER_PHONE || '(031) 892-1234';
    }
    if (document.getElementById('lokasiEmail')) {
      document.getElementById('lokasiEmail').textContent = currentConfig.FOOTER_EMAIL || 'info@smpalhikam.sch.id';
    }
    if (document.getElementById('footerEmail')) {
      document.getElementById('footerEmail').textContent = currentConfig.FOOTER_EMAIL || 'info@smpalhikam.sch.id';
    }
    if (document.getElementById('footerVersionTag')) {
      document.getElementById('footerVersionTag').textContent = currentConfig.FOOTER_VERSION || 'Portal v2.2.0';
    }

    // Tautan Cepat
    const linksContainer = document.getElementById('quickLinksContainer');
    if (linksContainer) {
      linksContainer.innerHTML = \`
        <a href="\${currentConfig.WEBSITE}" target="_blank" class="quick-link">
          <span class="material-symbols-rounded">language</span> Website Sekolah
        </a>
        <a href="\${currentConfig.EMAIL}" class="quick-link">
          <span class="material-symbols-rounded">alternate_email</span> Email
        </a>
        <a href="\${currentConfig.WHATSAPP}" target="_blank" class="quick-link whatsapp">
          <span class="material-symbols-rounded">chat</span> WhatsApp
        </a>
        <a href="\${currentConfig.INSTAGRAM}" target="_blank" class="quick-link instagram">
          <span class="material-symbols-rounded">photo_camera</span> Instagram
        </a>
        <a href="\${currentConfig.YOUTUBE}" target="_blank" class="quick-link youtube">
          <span class="material-symbols-rounded">video_library</span> YouTube
        </a>
      \`;
    }

    renderAppCards();
    renderAnnouncements();
    renderNews();
    renderAgenda();
    renderPrograms();
    renderGallery();
    renderFaqs();
  }

  // 4. Render Kartu Menu Aplikasi Launcher
  function renderAppCards() {
    const grid = document.getElementById('appsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    currentApps.forEach((app, index) => {
      const card = document.createElement('div');
      card.className = 'app-card';
      card.style.position = 'relative';
      
      let adminOverlay = '';
      if (isLoggedIn) {
        adminOverlay = \`
          <div class="admin-actions-overlay" style="display: flex;">
            <button class="admin-action-mini-btn edit" onclick="event.preventDefault(); openAppModal(\${index})" title="Edit Menu">
              <span class="material-symbols-rounded">edit</span>
            </button>
            <button class="admin-action-mini-btn delete" onclick="event.preventDefault(); deleteApp(\${index})" title="Hapus Menu">
              <span class="material-symbols-rounded">delete</span>
            </button>
          </div>
        \`;
      }

      // Deteksi kategori dinamis
      let categoryName = "Aplikasi";
      if (app.icon === 'payments' || app.title.toLowerCase().includes('uang') || app.title.toLowerCase().includes('bayar')) {
        categoryName = "Keuangan";
      } else if (app.icon === 'mail' || app.title.toLowerCase().includes('surat') || app.title.toLowerCase().includes('arsip')) {
        categoryName = "Administrasi";
      } else if (app.icon === 'school' || app.icon === 'menu_book' || app.title.toLowerCase().includes('pustaka') || app.title.toLowerCase().includes('belajar')) {
        categoryName = "Akademik";
      }

      card.innerHTML = \`
        \${adminOverlay}
        <a href="\${app.url}" target="_blank" style="display:flex; flex-direction:column; text-decoration:none; color:inherit; width:100%; height:100%;" onclick="createRipple(event, this)">
          <div class="app-icon-wrapper">
            <span class="material-symbols-rounded">\${app.icon}</span>
          </div>
          <h4 class="app-title">\${app.title}</h4>
          <p class="app-desc">\${app.description}</p>
          <div style="margin-top:auto; display:flex; align-items:center; flex-wrap:wrap; gap:4px;">
            <span class="app-category-tag">\${categoryName}</span>
            <span class="app-status-badge">● Online</span>
          </div>
        </a>
      \`;
      grid.appendChild(card);
    });
  }

  // 5. Render Pengumuman
  function renderAnnouncements() {
    const container = document.getElementById('announcementsList');
    if (!container) return;
    container.innerHTML = '';

    if (currentSchoolData.announcements.length === 0) {
      container.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding:24px;">Tidak ada pengumuman harian.</div>';
      return;
    }

    currentSchoolData.announcements.forEach((ann) => {
      const div = document.createElement('div');
      div.className = 'announcement-item hover-lift';
      
      let adminOverlay = '';
      if (isLoggedIn) {
        adminOverlay = \`
          <div class="admin-actions-overlay" style="display: flex; top: 12px; right: 12px;">
            <button class="admin-action-mini-btn edit" onclick="openAnnouncementModal(\${ann.id})" title="Edit Pengumuman">
              <span class="material-symbols-rounded">edit</span>
            </button>
            <button class="admin-action-mini-btn delete" onclick="deleteAnnouncement(\${ann.id})" title="Hapus Pengumuman">
              <span class="material-symbols-rounded">delete</span>
            </button>
          </div>
        \`;
      }

      div.innerHTML = \`
        \${adminOverlay}
        <div class="announcement-meta">
          <span class="announcement-badge" style="background-color: \${ann.badgeColor || '#3b82f6'}">\${ann.category}</span>
          <span class="announcement-date">\${ann.date}</span>
        </div>
        <h4 class="announcement-title" style="padding-right: 60px;">\${ann.title}</h4>
        <p class="announcement-body">\${ann.content}</p>
      \`;
      container.appendChild(div);
    });
  }

  // 6. Render Berita
  function renderNews() {
    const container = document.getElementById('newsList');
    if (!container) return;
    container.innerHTML = '';

    if (currentSchoolData.news.length === 0) {
      container.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding:24px; grid-column:1/-1;">Belum ada berita terbit.</div>';
      return;
    }

    // Ambil maksimal 3 berita untuk dashboard agar tetap rapi
    const displayNews = currentSchoolData.news.slice(0, 3);

    displayNews.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'news-card';
      
      let adminOverlay = '';
      if (isLoggedIn) {
        adminOverlay = \`
          <div class="admin-actions-overlay" style="display: flex; top: 8px; right: 8px; background: rgba(0,0,0,0.5); padding: 4px; border-radius: 8px;">
            <button class="admin-action-mini-btn edit" onclick="openNewsModal(\${item.id})" title="Edit Berita">
              <span class="material-symbols-rounded">edit</span>
            </button>
            <button class="admin-action-mini-btn delete" onclick="deleteNews(\${item.id})" title="Hapus Berita">
              <span class="material-symbols-rounded">delete</span>
            </button>
          </div>
        \`;
      }

      card.innerHTML = \`
        \${adminOverlay}
        <div style="overflow:hidden; height:160px; position:relative;">
          <img class="news-img" src="\${item.image}" alt="\${item.title}" onerror="this.src='https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400'" loading="lazy">
        </div>
        <div class="news-body">
          <div class="news-meta-row">
            <span class="news-cat-badge">Kabar Sekolah</span>
            <span class="news-date">
              <span class="material-symbols-rounded" style="font-size:12px;">calendar_month</span> \${item.date}
            </span>
          </div>
          <h4 class="news-title">\${item.title}</h4>
          <p class="news-desc">\${item.summary}</p>
          <span style="font-size: 10px; color: var(--text-muted); font-weight:600; margin-top: auto; padding-top:10px; display:block;">Oleh: Humas Al-Hikam</span>
        </div>
      \`;
      container.appendChild(card);
    });
  }

  // Fungsi Pembantu Perhitungan Hari Tersisa Agenda
  function calculateDaysRemaining(dateStr) {
    const monthsId = {
      'januari': 0, 'februari': 1, 'maret': 2, 'april': 3, 'mei': 4, 'juni': 5,
      'juli': 6, 'agustus': 7, 'september': 8, 'oktober': 9, 'november': 10, 'desember': 11
    };
    try {
      const parts = dateStr.toLowerCase().trim().split(/\s+/);
      if (parts.length < 3) return null;
      const day = parseInt(parts[0], 10);
      const monthName = parts[1];
      const year = parseInt(parts[2], 10);
      const month = monthsId[monthName];
      if (isNaN(day) || month === undefined || isNaN(year)) return null;
      
      const targetDate = new Date(year, month, day);
      const today = new Date();
      targetDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      
      const diffTime = targetDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return "Hari Ini";
      } else if (diffDays > 0) {
        return \`\${diffDays} Hari Lagi\`;
      } else {
        return "Selesai";
      }
    } catch (e) {
      return null;
    }
  }

  // 7. Render Agenda
  function renderAgenda() {
    const container = document.getElementById('agendaList');
    if (!container) return;
    container.innerHTML = '';

    if (currentSchoolData.agenda.length === 0) {
      container.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding:24px; grid-column:1/-1;">Belum ada agenda terdekat.</div>';
      return;
    }

    currentSchoolData.agenda.forEach((item) => {
      const parts = item.date.split(' ');
      const day = parts[0] || '00';
      const month = (parts[1] || 'SCH').substring(0, 3);

      const div = document.createElement('div');
      div.className = 'agenda-item hover-lift';
      
      let adminOverlay = '';
      if (isLoggedIn) {
        adminOverlay = \`
          <div class="admin-actions-overlay" style="display: flex; top: 12px; right: 12px;">
            <button class="admin-action-mini-btn edit" onclick="openAgendaModal(\${item.id})" title="Edit Agenda">
              <span class="material-symbols-rounded">edit</span>
            </button>
            <button class="admin-action-mini-btn delete" onclick="deleteAgenda(\${item.id})" title="Hapus Agenda">
              <span class="material-symbols-rounded">delete</span>
            </button>
          </div>
        \`;
      }

      // Hitung sisa hari
      const countdownText = calculateDaysRemaining(item.date);
      let countdownBadge = '';
      if (countdownText) {
        let badgeColor = "#ef4444"; // default merah untuk Selesai
        let textColor = "#ffffff";
        if (countdownText === "Hari Ini") {
          badgeColor = "#10b981"; // hijau
        } else if (countdownText.includes("Hari Lagi")) {
          badgeColor = "#f59e0b"; // kuning/oranye
          textColor = "#000000";
        }
        countdownBadge = \`<span class="agenda-countdown-badge" style="background-color: \${badgeColor}; color: \${textColor};">\${countdownText}</span>\`;
      }

      div.innerHTML = \`
        \${countdownBadge}
        \${adminOverlay}
        <div class="agenda-date-box">
          <span class="agenda-day">\${day}</span>
          <span class="agenda-month">\${month}</span>
        </div>
        <div class="agenda-details" style="padding-right: 50px;">
          <h4 class="agenda-title">\${item.title}</h4>
          <span class="agenda-time" style="margin-bottom:4px;">
            <span class="material-symbols-rounded" style="font-size:12px; color:#60a5fa;">schedule</span> \${item.time}
          </span>
          <span class="agenda-time">
            <span class="material-symbols-rounded" style="font-size:12px; color:#ef4444;">location_on</span> \${item.location}
          </span>
        </div>
      \`;
      container.appendChild(div);
    });
  }

  // 8. TABS MANAGEMENT
  function setupTabs() {
    const tabs = document.querySelectorAll('.tab-title');
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const targetTab = this.getAttribute('data-tab');
        
        document.querySelectorAll('.tab-title').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        this.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
      });
    });
  }

  function handleAddInfoClick() {
    const activeTabTitle = document.querySelector('.tab-title.active').getAttribute('data-tab');
    if (activeTabTitle === 'announcementsTab') {
      openAnnouncementModal();
    } else {
      openNewsModal();
    }
  }

  // 9. CLIENT SEARCH ENGINE
  function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearIcon = document.getElementById('clearSearch');
    const noResults = document.getElementById('noResults');

    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();
      let matchedCount = 0;

      clearIcon.style.display = query.length > 0 ? 'block' : 'none';

      const cards = document.querySelectorAll('.app-card');
      cards.forEach((card, index) => {
        const app = currentApps[index];
        const matchTitle = app.title.toLowerCase().includes(query);
        const matchDesc = app.description.toLowerCase().includes(query);

        if (matchTitle || matchDesc) {
          card.style.display = 'block';
          matchedCount++;
        } else {
          card.style.display = 'none';
        }
      });

      noResults.style.display = matchedCount === 0 ? 'flex' : 'none';
    });

    clearIcon.addEventListener('click', function() {
      searchInput.value = '';
      this.style.display = 'none';
      searchInput.focus();
      
      const cards = document.querySelectorAll('.app-card');
      cards.forEach(card => card.style.display = 'block');
      noResults.style.display = 'none';
    });
  }

  // 10. DARK/LIGHT THEME SWITCHER
  function setupTheme() {
    const lightBtn = document.getElementById('lightThemeBtn');
    const darkBtn = document.getElementById('darkThemeBtn');
    
    const savedTheme = localStorage.getItem('school-portal-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButtons(savedTheme);

    lightBtn.addEventListener('click', () => setTheme('light'));
    darkBtn.addEventListener('click', () => setTheme('dark'));

    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('school-portal-theme', theme);
      updateThemeButtons(theme);
    }

    function updateThemeButtons(theme) {
      if (theme === 'dark') {
        darkBtn.classList.add('active');
        lightBtn.classList.remove('active');
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#030712');
      } else {
        lightBtn.classList.add('active');
        darkBtn.classList.remove('active');
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#1e40af');
      }
    }
  }

  // Sticky header scroll shadow & blur effect
  function setupScrollEffect() {
    window.addEventListener('scroll', function() {
      const header = document.getElementById('mainHeader');
      if (header) {
        if (window.scrollY > 20) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }
      }
    });
  }

  // Smooth Scroll Helper
  function smoothScroll(event, targetId) {
    event.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerOffset = document.getElementById('mainHeader').offsetHeight + (isLoggedIn ? 48 : 0);
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }

  // LIGHTBOX POPUP SYSTEM FOR GALLERY
  function openLightbox(element) {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImage');
    const caption = document.getElementById('lightboxCaption');
    const sourceImg = element.querySelector('img');
    
    if (modal && img && caption && sourceImg) {
      modal.style.display = 'block';
      img.src = sourceImg.src;
      caption.textContent = sourceImg.alt || "Galeri Foto AL-HIKAM SCHOOL";
    }
  }

  function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  // SHOW ALL NEWS POPUP
  function showAllNewsModal() {
    const container = document.getElementById('allNewsListContainer');
    if (!container) return;
    container.innerHTML = '';
    
    if (currentSchoolData.news.length === 0) {
      container.innerHTML = '<p style="text-align:center; color:rgba(255,255,255,0.6); width:100%; padding:24px;">Belum ada berita terbit.</p>';
    } else {
      currentSchoolData.news.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = \`
          <div style="overflow:hidden; height:160px;">
            <img class="news-img" src="\${item.image}" alt="\${item.title}" onerror="this.src='https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400'" loading="lazy">
          </div>
          <div class="news-body" style="background: rgba(255,255,255,0.02)">
            <div class="news-meta-row">
              <span class="news-cat-badge">Berita Sekolah</span>
              <span class="news-date">\${item.date}</span>
            </div>
            <h4 class="news-title">\${item.title}</h4>
            <p class="news-desc">\${item.summary}</p>
          </div>
        \`;
        container.appendChild(card);
      });
    }
    openModal('allNewsModal');
  }

  // Ripple effect creator
  function createRipple(event, element) {
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = \`\${diameter}px\`;
    const rect = element.getBoundingClientRect();
    circle.style.left = \`\${event.clientX - rect.left - radius}px\`;
    circle.style.top = \`\${event.clientY - rect.top - radius}px\`;
    circle.style.position = 'absolute';
    circle.className = 'ripple';

    const prevRipple = element.querySelector('.ripple');
    if (prevRipple) prevRipple.remove();

    element.appendChild(circle);
  }

  // Toast System
  function showToast(message, type = "success") {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = "check_circle";
    let color = "#10b981";
    
    if (type === "error") {
      icon = "error";
      color = "#ef4444";
    }
    
    toast.innerHTML = \`<span class="material-symbols-rounded" style="color: \${color}">\${icon}</span> <span>\${message}</span>\`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ==========================================================================
  // ADMINISTRATOR PANEL OPERATIONS (LOGIN, CRUD AND DB SYNC)
  // ==========================================================================
  function openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('loginPassword').focus();
  }

  function openModal(id) {
    document.getElementById(id).style.display = 'flex';
  }

  function closeModal(id) {
    document.getElementById(id).style.display = 'none';
  }

  function submitLogin(e) {
    e.preventDefault();
    const user = document.getElementById('loginUsername').value;
    const pass = document.getElementById('loginPassword').value;
    const errorAlert = document.getElementById('loginError');

    if (user !== "admin") {
      errorAlert.textContent = "Username salah.";
      errorAlert.style.display = 'block';
      return;
    }

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler(function(isOK) {
          if (isOK) {
            isLoggedIn = true;
            adminPasswordInput = pass;
            closeModal('loginModal');
            showToast("Selamat Datang Administrator!", "success");
            toggleAdminLayout(true);
            applyPortalData();
          } else {
            errorAlert.textContent = "Sandi salah.";
            errorAlert.style.display = 'block';
          }
        })
        .withFailureHandler(function(err) {
          errorAlert.textContent = "Gagal memverifikasi: " + err;
          errorAlert.style.display = 'block';
        })
        .verifyAdminPassword(pass);
    } else {
      // Offline mode bypass (sandi: admin)
      if (pass === "admin") {
        isLoggedIn = true;
        adminPasswordInput = pass;
        closeModal('loginModal');
        showToast("Masuk mode simulasi offline.", "success");
        toggleAdminLayout(true);
        applyPortalData();
      } else {
        errorAlert.textContent = "Sandi offline salah (sandi bawaan: admin).";
        errorAlert.style.display = 'block';
      }
    }
  }

  function logoutAdmin() {
    isLoggedIn = false;
    adminPasswordInput = "";
    toggleAdminLayout(false);
    applyPortalData();
    showToast("Anda telah keluar dari mode admin.");
  }

  function toggleAdminLayout(active) {
    document.getElementById('adminBar').style.display = active ? 'flex' : 'none';
    document.getElementById('loginBtn').style.display = active ? 'none' : 'flex';
    document.getElementById('addNewAppBtnHeader').style.display = active ? 'inline-flex' : 'none';
    document.getElementById('addInfoBtn').style.display = active ? 'inline-flex' : 'none';
    document.getElementById('addAgendaBtnHeader').style.display = active ? 'inline-flex' : 'none';
    if (document.getElementById('addProgramBtn')) document.getElementById('addProgramBtn').style.display = active ? 'inline-flex' : 'none';
    if (document.getElementById('addGalleryBtn')) document.getElementById('addGalleryBtn').style.display = active ? 'inline-flex' : 'none';
    if (document.getElementById('addFaqBtn')) document.getElementById('addFaqBtn').style.display = active ? 'inline-flex' : 'none';
    
    // Beri margin top ke header jika admin bar aktif
    document.getElementById('mainHeader').style.top = active ? '48px' : '0';
  }

  // SYNC UTAMA KE GOOGLE APPS SCRIPT
  // (Pertahankan function ini, jangan merubah logika Spreadsheet & cloud PropertiesService)
  function syncPortalDataToCloud(fieldToSync) {
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      const payload = {
        config: currentConfig,
        apps: currentApps,
        schoolData: currentSchoolData
      };
      
      google.script.run
        .withSuccessHandler(function() {
          showToast("Perubahan " + fieldToSync + " berhasil disimpan ke cloud!", "success");
        })
        .withFailureHandler(function(err) {
          showToast("Gagal sinkronisasi cloud: " + err, "error");
        })
        .updatePortalData(adminPasswordInput, payload);
    } else {
      // Offline Local Storage sync
      localStorage.setItem('sim_portal_config', JSON.stringify(currentConfig));
      localStorage.setItem('sim_portal_apps', JSON.stringify(currentApps));
      localStorage.setItem('sim_portal_school_data', JSON.stringify(currentSchoolData));
      showToast("Tersimpan secara lokal (Simulasi)!");
    }
  }

  // APP CARD LOGICS
  function openAppModal(index = null) {
    const modal = document.getElementById('appModal');
    const titleElem = document.getElementById('appModalTitle');
    
    if (index !== null) {
      titleElem.textContent = "Edit Aplikasi / Layanan";
      document.getElementById('appFormIndex').value = index;
      document.getElementById('appFormTitle').value = currentApps[index].title;
      document.getElementById('appFormIcon').value = currentApps[index].icon;
      document.getElementById('appFormDesc').value = currentApps[index].description;
      document.getElementById('appFormUrl').value = currentApps[index].url;
    } else {
      titleElem.textContent = "Tambah Aplikasi Baru";
      document.getElementById('appFormIndex').value = "";
      document.getElementById('appFormTitle').value = "";
      document.getElementById('appFormIcon').value = "folder";
      document.getElementById('appFormDesc').value = "";
      document.getElementById('appFormUrl').value = "";
    }
    
    openModal('appModal');
  }

  function submitAppForm(e) {
    e.preventDefault();
    const idx = document.getElementById('appFormIndex').value;
    const title = document.getElementById('appFormTitle').value;
    const icon = document.getElementById('appFormIcon').value;
    const description = document.getElementById('appFormDesc').value;
    const url = document.getElementById('appFormUrl').value;

    const appObj = { title, icon, description, url };

    if (idx !== "") {
      currentApps[idx] = appObj;
    } else {
      currentApps.push(appObj);
    }

    closeModal('appModal');
    applyPortalData();
    syncPortalDataToCloud("Daftar Menu");
  }

  function deleteApp(idx) {
    if (confirm("Apakah Anda yakin ingin menghapus aplikasi " + currentApps[idx].title + "?")) {
      currentApps.splice(idx, 1);
      applyPortalData();
      syncPortalDataToCloud("Daftar Menu");
    }
  }

  // ANNOUNCEMENTS LOGICS
  function openAnnouncementModal(id = null) {
    const modal = document.getElementById('announcementModal');
    const titleElem = document.getElementById('announcementModalTitle');
    
    if (id !== null) {
      titleElem.textContent = "Edit Pengumuman";
      const item = currentSchoolData.announcements.find(a => a.id === id);
      document.getElementById('announcementFormId').value = id;
      document.getElementById('announcementFormTitle').value = item.title;
      document.getElementById('announcementFormCategory').value = item.category;
      document.getElementById('announcementFormColor').value = item.badgeColor || "#3b82f6";
      document.getElementById('announcementFormDate').value = item.date;
      document.getElementById('announcementFormContent').value = item.content;
    } else {
      titleElem.textContent = "Tambah Pengumuman Baru";
      document.getElementById('announcementFormId').value = "";
      document.getElementById('announcementFormTitle').value = "";
      document.getElementById('announcementFormCategory').value = "Penting";
      document.getElementById('announcementFormColor').value = "#ef4444";
      
      const today = new Date();
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      document.getElementById('announcementFormDate').value = today.getDate() + " " + months[today.getMonth()] + " " + today.getFullYear();
      document.getElementById('announcementFormContent').value = "";
    }
    openModal('announcementModal');
  }

  function autoColorBadge() {
    const cat = document.getElementById('announcementFormCategory').value;
    const colorInput = document.getElementById('announcementFormColor');
    const colors = { Penting: '#ef4444', Akademik: '#3b82f6', Sistem: '#f59e0b', Umum: '#10b981' };
    colorInput.value = colors[cat] || "#3b82f6";
  }

  function submitAnnouncementForm(e) {
    e.preventDefault();
    const id = document.getElementById('announcementFormId').value;
    const title = document.getElementById('announcementFormTitle').value;
    const category = document.getElementById('announcementFormCategory').value;
    const badgeColor = document.getElementById('announcementFormColor').value;
    const date = document.getElementById('announcementFormDate').value;
    const content = document.getElementById('announcementFormContent').value;

    if (id !== "") {
      const idx = currentSchoolData.announcements.findIndex(a => a.id == id);
      if (idx !== -1) {
        currentSchoolData.announcements[idx] = { id: Number(id), title, category, badgeColor, date, content };
      }
    } else {
      currentSchoolData.announcements.unshift({ id: Date.now(), title, category, badgeColor, date, content });
    }

    closeModal('announcementModal');
    applyPortalData();
    syncPortalDataToCloud("Pengumuman");
  }

  // Delete Announcement
  function deleteAnnouncement(id) {
    if (confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
      currentSchoolData.announcements = currentSchoolData.announcements.filter(a => a.id !== id);
      applyPortalData();
      syncPortalDataToCloud("Pengumuman");
    }
  }

  // NEWS LOGICS
  function openNewsModal(id = null) {
    const titleElem = document.getElementById('newsModalTitle');
    if (id !== null) {
      titleElem.textContent = "Edit Berita";
      const item = currentSchoolData.news.find(n => n.id === id);
      document.getElementById('newsFormId').value = id;
      document.getElementById('newsFormTitle').value = item.title;
      document.getElementById('newsFormDate').value = item.date;
      document.getElementById('newsFormImage').value = item.image;
      document.getElementById('newsFormSummary').value = item.summary;
    } else {
      titleElem.textContent = "Tambah Berita & Prestasi";
      document.getElementById('newsFormId').value = "";
      document.getElementById('newsFormTitle').value = "";
      
      const today = new Date();
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      document.getElementById('newsFormDate').value = today.getDate() + " " + months[today.getMonth()] + " " + today.getFullYear();
      document.getElementById('newsFormImage').value = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400";
      document.getElementById('newsFormSummary').value = "";
    }
    openModal('newsModal');
  }

  function submitNewsForm(e) {
    e.preventDefault();
    const id = document.getElementById('newsFormId').value;
    const title = document.getElementById('newsFormTitle').value;
    const date = document.getElementById('newsFormDate').value;
    const image = document.getElementById('newsFormImage').value;
    const summary = document.getElementById('newsFormSummary').value;

    if (id !== "") {
      const idx = currentSchoolData.news.findIndex(n => n.id == id);
      if (idx !== -1) {
        currentSchoolData.news[idx] = { id: Number(id), title, date, image, summary };
      }
    } else {
      currentSchoolData.news.unshift({ id: Date.now(), title, date, image, summary });
    }

    closeModal('newsModal');
    applyPortalData();
    syncPortalDataToCloud("Berita & Prestasi");
  }

  function deleteNews(id) {
    if (confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
      currentSchoolData.news = currentSchoolData.news.filter(n => n.id !== id);
      applyPortalData();
      syncPortalDataToCloud("Berita & Prestasi");
    }
  }

  // AGENDA LOGICS
  function openAgendaModal(id = null) {
    const titleElem = document.getElementById('agendaModalTitle');
    if (id !== null) {
      titleElem.textContent = "Edit Agenda";
      const item = currentSchoolData.agenda.find(a => a.id === id);
      document.getElementById('agendaFormId').value = id;
      document.getElementById('agendaFormTitle').value = item.title;
      document.getElementById('agendaFormDate').value = item.date;
      document.getElementById('agendaFormTime').value = item.time;
      document.getElementById('agendaFormLocation').value = item.location;
    } else {
      titleElem.textContent = "Tambah Agenda Kegiatan";
      document.getElementById('agendaFormId').value = "";
      document.getElementById('agendaFormTitle').value = "";
      
      const today = new Date();
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      document.getElementById('agendaFormDate').value = today.getDate() + " " + months[today.getMonth()] + " " + today.getFullYear();
      document.getElementById('agendaFormTime').value = "08:00 - Selesai";
      document.getElementById('agendaFormLocation').value = "Aula Pertemuan Utama";
    }
    openModal('agendaModal');
  }

  function submitAgendaForm(e) {
    e.preventDefault();
    const id = document.getElementById('agendaFormId').value;
    const title = document.getElementById('agendaFormTitle').value;
    const date = document.getElementById('agendaFormDate').value;
    const time = document.getElementById('agendaFormTime').value;
    const location = document.getElementById('agendaFormLocation').value;

    if (id !== "") {
      const idx = currentSchoolData.agenda.findIndex(a => a.id == id);
      if (idx !== -1) {
        currentSchoolData.agenda[idx] = { id: Number(id), title, date, time, location };
      }
    } else {
      currentSchoolData.agenda.push({ id: Date.now(), title, date, time, location });
    }

    closeModal('agendaModal');
    applyPortalData();
    syncPortalDataToCloud("Agenda Terdekat");
  }

  function deleteAgenda(id) {
    if (confirm("Apakah Anda yakin ingin menghapus agenda kegiatan ini?")) {
      currentSchoolData.agenda = currentSchoolData.agenda.filter(a => a.id !== id);
      applyPortalData();
      syncPortalDataToCloud("Agenda Terdekat");
    }
  }

  // PROFILE CONFIG LOGICS
  function openProfileModal() {
    document.getElementById('profSchoolName').value = currentConfig.SCHOOL_NAME || "";
    document.getElementById('profSchoolSubtitle').value = currentConfig.SCHOOL_SUBTITLE || "";
    document.getElementById('profAccreditationRating').value = currentConfig.ACCREDITATION_RATING || "Akreditasi A";
    document.getElementById('profAccreditationDetail').value = currentConfig.ACCREDITATION_DETAIL || "Sangat Memuaskan (BAN-S/M)";
    document.getElementById('profAboutContent').value = currentConfig.ABOUT_CONTENT || "Sistem portal digital resmi AL-HIKAM SCHOOL. Menghubungkan seluruh layanan sekolah dalam satu pintu pintar berbasis komputasi awan.";
    document.getElementById('profVisi').value = currentConfig.VISI || '"Unggul dalam Prestasi, Terdepan dalam Teknologi, Berlandaskan Iman dan Taqwa."';
    document.getElementById('profMisi').value = currentConfig.MISI || "- Menyelenggarakan pendidikan holistik berbasis nilai islam.\\n- Meningkatkan literasi dan kemampuan teknologi informasi.\\n- Membina kemandirian dan jiwa kepemimpinan siswa.";
    document.getElementById('profWebsite').value = currentConfig.WEBSITE || "";
    document.getElementById('profEmail').value = currentConfig.EMAIL || "";
    document.getElementById('profWhatsapp').value = currentConfig.WHATSAPP || "";
    document.getElementById('profInstagram').value = currentConfig.INSTAGRAM || "";
    document.getElementById('profYoutube').value = currentConfig.YOUTUBE || "";
    document.getElementById('profFooterAddress').value = currentConfig.FOOTER_ADDRESS || "Jl. Raya Sendang Mulyo, Kec. sendang Agung, Kab. Lampung tengah, Prov. Lampung";
    document.getElementById('profFooterPhone').value = currentConfig.FOOTER_PHONE || "(031) 892-1234";
    document.getElementById('profFooterEmail').value = currentConfig.FOOTER_EMAIL || "info@smpalhikam.sch.id";
    document.getElementById('profFooterVersion').value = currentConfig.FOOTER_VERSION || "Portal v2.2.0";
    
    openModal('profileModal');
  }

  function submitProfileForm(e) {
    e.preventDefault();
    currentConfig.SCHOOL_NAME = document.getElementById('profSchoolName').value;
    currentConfig.SCHOOL_SUBTITLE = document.getElementById('profSchoolSubtitle').value;
    currentConfig.ACCREDITATION_RATING = document.getElementById('profAccreditationRating').value;
    currentConfig.ACCREDITATION_DETAIL = document.getElementById('profAccreditationDetail').value;
    currentConfig.ABOUT_CONTENT = document.getElementById('profAboutContent').value;
    currentConfig.VISI = document.getElementById('profVisi').value;
    currentConfig.MISI = document.getElementById('profMisi').value;
    currentConfig.WEBSITE = document.getElementById('profWebsite').value;
    currentConfig.EMAIL = document.getElementById('profEmail').value;
    currentConfig.WHATSAPP = document.getElementById('profWhatsapp').value;
    currentConfig.INSTAGRAM = document.getElementById('profInstagram').value;
    currentConfig.YOUTUBE = document.getElementById('profYoutube').value;
    currentConfig.FOOTER_ADDRESS = document.getElementById('profFooterAddress').value;
    currentConfig.FOOTER_PHONE = document.getElementById('profFooterPhone').value;
    currentConfig.FOOTER_EMAIL = document.getElementById('profFooterEmail').value;
    currentConfig.FOOTER_VERSION = document.getElementById('profFooterVersion').value;

    closeModal('profileModal');
    applyPortalData();
    syncPortalDataToCloud("Profil & Tampilan Portal");
  }

  // ADMIN PASSWORD CHANGING
  function openPasswordModal() {
    document.getElementById('passwordError').style.display = 'none';
    document.getElementById('passwordSuccess').style.display = 'none';
    document.getElementById('passOld').value = "";
    document.getElementById('passNew').value = "";
    document.getElementById('passConfirm').value = "";
    
    openModal('passwordModal');
  }

  function submitPasswordForm(e) {
    e.preventDefault();
    const oldPass = document.getElementById('passOld').value;
    const newPass = document.getElementById('passNew').value;
    const confirmPass = document.getElementById('passConfirm').value;
    
    const errAlert = document.getElementById('passwordError');
    const succAlert = document.getElementById('passwordSuccess');

    errAlert.style.display = 'none';
    succAlert.style.display = 'none';

    if (oldPass !== adminPasswordInput) {
      errAlert.textContent = "Kata sandi saat ini salah.";
      errAlert.style.display = 'block';
      return;
    }
    if (newPass.length < 4) {
      errAlert.textContent = "Kata sandi baru minimal 4 karakter.";
      errAlert.style.display = 'block';
      return;
    }
    if (newPass !== confirmPass) {
      errAlert.textContent = "Konfirmasi kata sandi baru tidak sesuai.";
      errAlert.style.display = 'block';
      return;
    }

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler(function() {
          adminPasswordInput = newPass;
          succAlert.textContent = "Kata sandi administrator berhasil diperbarui!";
          succAlert.style.display = 'block';
          setTimeout(() => closeModal('passwordModal'), 1500);
        })
        .withFailureHandler(function(err) {
          errAlert.textContent = "Gagal memperbarui sandi cloud: " + err;
          errAlert.style.display = 'block';
        })
        .updateAdminPassword(oldPass, newPass);
    } else {
      adminPasswordInput = newPass;
      succAlert.textContent = "Sandi offline diperbarui (Simulasi)!";
      succAlert.style.display = 'block';
      setTimeout(() => closeModal('passwordModal'), 1500);
    }
  }

  // Fallback Local Data loaders
  function loadFallbackLocalData() {
    // Config
    try {
      const c = localStorage.getItem('sim_portal_config');
      currentConfig = c ? JSON.parse(c) : getMockConfig();
    } catch(e) { currentConfig = getMockConfig(); }

    // Apps
    try {
      const a = localStorage.getItem('sim_portal_apps');
      currentApps = a ? JSON.parse(a) : getMockApps();
    } catch(e) { currentApps = getMockApps(); }

    // School Data
    try {
      const s = localStorage.getItem('sim_portal_school_data');
      currentSchoolData = s ? JSON.parse(s) : getMockSchoolData();
    } catch(e) { currentSchoolData = getMockSchoolData(); }

    applyPortalData();
    hideLoadingOverlay();
  }

  function handleFooterVersionClick() {
    openLoginModal();
  }

  function getMockConfig() {
    return {
      SCHOOL_NAME: "AL-HIKAM SCHOOL",
      SCHOOL_SUBTITLE: "Portal Digital & Website Resmi Sekolah",
      WEBSITE: "https://sekolahkita.sch.id",
      EMAIL: "mailto:info@smpalhikam.sch.id",
      WHATSAPP: "https://wa.me/6281234567890",
      INSTAGRAM: "https://instagram.com/smpalhikam_id",
      YOUTUBE: "https://youtube.com/c/smpalhikam_yt",
      ABOUT_CONTENT: "Sistem portal digital resmi AL-HIKAM SCHOOL. Menghubungkan seluruh layanan sekolah dalam satu pintu pintar berbasis komputasi awan.\\n\\nDengan komitmen mutu kependidikan terakreditasi BAN-S/M, kami mendidik santri-siswa yang berakhlak mulia, cakap teknologi, dan berprestasi unggul di era global.",
      VISI: '"Unggul dalam Prestasi, Terdepan dalam Teknologi, Berlandaskan Iman dan Taqwa."',
      MISI: "- Menyelenggarakan pendidikan holistik berbasis nilai islam.\\n- Meningkatkan literasi dan kemampuan teknologi informasi.\\n- Membina kemandirian dan jiwa kepemimpinan siswa.",
      ACCREDITATION_RATING: "Akreditasi A",
      ACCREDITATION_DETAIL: "Sangat Memuaskan (BAN-S/M)",
      FOOTER_ADDRESS: "Jl. Raya Sendang Mulyo, Kec. sendang Agung, Kab. Lampung tengah, Prov. Lampung",
      FOOTER_PHONE: "(031) 892-1234",
      FOOTER_EMAIL: "info@smpalhikam.sch.id",
      FOOTER_VERSION: "Portal v2.2.0"
    };
  }

  function getMockApps() {
    return [
      { title: "Arsip Digital", icon: "folder", description: "Sistem penyimpanan dokumen sekolah terpusat secara digital.", url: "#" },
      { title: "Manajemen Surat", icon: "mail", description: "Pencatatan, pengarsipan, dan disposisi surat masuk & keluar.", url: "#" },
      { title: "Keuangan Sekolah", icon: "payments", description: "Administrasi pembayaran kas dan pelaporan keuangan.", url: "#" },
      { title: "Absensi Elektronik", icon: "fact_check", description: "Rekapitulasi absensi harian guru, staf kependidikan, dan siswa.", url: "#" }
    ];
  }

  function getMockSchoolData() {
    return {
      announcements: [
        { id: 1, title: "Pendaftaran Siswa Baru (PPDB) Gelombang II", date: "02 Juli 2026", content: "Registrasi online untuk PPDB Gelombang kedua telah resmi dibuka.", category: "Penting", badgeColor: "#ef4444" }
      ],
      agenda: [
        { id: 1, title: "Rapat Pleno Komite & Wali Murid", date: "05 Juli 2026", time: "09:00 - Selesai", location: "Aula Utama" }
      ],
      news: [
        { id: 1, title: "Juara OSN Tingkat Nasional", date: "01 Juli 2026", summary: "Sekolah meraih medali emas bidang Fisika tingkat nasional.", image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400" }
      ],
      programs: [
        { title: "Tahfidz Al-Qur'an", icon: "workspace_premium", description: "Program akselerasi hafalan Juz Amma dan juz-juz pilihan dengan bimbingan ustadz-ustadzah bersertifikat." },
        { title: "Klinik Literasi & TIK", icon: "menu_book", description: "Pembelajaran coding dasar, desain grafis, robotika serta literasi digital untuk seluruh jenjang kelas." },
        { title: "Sains Club & OSN", icon: "school", description: "Bimbingan intensif persiapan Olimpiade Sains Nasional bidang Matematika, IPA, dan IPS Terpadu." }
      ],
      gallery: [
        { title: "Upacara Hari Lahir Pancasila", image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400" },
        { title: "Kegiatan Istighosah Akbar", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400" },
        { title: "Praktikum Laboratorium Komputer", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400" }
      ],
      faqs: [
        { question: "Bagaimana cara mendaftar menjadi siswa baru?", answer: "Pendaftaran siswa baru (PPDB) dapat diakses secara online melalui portal ini pada aplikasi PPDB Online, atau datang langsung ke sekretariat pendaftaran di kantor tata usaha." },
        { question: "Apakah ada program beasiswa bagi siswa berprestasi?", answer: "Ya, AL-HIKAM SCHOOL menyediakan beasiswa prestasi akademik, non-akademik, serta beasiswa tahfidz Al-Qur'an berupa keringanan biaya SPP bulanan." }
      ]
    };
  }

  document.addEventListener('DOMContentLoaded', initPortal);
</script>
`;
}

export function getIncludeHtmlTemplate(): string {
  return `<!--
  Portal Aplikasi Sekolah - include.html
  File penyisipan aset eksternal dan font dari CDN resmi Google.
-->

<!-- Google Fonts (Poppins) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- Material Symbols Rounded (Untuk Ikon Premium Mirip Google Workspace) -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
`;
}
