import { LanguageInfo } from '../types';

export const ALL_LANGUAGES: LanguageInfo[] = [
  { code: 'uz', name: 'Uzbek', nativeName: "O'zbekcha", flag: '🇺🇿' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', isRtl: true },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', isRtl: true },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', isRtl: true },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша', flag: '🇰🇿' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', flag: '🇰🇬' },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', flag: '🇹🇯' },
  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmençe', flag: '🇹🇲' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycanca', flag: '🇦🇿' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', isRtl: true },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', flag: '🇦🇲' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
];

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  greetingMorning: string;
  greetingDay: string;
  greetingEvening: string;
  greetingNight: string;
  inputPlaceholder: string;
  notePlaceholder: string;
  timeLabel: string;
  priorityLabel: string;
  priorityLow: string;
  priorityMedium: string;
  priorityHigh: string;
  categoryLabel: string;
  catWork: string;
  catStudy: string;
  catHome: string;
  catHealth: string;
  catFamily: string;
  catShopping: string;
  catOther: string;
  addButton: string;
  validationEmpty: string;
  searchPlaceholder: string;
  filterAll: string;
  filterPending: string;
  filterCompleted: string;
  sortBy: string;
  sortTime: string;
  sortPriority: string;
  sortCreated: string;
  overdue: string;
  emptyStateTitle: string;
  emptyStateSub: string;
  statsTitle: string;
  completedToday: string;
  streakDays: string;
  weeklyStats: string;
  categoryDistribution: string;
  allDoneTitle: string;
  allDoneSub: string;
  soundOn: string;
  soundOff: string;
  clearAll: string;
  clearConfirmTitle: string;
  clearConfirmDesc: string;
  confirmYes: string;
  confirmCancel: string;
  exportData: string;
  importData: string;
  editTask: string;
  saveChanges: string;
  otherLanguage: string;
  otherLangPrompt: string;
  translating: string;
  remindNotificationTitle: string;
  enableNotifications: string;
  dragHint: string;
}

export const UZBEK_TRANSLATIONS: TranslationDictionary = {
  appName: 'KunReja',
  tagline: 'Kunlik ish rejasi',
  greetingMorning: 'Xayrli tong!',
  greetingDay: 'Xayrli kun!',
  greetingEvening: 'Xayrli kech!',
  greetingNight: 'Xayrli tun!',
  inputPlaceholder: 'Bugun nima qilmoqchisiz?',
  notePlaceholder: 'Qisqa izoh (ixtiyoriy)...',
  timeLabel: 'Vaqt',
  priorityLabel: 'Muhimlik',
  priorityLow: 'Past',
  priorityMedium: "O'rta",
  priorityHigh: 'Yuqori',
  categoryLabel: 'Kategoriya',
  catWork: 'Ish',
  catStudy: "O'qish",
  catHome: 'Uy',
  catHealth: "Sog'liq",
  catFamily: 'Oila',
  catShopping: 'Xarid',
  catOther: 'Boshqa',
  addButton: "Qo'shish",
  validationEmpty: 'Avval reja yozing!',
  searchPlaceholder: 'Rejalarni qidirish...',
  filterAll: 'Hammasi',
  filterPending: 'Bajarilmagan',
  filterCompleted: 'Bajarilgan',
  sortBy: 'Tartiblash',
  sortTime: "Vaqt bo'yicha",
  sortPriority: "Muhimlik bo'yicha",
  sortCreated: "Qo'shilgan vaqt",
  overdue: 'Kechikdi',
  emptyStateTitle: 'Hali reja yo‘q',
  emptyStateSub: 'Bugungi birinchi maqsadingizni qo‘shing!',
  statsTitle: 'Kunlik statistika',
  completedToday: 'Bugun bajarildi',
  streakDays: 'Ketma-ket kunlar',
  weeklyStats: 'Oxirgi 7 kunlik natija',
  categoryDistribution: 'Kategoriyalar tahlili',
  allDoneTitle: 'Ofarin! Bugun ajoyib kun bo‘ldi! 🎉',
  allDoneSub: 'Barcha rejalaringiz to‘liq bajarildi! O‘zingiz bilan faxrlaning.',
  soundOn: 'Ovoz yoqilgan',
  soundOff: "Ovoz o'chirilgan",
  clearAll: "Hammasini o'chirish",
  clearConfirmTitle: 'Ishonchingiz komilmi?',
  clearConfirmDesc: "Barcha rejalar butunlay o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.",
  confirmYes: "Ha, o'chirilsin",
  confirmCancel: 'Bekor qilish',
  exportData: 'Eksport',
  importData: 'Import',
  editTask: 'Rejani tahrirlash',
  saveChanges: 'Saqlash',
  otherLanguage: 'Boshqa til',
  otherLangPrompt: 'Istalgan til nomini yozing (masalan: Esperanto, Lotincha, Mo‘g‘ulcha):',
  translating: "AI butun saytni tarjima qilmoqda...",
  remindNotificationTitle: 'Reja vaqti yetib keldi!',
  enableNotifications: 'Bildirishnomalarni yoqish',
  dragHint: "Surib o'rnini almashtiring",
};

