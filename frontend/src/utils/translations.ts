// Path: cineverse/frontend/src/utils/translations.ts

export type Language = "ar" | "en";

export const translations = {
  ar: {
    // التنقل والشريط العلوي
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

    // الصفحة الرئيسية (Featured & Sections)
    featuredTitleBadge: "العمل المميز اليوم في الشرق الأوسط",
    digitallyLicensed: "مرخص رقمياً",
    officialLicensed: "مرخص رسمي",
    whereToWatchCta: "أين أشاهد العمل؟",
    whereToWatchCard: "أين تشاهد العمل؟",
    noOverviewFound: "لا يوجد وصف عربي متوفر حالياً لهذا العمل.",
    
    homeFeaturesLegalTitle: "منصات قانونية 100%",
    homeFeaturesLegalDesc: "روابط مباشرة للمنصات المعتمدة بدون مواقع مقرصنة.",
    homeFeaturesCoverageTitle: "تغطية شاملة للمنطقة",
    homeFeaturesCoverageDesc: "شاهد، نتفليكس، OSN+، واتش إت، وبرايم فيديو.",
    homeFeaturesFamilyTitle: "فحص عائلي دقيق",
    homeFeaturesFamilyDesc: "تصنيفات عمرية ومؤشرات العنف والألفاظ قبل المشاهدة.",

    trendingSectionTitle: "الأكثر رواجاً في منطقتك",
    trendingSectionSub: "الأعمال التي يتحدث عنها الجميع الآن وتتوفر رقمياً",
    viewAllCatalogBtn: "عرض الكتالوج بالكامل",

    topRatedSectionTitle: "الأعلى تقييماً نقدياً وجماهيرياً",
    topRatedSectionSub: "تحف سينمائية حاصلة على أعلى التقييمات",
    moreBtn: "المزيد",

    // دليل العائلة
    familyGuideMainTitle: "دليل المشاهدة الآمنة للأسرة",
    familyGuideMainSub: "تقارير فحص وتصنيف المحتوى لحماية الأطفال ومساعدة أولياء الأمور في اختيار المحتوى المناسب.",
    tabAllAges: "جميع الأعمار",
    tabGeneral: "للجميع (G)",
    tabKids7: "أطفال (+7)",
    tabTeens13: "يافعين (+13)",
    tabGuidance16: "إشراف عائلي (+16)",
    tabAdults18: "كبار فقط (+18)",
    releaseYearLabel: "سنة الإنتاج:",
    violenceLabel: "العنف:",
    fearLabel: "الرعب النفسي:",
    sensitiveScenesLabel: "المشاهد الحساسة:",
    profanityLabel: "الألفاظ:",
    drugsLabel: "المواد والمخدرات:",
    familyCardCta: "تفاصيل العمل ومنصات العرض الرسمية",

    // قائمة المشاهدة
    watchlistHeaderTitle: "قائمتي الشخصية للمشاهدة اللاحقة",
    watchlistSubCloud: "مرحباً {name}، قائمتك مزامنة سحابياً بحسابك",
    watchlistSubLocal: "يتم حفظ قائمتك على هذا المتصفح (سجّل دخولك لحفظها سحابياً)",
    savedTitlesHeader: "الأعمال المحفوظة",
    totalSavedLabel: "إجمالي المحفوظات:",
    emptyWatchlistTitle: "قائمتك فارغة حالياً",
    emptyWatchlistDesc: "تصفح الكتالوج واضغط على علامة 'أضف لقائمتي' لتنظيم قائمة المشاهدة الخاصة بك.",
    exploreCatalogBtn: "استكشف الكتالوج الآن",
    viewTitleDetails: "تفاصيل العرض",

    // المنصات
    platformsPageTitle: "المنصات الرقمية الرسمية المعتمدة",
    platformsPageSub: "دليل المنصات المرخصة قانونياً في الشرق الأوسط مع روابط الوصول المباشر.",
    visitPlatformBtn: "زيارة المنصة الرسمية",
    browsePlatformCatalog: "استعراض أعمال المنصة",
    availableTitlesCount: "عمل متوفر",

    // صفحة تفاصيل العمل
    back: "رجوع",
    whereToWatch: "أين تشاهد العمل بشكل رسمي؟",
    legalStreamingSub: "منصات البث الرقمي المعتمدة والمرخصة قانونياً",
    notAvailableInCountry: "العمل غير متوفر حالياً على منصات البث الرقمي الرسمية في هذه الدولة.",
    autoUpdateDaily: "يتم تحديث الدليل وتوفر المنصات بشكل يومي وتلقائي.",
    watchNow: "شاهد الآن",
    watchTrailer: "الإعلان الترويجي",
    loadingTrailer: "جاري تجهيز مشغل الإعلان الترويجي...",
    subscription: "ضمن الاشتراك",
    rentBuy: "إيجار / شراء",
    addToWatchlist: "أضف لقائمتي",
    inWatchlist: "محفوظ في قائمتي",
    noOverview: "لا يوجد وصف متاح حالياً لهذا العمل.",

    // مستويات المؤشرات
    levelNone: "منعدم",
    levelMild: "خفيف",
    levelModerate: "متوسط",
    levelSevere: "شديد",
    levelCritical: "حرج",

    // الفوتر
    footerTagline: "دليلك الذكي لاكتشاف أين تُعرض الأفلام والمسلسلات في الشرق الأوسط بشكل قانوني ورسمي، مع دعم حقوق الملكية الفكرية وتوجيه الرقابة العائلية.",
    footerBadge: "منصة مرخصة وموثوقة 100%",
    footerNavTitle: "استكشاف",
    footerPlatformsTitle: "المنصات المدعومة",
    footerSafetyTitle: "الشفافية والأمان",
    footerSafetyText: "CineVerse لا يستضيف أو يبث أي مواد مقرصنة أو محمية بحقوق الطبع والنشر. نوفر فقط روابط مباشرة وتوجيهية إلى المنصات المرخصة رسمياً في منطقتك الجغرافية.",
    footerAffiliateNotice: "قد تتضمن بعض الروابط معرفات تسويقية (Affiliate) لدعم استمرار وتطوير المنصة دون تحميل المستخدم أي تكاليف إضافية.",
    footerCopyright: "جميع الحقوق محفوظة © 2026 CineVerse."
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

    // Home Page (Featured & Sections)
    featuredTitleBadge: "Featured Title Today in MENA",
    digitallyLicensed: "Digitally Licensed",
    officialLicensed: "Official Licensed",
    whereToWatchCta: "Where to Watch?",
    whereToWatchCard: "Where to Watch?",
    noOverviewFound: "No English description available for this title.",

    homeFeaturesLegalTitle: "100% Legal Platforms",
    homeFeaturesLegalDesc: "Direct verified links to authorized platforms with zero piracy.",
    homeFeaturesCoverageTitle: "Comprehensive Regional Coverage",
    homeFeaturesCoverageDesc: "Shahid, Netflix, OSN+, Watch IT, and Prime Video.",
    homeFeaturesFamilyTitle: "Precise Family Screening",
    homeFeaturesFamilyDesc: "Age ratings, violence, and language metrics before streaming.",

    trendingSectionTitle: "Trending in Your Region",
    trendingSectionSub: "Titles everyone is talking about now available digitally",
    viewAllCatalogBtn: "View Full Catalog",

    topRatedSectionTitle: "Critically & Top Rated",
    topRatedSectionSub: "Masterpieces with the highest ratings",
    moreBtn: "More",

    // Family Guide
    familyGuideMainTitle: "Family Safety & Content Guide",
    familyGuideMainSub: "Detailed content screening and age classification to protect children and help parents select appropriate cinema.",
    tabAllAges: "All Ages",
    tabGeneral: "General (G)",
    tabKids7: "Kids (+7)",
    tabTeens13: "Teens (+13)",
    tabGuidance16: "Parental Guidance (+16)",
    tabAdults18: "Adults Only (+18)",
    releaseYearLabel: "Release Year:",
    violenceLabel: "Violence:",
    fearLabel: "Psychological Fear:",
    sensitiveScenesLabel: "Sensitive Scenes:",
    profanityLabel: "Profanity:",
    drugsLabel: "Substances & Drugs:",
    familyCardCta: "Title Details & Official Platforms",

    // Watchlist
    watchlistHeaderTitle: "My Personal Watchlist",
    watchlistSubCloud: "Welcome {name}, your list is synced with cloud",
    watchlistSubLocal: "Saved on this device (Sign in to sync with cloud)",
    savedTitlesHeader: "Saved Titles",
    totalSavedLabel: "Total Saved:",
    emptyWatchlistTitle: "Your Watchlist is Empty",
    emptyWatchlistDesc: "Browse our catalog and bookmark titles to organize what you want to stream.",
    exploreCatalogBtn: "Explore Catalog Now",
    viewTitleDetails: "View Details",

    // Platforms
    platformsPageTitle: "Official Licensed Platforms",
    platformsPageSub: "Your trusted directory for legally authorized streaming services in the Middle East.",
    visitPlatformBtn: "Visit Official Platform",
    browsePlatformCatalog: "Browse Platform Titles",
    availableTitlesCount: "Titles Available",

    // Title Details
    back: "Back",
    whereToWatch: "Where to Watch Officially?",
    legalStreamingSub: "Licensed and legally approved streaming platforms",
    notAvailableInCountry: "This title is currently unavailable on official streaming platforms in this country.",
    autoUpdateDaily: "Platform availability is updated automatically daily.",
    watchNow: "Watch Now",
    watchTrailer: "Official Trailer",
    loadingTrailer: "Loading official trailer player...",
    subscription: "Subscription",
    rentBuy: "Rent / Buy",
    addToWatchlist: "Add to My List",
    inWatchlist: "Saved in My List",
    noOverview: "No description available for this title.",

    // Metric Levels
    levelNone: "None",
    levelMild: "Mild",
    levelModerate: "Moderate",
    levelSevere: "Severe",
    levelCritical: "Critical",

    // Footer
    footerTagline: "Your smart guide to discovering where to legally stream movies and TV shows across the Middle East, supporting intellectual property and family guidance.",
    footerBadge: "100% Legal & Verified Platform",
    footerNavTitle: "Explore",
    footerPlatformsTitle: "Supported Platforms",
    footerSafetyTitle: "Safety & Transparency",
    footerSafetyText: "CineVerse does not host or stream any pirated or copyrighted content. We only provide direct links to officially licensed streaming services in your region.",
    footerAffiliateNotice: "Some links may include affiliate tags to support the development of the platform at no extra cost to the user.",
    footerCopyright: "All rights reserved © 2026 CineVerse."
  }
};

