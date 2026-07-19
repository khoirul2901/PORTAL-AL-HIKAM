/**
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
      .setTitle('SMP AL-HIKAM')
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
  return {
    "SCHOOL_NAME": "SMP AL-HIKAM",
    "SCHOOL_SUBTITLE": "Portal Akademik & Layanan Digital",
    "APP_ARSIP": "https://script.google.com/macros/s/example-arsip/exec",
    "APP_SURAT": "https://script.google.com/macros/s/example-surat/exec",
    "APP_KEUANGAN": "https://script.google.com/macros/s/example-keuangan/exec",
    "APP_ABSENSI": "https://script.google.com/macros/s/example-absensi/exec",
    "APP_INVENTARIS": "https://script.google.com/macros/s/example-inventaris/exec",
    "APP_PERPUSTAKAAN": "https://script.google.com/macros/s/example-perpustakaan/exec",
    "APP_MONITORING": "https://script.google.com/macros/s/example-monitoring/exec",
    "LINK_DOWNLOAD_APK": "https://drive.google.com/drive/folders/example-apk-folder",
    "WEBSITE": "https://sekolahkita.sch.id",
    "EMAIL": "mailto:info@smpalhikam.sch.id",
    "WHATSAPP": "https://wa.me/6281234567890",
    "INSTAGRAM": "https://instagram.com/smpalhikam_id",
    "FACEBOOK": "https://facebook.com/smpalhikam.fb",
    "YOUTUBE": "https://youtube.com/c/smpalhikam_yt",
    "ABOUT_TITLE": "Mengenal SMP AL-HIKAM",
    "ABOUT_TEXT_1": "SMP AL-HIKAM Sidoarjo adalah sekolah menengah pertama yang berdedikasi tinggi melahirkan generasi rabbani yang cerdas secara akademik, mantap dalam spiritual, dan tangkas dalam menguasai teknologi informasi di era digital.",
    "ABOUT_TEXT_2": "Dengan menerapkan kurikulum nasional yang dipadukan dengan kurikulum kepesantrenan dan literasi digital, kami berkomitmen membentuk siswa yang tidak hanya unggul dalam prestasi intelektual namun juga memiliki karakter akhlakul karimah yang kokoh.",
    "ABOUT_VISI": "Unggul dalam Prestasi, Terdepan dalam Teknologi, Berlandaskan Iman dan Taqwa.",
    "ABOUT_MISI": "Menyelenggarakan pembelajaran berkualitas berbasis ICT (Information and Communication Technology).\nMembiasakan nilai-nilai islami dan ibadah harian secara istiqomah.\nMengembangkan minat bakat siswa di bidang riset, bahasa, olahraga, dan seni.",
    "ACCREDITATION_RATING": "Akreditasi A",
    "ACCREDITATION_DETAIL": "Sangat Memuaskan (BAN-S/M)",
    "FOOTER_ADDRESS": "Jl. Raya Candi No. 45, Kecamatan Candi, Kabupaten Sidoarjo, Jawa Timur 61271",
    "FOOTER_PHONE": "(031) 892-1234",
    "FOOTER_EMAIL": "info@smpalhikam.sch.id",
    "FOOTER_COPYRIGHT": "&copy; 2026 SMP AL-HIKAM Sidoarjo. Hak Cipta Dilindungi Undang-Undang.",
    "FOOTER_VERSION": "Portal v2.2.0"
  };
}

function getDefaultApps() {
  return [
    {
      "title": "Arsip Digital",
      "icon": "folder",
      "description": "Sistem penyimpanan dan pengelolaan dokumen sekolah terpusat secara digital.",
      "url": "https://script.google.com/macros/s/example-arsip/exec"
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
  return {
    "announcements": [
      {
        "id": 1,
        "title": "Pendaftaran Siswa Baru (PPDB) Gelombang II",
        "date": "02 Juli 2026",
        "content": "Pendaftaran Peserta Didik Baru (PPDB) gelombang kedua telah resmi dibuka mulai hari ini hingga tanggal 15 Juli 2026. Silakan akses portal PPDB untuk registrasi online.",
        "category": "Penting",
        "badgeColor": "#ef4444"
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
    ],
    "programs": [
      {
        "id": 1,
        "title": "Tahfidzul Qur'an",
        "icon": "menu_book",
        "description": "Bimbingan hafalan Al-Qur'an mutqin minimal 2-3 Juz selama masa belajar."
      },
      {
        "id": 2,
        "title": "Bilingual Class Program",
        "icon": "translate",
        "description": "Penggunaan Bahasa Inggris sebagai bahasa pengantar pada mata pelajaran sains pilihan."
      },
      {
        "id": 3,
        "title": "Digital Classroom",
        "icon": "computer",
        "description": "Interaksi belajar paperless memanfaatkan Chromebook dan Google Workspace."
      },
      {
        "id": 4,
        "title": "Robotics & Coding Club",
        "icon": "precision_manufacturing",
        "description": "Pelatihan logika pemrograman, sains robotika, dan pembuatan aplikasi mini."
      }
    ],
    "gallery": [
      {
        "id": 1,
        "title": "Kelas Digital",
        "image": "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=600"
      },
      {
        "id": 2,
        "title": "Lab Komputer",
        "image": "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600"
      },
      {
        "id": 3,
        "title": "Gedung Sekolah",
        "image": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600"
      },
      {
        "id": 4,
        "title": "Rapat Guru",
        "image": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600"
      },
      {
        "id": 5,
        "title": "Ekstrakurikuler",
        "image": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600"
      },
      {
        "id": 6,
        "title": "Perpustakaan",
        "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600"
      },
      {
        "id": 7,
        "title": "Upacara Bendera",
        "image": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600"
      },
      {
        "id": 8,
        "title": "Wisuda Tahfidz",
        "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600"
      }
    ],
    "faqs": [
      {
        "id": 1,
        "question": "Bagaimana cara masuk (login) ke portal pengelola?",
        "answer": "Hanya petugas pengelola (Administrator) yang memerlukan login. Caranya adalah mengeklik tombol \"Admin Login\" di pojok kanan atas, lalu memasukkan kata sandi rahasia administrator Anda. Pengguna umum, wali murid, dan siswa dapat langsung memanfaatkan seluruh tautan launcher aplikasi tanpa perlu login."
      },
      {
        "id": 2,
        "question": "Apa saja jenis layanan digital yang dapat diakses di sini?",
        "answer": "Portal ini menampung berbagai aplikasi penting seperti <strong>Arsip Digital Sekolah</strong>, <strong>Sistem Manajemen Surat Menyurat</strong>, <strong>Administrasi Keuangan</strong>, <strong>Absensi Elektronik</strong>, <strong>Perpustakaan Online</strong>, serta pengumuman rilis dan agenda operasional sekolah."
      },
      {
        "id": 3,
        "question": "Bagaimana cara menghubungi pihak sekolah atau layanan helpdesk?",
        "answer": "Anda dapat menggunakan kolom <strong>\"Tautan Cepat\"</strong> di bawah bagian hero untuk langsung tersambung ke WhatsApp Hubungi Kami, Email Resmi, Akun Instagram, dan YouTube Channel resmi sekolah."
      },
      {
        "id": 4,
        "question": "Bagaimana cara mengakses menu perpustakaan digital?",
        "answer": "Silakan cari kartu aplikasi bernama <strong>\"Perpustakaan Online\"</strong> di baris grid aplikasi, lalu klik kartu tersebut. Sistem akan membuka tab baru dan mengarahkan Anda langsung ke katalog perpustakaan digital SMP AL-HIKAM."
      },
      {
        "id": 5,
        "question": "Bagaimana jika administrator lupa kata sandi login?",
        "answer": "Jika Anda lupa sandi administrator, harap hubungi tim IT Administrator SMP AL-HIKAM atau Anda dapat mereset nilai kunci <code>portal_admin_password</code> secara langsung pada menu <strong>Script Properties</strong> di Konsol Google Apps Script."
      }
    ]
  };
}

function getDefaultAdminPassword() {
  return "admin";
}