export const ENGLISH_TRANSLATIONS: TranslationDictionary = {
  appName: 'KunReja',
  tagline: 'Daily Planner',
  greetingMorning: 'Good morning!',
  greetingDay: 'Good afternoon!',
  greetingEvening: 'Good evening!',
  greetingNight: 'Good night!',
  inputPlaceholder: 'What do you plan to do today?',
  notePlaceholder: 'Short note (optional)...',
  timeLabel: 'Time',
  priorityLabel: 'Priority',
  priorityLow: 'Low',
  priorityMedium: 'Medium',
  priorityHigh: 'High',
  categoryLabel: 'Category',
  catWork: 'Work',
  catStudy: 'Study',
  catHome: 'Home',
  catHealth: 'Health',
  catFamily: 'Family',
  catShopping: 'Shopping',
  catOther: 'Other',
  addButton: 'Add Plan',
  validationEmpty: 'Please enter a plan first!',
  searchPlaceholder: 'Search plans...',
  filterAll: 'All',
  filterPending: 'Pending',
  filterCompleted: 'Completed',
  sortBy: 'Sort by',
  sortTime: 'By Time',
  sortPriority: 'By Priority',
  sortCreated: 'Recently Added',
  overdue: 'Overdue',
  emptyStateTitle: 'No plans yet',
  emptyStateSub: 'Add your first target for today!',
  statsTitle: 'Daily Statistics',
  completedToday: 'Completed Today',
  streakDays: 'Day Streak',
  weeklyStats: 'Last 7 Days',
  categoryDistribution: 'Category Breakdown',
  allDoneTitle: 'Bravo! Today was an amazing day! 🎉',
  allDoneSub: 'All tasks completed successfully. Be proud of yourself!',
  soundOn: 'Sound enabled',
  soundOff: 'Sound muted',
  clearAll: 'Clear all',
  clearConfirmTitle: 'Are you sure?',
  clearConfirmDesc: 'All plans will be permanently removed. This action cannot be undone.',
  confirmYes: 'Yes, clear all',
  confirmCancel: 'Cancel',
  exportData: 'Export',
  importData: 'Import',
  editTask: 'Edit Plan',
  saveChanges: 'Save',
  otherLanguage: 'Other Language',
  otherLangPrompt: 'Enter any language name (e.g. Esperanto, Latin, Mongolian):',
  translating: 'AI is translating the entire app...',
  remindNotificationTitle: 'Time for your task!',
  enableNotifications: 'Enable notifications',
  dragHint: 'Drag to reorder',
};

export const RUSSIAN_TRANSLATIONS: TranslationDictionary = {
  appName: 'KunReja',
  tagline: 'Ежедневный план',
  greetingMorning: 'Доброе утро!',
  greetingDay: 'Добрый день!',
  greetingEvening: 'Добрый вечер!',
  greetingNight: 'Доброй ночи!',
  inputPlaceholder: 'Что вы планируете сделать сегодня?',
  notePlaceholder: 'Краткая заметка (необязательно)...',
  timeLabel: 'Время',
  priorityLabel: 'Приоритет',
  priorityLow: 'Низкий',
  priorityMedium: 'Средний',
  priorityHigh: 'Высокий',
  categoryLabel: 'Категория',
  catWork: 'Работа',
  catStudy: 'Учёба',
  catHome: 'Дом',
  catHealth: 'Здоровье',
  catFamily: 'Семья',
  catShopping: 'Покупки',
  catOther: 'Другое',
  addButton: 'Добавить',
  validationEmpty: 'Сначала напишите план!',
  searchPlaceholder: 'Поиск планов...',
  filterAll: 'Все',
  filterPending: 'Не выполнено',
  filterCompleted: 'Выполнено',
  sortBy: 'Сортировка',
  sortTime: 'По времени',
  sortPriority: 'По важности',
  sortCreated: 'По добавлению',
  overdue: 'Просрочено',
  emptyStateTitle: 'Планов пока нет',
  emptyStateSub: 'Добавьте свою первую цель на сегодня!',
  statsTitle: 'Статистика дня',
  completedToday: 'Сегодня выполнено',
  streakDays: 'Серия дней',
  weeklyStats: 'Результаты за 7 дней',
  categoryDistribution: 'Анализ категорий',
  allDoneTitle: 'Браво! Сегодня был чудесный день! 🎉',
  allDoneSub: 'Все планы успешно выполнены! Гордитесь собой.',
  soundOn: 'Звук включён',
  soundOff: 'Звук выключен',
  clearAll: 'Очистить всё',
  clearConfirmTitle: 'Вы уверены?',
  clearConfirmDesc: 'Все планы будут безвозвратно удалены.',
  confirmYes: 'Да, удалить',
  confirmCancel: 'Отмена',
  exportData: 'Экспорт',
  importData: 'Импорт',
  editTask: 'Редактировать план',
  saveChanges: 'Сохранить',
  otherLanguage: 'Другой язык',
  otherLangPrompt: 'Введите название языка (например: Эсперанто, Латынь):',
  translating: 'ИИ переводит приложение...',
  remindNotificationTitle: 'Пора выполнять задачу!',
  enableNotifications: 'Включить уведомления',
  dragHint: 'Перетащите для смены порядка',
};

export const TURKISH_TRANSLATIONS: TranslationDictionary = {
  appName: 'KunReja',
  tagline: 'Günlük Plan',
  greetingMorning: 'Günaydın!',
  greetingDay: 'İyi günler!',
  greetingEvening: 'İyi akşamlar!',
  greetingNight: 'İyi geceler!',
  inputPlaceholder: 'Bugün ne yapmayı planlıyorsunuz?',
  notePlaceholder: 'Kısa not (isteğe bağlı)...',
  timeLabel: 'Saat',
  priorityLabel: 'Öncelik',
  priorityLow: 'Düşük',
  priorityMedium: 'Orta',
  priorityHigh: 'Yüksek',
  categoryLabel: 'Kategori',
  catWork: 'İş',
  catStudy: 'Eğitim',
  catHome: 'Ev',
  catHealth: 'Sağlık',
  catFamily: 'Aile',
  catShopping: 'Alışveriş',
  catOther: 'Diğer',
  addButton: 'Ekle',
  validationEmpty: 'Lütfen önce bir plan yazın!',
  searchPlaceholder: 'Planlarda ara...',
  filterAll: 'Tümü',
  filterPending: 'Tamamlanmamış',
  filterCompleted: 'Tamamlanan',
  sortBy: 'Sırala',
  sortTime: 'Saate göre',
  sortPriority: 'Önceliğe göre',
  sortCreated: 'Eklenme sırasına göre',
  overdue: 'Gecikti',
  emptyStateTitle: 'Henüz plan yok',
  emptyStateSub: 'Bugünkü ilk hedefinizi ekleyin!',
  statsTitle: 'Günlük İstatistik',
  completedToday: 'Bugün tamamlanan',
  streakDays: 'Ardışık Günler',
  weeklyStats: 'Son 7 Günlük İlerleme',
  categoryDistribution: 'Kategori Analizi',
  allDoneTitle: 'Tebrikler! Bugün harika bir gün oldu! 🎉',
  allDoneSub: 'Bütün hedeflerinizi tamamladınız! Kendinizle gurur duyun.',
  soundOn: 'Ses açık',
  soundOff: 'Ses kapalı',
  clearAll: 'Hepsini temizle',
  clearConfirmTitle: 'Emin misiniz?',
  clearConfirmDesc: 'Tüm planlar kalıcı olarak silinecek.',
  confirmYes: 'Evet, sil',
  confirmCancel: 'İptal',
  exportData: 'Dışa Aktar',
  importData: 'İçe Aktar',
  editTask: 'Planı Düzenle',
  saveChanges: 'Kaydet',
  otherLanguage: 'Başka Dil',
  otherLangPrompt: 'Herhangi bir dil adı girin:',
  translating: 'Yapay zeka çeviriyor...',
  remindNotificationTitle: 'Görev zamanı geldi!',
  enableNotifications: 'Bildirimleri aç',
  dragHint: 'Sıralamak için sürükleyin',
};

