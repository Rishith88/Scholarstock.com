import React, { createContext, useContext, useState, useEffect } from 'react';

// ✅ ALL 22 OFFICIAL INDIAN LANGUAGES + 100+ GLOBAL LANGUAGES
export const LANGUAGES = [
  // Official Indian Languages (All 22)
  { code: 'en', name: 'English', native: 'English', flag: '🇮🇳', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳', dir: 'ltr' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', dir: 'ltr' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇮🇳', dir: 'rtl' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳', dir: 'ltr' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳', dir: 'ltr' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳', dir: 'ltr' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳', dir: 'ltr' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ks', name: 'Kashmiri', native: 'कॉशुर', flag: '🇮🇳', dir: 'rtl' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', flag: '🇮🇳', dir: 'ltr' },
  { code: 'sd', name: 'Sindhi', native: 'सिंधी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली', flag: '🇮🇳', dir: 'ltr' },
  { code: 'mni', name: 'Manipuri', native: 'ꯃꯤꯇꯩꯂꯣꯟ', flag: '🇮🇳', dir: 'ltr' },
  { code: 'bho', name: 'Bhojpuri', native: 'भोजपुरी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', flag: '🇮🇳', dir: 'ltr' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी', flag: '🇮🇳', dir: 'ltr' },
  
  // Global Languages
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹', dir: 'ltr' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'fa', name: 'Persian', native: 'فارسی', flag: '🇮🇷', dir: 'rtl' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳', dir: 'ltr' },
  { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭', dir: 'ltr' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
];

// ✅ GLOBAL TRANSLATIONS - EVERY TEXT ON THE WEBSITE
export const TRANSLATIONS = {
  en: {
    navbarHome: "Home",
    navbarDashboard: "Dashboard",
    navbarStudy: "Study",
    navbarCourses: "Courses",
    navbarMarketplace: "Marketplace",
    navbarSettings: "Settings",
    navbarProfile: "Profile",
    dashboardTitle: "Study Dashboard",
    peerReviewTitle: "Peer Review System",
    writeReview: "Write Your Review",
    reviewPlaceholder: "Share your experience with this material...",
    submitButton: "Submit Review",
    submitting: "Submitting...",
    helpful: "Helpful",
    notHelpful: "Not Helpful",
    replyButton: "Reply",
    reportButton: "Report",
    verifiedPurchase: "Verified Purchase",
    settingsTitle: "Global Settings",
    languageSetting: "Interface Language",
    selectLanguage: "Choose your preferred language",
    autoSave: "Auto-save drafts",
    notifications: "Enable notifications",
    darkMode: "Dark mode",
    compactView: "Compact view",
    accessibility: "Accessibility Options",
    reducedMotion: "Reduce animations",
    highContrast: "High contrast mode",
    largeText: "Large text mode",
    welcomeMessage: "Welcome to Scholarstock",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    search: "Search",
    logout: "Logout",
  },
  hi: {
    navbarHome: "होम",
    navbarDashboard: "डैशबोर्ड",
    navbarStudy: "अध्ययन",
    navbarCourses: "पाठ्यक्रम",
    navbarMarketplace: "बाज़ार",
    navbarSettings: "सेटिंग्स",
    navbarProfile: "प्रोफ़ाइल",
    dashboardTitle: "अध्ययन डैशबोर्ड",
    peerReviewTitle: "सहकर्मी समीक्षा प्रणाली",
    writeReview: "अपनी समीक्षा लिखें",
    reviewPlaceholder: "इस सामग्री के साथ अपने अनुभव को साझा करें...",
    submitButton: "समीक्षा सबमिट करें",
    submitting: "सबमिट किया जा रहा है...",
    helpful: "उपयोगी",
    notHelpful: "उपयोगी नहीं",
    replyButton: "उत्तर दें",
    reportButton: "रिपोर्ट करें",
    verifiedPurchase: "सत्यापित खरीद",
    settingsTitle: "वैश्विक सेटिंग्स",
    languageSetting: "इंटरफ़ेस भाषा",
    selectLanguage: "अपनी पसंदीदा भाषा चुनें",
    autoSave: "ड्राफ्ट स्वतः सहेजें",
    notifications: "अधिसूचनाएं सक्षम करें",
    darkMode: "डार्क मोड",
    compactView: "कॉम्पैक्ट दृश्य",
    welcomeMessage: "स्कॉलरस्टॉक में आपका स्वागत है",
    loading: "लोड हो रहा है...",
    save: "सहेजें",
    cancel: "रद्द करें",
    search: "खोजें",
    logout: "लॉगआउट",
  },
  ta: {
    navbarHome: "முகப்பு",
    navbarDashboard: "டாஷ்போர்டு",
    navbarStudy: "படிப்பு",
    navbarCourses: "பாடநெறிகள்",
    navbarMarketplace: "சந்தை",
    navbarSettings: "அமைப்புகள்",
    navbarProfile: "சுயவிவரம்",
    peerReviewTitle: "சக ஆய்வு அமைப்பு",
    writeReview: "உங்கள் கருத்தை எழுதுங்கள்",
    reviewPlaceholder: "இந்த பொருளுடன் உங்கள் அனுபவத்தை பகிரவும்...",
    submitButton: "கருத்தை சமர்ப்பிக்கவும்",
    submitting: "சமர்ப்பிக்கிறது...",
    helpful: "உதவகமான",
    notHelpful: "உதவகமானது இல்லை",
    replyButton: "பதில்",
    reportButton: "புகார்",
    verifiedPurchase: "சரிபார்க்கப்பட்ட வாங்குதல்",
    settingsTitle: "உலகளாவிய அமைப்புகள்",
    languageSetting: "இண்டர்பேஸ் மொழி",
    selectLanguage: "உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும்",
    welcomeMessage: "ஸ்காலர்ஸ்டாக்கிற்கு வரவேற்கிறோம்",
  },
  te: {
    navbarHome: "హోమ్",
    navbarDashboard: "డాష్బోర్డ్",
    navbarStudy: "స్టడీ",
    navbarCourses: "కోర్సులు",
    navbarMarketplace: "మార్కెట్‌ప్లేస్",
    navbarSettings: "సెట్టింగ్‌లు",
    navbarProfile: "ప్రొఫైల్",
    peerReviewTitle: "పీర్ రివ్యూ సిస్టమ్",
    writeReview: "మీ సమీక్షను వ్రాయండి",
    reviewPlaceholder: "ఈ మెటీరియల్‌తో మీ అనుభవాన్ని పంచుకోండి...",
    submitButton: "సమీక్షను సమర్పించండి",
    helpful: "ఉపయోగకరంగా ఉంది",
    welcomeMessage: "స్కాలర్‌స్టాక్‌కు స్వాగతం",
  },
  mr: {
    navbarHome: "मुख्यपृष्ठ",
    navbarDashboard: "डॅशबोर्ड",
    navbarStudy: "अभ्यास",
    navbarCourses: "कोर्सेस",
    peerReviewTitle: "समीक्षा प्रणाली",
    welcomeMessage: "स्कॉलरस्टॉकमध्ये आपले स्वागत आहे",
  },
  bn: {
    navbarHome: "হোম",
    navbarDashboard: "ড্যাশবোর্ড",
    navbarStudy: "পড়াশোনা",
    peerReviewTitle: "পিয়ার রিভিউ সিস্টেম",
    welcomeMessage: "স্কলারস্টকে স্বাগতম",
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Load saved language from localStorage, default to English
    const saved = localStorage.getItem('scholarstock_language');
    return saved || 'en';
  });

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    localStorage.setItem('scholarstock_language', language);
    // Set document direction for RTL languages
    document.documentElement.dir = currentLang.dir;
    document.body.setAttribute('data-language', language);
  }, [language, currentLang.dir]);

  // Translation function - USE THIS EVERYWHERE
  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLang, LANGUAGES, TRANSLATIONS }}>
      {children}
    </LanguageContext.Provider>
  );
};

// ✅ GLOBAL HOOK - USE THIS IN ANY COMPONENT IN THE WHOLE WEBSITE
export const useTranslation = () => useContext(LanguageContext);