// مترجم ذكي لعناوين الأفلام
export function translateTitleName(rawTitle: string | undefined | null, lang: Language): string {
  if (!rawTitle) return "";
  if (lang === "ar") return rawTitle;

  const titleMap: Record<string, string> = {
    "مواجهة إل تشابو": "Hunting El Chapo",
    "يوم الإفصاح": "Disclosure Day",
    "حرب العوالم": "War of the Worlds",
    "المنتقمون: الحرب الأبدية": "Avengers: Infinity War",
    "المنتقمون: نهاية اللعبة": "Avengers: Endgame",
    "مشروع هيل ماري": "Project Hail Mary",
    "العداءة": "The Runner",
    "愛のぬくもり": "Warmth of Love",
    "PAW Patrol: The Dino Movie": "PAW Patrol: The Dino Movie",
    "Tumbal Proyek": "Tumbal Proyek",
    "Rage of Stars": "Rage of Stars"
  };

  return titleMap[rawTitle.trim()] || rawTitle;
}

// مترجم ذكي لوصف الأفلام في الكتالوج والرئيسية
export function translateTitleOverview(rawDesc: string | undefined | null, title: string, lang: Language): string {
  if (!rawDesc) return "";
  if (lang === "ar") return rawDesc;

  const descMap: Record<string, string> = {
    "مواجهة إل تشابو": "Two Mexican officers must survive the final hours of their shift after getting entangled in a confrontation with a ruthless cartel boss.",
    "يوم الإفصاح": "A cybersecurity expert turns whistleblower after discovering alien secrets, pursued by a corporation while teaming up with a meteorologist.",
    "حرب العوالم": "War of the Worlds 2025 follows an alien invasion stealing human data through cyberspace to threaten global security.",
    "المنتقمون: الحرب الأبدية": "The Avengers and their allies must sacrifice all in an attempt to defeat the powerful Thanos before his blitz of ruin puts an end to the universe.",
    "المنتقمون: نهاية اللعبة": "After the devastating events of Infinity War, the universe is in ruins. The remaining Avengers assemble once more to reverse Thanos' actions.",
    "مشروع هيل ماري": "A lone astronaut must solve the mystery of an extinction-level substance threatening Earth, forming an unlikely friendship.",
    "العداءة": "In this psychological thriller, London lawyer Maya Martin's life collapses during her morning run when her son is abducted.",
    "愛のぬくもり": "A heartwarming drama exploring emotional connections and human compassion.",
    "لا يوجد وصف عربي متوفر حالياً لهذا العمل.": "No description available for this title."
  };

  return descMap[title.trim()] || descMap[rawDesc.trim()] || rawDesc;
}

