import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExtendedAppConfig } from '../defaultData';
import { AppItem, AnnouncementItem, AgendaItem, NewsItem, SchoolData, ProgramItem, GalleryItem, FaqItem } from '../types';

interface PortalPreviewProps {
  config: ExtendedAppConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedAppConfig>>;
  apps: AppItem[];
  setApps: React.Dispatch<React.SetStateAction<AppItem[]>>;
  schoolData: SchoolData;
  setSchoolData: React.Dispatch<React.SetStateAction<SchoolData>>;
  adminPassword: string;
  setAdminPassword: React.Dispatch<React.SetStateAction<string>>;
}

export default function PortalPreview({
  config,
  setConfig,
  apps,
  setApps,
  schoolData,
  setSchoolData,
  adminPassword,
  setAdminPassword
}: PortalPreviewProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'announcements' | 'news'>('announcements');
  const [currentTime, setCurrentTime] = useState('');
  
  // Admin Authentication States
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin CRUD Modal States
  const [activeModal, setActiveModal] = useState<'app' | 'announcement' | 'news' | 'agenda' | 'profile' | 'password' | 'program' | 'gallery' | 'faq' | null>(null);
  
  // Entity Form States
  const [appForm, setAppForm] = useState<AppItem & { index?: number }>({ title: '', icon: 'folder', description: '', url: '' });
  const [announcementForm, setAnnouncementForm] = useState<AnnouncementItem & { isNew?: boolean }>({ id: 0, title: '', date: '', content: '', category: 'Umum', badgeColor: '#3b82f6' });
  const [newsForm, setNewsForm] = useState<NewsItem & { isNew?: boolean }>({ id: 0, title: '', date: '', summary: '', image: '' });
  const [agendaForm, setAgendaForm] = useState<AgendaItem & { isNew?: boolean }>({ id: 0, title: '', date: '', time: '', location: '' });
  const [programForm, setProgramForm] = useState<ProgramItem & { isNew?: boolean }>({ id: 0, title: '', description: '', icon: 'star' });
  const [galleryForm, setGalleryForm] = useState<GalleryItem & { isNew?: boolean }>({ id: 0, title: '', image: '' });
  const [faqForm, setFaqForm] = useState<FaqItem & { isNew?: boolean }>({ id: 0, question: '', answer: '' });
  
  // Extended Config Form State
  const [configForm, setConfigForm] = useState<ExtendedAppConfig>({ ...config });
  
  // Password Form State
  const [passwordForm, setPasswordForm] = useState({ oldPass: '', newPass: '', confirmPass: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Realtime clock
  useEffect(() => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const updateClock = () => {
      const now = new Date();
      const dayName = days[now.getDay()];
      const dayNum = String(now.getDate()).padStart(2, '0');
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      setCurrentTime(`${dayName}, ${dayNum} ${monthName} ${year} • ${hours}:${minutes}:${seconds} WIB`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync configForm state when config prop changes
  useEffect(() => {
    setConfigForm({ ...config });
  }, [config]);

  // Filter apps
  const filteredApps = apps.filter(app => 
    app.title.toLowerCase().includes(search.toLowerCase().trim()) || 
    app.description.toLowerCase().includes(search.toLowerCase().trim())
  );

  // Custom ripple trigger
  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(card.clientWidth, card.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    const rect = card.getBoundingClientRect();
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.style.position = 'absolute';
    circle.className = 'absolute bg-[#0b57d0]/15 dark:bg-[#a8c7fa]/15 rounded-full scale-0 animate-[ripple_0.6s_linear] pointer-events-none';

    const prevRipple = card.querySelector('.ripple-element');
    if (prevRipple) prevRipple.remove();
    circle.classList.add('ripple-element');

    card.appendChild(circle);
  };

  // Authenticate Admin
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === adminPassword) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setLoginError('');
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Kombinasi Username atau Kata Sandi salah.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setActiveModal(null);
  };

  // APP CARD CRUD HANDLERS
  const openAppModal = (app?: AppItem, index?: number) => {
    if (app && index !== undefined) {
      setAppForm({ ...app, index });
    } else {
      setAppForm({ title: '', icon: 'folder', description: '', url: '' });
    }
    setActiveModal('app');
  };

  const saveApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appForm.title.trim() || !appForm.url.trim()) return;

    const newApp: AppItem = {
      title: appForm.title,
      icon: appForm.icon,
      description: appForm.description,
      url: appForm.url
    };

    if (appForm.index !== undefined) {
      // Edit
      const updated = [...apps];
      updated[appForm.index] = newApp;
      setApps(updated);
    } else {
      // Create
      setApps([...apps, newApp]);
    }
    setActiveModal(null);
  };

  const deleteApp = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus aplikasi/layanan ini?')) {
      const updated = apps.filter((_, i) => i !== index);
      setApps(updated);
    }
  };

  // ANNOUNCEMENTS CRUD HANDLERS
  const openAnnouncementModal = (ann?: AnnouncementItem) => {
    if (ann) {
      setAnnouncementForm({ ...ann, isNew: false });
    } else {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const dateStr = `${day} ${months[today.getMonth()]} ${today.getFullYear()}`;
      
      setAnnouncementForm({
        id: Date.now(),
        title: '',
        date: dateStr,
        content: '',
        category: 'Penting',
        badgeColor: '#ef4444',
        isNew: true
      });
    }
    setActiveModal('announcement');
  };

  const saveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementForm.title.trim() || !announcementForm.content.trim()) return;

    const updatedAnnouncements = [...schoolData.announcements];
    if (announcementForm.isNew) {
      const { isNew, ...cleanItem } = announcementForm;
      updatedAnnouncements.unshift(cleanItem);
    } else {
      const index = updatedAnnouncements.findIndex(item => item.id === announcementForm.id);
      if (index !== -1) {
        const { isNew, ...cleanItem } = announcementForm;
        updatedAnnouncements[index] = cleanItem;
      }
    }

    setSchoolData({ ...schoolData, announcements: updatedAnnouncements });
    setActiveModal(null);
  };

  const deleteAnnouncement = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      const updated = schoolData.announcements.filter(item => item.id !== id);
      setSchoolData({ ...schoolData, announcements: updated });
    }
  };

  // NEWS CRUD HANDLERS
  const openNewsModal = (item?: NewsItem) => {
    if (item) {
      setNewsForm({ ...item, isNew: false });
    } else {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const dateStr = `${day} ${months[today.getMonth()]} ${today.getFullYear()}`;

      setNewsForm({
        id: Date.now(),
        title: '',
        date: dateStr,
        summary: '',
        image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400',
        isNew: true
      });
    }
    setActiveModal('news');
  };

  const saveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title.trim() || !newsForm.summary.trim()) return;

    const updatedNews = [...schoolData.news];
    if (newsForm.isNew) {
      const { isNew, ...cleanItem } = newsForm;
      updatedNews.unshift(cleanItem);
    } else {
      const index = updatedNews.findIndex(item => item.id === newsForm.id);
      if (index !== -1) {
        const { isNew, ...cleanItem } = newsForm;
        updatedNews[index] = cleanItem;
      }
    }

    setSchoolData({ ...schoolData, news: updatedNews });
    setActiveModal(null);
  };

  const deleteNews = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      const updated = schoolData.news.filter(item => item.id !== id);
      setSchoolData({ ...schoolData, news: updated });
    }
  };

  // AGENDA CRUD HANDLERS
  const openAgendaModal = (item?: AgendaItem) => {
    if (item) {
      setAgendaForm({ ...item, isNew: false });
    } else {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const dateStr = `${day} ${months[today.getMonth()]} ${today.getFullYear()}`;

      setAgendaForm({
        id: Date.now(),
        title: '',
        date: dateStr,
        time: '08:00 - selesai',
        location: 'Aula Sekolah',
        isNew: true
      });
    }
    setActiveModal('agenda');
  };

  const saveAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaForm.title.trim() || !agendaForm.date.trim()) return;

    const updatedAgenda = [...schoolData.agenda];
    if (agendaForm.isNew) {
      const { isNew, ...cleanItem } = agendaForm;
      updatedAgenda.push(cleanItem);
    } else {
      const index = updatedAgenda.findIndex(item => item.id === agendaForm.id);
      if (index !== -1) {
        const { isNew, ...cleanItem } = agendaForm;
        updatedAgenda[index] = cleanItem;
      }
    }

    setSchoolData({ ...schoolData, agenda: updatedAgenda });
    setActiveModal(null);
  };

  const deleteAgenda = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus agenda ini?')) {
      const updated = schoolData.agenda.filter(item => item.id !== id);
      setSchoolData({ ...schoolData, agenda: updated });
    }
  };

  // PROGRAMS CRUD HANDLERS
  const openProgramModal = (item?: ProgramItem) => {
    if (item) {
      setProgramForm({ ...item, isNew: false });
    } else {
      setProgramForm({ id: Date.now(), title: '', description: '', icon: 'star', isNew: true });
    }
    setActiveModal('program');
  };

  const saveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!programForm.title.trim() || !programForm.description.trim()) return;

    const updatedPrograms = [...(schoolData.programs || [])];
    if (programForm.isNew) {
      const { isNew, ...cleanItem } = programForm;
      updatedPrograms.push(cleanItem);
    } else {
      const index = updatedPrograms.findIndex(item => item.id === programForm.id);
      if (index !== -1) {
        const { isNew, ...cleanItem } = programForm;
        updatedPrograms[index] = cleanItem;
      }
    }

    setSchoolData({ ...schoolData, programs: updatedPrograms });
    setActiveModal(null);
  };

  const deleteProgram = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus program unggulan ini?')) {
      const updated = (schoolData.programs || []).filter(item => item.id !== id);
      setSchoolData({ ...schoolData, programs: updated });
    }
  };

  // GALLERY CRUD HANDLERS
  const openGalleryModal = (item?: GalleryItem) => {
    if (item) {
      setGalleryForm({ ...item, isNew: false });
    } else {
      setGalleryForm({ id: Date.now(), title: '', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400', isNew: true });
    }
    setActiveModal('gallery');
  };

  const saveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title.trim() || !galleryForm.image.trim()) return;

    const updatedGallery = [...(schoolData.gallery || [])];
    if (galleryForm.isNew) {
      const { isNew, ...cleanItem } = galleryForm;
      updatedGallery.push(cleanItem);
    } else {
      const index = updatedGallery.findIndex(item => item.id === galleryForm.id);
      if (index !== -1) {
        const { isNew, ...cleanItem } = galleryForm;
        updatedGallery[index] = cleanItem;
      }
    }

    setSchoolData({ ...schoolData, gallery: updatedGallery });
    setActiveModal(null);
  };

  const deleteGallery = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus foto galeri ini?')) {
      const updated = (schoolData.gallery || []).filter(item => item.id !== id);
      setSchoolData({ ...schoolData, gallery: updated });
    }
  };

  // FAQ CRUD HANDLERS
  const openFaqModal = (item?: FaqItem) => {
    if (item) {
      setFaqForm({ ...item, isNew: false });
    } else {
      setFaqForm({ id: Date.now(), question: '', answer: '', isNew: true });
    }
    setActiveModal('faq');
  };

  const saveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return;

    const updatedFaqs = [...(schoolData.faqs || [])];
    if (faqForm.isNew) {
      const { isNew, ...cleanItem } = faqForm;
      updatedFaqs.push(cleanItem);
    } else {
      const index = updatedFaqs.findIndex(item => item.id === faqForm.id);
      if (index !== -1) {
        const { isNew, ...cleanItem } = faqForm;
        updatedFaqs[index] = cleanItem;
      }
    }

    setSchoolData({ ...schoolData, faqs: updatedFaqs });
    setActiveModal(null);
  };

  const deleteFaq = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) {
      const updated = (schoolData.faqs || []).filter(item => item.id !== id);
      setSchoolData({ ...schoolData, faqs: updated });
    }
  };

  // SCHOOL CONFIG HANDLERS
  const saveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setConfig(configForm);
    setActiveModal(null);
  };

  // CHANGE PASSWORD HANDLER
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.oldPass !== adminPassword) {
      setPasswordError('Sandi lama Anda salah.');
      return;
    }
    if (passwordForm.newPass.length < 4) {
      setPasswordError('Sandi baru harus minimal 4 karakter.');
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirmPass) {
      setPasswordError('Konfirmasi sandi baru tidak sesuai.');
      return;
    }

    setAdminPassword(passwordForm.newPass);
    setPasswordSuccess('Sandi administrator berhasil diperbarui!');
    setPasswordForm({ oldPass: '', newPass: '', confirmPass: '' });
    
    setTimeout(() => {
      setActiveModal(null);
      setPasswordSuccess('');
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen transition-all duration-500 font-sans pb-12 flex flex-col text-white"
      style={{
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #0b1329 0%, #1e1b4b 50%, #111827 100%)'
          : 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #93c5fd 100%)'
      }}
    >
      {/* SCOPED PREVIEW STYLING */}
      <style>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>

      {/* ADMIN CONTROL BAR (IF LOGGED IN) */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-emerald-600 text-white text-xs py-2 px-6 flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-emerald-500 shadow-md font-semibold z-50 sticky top-0"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <span>MODE ADMIN AKTIF — Kelola Seluruh Data & Tampilan Portal</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button 
                onClick={() => setActiveModal('profile')}
                className="bg-white/20 hover:bg-white/35 border border-white/25 px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-rounded text-sm">settings</span> Profil & Tautan
              </button>
              <button 
                onClick={() => openAppModal()}
                className="bg-white/20 hover:bg-white/35 border border-white/25 px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-rounded text-sm">add_box</span> Tambah Aplikasi
              </button>
              <button 
                onClick={() => {
                  setPasswordForm({ oldPass: '', newPass: '', confirmPass: '' });
                  setPasswordError('');
                  setPasswordSuccess('');
                  setActiveModal('password');
                }}
                className="bg-white/20 hover:bg-white/35 border border-white/25 px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-rounded text-sm">lock_reset</span> Ganti Sandi
              </button>
              <button 
                onClick={handleLogout}
                className="bg-red-700 hover:bg-red-800 border border-red-500/30 px-3 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-rounded text-sm">logout</span> Keluar Admin
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STICKY HEADER */}
      <header className={`sticky top-4 z-40 backdrop-blur-xl border transition-all duration-300 py-4 px-6 rounded-2xl mx-4 sm:mx-6 shadow-2xl ${
        isAdmin ? 'mt-4' : ''
      } ${
        theme === 'dark' 
          ? 'bg-black/30 border-white/10 text-white' 
          : 'bg-white/20 border-white/30 text-white'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 border border-white/30 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
              {config.SCHOOL_NAME ? config.SCHOOL_NAME.charAt(0) : 'S'}
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-base sm:text-lg font-black leading-none tracking-tight text-white uppercase">{config.SCHOOL_NAME}</h1>
              <span className="text-xs mt-1 text-white/70">
                {config.SCHOOL_SUBTITLE}
              </span>
            </div>
          </div>

          {/* Time, Theme, and Login Admin */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {/* Realtime Clock Widget */}
            <div className={`px-4 py-1.5 rounded-full text-xs font-semibold shadow-inner transition-all duration-300 flex items-center gap-2 ${
              theme === 'dark' 
                ? 'bg-black/20 text-white/90 border border-white/10' 
                : 'bg-white/15 text-white border border-white/20'
            }`}>
              <span className="material-symbols-rounded text-sm">schedule</span>
              <span>{currentTime || 'Memuat...'}</span>
            </div>

            {/* Theme Toggle Controls */}
            <div className={`flex items-center p-1 rounded-full border transition-all duration-300 ${
              theme === 'dark' ? 'bg-black/30 border-white/10' : 'bg-white/10 border-white/20'
            }`}>
              <button 
                onClick={() => setTheme('light')}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  theme === 'light' 
                    ? 'bg-white/30 text-white shadow-sm' 
                    : 'text-white/60 hover:text-white'
                }`}
                aria-label="Mode Terang"
              >
                <span className="material-symbols-rounded text-lg">light_mode</span>
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  theme === 'dark' 
                    ? 'bg-black/40 text-white shadow-sm' 
                    : 'text-white/60 hover:text-white'
                }`}
                aria-label="Mode Gelap"
              >
                <span className="material-symbols-rounded text-lg">dark_mode</span>
              </button>
            </div>

            {/* Admin Access Button */}
            {!isAdmin && (
              <button
                onClick={() => setShowLoginModal(true)}
                className={`px-3 py-1.5 rounded-full border transition-all duration-300 flex items-center gap-1.5 text-xs font-semibold hover:scale-105 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-indigo-500/20 border-indigo-400/30 text-indigo-200 hover:bg-indigo-500/35'
                    : 'bg-white/20 border-white/30 text-white hover:bg-white/30 shadow-md'
                }`}
              >
                <span className="material-symbols-rounded text-sm">lock</span>
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-6 text-center text-white">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-white mb-4 uppercase tracking-wider backdrop-blur-md">
          <span className="material-symbols-rounded text-[14px]">verified_user</span> Portal Terverifikasi
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-white drop-shadow-md leading-tight">
          Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-100 to-white">Portal Digital</span>
        </h2>
        <p className="text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed text-white/80 font-medium drop-shadow-sm">
          Satu pintu untuk seluruh layanan digital sekolah Anda. Kelola arsip, keuangan, absensi, 
          dan pustaka secara efisien dalam ekosistem cloud terintegrasi.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
            search
          </span>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari aplikasi atau layanan..."
            className={`w-full py-3 pl-12 pr-10 rounded-full text-sm font-medium transition-all shadow-xl focus:outline-none focus:ring-2 focus:ring-white/40 ${
              theme === 'dark' 
                ? 'bg-black/35 border border-white/20 text-white placeholder-white/40 focus:bg-black/50' 
                : 'bg-white/20 border border-white/30 text-white placeholder-white/60 focus:bg-white/30'
            } backdrop-blur-md`}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform text-white/60 hover:text-white"
              title="Bersihkan Pencarian"
            >
              <span className="material-symbols-rounded text-lg">close</span>
            </button>
          )}
        </div>
      </section>

      {/* QUICK ACCESS BAR */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 w-full">
        <div className={`p-4 rounded-2xl border transition-all ${
          theme === 'dark' ? 'bg-black/25 border-white/10 shadow-lg text-white' : 'bg-white/15 border-white/20 shadow-lg text-white'
        } backdrop-blur-md`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/70">
              <span className="material-symbols-rounded text-blue-500">link</span> Tautan Cepat:
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <a 
                href={config.WEBSITE} 
                target="_blank" 
                rel="noreferrer"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10 text-white hover:bg-white/15 hover:border-white/20' 
                    : 'bg-white/15 border-white/20 text-white hover:bg-white/30 hover:border-white/35 shadow-sm'
                }`}
              >
                <span className="material-symbols-rounded text-sm">language</span> Website Sekolah
              </a>
              <a 
                href={config.EMAIL} 
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10 text-white hover:bg-white/15 hover:border-white/20' 
                    : 'bg-white/15 border-white/20 text-white hover:bg-white/30 hover:border-white/35 shadow-sm'
                }`}
              >
                <span className="material-symbols-rounded text-sm">alternate_email</span> Email
              </a>
              <a 
                href={config.WHATSAPP} 
                target="_blank" 
                rel="noreferrer"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  theme === 'dark'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                    : 'border-emerald-400/30 bg-emerald-400/20 text-white hover:bg-emerald-400/35 shadow-sm'
                }`}
              >
                <span className="material-symbols-rounded text-sm">chat</span> WhatsApp
              </a>
              <a 
                href={config.INSTAGRAM} 
                target="_blank" 
                rel="noreferrer"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  theme === 'dark'
                    ? 'border-pink-500/30 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20'
                    : 'border-pink-400/30 bg-pink-400/20 text-white hover:bg-pink-400/35 shadow-sm'
                }`}
              >
                <span className="material-symbols-rounded text-sm">photo_camera</span> Instagram
              </a>
              <a 
                href={config.YOUTUBE} 
                target="_blank" 
                rel="noreferrer"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  theme === 'dark'
                    ? 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                    : 'border-rose-400/30 bg-rose-400/20 text-white hover:bg-rose-400/35 shadow-sm'
                }`}
              >
                <span className="material-symbols-rounded text-sm">video_library</span> YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* APPS GRID LAUNCHER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-10 w-full flex-1">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold flex items-center gap-2 text-white">
            <span className="material-symbols-rounded text-white/90">apps</span> Dashboard Aplikasi Sekolah
          </h3>
          {isAdmin && (
            <button 
              onClick={() => openAppModal()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-rounded text-base">add</span> Tambah Aplikasi
            </button>
          )}
        </div>

        {/* Dynamic Cards */}
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredApps.map((app, index) => (
              <div key={index} className="relative group">
                <a 
                  href={app.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleCardClick}
                  className={`block p-5 rounded-2xl border flex flex-col items-start relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-xl backdrop-blur-md ${
                    theme === 'dark' 
                      ? 'bg-black/35 hover:bg-black/50 border-white/10 hover:border-white/20' 
                      : 'bg-white/15 hover:bg-white/25 border-white/25 hover:border-white/35'
                  }`}
                >
                  {/* Visual Circle Overlay */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-white/5 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                  {/* Styled App Icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 transition-all duration-300 group-hover:scale-110 shadow-inner ${
                    theme === 'dark' 
                      ? 'bg-white/10 text-white' 
                      : 'bg-white/25 text-white'
                  }`}>
                    <span className="material-symbols-rounded">{app.icon}</span>
                  </div>

                  <h4 className="text-sm font-bold mb-1.5 text-white group-hover:text-white/90 transition-colors">
                    {app.title}
                  </h4>
                  <p className="text-xs leading-relaxed text-left text-white/70 group-hover:text-white/80 transition-colors">
                    {app.description}
                  </p>
                </a>

                {/* Edit Controls for Admin on Hover */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); openAppModal(app, index); }}
                      className="w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-amber-600 transition-colors cursor-pointer"
                      title="Edit Layanan"
                    >
                      <span className="material-symbols-rounded text-sm">edit</span>
                    </button>
                    <button 
                      onClick={(e) => deleteApp(index, e)}
                      className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors cursor-pointer"
                      title="Hapus Layanan"
                    >
                      <span className="material-symbols-rounded text-sm">delete</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={`p-10 border rounded-2xl text-center flex flex-col items-center justify-center gap-3 backdrop-blur-md ${
            theme === 'dark' ? 'bg-black/30 border-white/10 text-white/80' : 'bg-white/15 border-white/20 text-white/90'
          }`}>
            <span className="material-symbols-rounded text-4xl text-white/60">search_off</span>
            <h4 className="font-semibold text-base">Layanan Tidak Ditemukan</h4>
            <p className="text-xs max-w-sm text-white/70">
              Maaf, tidak ada aplikasi sekolah yang cocok dengan kata kunci "{search}". Silakan coba kata kunci lain.
            </p>
          </div>
        )}
      </section>

      {/* INFORMATION SECTION (ANNOUNCEMENT, EVENTS, NEWS) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Announcements & News Tab Column */}
          <div className={`p-5 rounded-2xl border lg:col-span-2 backdrop-blur-md shadow-xl ${
            theme === 'dark' ? 'bg-black/25 border-white/10 text-white' : 'bg-white/15 border-white/20 text-white'
          }`}>
            <div className="flex border-b border-white/10 pb-2.5 mb-4 justify-between items-center" role="tablist">
              <div className="flex gap-4">
                <button 
                  role="tab"
                  aria-selected={activeTab === 'announcements'}
                  onClick={() => setActiveTab('announcements')}
                  className={`text-sm font-bold pb-2.5 relative transition-colors ${
                    activeTab === 'announcements' 
                      ? 'text-white' 
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  Pengumuman Terbaru
                  {activeTab === 'announcements' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                  )}
                </button>
                <button 
                  role="tab"
                  aria-selected={activeTab === 'news'}
                  onClick={() => setActiveTab('news')}
                  className={`text-sm font-bold pb-2.5 relative transition-colors ${
                    activeTab === 'news' 
                      ? 'text-white' 
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  Berita & Prestasi
                  {activeTab === 'news' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                  )}
                </button>
              </div>

              {/* Add Button for Admins */}
              {isAdmin && (
                <button
                  onClick={() => activeTab === 'announcements' ? openAnnouncementModal() : openNewsModal()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] px-2.5 py-1 rounded-md font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-rounded text-xs">add</span>
                  <span>{activeTab === 'announcements' ? 'Pengumuman' : 'Berita'}</span>
                </button>
              )}
            </div>

            {/* Announcements Content */}
            {activeTab === 'announcements' && (
              <div className="flex flex-col gap-3.5 animate-[fadeIn_0.3s_ease]">
                {schoolData.announcements.map((ann) => (
                  <div 
                    key={ann.id}
                    className={`p-4 rounded-xl border transition-all hover:translate-x-1 backdrop-blur-sm text-left relative group/item ${
                      theme === 'dark' 
                        ? 'bg-black/30 border-white/10 hover:border-white/20' 
                        : 'bg-white/10 border-white/20 hover:border-white/30'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm" style={{ backgroundColor: ann.badgeColor }}>
                        {ann.category}
                      </span>
                      <span className="text-[10px] text-white/60">
                        {ann.date}
                      </span>
                    </div>
                    <h5 className="text-xs sm:text-sm font-bold mb-1.5 text-white pr-16">{ann.title}</h5>
                    <p className="text-[11px] sm:text-xs leading-relaxed text-white/70">
                      {ann.content}
                    </p>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openAnnouncementModal(ann)}
                          className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center hover:bg-amber-600 text-white cursor-pointer"
                        >
                          <span className="material-symbols-rounded text-xs">edit</span>
                        </button>
                        <button 
                          onClick={(e) => deleteAnnouncement(ann.id, e)}
                          className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 text-white cursor-pointer"
                        >
                          <span className="material-symbols-rounded text-xs">delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* News Content */}
            {activeTab === 'news' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-[fadeIn_0.3s_ease]">
                {schoolData.news.map((item) => (
                  <div 
                    key={item.id}
                    className={`rounded-xl border overflow-hidden flex flex-col hover:translate-y-[-2px] transition-all backdrop-blur-sm text-left relative group/item ${
                      theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white/10 border-white/20 text-white'
                    }`}
                  >
                    <img className="w-full h-28 object-cover filter brightness-95" src={item.image} alt={item.title} />
                    <div className="p-3.5 flex flex-col flex-1 gap-1.5">
                      <span className="text-[10px] text-white/60">
                        {item.date}
                      </span>
                      <h5 className="text-xs font-bold leading-snug line-clamp-2 text-white">{item.title}</h5>
                      <p className="text-[11px] leading-relaxed line-clamp-2 text-white/70">
                        {item.summary}
                      </p>
                    </div>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity bg-black/50 p-1.5 rounded-xl backdrop-blur-sm">
                        <button 
                          onClick={() => openNewsModal(item)}
                          className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center hover:bg-amber-600 text-white cursor-pointer"
                        >
                          <span className="material-symbols-rounded text-xs">edit</span>
                        </button>
                        <button 
                          onClick={(e) => deleteNews(item.id, e)}
                          className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 text-white cursor-pointer"
                        >
                          <span className="material-symbols-rounded text-xs">delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Agenda Column */}
          <div className={`p-5 rounded-2xl border backdrop-blur-md shadow-xl ${
            theme === 'dark' ? 'bg-black/25 border-white/10 text-white' : 'bg-white/15 border-white/20 text-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold flex items-center gap-1.5 text-white">
                <span className="material-symbols-rounded text-white/90 text-lg">calendar_month</span> Agenda Terdekat
              </h3>
              {isAdmin && (
                <button
                  onClick={() => openAgendaModal()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-2 py-1 rounded-md font-bold flex items-center gap-0.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-rounded text-[10px]">add</span> Tambah
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {schoolData.agenda.map((item) => {
                const parts = item.date.split(' ');
                const day = parts[0] || '00';
                const month = (parts[1] || 'SCH').substring(0, 3);

                return (
                  <div 
                    key={item.id}
                    className={`flex gap-3 p-3 rounded-xl border transition-transform hover:translate-y-[-2px] backdrop-blur-sm relative group/item ${
                      theme === 'dark' ? 'bg-black/35 border-white/10' : 'bg-white/10 border-white/20'
                    }`}
                  >
                    <div className={`min-w-[48px] h-12 rounded-lg flex flex-col items-center justify-center p-1 text-center font-bold ${
                      theme === 'dark' ? 'bg-white/10 text-white border border-white/15' : 'bg-white/20 text-white border border-white/25'
                    }`}>
                      <span className="text-base font-extrabold leading-none">{day}</span>
                      <span className="text-[9px] uppercase tracking-wider leading-none mt-1">{month}</span>
                    </div>
                    <div className="flex flex-col justify-center gap-0.5 text-left pr-12">
                      <h5 className="text-xs font-bold leading-tight text-white">{item.title}</h5>
                      <span className="text-[10px] flex items-center gap-1 text-white/70">
                        <span className="material-symbols-rounded text-xs text-white/80 animate-pulse">schedule</span> 
                        {item.time} | {item.location}
                      </span>
                    </div>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openAgendaModal(item)}
                          className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center hover:bg-amber-600 text-white cursor-pointer"
                        >
                          <span className="material-symbols-rounded text-[10px]">edit</span>
                        </button>
                        <button 
                          onClick={(e) => deleteAgenda(item.id, e)}
                          className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 text-white cursor-pointer"
                        >
                          <span className="material-symbols-rounded text-[10px]">delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: PROFIL LEMBAGA & AKREDITASI */}
      <section id="profil-lembaga" className="max-w-6xl mx-auto px-4 sm:px-6 w-full mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* About Us Column */}
          <div className={`p-6 rounded-2xl border backdrop-blur-md shadow-xl lg:col-span-2 text-left relative group ${
            theme === 'dark' ? 'bg-black/25 border-white/10 text-white' : 'bg-white/15 border-white/20 text-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-rounded text-white/90">domain</span> {config.ABOUT_TITLE || "Profil Lembaga"}
              </h3>
              {isAdmin && (
                <button
                  onClick={() => setActiveModal('profile')}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] px-2 py-1 rounded-md font-bold flex items-center gap-0.5 transition-all cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-rounded text-xs">edit</span> Edit Profil
                </button>
              )}
            </div>
            
            <div className="flex flex-col gap-4 text-xs leading-relaxed text-white/80">
              <p>{config.ABOUT_TEXT_1}</p>
              <p>{config.ABOUT_TEXT_2}</p>
              
              <div className="border-t border-white/10 pt-4 mt-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-white mb-2">Visi Sekolah</h4>
                <p className="italic text-sm font-medium text-white/95">
                  "{config.ABOUT_VISI}"
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-white mb-2">Misi Sekolah</h4>
                <ul className="list-disc list-inside flex flex-col gap-1.5 text-white/85">
                  {(config.ABOUT_MISI || "").split('\n').filter(line => line.trim().length > 0).map((misi, idx) => (
                    <li key={idx} className="pl-1 text-xs">{misi}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Accreditation Column */}
          <div className="flex flex-col gap-6">
            <div className={`p-6 rounded-2xl border backdrop-blur-md shadow-xl text-center relative group flex flex-col items-center justify-center flex-1 ${
              theme === 'dark' ? 'bg-black/25 border-white/10 text-white' : 'bg-white/15 border-white/20 text-white'
            }`}>
              {isAdmin && (
                <button
                  onClick={() => setActiveModal('profile')}
                  className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-600 text-white p-1 rounded-full flex items-center justify-center transition-all cursor-pointer"
                  title="Edit Akreditasi"
                >
                  <span className="material-symbols-rounded text-xs">edit</span>
                </button>
              )}
              <div className="w-14 h-14 bg-white/10 border border-white/25 rounded-full flex items-center justify-center text-3xl mb-3 text-amber-400 shadow-inner">
                <span className="material-symbols-rounded text-2xl">workspace_premium</span>
              </div>
              <h3 className="text-xl font-black text-white leading-none mb-1">
                {config.ACCREDITATION_RATING || "Akreditasi A"}
              </h3>
              <p className="text-[10px] font-medium text-white/70">
                {config.ACCREDITATION_DETAIL || "Sangat Memuaskan (BAN-S/M)"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: PROGRAM UNGGULAN */}
      <section id="program-unggulan" className="max-w-6xl mx-auto px-4 sm:px-6 w-full mb-8">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-sm font-bold flex items-center gap-2 text-white">
            <span className="material-symbols-rounded text-white/90">grade</span> Program Unggulan
          </h3>
          {isAdmin && (
            <button 
              onClick={() => openProgramModal()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-2.5 py-1 rounded-md font-bold flex items-center gap-0.5 shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-rounded text-xs">add</span> Tambah Program
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(schoolData.programs || []).map((prog) => (
            <div 
              key={prog.id}
              className={`p-4 rounded-xl border flex flex-col items-start relative overflow-hidden transition-all duration-300 hover:-translate-y-1 group backdrop-blur-md shadow-xl ${
                theme === 'dark' ? 'bg-black/25 border-white/10' : 'bg-white/15 border-white/20'
              }`}
            >
              {isAdmin && (
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/50 p-1 rounded-lg">
                  <button 
                    onClick={() => openProgramModal(prog)}
                    className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center hover:bg-amber-600 text-white cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-[10px]">edit</span>
                  </button>
                  <button 
                    onClick={(e) => deleteProgram(prog.id, e)}
                    className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 text-white cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-[10px]">delete</span>
                  </button>
                </div>
              )}
              <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-lg text-white mb-3">
                <span className="material-symbols-rounded text-base">{prog.icon}</span>
              </div>
              <h4 className="text-xs font-bold text-white mb-1 text-left">{prog.title}</h4>
              <p className="text-[10px] leading-relaxed text-white/70 text-left">{prog.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: GALERI SEKOLAH */}
      <section id="galeri-sekolah" className="max-w-6xl mx-auto px-4 sm:px-6 w-full mb-8">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-sm font-bold flex items-center gap-2 text-white">
            <span className="material-symbols-rounded text-white/90">photo_library</span> Galeri Kegiatan
          </h3>
          {isAdmin && (
            <button 
              onClick={() => openGalleryModal()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-2.5 py-1 rounded-md font-bold flex items-center gap-0.5 shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-rounded text-xs">add_a_photo</span> Tambah Foto
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(schoolData.gallery || []).map((gal) => (
            <div 
              key={gal.id}
              className={`rounded-xl border overflow-hidden relative group backdrop-blur-md shadow-xl hover:-translate-y-1 transition-all ${
                theme === 'dark' ? 'bg-black/25 border-white/10' : 'bg-white/15 border-white/20'
              }`}
            >
              <img src={gal.image} alt={gal.title} className="w-full h-28 object-cover filter brightness-95" />
              <div className="p-2.5">
                <h5 className="text-[10px] font-bold text-white text-left truncate">{gal.title}</h5>
              </div>
              {isAdmin && (
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-1 rounded-xl backdrop-blur-sm">
                  <button 
                    onClick={() => openGalleryModal(gal)}
                    className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center hover:bg-amber-600 text-white cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-[10px]">edit</span>
                  </button>
                  <button 
                    onClick={(e) => deleteGallery(gal.id, e)}
                    className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 text-white cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-[10px]">delete</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 10: FAQ & LOKASI */}
      <section id="faq-dan-lokasi" className="max-w-6xl mx-auto px-4 sm:px-6 w-full mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FAQ Column */}
          <div className={`p-6 rounded-2xl border backdrop-blur-md shadow-xl lg:col-span-2 text-left relative group ${
            theme === 'dark' ? 'bg-black/25 border-white/10 text-white' : 'bg-white/15 border-white/20 text-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-rounded text-white/90">help</span> Tanya Jawab (FAQ)
              </h3>
              {isAdmin && (
                <button
                  onClick={() => openFaqModal()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-0.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-rounded text-xs">add</span> Tambah FAQ
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
              {(schoolData.faqs || []).map((faq) => (
                <div 
                  key={faq.id} 
                  className={`p-3.5 rounded-xl border relative group/item transition-all ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/10 border-white/20'
                  }`}
                >
                  <h4 className="text-xs font-bold text-white mb-1.5 flex gap-1.5 items-start">
                    <span className="text-indigo-400">Q:</span>
                    <span>{faq.question}</span>
                  </h4>
                  <p className="text-[10px] leading-relaxed text-white/70 pl-4" dangerouslySetInnerHTML={{ __html: faq.answer }} />

                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity bg-black/40 p-1 rounded-md">
                      <button 
                        onClick={() => openFaqModal(faq)}
                        className="w-4.5 h-4.5 bg-amber-500 rounded-full flex items-center justify-center hover:bg-amber-600 text-white cursor-pointer"
                      >
                        <span className="material-symbols-rounded text-[9px]">edit</span>
                      </button>
                      <button 
                        onClick={(e) => deleteFaq(faq.id, e)}
                        className="w-4.5 h-4.5 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 text-white cursor-pointer"
                      >
                        <span className="material-symbols-rounded text-[9px]">delete</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Lokasi Column */}
          <div className={`p-6 rounded-2xl border backdrop-blur-md shadow-xl text-left relative group flex flex-col justify-between ${
            theme === 'dark' ? 'bg-black/25 border-white/10 text-white' : 'bg-white/15 border-white/20 text-white'
          }`}>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                <span className="material-symbols-rounded text-white/90">explore</span> Lokasi Lembaga
              </h3>
              <div className="w-full h-36 rounded-xl overflow-hidden border border-white/15 mb-4 shadow-inner">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.1235489812563!2d112.7123456!3d-7.456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e12345678901%3A0x1234567890abcdef!2sCandi%2C%20Sidoarjo%20Regency%2C%20East%20Java!5e0!3m2!1sid!2sid!4v1700000000000" 
                  className="w-full h-full border-none filter contrast-110 brightness-95" 
                  loading="lazy" 
                  title="Peta Lokasi SMP Al-Hikam Sidoarjo"
                />
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed flex gap-2 items-start mb-3">
                <span className="material-symbols-rounded text-white text-base">location_on</span>
                <span>{config.FOOTER_ADDRESS}</span>
              </p>
            </div>
            <div className="border-t border-white/10 pt-3 mt-2 text-[10px] text-white/70">
              <span className="font-bold text-white block mb-0.5">Jam Operasional:</span>
              <span>Senin - Jumat: 07:00 - 15:00 WIB</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`mt-auto border-t py-10 transition-all backdrop-blur-md ${
        theme === 'dark' ? 'bg-black/45 border-white/10 text-white/70' : 'bg-white/10 border-white/20 text-white/80'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col gap-3 text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 border border-white/30 rounded-lg flex items-center justify-center text-white font-extrabold text-base uppercase">
                  {config.SCHOOL_NAME ? config.SCHOOL_NAME.charAt(0) : 'S'}
                </div>
                <span className="text-sm font-bold text-white uppercase">{config.SCHOOL_NAME}</span>
              </div>
              <p className="text-xs leading-relaxed max-w-sm text-white/70">
                Sistem launcher digital berbasis Google Cloud Platform dan Google Workspace 
                untuk menunjang efisiensi operasional pendidikan abad ke-21.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:col-span-2 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Hubungi Kami</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex gap-2 items-start text-white/75">
                  <span className="material-symbols-rounded text-white mt-0.5 text-base">location_on</span>
                  <span>{config.FOOTER_ADDRESS}</span>
                </div>
                <div className="flex flex-col gap-2 text-white/75">
                  <div className="flex gap-2 items-center">
                    <span className="material-symbols-rounded text-white text-base">call</span>
                    <span>{config.FOOTER_PHONE}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="material-symbols-rounded text-white text-base">mail</span>
                    <span>{config.FOOTER_EMAIL ? config.FOOTER_EMAIL.replace('mailto:', '') : ''}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/60">
            <div dangerouslySetInnerHTML={{ __html: config.FOOTER_COPYRIGHT }} />
            <div className="flex items-center gap-2.5">
              <span>Sistem Operasional Cloud</span>
              <button 
                onClick={() => isAdmin ? handleLogout() : setShowLoginModal(true)}
                className={`px-2.5 py-0.5 rounded-full font-semibold border text-[11px] cursor-pointer hover:scale-105 transition-all ${
                  isAdmin 
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200' 
                    : theme === 'dark' ? 'bg-black/30 border-white/10 text-white/80' : 'bg-white/10 border-white/20 text-white/90'
                }`}
              >
                {isAdmin ? 'Dashboard Admin' : (config.FOOTER_VERSION || 'Portal v2.2.0')}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ==========================================
          MODAL-MODAL INTERAKTIF ADMINISTRATOR
          ========================================== */}

      {/* 1. LOGIN ADMIN MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/15 p-6 sm:p-8 rounded-3xl w-full max-w-sm shadow-2xl relative text-left"
            >
              <button 
                onClick={() => { setShowLoginModal(false); setLoginError(''); }}
                className="absolute top-4 right-4 text-white/60 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-rounded">close</span>
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-rounded">security</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Login Admin Portal</h4>
                  <span className="text-[11px] text-white/60">Verifikasi akses pengelola</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                {loginError && (
                  <div className="bg-red-500/20 border border-red-500/30 text-red-200 text-xs p-3 rounded-xl">
                    {loginError}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/70">Username</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Masukkan admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-white/5 border border-white/15 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-white/30"
                  />
                  <span className="text-[10px] text-white/40">Username default: <strong className="text-white/60">admin</strong></span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/70">Kata Sandi</label>
                  <input 
                    type="password" 
                    required
                    placeholder="Masukkan sandi Anda"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border border-white/15 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-white/30"
                  />
                  <span className="text-[10px] text-white/40">Sandi default: <strong className="text-white/60">admin</strong></span>
                </div>

                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-3 rounded-xl transition-all cursor-pointer mt-2"
                >
                  Masuk Ke Dashboard
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. APP CREATE/EDIT MODAL */}
      <AnimatePresence>
        {activeModal === 'app' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/15 p-6 rounded-3xl w-full max-w-md shadow-2xl relative text-left text-white max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-rounded">close</span>
              </button>

              <h4 className="text-base font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-rounded text-amber-500">apps</span>
                {appForm.index !== undefined ? 'Edit Aplikasi / Menu Layanan' : 'Tambah Aplikasi / Menu Baru'}
              </h4>

              <form onSubmit={saveApp} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Nama Aplikasi / Layanan</label>
                  <input 
                    type="text" required placeholder="Contoh: E-Learning" value={appForm.title}
                    onChange={(e) => setAppForm({ ...appForm, title: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Ikon Google Material</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" required placeholder="folder, mail, payments, school..." value={appForm.icon}
                      onChange={(e) => setAppForm({ ...appForm, icon: e.target.value })}
                      className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white flex-1 font-mono"
                    />
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-lg">
                      <span className="material-symbols-rounded">{appForm.icon || 'question_mark'}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/50">Gunakan nama ikon dari Google Material (folder, payments, mail, school, menu_book, download, inventory_2, fact_check)</span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Deskripsi Singkat</label>
                  <textarea 
                    required rows={3} placeholder="Penjelasan ringkas mengenai fungsi sistem..." value={appForm.description}
                    onChange={(e) => setAppForm({ ...appForm, description: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">URL / Link Aplikasi</label>
                  <input 
                    type="text" required placeholder="https://script.google.com/..." value={appForm.url}
                    onChange={(e) => setAppForm({ ...appForm, url: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white font-mono"
                  />
                  <span className="text-[10px] text-white/50">Meskipun ditujukan ke aplikasi luar / Google Sheets / Apps Script lain, masukkan URL lengkapnya di sini.</span>
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white">Batal</button>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md">Simpan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. ANNOUNCEMENT CREATE/EDIT MODAL */}
      <AnimatePresence>
        {activeModal === 'announcement' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/15 p-6 rounded-3xl w-full max-w-md shadow-2xl relative text-left text-white max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-rounded">close</span>
              </button>

              <h4 className="text-base font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-rounded text-rose-500">campaign</span>
                {announcementForm.isNew ? 'Tambah Pengumuman Baru' : 'Edit Pengumuman'}
              </h4>

              <form onSubmit={saveAnnouncement} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Judul Pengumuman</label>
                  <input 
                    type="text" required placeholder="Contoh: Libur Kenaikan Kelas" value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-white/70">Kategori</label>
                    <select 
                      value={announcementForm.category}
                      onChange={(e) => {
                        const colors: { [key: string]: string } = { Penting: '#ef4444', Akademik: '#3b82f6', Sistem: '#f59e0b', Umum: '#10b981' };
                        setAnnouncementForm({ 
                          ...announcementForm, 
                          category: e.target.value,
                          badgeColor: colors[e.target.value] || '#3b82f6'
                        });
                      }}
                      className="bg-slate-800 border border-white/15 px-3 py-2 rounded-xl text-sm text-white"
                    >
                      <option value="Penting">Penting</option>
                      <option value="Akademik">Akademik</option>
                      <option value="Sistem">Sistem</option>
                      <option value="Umum">Umum</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-white/70">Warna Tag</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="color" value={announcementForm.badgeColor}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, badgeColor: e.target.value })}
                        className="bg-white/5 border border-white/15 p-1 rounded-lg w-10 h-10 text-white cursor-pointer"
                      />
                      <span className="text-xs font-mono">{announcementForm.badgeColor}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-white/70">Tanggal Rilis</label>
                    <input 
                      type="text" required placeholder="Contoh: 04 Juli 2026" value={announcementForm.date}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, date: e.target.value })}
                      className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Isi Detail Pengumuman</label>
                  <textarea 
                    required rows={4} placeholder="Tuliskan isi pengumuman secara rinci..." value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white">Batal</button>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md">Simpan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. NEWS CREATE/EDIT MODAL */}
      <AnimatePresence>
        {activeModal === 'news' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/15 p-6 rounded-3xl w-full max-w-md shadow-2xl relative text-left text-white max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-rounded">close</span>
              </button>

              <h4 className="text-base font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-rounded text-blue-500">newspaper</span>
                {newsForm.isNew ? 'Tambah Berita / Prestasi Baru' : 'Edit Berita / Prestasi'}
              </h4>

              <form onSubmit={saveNews} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Judul Berita</label>
                  <input 
                    type="text" required placeholder="Contoh: Juara Olimpiade Matematika" value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Tanggal Terbit</label>
                  <input 
                    type="text" required placeholder="Contoh: 04 Juli 2026" value={newsForm.date}
                    onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">URL Gambar Sampul (Unsplash dll)</label>
                  <input 
                    type="text" required placeholder="https://..." value={newsForm.image}
                    onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white font-mono"
                  />
                  <div className="w-full h-24 rounded-lg bg-white/10 mt-1 overflow-hidden">
                    <img src={newsForm.image} alt="Preview" className="w-full h-full object-cover" onError={(e)=>{(e.target as HTMLImageElement).src='https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400';}} />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Ringkasan Berita</label>
                  <textarea 
                    required rows={3} placeholder="Tuliskan intisari singkat berita ini..." value={newsForm.summary}
                    onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white">Batal</button>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md">Simpan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. AGENDA CREATE/EDIT MODAL */}
      <AnimatePresence>
        {activeModal === 'agenda' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/15 p-6 rounded-3xl w-full max-w-md shadow-2xl relative text-left text-white max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-rounded">close</span>
              </button>

              <h4 className="text-base font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-rounded text-indigo-400">calendar_month</span>
                {agendaForm.isNew ? 'Tambah Agenda Baru' : 'Edit Agenda'}
              </h4>

              <form onSubmit={saveAgenda} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Judul Agenda</label>
                  <input 
                    type="text" required placeholder="Contoh: Rapat Pleno Semester" value={agendaForm.title}
                    onChange={(e) => setAgendaForm({ ...agendaForm, title: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Tanggal Pelaksanaan</label>
                  <input 
                    type="text" required placeholder="Contoh: 15 Juli 2026" value={agendaForm.date}
                    onChange={(e) => setAgendaForm({ ...agendaForm, date: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white"
                  />
                  <span className="text-[10px] text-white/50">Gunakan format "HARI_ANGKA BULAN TAHUN", contoh: "15 Juli 2026" atau "20-22 Juli 2026" agar kalender samping ter-render indah.</span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Waktu Acara</label>
                  <input 
                    type="text" required placeholder="Contoh: 08:00 - 13:00" value={agendaForm.time}
                    onChange={(e) => setAgendaForm({ ...agendaForm, time: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Lokasi Pelaksanaan</label>
                  <input 
                    type="text" required placeholder="Contoh: Aula Serbaguna Lantai 2" value={agendaForm.location}
                    onChange={(e) => setAgendaForm({ ...agendaForm, location: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white">Batal</button>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md">Simpan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. GENERAL CONFIG (PROFIL & SOSMED) MODAL */}
      <AnimatePresence>
        {activeModal === 'profile' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/15 p-6 rounded-3xl w-full max-w-lg shadow-2xl relative text-left text-white max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-rounded">close</span>
              </button>

              <h4 className="text-base font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-rounded text-indigo-500">domain</span>
                Pengaturan Profil Sekolah & Tautan Sosial
              </h4>

              <form onSubmit={saveConfig} className="flex flex-col gap-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-white/70">Nama Sekolah</label>
                    <input 
                      type="text" required placeholder="SMA NEGERI DIGITAL" value={configForm.SCHOOL_NAME}
                      onChange={(e) => setConfigForm({ ...configForm, SCHOOL_NAME: e.target.value })}
                      className="bg-white/5 border border-white/15 px-3 py-2 rounded-xl text-sm text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-white/70">Sub-judul Sistem</label>
                    <input 
                      type="text" required placeholder="Sistem Informasi Digital" value={configForm.SCHOOL_SUBTITLE}
                      onChange={(e) => setConfigForm({ ...configForm, SCHOOL_SUBTITLE: e.target.value })}
                      className="bg-white/5 border border-white/15 px-3 py-2 rounded-xl text-sm text-white"
                    />
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3 mt-1">
                  <h5 className="text-xs font-bold text-white/95 uppercase tracking-wider mb-2">Tautan Akses Cepat (Sosial Media & Kontak)</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-white/60">Website Sekolah</label>
                      <input 
                        type="text" required value={configForm.WEBSITE}
                        onChange={(e) => setConfigForm({ ...configForm, WEBSITE: e.target.value })}
                        className="bg-white/5 border border-white/15 px-3 py-1.5 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-white/60">Email Sekolah (mailto:...)</label>
                      <input 
                        type="text" required value={configForm.EMAIL}
                        onChange={(e) => setConfigForm({ ...configForm, EMAIL: e.target.value })}
                        className="bg-white/5 border border-white/15 px-3 py-1.5 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-white/60">WhatsApp (https://wa.me/...)</label>
                      <input 
                        type="text" required value={configForm.WHATSAPP}
                        onChange={(e) => setConfigForm({ ...configForm, WHATSAPP: e.target.value })}
                        className="bg-white/5 border border-white/15 px-3 py-1.5 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-white/60">Instagram URL</label>
                      <input 
                        type="text" required value={configForm.INSTAGRAM}
                        onChange={(e) => setConfigForm({ ...configForm, INSTAGRAM: e.target.value })}
                        className="bg-white/5 border border-white/15 px-3 py-1.5 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label className="text-[10px] font-semibold text-white/60">YouTube Channel URL</label>
                      <input 
                        type="text" required value={configForm.YOUTUBE}
                        onChange={(e) => setConfigForm({ ...configForm, YOUTUBE: e.target.value })}
                        className="bg-white/5 border border-white/15 px-3 py-1.5 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-3">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white">Batal</button>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md">Simpan Perubahan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. CHANGE PASSWORD MODAL */}
      <AnimatePresence>
        {activeModal === 'password' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/15 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative text-left text-white"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-rounded">close</span>
              </button>

              <h4 className="text-base font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-rounded text-amber-500">key</span>
                Ganti Sandi Administrator
              </h4>

              <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                {passwordError && (
                  <div className="bg-red-500/20 border border-red-500/30 text-red-200 text-xs p-3 rounded-xl">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs p-3 rounded-xl">
                    {passwordSuccess}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Kata Sandi Lama</label>
                  <input 
                    type="password" required placeholder="Masukkan sandi saat ini" value={passwordForm.oldPass}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPass: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2.5 rounded-xl text-sm text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Kata Sandi Baru</label>
                  <input 
                    type="password" required placeholder="Sandi baru (min 4 karakter)" value={passwordForm.newPass}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2.5 rounded-xl text-sm text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Konfirmasi Kata Sandi Baru</label>
                  <input 
                    type="password" required placeholder="Ketik ulang sandi baru" value={passwordForm.confirmPass}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPass: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2.5 rounded-xl text-sm text-white"
                  />
                </div>

                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-3 rounded-xl transition-all cursor-pointer mt-2"
                >
                  Perbarui Kata Sandi
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. PROGRAM CREATE/EDIT MODAL */}
      <AnimatePresence>
        {activeModal === 'program' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/15 p-6 rounded-3xl w-full max-w-md shadow-2xl relative text-left text-white max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-rounded">close</span>
              </button>

              <h4 className="text-base font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-rounded text-emerald-500">grade</span>
                {programForm.isNew ? 'Tambah Program Unggulan' : 'Edit Program Unggulan'}
              </h4>

              <form onSubmit={saveProgram} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Judul Program</label>
                  <input 
                    type="text" required placeholder="Contoh: Kelas Tahfidz Al-Qur'an" value={programForm.title}
                    onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Ikon Google Material</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" required placeholder="star, school, auto_stories..." value={programForm.icon}
                      onChange={(e) => setProgramForm({ ...programForm, icon: e.target.value })}
                      className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white flex-1 font-mono"
                    />
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-lg">
                      <span className="material-symbols-rounded">{programForm.icon || 'star'}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/50">Nama ikon material: star, school, auto_stories, computer, sports_soccer, translate, menu_book</span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Deskripsi Ringkas</label>
                  <textarea 
                    required rows={3} placeholder="Tuliskan deskripsi singkat atau keunggulan program..." value={programForm.description}
                    onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white">Batal</button>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md">Simpan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. GALLERY CREATE/EDIT MODAL */}
      <AnimatePresence>
        {activeModal === 'gallery' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/15 p-6 rounded-3xl w-full max-w-md shadow-2xl relative text-left text-white max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-rounded">close</span>
              </button>

              <h4 className="text-base font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-rounded text-blue-500">photo_library</span>
                {galleryForm.isNew ? 'Tambah Foto Galeri Baru' : 'Edit Foto Galeri'}
              </h4>

              <form onSubmit={saveGallery} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Keterangan Foto</label>
                  <input 
                    type="text" required placeholder="Contoh: Upacara Bendera HUT RI" value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">URL Link Gambar (Sampul)</label>
                  <input 
                    type="text" required placeholder="https://images.unsplash.com/..." value={galleryForm.image}
                    onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-sm text-white font-mono"
                  />
                  <div className="w-full h-32 rounded-lg bg-white/10 mt-1 overflow-hidden">
                    <img src={galleryForm.image} alt="Preview Foto" className="w-full h-full object-cover" onError={(e)=>{(e.target as HTMLImageElement).src='https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400';}} />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white">Batal</button>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md">Simpan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 10. FAQ CREATE/EDIT MODAL */}
      <AnimatePresence>
        {activeModal === 'faq' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/15 p-6 rounded-3xl w-full max-w-lg shadow-2xl relative text-left text-white max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-rounded">close</span>
              </button>

              <h4 className="text-base font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-rounded text-indigo-400">help</span>
                {faqForm.isNew ? 'Tambah FAQ Baru' : 'Edit FAQ'}
              </h4>

              <form onSubmit={saveFaq} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Pertanyaan (Question)</label>
                  <input 
                    type="text" required placeholder="Contoh: Bagaimana prosedur pendaftaran siswa baru?" value={faqForm.question}
                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2.5 rounded-xl text-sm text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white/70">Jawaban (Answer - Mendukung tag HTML seperti &lt;br&gt;, &lt;b&gt;)</label>
                  <textarea 
                    required rows={4} placeholder="Tuliskan jawaban yang lengkap..." value={faqForm.answer}
                    onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                    className="bg-white/5 border border-white/15 px-4 py-2.5 rounded-xl text-sm text-white resize-none font-sans"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white">Batal</button>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md">Simpan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
