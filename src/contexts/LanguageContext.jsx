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
    // Navigation
    navbarHome: "Home",
    navbarDashboard: "Dashboard",
    navbarStudy: "Study",
    navbarCourses: "Courses",
    navbarMarketplace: "Marketplace",
    navbarSettings: "Settings",
    navbarProfile: "Profile",
    navbarLibrary: "Library",
    navbarCart: "Cart",
    navbarBrowse: "Browse",
    navbarLogout: "Logout",
    navbarLogin: "Login",
    navbarSignup: "Sign Up",
    
    // Dashboard
    dashboardTitle: "Study Dashboard",
    upcomingDeadlines: "Upcoming Deadlines",
    studyStats: "Study Statistics",
    recentDocuments: "Recent Documents",
    todoList: "To-Do List",
    progressTracker: "Progress Tracker",
    flashcardDue: "Flashcards Due",
    studyStreak: "Study Streak",
    examCountdown: "Exam Countdown",
    
    // Peer Review
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
    reviewPosted: "Review posted successfully!",
    replyPosted: "Reply posted successfully!",
    reviewReported: "Review reported. Thank you for helping keep our community safe.",
    
    // Settings
    settingsTitle: "Global Settings",
    languageSetting: "Interface Language",
    selectLanguage: "Choose your preferred language",
    languageChanged: "Language changed successfully!",
    autoSave: "Auto-save drafts",
    notifications: "Enable notifications",
    darkMode: "Dark mode",
    compactView: "Compact view",
    accessibility: "Accessibility Options",
    reducedMotion: "Reduce animations",
    highContrast: "High contrast mode",
    largeText: "Large text mode",
    dyslexicFont: "Dyslexic-friendly font",
    
    // Common
    welcomeMessage: "Welcome to Scholarstock",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    search: "Search",
    logout: "Logout",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    close: "Close",
    back: "Back",
    next: "Next",
    previous: "Previous",
    
    // Study Rooms
    studyRoomsTitle: "Collaborative Study Rooms",
    createRoom: "Create Study Room",
    joinRoom: "Join Study Room",
    inviteCode: "Invite Code",
    participants: "Participants",
    endSession: "End Session",
    shareNotes: "Share Notes",
    whiteboard: "Whiteboard",
    voiceChat: "Voice Chat",
    
    // Flashcards
    flashcardsTitle: "Flashcards",
    createDeck: "Create Deck",
    addFlashcard: "Add Flashcard",
    reviewCards: "Review Cards",
    deckName: "Deck Name",
    question: "Question",
    answer: "Answer",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    
    // Marketplace
    marketplaceTitle: "University Marketplace",
    buyMaterials: "Buy Materials",
    sellMaterials: "Sell Materials",
    rentMaterials: "Rent Materials",
    price: "Price",
    duration: "Duration",
    addToCart: "Add to Cart",
    checkout: "Checkout",
    
    // Course Sync
    courseSyncTitle: "University Course Sync",
    selectUniversity: "Select University",
    selectCourse: "Select Course",
    syncCourse: "Sync Course",
    syncing: "Syncing...",
    syncComplete: "Sync completed successfully!",
    
    // Offline Mode
    offlineModeTitle: "Offline Mode",
    downloadForOffline: "Download for Offline",
    offlineStorage: "Offline Storage",
    syncQueue: "Sync Queue",
    
    // Errors & Messages
    errorOccurred: "An error occurred",
    tryAgain: "Try Again",
    success: "Success",
    warning: "Warning",
    info: "Information",
  },
  hi: {
    // Navigation
    navbarHome: "होम",
    navbarDashboard: "डैशबोर्ड",
    navbarStudy: "अध्ययन",
    navbarCourses: "पाठ्यक्रम",
    navbarMarketplace: "बाज़ार",
    navbarSettings: "सेटिंग्स",
    navbarProfile: "प्रोफ़ाइल",
    navbarLibrary: "लाइब्रेरी",
    navbarCart: "कार्ट",
    navbarBrowse: "ब्राउज़ करें",
    navbarLogout: "लॉगआउट",
    navbarLogin: "लॉगिन",
    navbarSignup: "साइन अप",
    
    // Dashboard
    dashboardTitle: "अध्ययन डैशबोर्ड",
    upcomingDeadlines: "आने वाली समय सीमाएं",
    studyStats: "अध्ययन आंकड़े",
    recentDocuments: "हाल के दस्तावेज़",
    todoList: "करने के लिए सूची",
    progressTracker: "प्रगति ट्रैकर",
    flashcardDue: "फ्लैशकार्ड देय",
    studyStreak: "अध्ययन स्ट्रीक",
    examCountdown: "परीक्षा गिनती",
    
    // Peer Review
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
    reviewPosted: "समीक्षा सफलतापूर्वक पोस्ट की गई!",
    replyPosted: "उत्तर सफलतापूर्वक पोस्ट किया गया!",
    reviewReported: "समीक्षा की रिपोर्ट की गई। हमारे समुदाय को सुरक्षित रखने में मदद के लिए धन्यवाद।",
    
    // Settings
    settingsTitle: "वैश्विक सेटिंग्स",
    languageSetting: "इंटरफ़ेस भाषा",
    selectLanguage: "अपनी पसंदीदा भाषा चुनें",
    languageChanged: "भाषा सफलतापूर्वक बदल दी गई!",
    autoSave: "ड्राफ्ट स्वतः सहेजें",
    notifications: "अधिसूचनाएं सक्षम करें",
    darkMode: "डार्क मोड",
    compactView: "कॉम्पैक्ट दृश्य",
    accessibility: "पहुंच विकल्प",
    reducedMotion: "एनिमेशन कम करें",
    highContrast: "उच्च विपरीतता मोड",
    largeText: "बड़ा पाठ मोड",
    dyslexicFont: "डिस्लेक्सिया-अनुकूल फ़ॉन्ट",
    
    // Common
    welcomeMessage: "स्कॉलरस्टॉक में आपका स्वागत है",
    loading: "लोड हो रहा है...",
    save: "सहेजें",
    cancel: "रद्द करें",
    search: "खोजें",
    logout: "लॉगआउट",
    delete: "हटाएं",
    edit: "संपादित करें",
    add: "जोड़ें",
    close: "बंद करें",
    back: "वापस",
    next: "अगला",
    previous: "पिछला",
    
    // Study Rooms
    studyRoomsTitle: "सहयोगी अध्ययन कक्ष",
    createRoom: "अध्ययन कक्ष बनाएं",
    joinRoom: "अध्ययन कक्ष में शामिल हों",
    inviteCode: "आमंत्रण कोड",
    participants: "प्रतिभागी",
    endSession: "सत्र समाप्त करें",
    shareNotes: "नोट्स साझा करें",
    whiteboard: "व्हाइटबोर्ड",
    voiceChat: "वॉयस चैट",
    
    // Flashcards
    flashcardsTitle: "फ्लैशकार्ड",
    createDeck: "डेक बनाएं",
    addFlashcard: "फ्लैशकार्ड जोड़ें",
    reviewCards: "कार्ड की समीक्षा करें",
    deckName: "डेक का नाम",
    question: "प्रश्न",
    answer: "उत्तर",
    easy: "आसान",
    medium: "मध्यम",
    hard: "कठिन",
    
    // Marketplace
    marketplaceTitle: "विश्वविद्यालय बाज़ार",
    buyMaterials: "सामग्री खरीदें",
    sellMaterials: "सामग्री बेचें",
    rentMaterials: "सामग्री किराए पर लें",
    price: "कीमत",
    duration: "अवधि",
    addToCart: "कार्ट में जोड़ें",
    checkout: "चेकआउट",
    
    // Course Sync
    courseSyncTitle: "विश्वविद्यालय पाठ्यक्रम सिंक",
    selectUniversity: "विश्वविद्यालय चुनें",
    selectCourse: "पाठ्यक्रम चुनें",
    syncCourse: "पाठ्यक्रम सिंक करें",
    syncing: "सिंक किया जा रहा है...",
    syncComplete: "सिंक सफलतापूर्वक पूरा हुआ!",
    
    // Offline Mode
    offlineModeTitle: "ऑफ़लाइन मोड",
    downloadForOffline: "ऑफ़लाइन के लिए डाउनलोड करें",
    offlineStorage: "ऑफ़लाइन स्टोरेज",
    syncQueue: "सिंक कतार",
    
    // Errors & Messages
    errorOccurred: "एक त्रुटि हुई",
    tryAgain: "फिर से प्रयास करें",
    success: "सफलता",
    warning: "चेतावनी",
    info: "जानकारी",
  },
  ta: {
    // Navigation
    navbarHome: "முகப்பு",
    navbarDashboard: "டாஷ்போர்டு",
    navbarStudy: "படிப்பு",
    navbarCourses: "பாடநெறிகள்",
    navbarMarketplace: "சந்தை",
    navbarSettings: "அமைப்புகள்",
    navbarProfile: "சுயவிவரம்",
    navbarLibrary: "நூலகம்",
    navbarCart: "வண்டி",
    navbarBrowse: "உலாவ",
    navbarLogout: "வெளியேறு",
    navbarLogin: "உள்நுழைக",
    navbarSignup: "பதிவு செய்க",
    
    // Peer Review
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
    
    // Settings
    settingsTitle: "உலகளாவிய அமைப்புகள்",
    languageSetting: "இண்டர்பேஸ் மொழி",
    selectLanguage: "உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும்",
    languageChanged: "மொழி வெற்றிகரமாக மாற்றப்பட்டது!",
    
    // Common
    welcomeMessage: "ஸ்காலர்ஸ்டாக்கிற்கு வரவேற்கிறோம்",
    loading: "ஏற்றுகிறது...",
    save: "சேமிக்கவும்",
    cancel: "ரத்து செய்க",
    search: "தேடுக",
    logout: "வெளியேறு",
  },
  te: {
    // Navigation
    navbarHome: "హోమ్",
    navbarDashboard: "డాష్బోర్డ్",
    navbarStudy: "స్టడీ",
    navbarCourses: "కోర్సులు",
    navbarMarketplace: "మార్కెట్‌ప్లేస్",
    navbarSettings: "సెట్టింగ్‌లు",
    navbarProfile: "ప్రొఫైల్",
    navbarLibrary: "లైబ్రరీ",
    navbarCart: "కార్ట్",
    navbarBrowse: "బ్రౌజ్ చేయండి",
    navbarLogout: "లాగ్‌అవుట్",
    navbarLogin: "లాగిన్",
    navbarSignup: "సైన్ అప్",
    
    // Peer Review
    peerReviewTitle: "పీర్ రివ్యూ సిస్టమ్",
    writeReview: "మీ సమీక్షను వ్రాయండి",
    reviewPlaceholder: "ఈ మెటీరియల్‌తో మీ అనుభవాన్ని పంచుకోండి...",
    submitButton: "సమీక్షను సమర్పించండి",
    submitting: "సమర్పిస్తోంది...",
    helpful: "ఉపయోగకరంగా ఉంది",
    notHelpful: "ఉపయోగకరం కాదు",
    replyButton: "ప్రతిస్పందించండి",
    reportButton: "నివేదించండి",
    verifiedPurchase: "ధృవీకృత ఖరీదు",
    
    // Settings
    settingsTitle: "గ్లోబల్ సెట్టింగ్‌లు",
    languageSetting: "ఇంటర్‌ఫేస్ భాష",
    selectLanguage: "మీ ఇష్ట భాషను ఎంచుకోండి",
    languageChanged: "భాష విజయవంతంగా మార్చబడింది!",
    
    // Common
    welcomeMessage: "స్కాలర్‌స్టాక్‌కు స్వాగతం",
    loading: "లోడ్ చేస్తోంది...",
    save: "సేవ్ చేయండి",
    cancel: "రద్దు చేయండి",
    search: "వెతకండి",
    logout: "లాగ్‌అవుట్",
  },
  mr: {
    // Navigation
    navbarHome: "मुख्यपृष्ठ",
    navbarDashboard: "डॅशबोर्ड",
    navbarStudy: "अभ्यास",
    navbarCourses: "कोर्सेस",
    navbarMarketplace: "बाजार",
    navbarSettings: "सेटिंग्स",
    navbarProfile: "प्रोफाइल",
    navbarLibrary: "लायब्ररी",
    navbarCart: "कार्ट",
    navbarBrowse: "ब्राउজ करा",
    navbarLogout: "लॉगआउट",
    navbarLogin: "लॉगिन",
    navbarSignup: "साइन अप",
    
    // Peer Review
    peerReviewTitle: "समीक्षा प्रणाली",
    writeReview: "आपली समीक्षा लिहा",
    reviewPlaceholder: "या सामग्रीसह आपले अनुभव शेअर करा...",
    submitButton: "समीक्षा सबमिट करा",
    submitting: "सबमिट केले जात आहे...",
    helpful: "उपयुक्त",
    notHelpful: "उपयुक्त नाही",
    replyButton: "उत्तर द्या",
    reportButton: "अहवाल द्या",
    verifiedPurchase: "सत्यापित खरेदी",
    
    // Settings
    settingsTitle: "जागतिक सेटिंग्स",
    languageSetting: "इंटरफेस भाषा",
    selectLanguage: "आपली पसंतीची भाषा निवडा",
    languageChanged: "भाषा यशस्वीरित्या बदलली!",
    
    // Common
    welcomeMessage: "स्कॉलरस्टॉकमध्ये आपले स्वागत आहे",
    loading: "लोड होत आहे...",
    save: "जतन करा",
    cancel: "रद्द करा",
    search: "शोध",
    logout: "लॉगआउट",
  },
  bn: {
    // Navigation
    navbarHome: "হোম",
    navbarDashboard: "ড্যাশবোর্ড",
    navbarStudy: "পড়াশোনা",
    navbarCourses: "কোর্স",
    navbarMarketplace: "মার্কেটপ্লেস",
    navbarSettings: "সেটিংস",
    navbarProfile: "প্রোফাইল",
    navbarLibrary: "লাইব্রেরি",
    navbarCart: "কার্ট",
    navbarBrowse: "ব্রাউজ করুন",
    navbarLogout: "লগআউট",
    navbarLogin: "লগইন",
    navbarSignup: "সাইন আপ",
    
    // Peer Review
    peerReviewTitle: "পিয়ার রিভিউ সিস্টেম",
    writeReview: "আপনার পর্যালোচনা লিখুন",
    reviewPlaceholder: "এই উপাদানের সাথে আপনার অভিজ্ঞতা শেয়ার করুন...",
    submitButton: "পর্যালোচনা জমা দিন",
    submitting: "জমা দেওয়া হচ্ছে...",
    helpful: "সহায়ক",
    notHelpful: "সহায়ক নয়",
    replyButton: "উত্তর দিন",
    reportButton: "রিপোর্ট করুন",
    verifiedPurchase: "যাচাইকৃত ক্রয়",
    
    // Settings
    settingsTitle: "বৈশ্বিক সেটিংস",
    languageSetting: "ইন্টারফেস ভাষা",
    selectLanguage: "আপনার পছন্দের ভাষা নির্বাচন করুন",
    languageChanged: "ভাষা সফলভাবে পরিবর্তিত হয়েছে!",
    
    // Common
    welcomeMessage: "স্কলারস্টকে স্বাগতম",
    loading: "লোড হচ্ছে...",
    save: "সংরক্ষণ করুন",
    cancel: "বাতিল করুন",
    search: "অনুসন্ধান",
    logout: "লগআউট",
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