// مترجم نصوص ومؤشرات دليل العائلة
export function translateFamilyMetric(val: string | undefined | null, lang: Language): string {
  if (!val) return "";
  if (lang === "ar") return val;

  const map: Record<string, string> = {
    // المؤشرات
    "منعدم": "None",
    "خفيف": "Mild",
    "متوسط": "Moderate",
    "شديد": "Severe",
    "حرج": "Critical",

    // التقييمات الإجمالية
    "إشراف عائلي موصى به": "Parental Guidance Suggested",
    "مناسب للمراهقين والأسرة": "Suitable for Teens & Family",
    "أجواء سوداوية وعنف جريمة": "Dark Tone & Crime Violence",
    "حروب خيال علمي ملحمية": "Epic Sci-Fi Warfare",
    "رعب نفسي شديد وإثارة معقدة": "Intense Psychological Thriller",
    "مناسب لجميع الأعمار": "Suitable for All Ages",
    "إرشاد عائلي +13": "PG-13",
    "للبالغين فقط +18": "Adults Only (18+)",

    // ملاحظات التوجيه
    "يتناول أفكاراً فلسفية وسياسية وتوتراً نفسياً عميقاً ومحاكاة لانفجارات وتجارب حربية معقدة.":
      "Explores deep philosophical and political themes with intense psychological tension and wartime simulation.",
    "محتوى علمي وفضائي مبهر وخالٍ من الإسفاف؛ مناسب جداً للمشاهدة العائلية لمن هم فوق 12 سنة.":
      "Stunning space science content, highly clean and recommended for family viewing for ages 12 and above.",
    "أجواء الجريمة ثقيلة والفيلم مظلم بصرياً ونفسياً، يحتوي على تحقيقات جرائم قتل وقتال عنيف.":
      "Heavy crime tone, visually and psychologically dark, contains murder investigations and intense combat.",
    "يحتوي على معارك حربية ملحمية واشتباكات بالسيوف؛ لا توجد مشاهد مخلة أو ألفاظ خارجة.":
      "Features epic sci-fi warfare and sword combat; zero inappropriate scenes or offensive language.",
    "غير مناسب للأطفال إطلاقاً؛ يحتوي على صدمات نفسية واضطرابات حادة ومشاهد تحقيق مرعبة.":
      "Not suitable for children at all; contains severe psychological trauma and disturbing investigation scenes.",
    "يُنصح بمرافقة الوالدين لتقييم ملاءمة المحتوى حسب المرحلة العمرية.":
      "Parental guidance is recommended to evaluate content suitability for younger viewers."
  };

  return map[val.trim()] || val;
}

export function getCountryName(code: string, lang: Language): string {
  const countries: Record<string, { ar: string; en: string }> = {
    EG: { ar: "مصر", en: "Egypt" },
    SA: { ar: "السعودية", en: "Saudi Arabia" },
    AE: { ar: "الإمارات", en: "UAE" }
  };
  return countries[code] ? countries[code][lang] : code;
}

// مترجم ذكي لأسماء المنصات الرسمية
export function translateProviderName(rawName: string | undefined | null, lang: Language): string {
  if (!rawName) return "";
  const clean = rawName.trim();
  const lower = clean.toLowerCase();

  if (lower.includes("shahid") || lower.includes("شاهد")) {
    return lang === "ar" ? "شاهد VIP" : "Shahid VIP";
  }
  if (lower.includes("watch") || lower.includes("واتش")) {
    return lang === "ar" ? "واتش إت (WATCH IT)" : "WATCH IT";
  }
  if (lower.includes("netflix") || lower.includes("نتفليكس") || lower.includes("نتفلكس")) {
    return lang === "ar" ? "نتفليكس" : "Netflix";
  }
  if (lower.includes("osn") || lower.includes("او اس ان") || lower.includes("أو إس إن")) {
    return lang === "ar" ? "أو إس إن+ (OSN+)" : "OSN+";
  }
  if (lower.includes("prime") || lower.includes("amazon") || lower.includes("أمازون") || lower.includes("برايم")) {
    return lang === "ar" ? "أمازون برايم فيديو" : "Amazon Prime Video";
  }
  if (lower.includes("disney") || lower.includes("ديزني")) {
    return lang === "ar" ? "ديزني+" : "Disney+";
  }
  if (lower.includes("apple") || lower.includes("أبل") || lower.includes("ابل")) {
    return lang === "ar" ? "أبل تي في+" : "Apple TV+";
  }
  if (lower.includes("tod") || lower.includes("تود")) {
    return lang === "ar" ? "تود (TOD)" : "TOD";
  }
  if (lower.includes("starz") || lower.includes("ستارز")) {
    return lang === "ar" ? "ستارزبلاي" : "Starzplay";
  }

  // تنظيف أي حروف عربية وأقواس متبقية في وضع الإنجليزية
  if (lang === "en") {
    const stripped = clean.replace(/[\u0600-\u06FF\(\)\/]/g, "").trim();
    if (stripped.length > 0) return stripped;
  }

  return clean;
}