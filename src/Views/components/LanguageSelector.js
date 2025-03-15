import React from 'react';
import { FaLanguage } from 'react-icons/fa';

const LanguageSelector = ({ currentLanguage, onChange }) => {
  const languages = [
    { code: 'english', name: 'English', flag: '🇺🇸' },
    { code: 'sinhala', name: 'සිංහල', flag: '🇱🇰' },
    { code: 'japanese', name: '日本語', flag: '🇯🇵' },
    { code: 'spanish', name: 'Español', flag: '🇪🇸' },
    { code: 'russian', name: 'Русский', flag: '🇷🇺' },
  ];

  // Translation content
  const content = {
    english: {
      brandName: 'TRAVEL LOTUS',
      tagline: 'Find Your Perfect Stay',
      description: 'Affordable, comfortable, and convenient Guest housing.',
      exploreButton: 'Explore Rooms',
      features: {
        rooms: 'Comfortable Rooms',
        roomsDesc: 'Choose from a variety of well-furnished rooms.',
        locations: 'Prime Locations',
        locationsDesc: 'Stay near campus with easy access to amenities.',
        booking: 'Easy Booking',
        bookingDesc: 'Apply online and get instant confirmation.',
      },
      transportation: 'Need Transportation?',
      chatbot: 'Chat with Lotus Assistant',
      login: 'Login / Register',
      footer: {
        rights: 'All rights reserved.',
        contact: 'Contact Us',
        privacy: 'Privacy Policy',
      },
    },
    sinhala: {
      brandName: 'ට්‍රැවල් ලෝටස්',
      tagline: 'ඔබේ පරිපූර්ණ නවාතැන සොයන්න',
      description: 'දැරිය හැකි, පහසු සහ පහසු අමුත්තන් නිවාස.',
      exploreButton: 'කාමර ගවේෂණය කරන්න',
      features: {
        rooms: 'පහසු කාමර',
        roomsDesc: 'හොඳින් ගෘහ භාණ්ඩ සපිරි කාමර විවිධාකාර වලින් තෝරන්න.',
        locations: 'ප්‍රධාන ස්ථාන',
        locationsDesc: 'පහසුකම් වලට පහසු ප්‍රවේශයක් සමඟ පරිශ්‍රය අසල රැඳී සිටින්න.',
        booking: 'පහසු වෙන්කිරීම',
        bookingDesc: 'මාර්ගගත අයදුම් කර ක්ෂණික තහවුරු කිරීම ලබා ගන්න.',
      },
      transportation: 'ප්‍රවාහනය අවශ්‍යද?',
      chatbot: 'ලෝටස් සහායක සමඟ කතා කරන්න',
      login: 'පිවිසෙන්න / ලියාපදිංචි වන්න',
      footer: {
        rights: 'සියලුම හිමිකම් ඇවිරිණි.',
        contact: 'අප අමතන්න',
        privacy: 'පෞද්ගලිකත්ව ප්‍රතිපත්තිය',
      },
    },
    japanese: {
      brandName: 'トラベルロータス',
      tagline: '完璧な滞在先を見つけよう',
      description: '手頃な価格で快適、そして便利なゲストハウジング。',
      exploreButton: '部屋を探す',
      features: {
        rooms: '快適な客室',
        roomsDesc: '様々な設備の整った部屋からお選びいただけます。',
        locations: '一等地',
        locationsDesc: 'キャンパス近くで便利な設備へのアクセスも簡単。',
        booking: '簡単予約',
        bookingDesc: 'オンラインで申し込み、すぐに確認ができます。',
      },
      transportation: '交通手段が必要ですか？',
      chatbot: 'ロータスアシスタントとチャット',
      login: 'ログイン / 登録',
      footer: {
        rights: '全著作権所有。',
        contact: 'お問い合わせ',
        privacy: 'プライバシーポリシー',
      },
    },
    spanish: {
      brandName: 'TRAVEL LOTUS',
      tagline: 'Encuentra Tu Estadía Perfecta',
      description: 'Alojamiento para huéspedes asequible, cómodo y conveniente.',
      exploreButton: 'Explorar Habitaciones',
      features: {
        rooms: 'Habitaciones Confortables',
        roomsDesc: 'Elige entre una variedad de habitaciones bien amuebladas.',
        locations: 'Ubicaciones Principales',
        locationsDesc: 'Alójate cerca del campus con fácil acceso a comodidades.',
        booking: 'Reserva Fácil',
        bookingDesc: 'Solicita en línea y obtén confirmación instantánea.',
      },
      transportation: '¿Necesitas Transporte?',
      chatbot: 'Chatea con Asistente Lotus',
      login: 'Iniciar Sesión / Registrarse',
      footer: {
        rights: 'Todos los derechos reservados。',
        contact: 'Contáctenos',
        privacy: 'Política de Privacidad',
      },
    },
    russian: {
      brandName: 'ТРЭВЕЛ ЛОТУС',
      tagline: 'Найдите Идеальное Место Проживания',
      description: 'Доступное, комфортное и удобное гостевое жилье.',
      exploreButton: 'Исследовать Номера',
      features: {
        rooms: 'Комфортабельные Номера',
        roomsDesc: 'Выбирайте из разнообразия хорошо обставленных комнат.',
        locations: 'Основные Локации',
        locationsDesc: 'Оставайтесь рядом с кампусом с легким доступом к удобствам.',
        booking: 'Простое Бронирование',
        bookingDesc: 'Подайте заявку онлайн и получите мгновенное подтверждение。',
      },
      transportation: 'Нужен Транспорт?',
      chatbot: 'Чат с Ассистентом Лотус',
      login: 'Вход / Регистрация',
      footer: {
        rights: 'Все права защищены。',
        contact: 'Связаться с нами',
        privacy: 'Политика конфиденциальности',
      },
    },
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
        type="button"
        id="languageDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <FaLanguage className="me-2" size={18} />
        {languages.find((lang) => lang.code === currentLanguage).flag}{' '}
        {languages.find((lang) => lang.code === currentLanguage).name}
      </button>
      <ul className="dropdown-menu" aria-labelledby="languageDropdown">
        {languages.map((lang) => (
          <li key={lang.code}>
            <button
              className={`dropdown-item ${currentLanguage === lang.code ? 'active bg-primary text-white' : ''}`}
              onClick={() => onChange(lang.code, content[lang.code])}
            >
              {lang.flag} {lang.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSelector;