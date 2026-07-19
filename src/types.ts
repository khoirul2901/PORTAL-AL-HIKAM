/**
 * Definition of types for the School App Portal.
 */

export interface AppConfig {
  APP_ARSIP: string;
  APP_SURAT: string;
  APP_KEUANGAN: string;
  APP_ABSENSI: string;
  APP_INVENTARIS: string;
  APP_PERPUSTAKAAN: string;
  APP_MONITORING: string;
  LINK_DOWNLOAD_APK: string;
  WEBSITE: string;
  EMAIL: string;
  WHATSAPP: string;
  INSTAGRAM: string;
  FACEBOOK: string;
  YOUTUBE: string;
}

export interface AppItem {
  title: string;
  icon: string;
  description: string;
  url: string;
}

export interface AnnouncementItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  badgeColor: string;
}

export interface AgendaItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  summary: string;
  image: string;
}

export interface ProgramItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  image: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface SchoolData {
  announcements: AnnouncementItem[];
  agenda: AgendaItem[];
  news: NewsItem[];
  programs: ProgramItem[];
  gallery: GalleryItem[];
  faqs: FaqItem[];
}
