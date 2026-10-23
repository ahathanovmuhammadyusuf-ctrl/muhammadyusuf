export interface QuoteItem {
  quote: string;
  author: string;
}

export const QUOTES: Record<string, QuoteItem[]> = {
  uz: [
    { quote: "Har bir yangi kun — yangi imkoniyatlar va yangi yutuqlar eshigi.", author: "Sharq hikmati" },
    { quote: "Rejasiz maqsad — shunchaki orzu bo'lib qoladi. Har kuningizni reja bilan boshlang.", author: "Antuan de Sent-Ekzyuperi" },
    { quote: "Katta natijalar har kuni bajariladigan kichik qadamlardan boshlanadi.", author: "Robin Sharma" },
    { quote: "Bugun bajargan har bir ishingiz, ertangi kelajagingiz poydevoridir.", author: "Al-Xorazmiy" },
    { quote: "Vaqtni boshqarish — bu hayotingizni boshqarish demakdir.", author: "Brayan Treysi" },
    { quote: "G'alaba intizom va davomiylikda yashiringan.", author: "Ibn Sino" },
    { quote: "Eng yaxshi vaqt — hozirgi daqiqa. Ishni bugundan boshlang!", author: "Xitoy maqoli" },
  ],
  en: [
    { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { quote: "A goal without a plan is just a wish.", author: "Antoine de Saint-Exupéry" },
    { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
    { quote: "Action is the foundational key to all success.", author: "Pablo Picasso" },
    { quote: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
    { quote: "Mastering your time means mastering your destiny.", author: "Brian Tracy" },
  ],
  ru: [
    { quote: "Секрет движения вперед — в том, чтобы сделать первый шаг.", author: "Марк Твен" },
    { quote: "Цель без плана — это просто мечта.", author: "Антуан де Сент-Экзюпери" },
    { quote: "Маленькие ежедневные шаги приводят к грандиозным результатам.", author: "Робин Шарма" },
    { quote: "Дисциплина — это мост между целями и достижениями.", author: "Джим Рон" },
    { quote: "Сделай сегодня то, за что будущее «я» скажет спасибо.", author: "Шон Патрик Флэнери" },
  ],
  tr: [
    { quote: "Başlamanın sırrı, işi küçük yönetilebilir parçalara bölmektir.", author: "Mark Twain" },
    { quote: "Plansız bir hedef, sadece bir temennidir.", author: "Antoine de Saint-Exupéry" },
    { quote: "Küçük günlük adımlar, büyük başarıların anahtarıdır.", author: "Robin Sharma" },
  ],
  ar: [
    { quote: "سر المضي قدماً هو البدء في العمل الآن.", author: "حكمة عالمية" },
    { quote: "الهدف من دون خطة يبقى مجرد أمنية.", author: "أنطوان دو سانت إكزوبيري" },
    { quote: "الخطوات اليومية الصغيرة تصنع إنجازات عظيمة.", author: "روبن شارما" },
  ],
};

export function getDailyQuote(lang: string): QuoteItem {
  const list = QUOTES[lang] || QUOTES['uz'] || QUOTES['en'];
  const dayIndex = new Date().getDate() % list.length;
  return list[dayIndex] || list[0];
}
