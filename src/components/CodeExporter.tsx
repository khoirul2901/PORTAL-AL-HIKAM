import { useState } from 'react';
import { AppItem, SchoolData } from '../types';
import { ExtendedAppConfig } from '../defaultData';
import {
  getCodeGsTemplate,
  getIndexHtmlTemplate,
  getCssHtmlTemplate,
  getJavascriptHtmlTemplate,
  getIncludeHtmlTemplate
} from './gasTemplates';

interface CodeExporterProps {
  config: ExtendedAppConfig;
  apps: AppItem[];
  schoolData: SchoolData;
  adminPassword: string;
}

interface GASFile {
  name: string;
  type: 'gs' | 'html';
  content: string;
  description: string;
}

export default function CodeExporter({ config, apps, schoolData, adminPassword }: CodeExporterProps) {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const files: GASFile[] = [
    {
      name: 'Code.gs',
      type: 'gs',
      description: 'Backend Google Apps Script (server-side) yang melayani halaman HTML, mengelola persistensi dengan PropertiesService, serta menyediakan endpoint verifikasi sandi dan pemutakhiran data secara aman.',
      content: getCodeGsTemplate(config, apps, schoolData, adminPassword)
    },
    {
      name: 'index.html',
      type: 'html',
      description: 'Struktur halaman HTML5 utama portal. Termasuk dashboard launcher menu, tab pengumuman dan berita, widget jam realtime, serta kerangka dialog admin dashboard dan notifikasi toast.',
      content: getIndexHtmlTemplate(config)
    },
    {
      name: 'css.html',
      type: 'html',
      description: 'Gaya visual CSS3 lengkap dengan dukungan variabel warna Mode Terang & Gelap, desain bento grid responsif, efek glassmorphism, serta animasi dan layout panel admin modern.',
      content: getCssHtmlTemplate()
    },
    {
      name: 'javascript.html',
      type: 'html',
      description: 'Logika Javascript sisi klien (frontend). Menghubungkan UI dengan server backend Google Apps Script secara asinkron, memproses pencarian real-time, autentikasi sandi, serta menyediakan operasi CRUD dinamis.',
      content: getJavascriptHtmlTemplate()
    },
    {
      name: 'include.html',
      type: 'html',
      description: 'Deklarasi meta-import aset, font Poppins premium, dan icon pack Material Symbols Rounded resmi dari Google CDN.',
      content: getIncludeHtmlTemplate()
    }
  ];

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* EXPORTER HERO HEADER */}
      <div className="bg-white/10 backdrop-blur-md text-white p-6 md:p-8 rounded-3xl mb-8 border border-white/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1 bg-white/15 border border-white/25 text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
              <span className="material-symbols-rounded text-sm">code</span> Google Apps Script Exporter
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2 text-white">Salin Kode ke Proyek Google Anda</h3>
            <p className="text-white/85 text-xs md:text-sm leading-relaxed">
              Semua file sudah dipisahkan secara modular sesuai kaidah Google Apps Script HTML Service. 
              Gunakan editor di bawah untuk menyalin kode dengan sekali klik dan langsung deploy sebagai Web App!
            </p>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID FOR INTERACTIVE STEPS AND EXPORTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: STEPS (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-xl text-white text-left">
            <h4 className="font-bold text-sm mb-4 flex items-center gap-1.5 border-b border-white/10 pb-2">
              <span className="material-symbols-rounded text-white">settings</span> Panduan Penerapan (Deployment)
            </h4>
            <ol className="flex flex-col gap-4 text-xs">
              <li className="flex gap-3">
                <span className="w-5 h-5 min-w-[20px] rounded-full bg-white/20 text-white font-bold flex items-center justify-center">1</span>
                <div>
                  <span className="font-bold block text-white">Buat Proyek Baru</span>
                  Kunjungi <a href="https://script.google.com" target="_blank" rel="noreferrer" className="text-white underline font-bold">script.google.com</a>, masuk dengan akun Google Anda, lalu buat proyek baru.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 min-w-[20px] rounded-full bg-white/20 text-white font-bold flex items-center justify-center">2</span>
                <div>
                  <span className="font-bold block text-white">Buat File Sesuai Tab</span>
                  Buat 5 file terpisah di editor Apps Script Anda: <b>1 file script</b> (<code>Code.gs</code>) dan <b>4 file HTML</b> (<code>index.html</code>, <code>css.html</code>, <code>javascript.html</code>, <code>include.html</code>).
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 min-w-[20px] rounded-full bg-white/20 text-white font-bold flex items-center justify-center">3</span>
                <div>
                  <span className="font-bold block text-white">Salin & Tempel Kode</span>
                  Pilih tab berkas di panel kanan, klik tombol <b>Salin Kode</b>, lalu tempelkan (Paste) ke berkas yang sesuai di editor Google Anda.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 min-w-[20px] rounded-full bg-white/20 text-white font-bold flex items-center justify-center">4</span>
                <div>
                  <span className="font-bold block text-white">Deploy Web App</span>
                  Klik <b>Terapkan</b> (Deploy) &rarr; <b>Penerapan baru</b> &rarr; Pilih jenis <b>Aplikasi Web</b>. Atur akses "Siapa Saja" (Anyone) lalu selesaikan rilis. Selesai!
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-5 text-xs flex flex-col gap-2.5 leading-relaxed text-white text-left">
            <h5 className="font-bold text-white flex items-center gap-1.5">
              <span className="material-symbols-rounded text-sm">database</span> Google Script Properties (Database)
            </h5>
            <p className="text-white/80">
              Data Informasi (Aplikasi, Pengumuman, Berita, Agenda) sekarang dikelola secara fully-dynamic menggunakan class <code>PropertiesService.getScriptProperties()</code> Google.
            </p>
            <p className="text-white/80">
              Saat pertama kali rilis, data default yang Anda kustomisasi pada generator ini akan diunggah otomatis sebagai default database awal. 
              Admin sekolah dapat login dan melakukan pembaruan kapan saja langsung dari portal web app yang sudah dideploy!
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE CODE VIEWER (8 COLS) */}
        <div className="lg:col-span-8 bg-black/40 border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-xl backdrop-blur-md">
          {/* FILE TABS */}
          <div className="bg-black/30 px-4 pt-4 pb-0 border-b border-white/10 flex gap-1 overflow-x-auto scrollbar-none">
            {files.map((file, idx) => (
              <button
                key={file.name}
                onClick={() => {
                  setActiveFileIndex(idx);
                  setCopied(false);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeFileIndex === idx
                    ? 'bg-white/15 text-white border-t border-x border-white/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-rounded text-sm">
                  {file.type === 'gs' ? 'settings' : 'html'}
                </span>
                <span>{file.name}</span>
              </button>
            ))}
          </div>

          {/* TAB METADATA DESCRIPTION */}
          <div className="bg-black/20 px-5 py-3.5 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 text-left">
              <span className="text-[10px] font-extrabold text-white/60 uppercase tracking-widest block mb-0.5">Deskripsi Berkas</span>
              <p className="text-white/95 text-xs font-medium leading-relaxed">
                {files[activeFileIndex].description}
              </p>
            </div>
            
            {/* COPY BUTTON */}
            <button
              onClick={() => handleCopy(files[activeFileIndex].content)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 active:scale-95 border ${
                copied 
                  ? 'bg-emerald-600 border-emerald-500 text-white' 
                  : 'bg-white/15 border-white/20 hover:bg-white/25 text-white shadow-lg'
              }`}
            >
              <span className="material-symbols-rounded text-base">
                {copied ? 'check_circle' : 'content_copy'}
              </span>
              <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
            </button>
          </div>

          {/* CODE EDITOR CONTAINER */}
          <div className="bg-black/55 p-4 font-mono text-xs overflow-auto h-[480px] text-white/90 text-left border-t border-white/10">
            <pre className="m-0 leading-relaxed select-all">
              <code>{files[activeFileIndex].content}</code>
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}
