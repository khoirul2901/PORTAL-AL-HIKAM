import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PortalPreview from './components/PortalPreview';
import CodeExporter from './components/CodeExporter';
import { DEFAULT_CONFIG, DEFAULT_APPS, DEFAULT_SCHOOL_DATA, ExtendedAppConfig } from './defaultData';
import { AppItem, SchoolData } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  // Load state from localStorage or defaults
  const [config, setConfig] = useState<ExtendedAppConfig>(() => {
    try {
      const saved = localStorage.getItem('portal_config');
      return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  });

  const [apps, setApps] = useState<AppItem[]>(() => {
    try {
      const saved = localStorage.getItem('portal_apps');
      return saved ? JSON.parse(saved) : DEFAULT_APPS;
    } catch (e) {
      return DEFAULT_APPS;
    }
  });

  const [schoolData, setSchoolData] = useState<SchoolData>(() => {
    try {
      const saved = localStorage.getItem('portal_school_data');
      return saved ? JSON.parse(saved) : DEFAULT_SCHOOL_DATA;
    } catch (e) {
      return DEFAULT_SCHOOL_DATA;
    }
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('portal_admin_password') || 'admin';
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('portal_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('portal_apps', JSON.stringify(apps));
  }, [apps]);

  useEffect(() => {
    localStorage.setItem('portal_school_data', JSON.stringify(schoolData));
  }, [schoolData]);

  useEffect(() => {
    localStorage.setItem('portal_admin_password', adminPassword);
  }, [adminPassword]);

  return (
    <div 
      className="min-h-screen flex flex-col font-sans transition-colors duration-300 text-white"
      style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #7e22ce 100%)' }}
    >
      
      {/* DEVELOPER HUB NAV BAR */}
      <div className="bg-black/30 border-b border-white/10 backdrop-blur-xl text-white py-3.5 px-4 sm:px-6 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-rounded text-white/90 text-2xl">school</span>
            <div>
              <span className="font-bold text-sm tracking-tight block">Portal Digital Sekolah</span>
              <span className="text-[10px] text-white/70 font-medium">Google Apps Script HTML Service Generator</span>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-black/35 p-1 rounded-xl border border-white/15 backdrop-blur-md">
            <button
              id="btn-preview-portal"
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'preview'
                  ? 'bg-white/20 text-white shadow-md border border-white/20'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="material-symbols-rounded text-base">visibility</span>
              <span>Pratinjau Live Portal</span>
            </button>
            <button
              id="btn-copy-code"
              onClick={() => setActiveTab('code')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'code'
                  ? 'bg-white/20 text-white shadow-md border border-white/20'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="material-symbols-rounded text-base">code</span>
              <span>Salin Kode Sumber</span>
            </button>
          </div>
        </div>
      </div>

      {/* CORE DISPLAY STAGE */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'preview' ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex-1 flex flex-col"
            >
              <PortalPreview 
                config={config} 
                setConfig={setConfig}
                apps={apps}
                setApps={setApps}
                schoolData={schoolData}
                setSchoolData={setSchoolData}
                adminPassword={adminPassword}
                setAdminPassword={setAdminPassword}
              />
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex-1"
            >
              <CodeExporter 
                config={config}
                apps={apps}
                schoolData={schoolData}
                adminPassword={adminPassword}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
