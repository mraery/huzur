/**
 * Huzur - Günlük Olumlama Veri Havuzu
 * Her olumlama için kategori, tema gradyanı, ikon ve tefekkür notu içerir.
 */
const AFFIRMATIONS_DATA = [
  // --- İÇ HUZUR & DİNGİNLİK ---
  {
    id: 1,
    category: "huzur",
    categoryName: "İç Huzur & Dinginlik",
    text: "Zihnim sakin, kalbim dingin. Şu anda güvendeyim ve her şey olması gerektiği gibi akıyor.",
    subtext: "Derin bir nefes al ve kontrol edemediğin her şeyi serbest bırak.",
    icon: "🌊",
    gradient: "from-cyan-900 via-teal-900 to-blue-950",
    accentColor: "#38bdf8",
    bgPattern: "radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.25) 0%, transparent 60%)"
  },
  {
    id: 2,
    category: "huzur",
    categoryName: "İç Huzur & Dinginlik",
    text: "Geçmişin yükünü ve geleceğin endişesini bırakıyorum. Şu anın huzuru bana yetiyor.",
    subtext: "Şimdiki an, sahip olduğun tek ve en değerli zamandır.",
    icon: "🍃",
    gradient: "from-emerald-950 via-teal-900 to-slate-950",
    accentColor: "#34d399",
    bgPattern: "radial-gradient(circle at 80% 30%, rgba(52, 211, 153, 0.25) 0%, transparent 60%)"
  },
  {
    id: 3,
    category: "huzur",
    categoryName: "İç Huzur & Dinginlik",
    text: "Tüm karmaşanın ortasında bile içimdeki sükuneti ve berraklığı koruyabiliyorum.",
    subtext: "Fırtına dışarıda kopabilir; senin sığınağın kendi kalbindir.",
    icon: "🕯️",
    gradient: "from-slate-900 via-indigo-950 to-neutral-950",
    accentColor: "#818cf8",
    bgPattern: "radial-gradient(circle at 50% 10%, rgba(129, 140, 248, 0.25) 0%, transparent 65%)"
  },
  {
    id: 4,
    category: "huzur",
    categoryName: "İç Huzur & Dinginlik",
    text: "Hayatın ritmine güveniyorum. Her şey benim en yüksek hayrıma gelişiyor.",
    subtext: "Sabır, tohumun toprağa güvenmesidir.",
    icon: "✨",
    gradient: "from-sky-950 via-blue-900 to-slate-950",
    accentColor: "#7dd3fc",
    bgPattern: "radial-gradient(circle at 30% 70%, rgba(125, 211, 252, 0.25) 0%, transparent 60%)"
  },
  {
    id: 5,
    category: "huzur",
    categoryName: "İç Huzur & Dinginlik",
    text: "Her nefes alışımda dinginliği içime çekiyor, her nefes verişimde tüm gerginlikleri salıveriyorum.",
    subtext: "Omuzlarını düşür, çeneni gevşet ve rahatla.",
    icon: "🕊️",
    gradient: "from-cyan-950 via-slate-900 to-teal-950",
    accentColor: "#2dd4bf",
    bgPattern: "radial-gradient(circle at 70% 80%, rgba(45, 212, 191, 0.25) 0%, transparent 60%)"
  },

  // --- ÖZ SEVGİ & DEĞERLİLİK ---
  {
    id: 6,
    category: "ozsevgi",
    categoryName: "Öz Sevgi & Değerlilik",
    text: "Kendimi tüm kusurlarım, hatalarım ve eşsiz güzelliğimle olduğum gibi kabul ediyor ve seviyorum.",
    subtext: "Sen bu dünyada biriciksin; kendini başkalarıyla kıyaslamaktan vazgeç.",
    icon: "🌸",
    gradient: "from-rose-950 via-pink-900 to-purple-950",
    accentColor: "#fb7185",
    bgPattern: "radial-gradient(circle at 70% 20%, rgba(251, 113, 133, 0.25) 0%, transparent 65%)"
  },
  {
    id: 7,
    category: "ozsevgi",
    categoryName: "Öz Sevgi & Değerlilik",
    text: "Değerim bir şeyleri başarmama bağlı değil; var oluşumun kendisi zaten yeterince değerli.",
    subtext: "Koşulsuz bir sevgiyle kendine sarıl.",
    icon: "💖",
    gradient: "from-fuchsia-950 via-pink-950 to-slate-950",
    accentColor: "#f472b6",
    bgPattern: "radial-gradient(circle at 20% 80%, rgba(244, 114, 182, 0.25) 0%, transparent 60%)"
  },
  {
    id: 8,
    category: "ozsevgi",
    categoryName: "Öz Sevgi & Değerlilik",
    text: "Kendi ihtiyaçlarımı önemsemek bencillik değil, ruhuma borcumdur. Kendime şefkat gösteriyorum.",
    subtext: "Başkalarına ışık saçmak için önce kendi fenerini doldurmalısın.",
    icon: "🌷",
    gradient: "from-rose-950 via-purple-950 to-indigo-950",
    accentColor: "#e879f9",
    bgPattern: "radial-gradient(circle at 50% 50%, rgba(232, 121, 249, 0.2) 0%, transparent 70%)"
  },
  {
    id: 9,
    category: "ozsevgi",
    categoryName: "Öz Sevgi & Değerlilik",
    text: "Sınırlarımı sevgiyle ve kararlılıkla çiziyorum. 'Hayır' deme hakkımı saygıyla kullanıyorum.",
    subtext: "Kendi huzurunu korumak en doğal hakkındır.",
    icon: "🛡️",
    gradient: "from-violet-950 via-purple-900 to-slate-950",
    accentColor: "#c084fc",
    bgPattern: "radial-gradient(circle at 80% 80%, rgba(192, 132, 252, 0.25) 0%, transparent 60%)"
  },
  {
    id: 10,
    category: "ozsevgi",
    categoryName: "Öz Sevgi & Değerlilik",
    text: "Bugün kendime nazik davranmayı seçiyorum. Hatalar bana rehberlik eden kıymetli derslerdir.",
    subtext: "En yakın dostun kendin ol.",
    icon: "🌿",
    gradient: "from-pink-950 via-rose-900 to-slate-950",
    accentColor: "#fda4af",
    bgPattern: "radial-gradient(circle at 30% 30%, rgba(253, 164, 175, 0.25) 0%, transparent 60%)"
  },

  // --- BOLLUK, BEREKET & BAŞARI ---
  {
    id: 11,
    category: "basari",
    categoryName: "Bolluk & Başarı",
    text: "Evrenin sonsuz bolluğuna açığım. Başarı, refah ve güzellikler hayatıma kolaylıkla akar.",
    subtext: "Kıtlık bilincini geride bırak, imkanların sınırsızlığını hisset.",
    icon: "🌟",
    gradient: "from-amber-950 via-yellow-950 to-stone-950",
    accentColor: "#fcd34d",
    bgPattern: "radial-gradient(circle at 75% 25%, rgba(252, 211, 77, 0.25) 0%, transparent 65%)"
  },
  {
    id: 12,
    category: "basari",
    categoryName: "Bolluk & Başarı",
    text: "Hayallerimi gerçeğe dönüştürecek içsel güce, yeteneğe ve azme fazlasıyla sahibim.",
    subtext: "Küçük adımların gücünü küçümseme, her adım bir zaferdir.",
    icon: "⚡",
    gradient: "from-orange-950 via-amber-900 to-slate-950",
    accentColor: "#fbbf24",
    bgPattern: "radial-gradient(circle at 20% 30%, rgba(251, 191, 36, 0.25) 0%, transparent 60%)"
  },
  {
    id: 13,
    category: "basari",
    categoryName: "Bolluk & Başarı",
    text: "Karşıma çıkan her engel, beni daha güçlü ve bilge bir insana dönüştüren bir basamaktır.",
    subtext: "Zorluklar yolunu kapatmaz, yolunu şekillendirir.",
    icon: "🏔️",
    gradient: "from-yellow-950 via-stone-900 to-slate-950",
    accentColor: "#fde047",
    bgPattern: "radial-gradient(circle at 50% 80%, rgba(253, 224, 71, 0.2) 0%, transparent 70%)"
  },
  {
    id: 14,
    category: "basari",
    categoryName: "Bolluk & Başarı",
    text: "Hedeflerime doğru sakin, kendimden emin ve adanmış bir inançla ilerliyorum.",
    subtext: "Yolculuğa güven, sonuca varacaksın.",
    icon: "🎯",
    gradient: "from-amber-950 via-orange-900 to-neutral-950",
    accentColor: "#f59e0b",
    bgPattern: "radial-gradient(circle at 80% 50%, rgba(245, 158, 11, 0.25) 0%, transparent 60%)"
  },
  {
    id: 15,
    category: "basari",
    categoryName: "Bolluk & Başarı",
    text: "Fırsatlar beni bulur; emeğimin ve yaratıcılığımın karşılığını fazlasıyla alıyorum.",
    subtext: "Zihnini yeni olasılıklara aç.",
    icon: "💎",
    gradient: "from-amber-950 via-emerald-950 to-slate-950",
    accentColor: "#facc15",
    bgPattern: "radial-gradient(circle at 30% 70%, rgba(250, 204, 21, 0.25) 0%, transparent 60%)"
  },

  // --- ŞÜKRAN & FARKINDALIK ---
  {
    id: 16,
    category: "sukran",
    categoryName: "Şükran & Farkındalık",
    text: "Bugün sahip olduğum her nimet, aldığım her nefes ve yaşadığım her an için kalpten minnettarım.",
    subtext: "Şükran duygusu, elindekini zenginliğe dönüştürür.",
    icon: "🌱",
    gradient: "from-emerald-950 via-green-950 to-slate-950",
    accentColor: "#4ade80",
    bgPattern: "radial-gradient(circle at 20% 20%, rgba(74, 222, 128, 0.25) 0%, transparent 65%)"
  },
  {
    id: 17,
    category: "sukran",
    categoryName: "Şükran & Farkındalık",
    text: "Hayatımın her detayındaki gizli lütufları ve güzellikleri fark ediyorum.",
    subtext: "Gözlerini aç ve sıradan görünen mucizeleri keşfet.",
    icon: "☀️",
    gradient: "from-lime-950 via-emerald-900 to-stone-950",
    accentColor: "#a3e635",
    bgPattern: "radial-gradient(circle at 80% 30%, rgba(163, 230, 53, 0.25) 0%, transparent 60%)"
  },
  {
    id: 18,
    category: "sukran",
    categoryName: "Şükran & Farkındalık",
    text: "Beni ben yapan tüm deneyimlere, sevdiklerime ve beni büyüten zorluklara teşekkür ederim.",
    subtext: "Kabul etmek ve teşekkür etmek ruhu hafifletir.",
    icon: "🙏",
    gradient: "from-teal-950 via-emerald-950 to-indigo-950",
    accentColor: "#6ee7b7",
    bgPattern: "radial-gradient(circle at 50% 60%, rgba(110, 231, 183, 0.25) 0%, transparent 65%)"
  },
  {
    id: 19,
    category: "sukran",
    categoryName: "Şükran & Farkındalık",
    text: "Küçük anların içindeki büyük mutlulukları hissediyor ve kutluyorum.",
    subtext: "Sıcak bir çay, güzel bir şarkı, tatlı bir tebessüm...",
    icon: "☕",
    gradient: "from-green-950 via-teal-950 to-slate-950",
    accentColor: "#86efac",
    bgPattern: "radial-gradient(circle at 30% 80%, rgba(134, 239, 172, 0.25) 0%, transparent 60%)"
  },

  // --- SAĞLIK & CANLILIK ---
  {
    id: 20,
    category: "saglik",
    categoryName: "Sağlık & Canlılık",
    text: "Bedenim muazzam bir şifa gücüne sahip. Her bir hücrem enerji, sıhhat ve uyumla titreşiyor.",
    subtext: "Bedenine sevgiyle kulak ver, o senin yeryüzündeki mabedindir.",
    icon: "🌿",
    gradient: "from-teal-950 via-cyan-950 to-slate-950",
    accentColor: "#2dd4bf",
    bgPattern: "radial-gradient(circle at 70% 30%, rgba(45, 212, 191, 0.25) 0%, transparent 60%)"
  },
  {
    id: 21,
    category: "saglik",
    categoryName: "Sağlık & Canlılık",
    text: "Bedenimi besleyen, dinlendiren ve ruhumu canlandıran seçimler yapıyorum.",
    subtext: "Yeterli uyku, temiz su ve temiz düşünceler senin ilacındır.",
    icon: "💧",
    gradient: "from-blue-950 via-sky-950 to-slate-950",
    accentColor: "#38bdf8",
    bgPattern: "radial-gradient(circle at 25% 75%, rgba(56, 189, 248, 0.25) 0%, transparent 60%)"
  },
  {
    id: 22,
    category: "saglik",
    categoryName: "Sağlık & Canlılık",
    text: "Her yeni günle birlikte yenileniyor, güçleniyor ve yaşam enerjisiyle doluyorum.",
    subtext: "Güneşin doğuşu gibi içindeki ışık da her sabah yeniden doğar.",
    icon: "🌅",
    gradient: "from-orange-950 via-rose-950 to-purple-950",
    accentColor: "#fb923c",
    bgPattern: "radial-gradient(circle at 60% 40%, rgba(251, 146, 60, 0.25) 0%, transparent 65%)"
  },

  // --- CESARET & ÖZGÜRLEŞME ---
  {
    id: 23,
    category: "cesaret",
    categoryName: "Cesaret & Özgürleşme",
    text: "Korkularımın ötesine geçecek cesarete sahibim. Bilinmeyene güvenle adım atıyorum.",
    subtext: "Kanatlarını açmadan ne kadar yüksek uçabileceğini bilemezsin.",
    icon: "🦅",
    gradient: "from-indigo-950 via-violet-950 to-slate-950",
    accentColor: "#a78bfa",
    bgPattern: "radial-gradient(circle at 40% 30%, rgba(167, 139, 250, 0.25) 0%, transparent 65%)"
  },
  {
    id: 24,
    category: "cesaret",
    categoryName: "Cesaret & Özgürleşme",
    text: "Artık bana hizmet etmeyen tüm inançları, pişmanlıkları ve kırgınlıkları sevgiyle serbest bırakıyorum.",
    subtext: "Eski yükleri bırak ki ellerin yeni güzellikleri tutabilsin.",
    icon: "🎈",
    gradient: "from-purple-950 via-fuchsia-950 to-slate-950",
    accentColor: "#e879f9",
    bgPattern: "radial-gradient(circle at 80% 70%, rgba(232, 121, 249, 0.25) 0%, transparent 60%)"
  },
  {
    id: 25,
    category: "cesaret",
    categoryName: "Cesaret & Özgürleşme",
    text: "Ben hayatımın bilinçli yaratıcısıyım. Kendi kaderimi sevgi ve inançla dokuyorum.",
    subtext: "Düşüncelerin tohum, hayatın ise o tohumların yeşerdiği bahçedir.",
    icon: "🌌",
    gradient: "from-slate-950 via-blue-950 to-purple-950",
    accentColor: "#818cf8",
    bgPattern: "radial-gradient(circle at 50% 20%, rgba(129, 140, 248, 0.25) 0%, transparent 70%)"
  },
  {
    id: 26,
    category: "huzur",
    categoryName: "İç Huzur & Dinginlik",
    text: "Şu anda, bu bedende, bu zamanda olmaktan huzur duyuyorum.",
    subtext: "Varoluşun kendisi bir armagandır.",
    icon: "🧘",
    gradient: "from-teal-950 via-blue-950 to-slate-950",
    accentColor: "#5eead4",
    bgPattern: "radial-gradient(circle at 35% 45%, rgba(94, 234, 212, 0.25) 0%, transparent 65%)"
  },
  {
    id: 27,
    category: "ozsevgi",
    categoryName: "Öz Sevgi & Değerlilik",
    text: "Kendi kalbime bir anne şefkatiyle, kendi aklıma bir bilge sabrıyla yaklaşıyorum.",
    subtext: "Kendini anlamak, iyileşmenin başlangıcıdır.",
    icon: "🌸",
    gradient: "from-pink-950 via-purple-950 to-stone-950",
    accentColor: "#f43f5e",
    bgPattern: "radial-gradient(circle at 65% 75%, rgba(244, 63, 94, 0.25) 0%, transparent 60%)"
  },
  {
    id: 28,
    category: "basari",
    categoryName: "Bolluk & Başarı",
    text: "Zenginlik sadece maddiyat değil; huzur, sağlık, sevgi ve ilhamın hayatıma akışıdır.",
    subtext: "Gönlü zengin olanın dünyası da zenginleşir.",
    icon: "🌾",
    gradient: "from-amber-950 via-yellow-900 to-slate-950",
    accentColor: "#eab308",
    bgPattern: "radial-gradient(circle at 20% 50%, rgba(234, 179, 8, 0.25) 0%, transparent 60%)"
  },
  {
    id: 29,
    category: "sukran",
    categoryName: "Şükran & Farkındalık",
    text: "Bana bahşedilen bu bedene, çarpan kalbime ve düşünen aklıma teşekkür ederim.",
    subtext: "Mucize arama; mucizenin ta kendisi sensin.",
    icon: "❤️",
    gradient: "from-rose-950 via-emerald-950 to-slate-950",
    accentColor: "#f87171",
    bgPattern: "radial-gradient(circle at 70% 30%, rgba(248, 113, 113, 0.25) 0%, transparent 60%)"
  },
  {
    id: 30,
    category: "cesaret",
    categoryName: "Cesaret & Özgürleşme",
    text: "Yolumu kendim çizerim; başkalarının yargıları benim gerçeğimi belirleyemez.",
    subtext: "Kendi hikayenin kahramanı ol.",
    icon: "🧭",
    gradient: "from-blue-950 via-indigo-950 to-neutral-950",
    accentColor: "#60a5fa",
    bgPattern: "radial-gradient(circle at 50% 50%, rgba(96, 165, 250, 0.25) 0%, transparent 65%)"
  }
];

const CATEGORIES = [
  { id: "all", name: "Tüm Olumlamalar", icon: "✨" },
  { id: "huzur", name: "İç Huzur & Dinginlik", icon: "🌊" },
  { id: "ozsevgi", name: "Öz Sevgi & Değerlilik", icon: "🌸" },
  { id: "basari", name: "Bolluk & Başarı", icon: "🌟" },
  { id: "sukran", name: "Şükran & Farkındalık", icon: "🌱" },
  { id: "saglik", name: "Sağlık & Canlılık", icon: "🌿" },
  { id: "cesaret", name: "Cesaret & Özgürleşme", icon: "🦅" },
  { id: "favorites", name: "Favorilerim", icon: "❤️" }
];
