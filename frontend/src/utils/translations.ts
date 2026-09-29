// Path: cineverse/frontend/src/utils/translations.ts

export type Language = "ar" | "en";

export const translations = {
  ar: {
    // الهيدر والتنقل
    brandTag: "المنصات الرسمية",
    navHome: "الرئيسية",
    navCatalog: "الكتالوج",
    navPlatforms: "المنصات الرسمية",
    navFamilyGuide: "دليل العائلة",
    navWatchlist: "قائمتي",
    searchPlaceholder: "ابحث عن فيلم، مسلسل، أو منصة...",
    searchSuggestions: "نتائج مقترحة فورية",
    searchAll: "عرض جميع النتائج في الكتالوج",
    login: "دخول",
    logout: "خروج",
    streamingRegion: "منطقة البث:",
    
    // صفحة تفاصيل العمل
    back: "رجوع",
    whereToWatch: "أين تشاهد العمل بشكل رسمي؟",
    legalStreamingSub: "منصات البث الرقمي المعتمدة والمرخصة قانونياً",
    notAvailableInCountry: "العمل غير متوفر حالياً على منصات البث الرقمي الرسمية في هذه الدولة.",
    autoUpdateDaily: "يتم تحديث الدليل وتوفر المنصات بشكل يومي وتلقائي.",
    watchNow: "شاهد الآن",
    watchTrailer: "الإعلان الترويجي",
    noTrailerFound: "عفواً، لا يتوفر إعلان رسمي لهذا العمل حالياً.",
    subscription: "ضمن الاشتراك",
    rentBuy: "إيجار / شراء",
    addToWatchlist: "أضف لقائمتي",
    inWatchlist: "محفوظ في قائمتي",
    noOverview: "لا يوجد وصف مختصر متاح حالياً لهذا العمل.",
    
    // دليل العائلة
    familyGuideTitle: "تقرير الفحص والرقابة العائلية",
    violence: "العنف",
    fear: "الرعب",
    sexualContent: "المشاهد",
    languageMetric: "الألفاظ",
    drugs: "المخدرات",
    
    // مستويات المؤشرات
    levelNone: "منعدم",
    levelMild: "خفيف",
    levelModerate: "متوسط",
    levelSevere: "شديد",
    levelCritical: "حرج",
    
    // قائمة المشاهدة
    watchlistTitle: "الأعمال المحفوظة",
    watchlistSubCloud: "مرحباً {name}، قائمتك مزامنة سحابياً بحسابك",
    watchlistSubLocal: "يتم حفظ قائمتك على هذا المتصفح (سجّل دخولك لحفظها سحابياً)",
    totalSaved: "إجمالي المحفوظات:",
    emptyWatchlistTitle: "قائمتك فارغة حالياً",
    emptyWatchlistDesc: "تصفح الكتالوج واضغط على علامة 'أضف لقائمتي' لتنظيم قائمة المشاهدة الخاصة بك.",
    exploreCatalog: "استكشف الكتالوج الآن",
    viewDetails: "تفاصيل العرض",
  },
  en: {
    // Header & Navigation
    brandTag: "Official Providers",
    navHome: "Home",
    navCatalog: "Catalog",
    navPlatforms: "Platforms",
    navFamilyGuide: "Family Guide",
    navWatchlist: "My List",
    searchPlaceholder: "Search for movies, series, or platforms...",
    searchSuggestions: "Instant Suggestions",
    searchAll: "View all catalog results",
    login: "Sign In",
    logout: "Sign Out",
    streamingRegion: "Streaming Region:",
    
    // Title Details
    back: "Back",
    whereToWatch: "Where to Watch Officially?",
    legalStreamingSub: "Licensed and legally approved streaming platforms",
    notAvailableInCountry: "This title is currently unavailable on official streaming platforms in this country.",
    autoUpdateDaily: "Platform availability is updated automatically daily.",
    watchNow: "Watch Now",
    watchTrailer: "Official Trailer",
    noTrailerFound: "Sorry, no official trailer is available for this title.",
    subscription: "Subscription",
    rentBuy: "Rent / Buy",
    addToWatchlist: "Add to My List",
    inWatchlist: "Saved in My List",
    noOverview: "No overview description available at this moment.",
    
    // Family Guide
    familyGuideTitle: "Family Safety & Content Guide",
    violence: "Violence",
    fear: "Fear & Horror",
    sexualContent: "Sex & Nudity",
    languageMetric: "Profanity",
    drugs: "Substances & Alcohol",
    
    // Metric Levels
    levelNone: "None",
    levelMild: "Mild",
    levelModerate: "Moderate",
    levelSevere: "Severe",
    levelCritical: "Critical",
    
    // Watchlist
    watchlistTitle: "Saved Watchlist",
    watchlistSubCloud: "Welcome {name}, your list is synced with cloud",
    watchlistSubLocal: "Saved on this device (Sign in to sync with cloud)",
    totalSaved: "Total Titles:",
    emptyWatchlistTitle: "Your Watchlist is Empty",
    emptyWatchlistDesc: "Browse our catalog and bookmark titles to organize what you want to stream.",
    exploreCatalog: "Explore Catalog Now",
    viewDetails: "View Title",
  }
};