export const ARABIC_TRANSLATIONS: TranslationDictionary = {
  appName: 'KunReja',
  tagline: 'خطة اليوم',
  greetingMorning: 'صباح الخير!',
  greetingDay: 'طاب يومك!',
  greetingEvening: 'مساء الخير!',
  greetingNight: 'تصبح على خير!',
  inputPlaceholder: 'ماذا تخطط لإنجازه اليوم؟',
  notePlaceholder: 'ملاحظة قصيرة (اختياري)...',
  timeLabel: 'الوقت',
  priorityLabel: 'الأهمية',
  priorityLow: 'منخفضة',
  priorityMedium: 'متوسطة',
  priorityHigh: 'عالية',
  categoryLabel: 'الفئة',
  catWork: 'العمل',
  catStudy: 'الدراسة',
  catHome: 'المنزل',
  catHealth: 'الصحة',
  catFamily: 'العائلة',
  catShopping: 'التسوق',
  catOther: 'أخرى',
  addButton: 'إضافة',
  validationEmpty: 'يرجى كتابة خطة أولاً!',
  searchPlaceholder: 'البحث في المهام...',
  filterAll: 'الكل',
  filterPending: 'غير مكتمل',
  filterCompleted: 'مكتمل',
  sortBy: 'ترتيب حسب',
  sortTime: 'الوقت',
  sortPriority: 'الأهمية',
  sortCreated: 'تاريخ الإضافة',
  overdue: 'متأخر',
  emptyStateTitle: 'لا توجد مهام بعد',
  emptyStateSub: 'أضف هدفك الأول لهذا اليوم!',
  statsTitle: 'إحصائيات اليوم',
  completedToday: 'تم إنجازه اليوم',
  streakDays: 'أيام متتالية',
  weeklyStats: 'نتائج آخر 7 أيام',
  categoryDistribution: 'تحليل الفئات',
  allDoneTitle: 'أحسنت! كان يوماً رائعاً! 🎉',
  allDoneSub: 'تم إنجاز جميع خططك بنجاح! كن فخوراً بنفسك.',
  soundOn: 'الصوت مفعّل',
  soundOff: 'الصوت معطّل',
  clearAll: 'مسح الكل',
  clearConfirmTitle: 'هل أنت متأكد؟',
  clearConfirmDesc: 'سيتم حذف جميع الخطط نهائياً.',
  confirmYes: 'نعم، احذف',
  confirmCancel: 'إلغاء',
  exportData: 'تصدير',
  importData: 'استيراد',
  editTask: 'تعديل المهمة',
  saveChanges: 'حفظ',
  otherLanguage: 'لغة أخرى',
  otherLangPrompt: 'أدخل اسم أي لغة:',
  translating: 'الذكاء الاصطناعي يترجم التطبيق...',
  remindNotificationTitle: 'حان موعد المهمة!',
  enableNotifications: 'تفعيل الإشعارات',
  dragHint: 'اسحب لتغيير الترتيب',
};

// Global language registry with default fallbacks for quick instant rendering
const BUILTIN_TRANSLATIONS: Record<string, Partial<TranslationDictionary>> = {
  uz: UZBEK_TRANSLATIONS,
  en: ENGLISH_TRANSLATIONS,
  ru: RUSSIAN_TRANSLATIONS,
  tr: TURKISH_TRANSLATIONS,
  ar: ARABIC_TRANSLATIONS,
};

export function getTranslations(langCode: string, customDicts: Record<string, TranslationDictionary> = {}): TranslationDictionary {
  if (customDicts[langCode]) {
    return customDicts[langCode];
  }
  const base = BUILTIN_TRANSLATIONS[langCode];
  if (base) {
    return { ...ENGLISH_TRANSLATIONS, ...base };
  }
  // Try matching language by prefix (e.g. "uz-UZ" -> "uz")
  const prefix = langCode.split('-')[0].toLowerCase();
  if (customDicts[prefix]) {
    return customDicts[prefix];
  }
  if (BUILTIN_TRANSLATIONS[prefix]) {
    return { ...ENGLISH_TRANSLATIONS, ...BUILTIN_TRANSLATIONS[prefix] };
  }
  return UZBEK_TRANSLATIONS;
}
