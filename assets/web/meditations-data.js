/**
 * Huzur - Rehberli Meditasyonlar, Nefes Egzersizleri ve Bilgelik Veri Havuzu
 */

const GUIDED_MEDITATIONS = [
  {
    id: "med_sleep",
    title: "Derin Uykuya Geçiş",
    subtitle: "Günün yorgunluğunu ve zihindeki düşünce bulutlarını serbest bırak.",
    category: "uyku",
    categoryName: "Derin Uyku",
    icon: "🌙",
    duration: 600, // 10 dakika
    durationText: "10 Dk",
    ambientPreset: "gece",
    gradient: "from-indigo-950 via-slate-900 to-black",
    accentColor: "#818cf8",
    steps: [
      { time: 0, text: "Yatağına rahatça uzan. Başını yastığına hafifçe bırak ve gözlerini usulca kapat.", cue: "Gözlerini kapat ve gevşe" },
      { time: 30, text: "Bugün olan her şey geride kaldı. Artık hiçbir şeyi çözmek ya da düşünmek zorunda değilsin.", cue: "Günü geride bırak" },
      { time: 70, text: "Derin bir nefes al... Burnundan yavaşça doldur ciğerlerini... Ve ağzından uzun bir nefes ver.", cue: "Derin nefes al ve ver" },
      { time: 120, text: "Bedeninin yatağa bıraktığı ağırlığı hisset. Omuzların, kolların ve sırtın tamamen serbest kalsın.", cue: "Kaslarını gevşet" },
      { time: 180, text: "Zihninden geçen düşünceleri bir nehirde yüzen kuru yapraklar gibi izle. Onlara tutunma, sadece akıp gitmelerine izin ver.", cue: "Düşünceleri serbest bırak" },
      { time: 260, text: "Ayak parmaklarından başına kadar tatlı bir ılık dalganın yayıldığını hayal et.", cue: "Huzur dalgası" },
      { time: 360, text: "Şu an güvendesin. Gece senin dinlenme ve yenilenme zamanın.", cue: "Güvendesin" },
      { time: 480, text: "Nefesin sakin, kalp atışların dingin. Kendini uykunun yumuşak kollarına bırak.", cue: "Huzurlu rüyalar..." }
    ]
  },
  {
    id: "med_morning",
    title: "Sabah Tazelenmesi & Güne Niyet",
    subtitle: "Yeni güne dingin, açık ve pozitif bir enerjiyle adım at.",
    category: "sabah",
    categoryName: "Sabah Uyanışı",
    icon: "🌅",
    duration: 300, // 5 dakika
    durationText: "5 Dk",
    ambientPreset: "piyano",
    gradient: "from-amber-950 via-orange-950 to-slate-950",
    accentColor: "#f59e0b",
    steps: [
      { time: 0, text: "Rahat bir oturuşa geç. Omurganı dik, omuzlarını rahat tut. Yeni günün ışığını içine çek.", cue: "Yeni güne merhaba" },
      { time: 30, text: "Bugün sana verilmiş yepyeni, tertemiz bir sayfa. Derin bir nefesle ciğerlerini hayat enerjisiyle doldur.", cue: "Taze nefes al" },
      { time: 75, text: "Gülümse. Yüzündeki hafif bir tebessüm sinir sistemine huzur ve güven sinyali gönderir.", cue: "Hafifçe gülümse" },
      { time: 130, text: "Bugün için bir niyet belirle: 'Bugün sakin kalmayı seçiyorum', 'Bugün sevgiyle hareket ediyorum'.", cue: "Günün niyetini belirle" },
      { time: 200, text: "Karşılaşacağın her durumu olgunluk ve zarafetle karşılayacak güce sahipsin.", cue: "İçindeki güce güven" },
      { time: 260, text: "Derin bir nefes al ve hazır hissettiğinde gözlerini dünyaya neşeyle aç.", cue: "Günün aydın olsun!" }
    ]
  },
  {
    id: "med_stress",
    title: "Hızlı Stres & Kaygı Savar",
    subtitle: "Panik, baskı ve zihinsel sıkışıklığı 3 dakikada eriten acil sükunet seansı.",
    category: "stres",
    categoryName: "Stres Savar",
    icon: "🛡️",
    duration: 180, // 3 dakika
    durationText: "3 Dk",
    ambientPreset: "yagmur",
    gradient: "from-cyan-950 via-teal-950 to-slate-950",
    accentColor: "#06b6d4",
    steps: [
      { time: 0, text: "Dur. Ne yapıyorsan bir anlığına bırak. Ayaklarını yere sağlam bas.", cue: "Her şeyi durdur" },
      { time: 25, text: "Şimdi burnundan 4 saniyede derin bir nefes al... Ve 6 saniyede yavaşça üfle.", cue: "Yavaş ve uzun nefes ver" },
      { time: 60, text: "Fark et: Şu anda tehlikede değilsin. Zihnin bir fırtına yaratıyor olabilir ama sen o fırtına değilsin, gökyüzüsün.", cue: "Sen gökyüzüsün" },
      { time: 100, text: "Çeneni sıkmayı bırak. Kaşlarının arasını serbest bırak. Omuzlarını aşağıya düşür.", cue: "Fiziksel gerilimi bırak" },
      { time: 140, text: "Her şey kontrolünde olmak zorunda değil. Hayatın kendi akışına güvenebilirsin.", cue: "Bırak aksın..." }
    ]
  },
  {
    id: "med_focus",
    title: "Derin Odaklanma & Zihinsel Akış",
    subtitle: "Ders çalışma, kod yazma ve yaratıcı işler öncesi zihni tek bir noktada toplama.",
    category: "odak",
    categoryName: "Odaklanma",
    icon: "🎯",
    duration: 420, // 7 dakika
    durationText: "7 Dk",
    ambientPreset: "kamp",
    gradient: "from-blue-950 via-indigo-950 to-slate-950",
    accentColor: "#3b82f6",
    steps: [
      { time: 0, text: "Dik otur. Çalışacağın alanı sadeleştir. Dikkatin sadece nefesinde toplansın.", cue: "Dikkatini topla" },
      { time: 40, text: "Burnunun ucundaki hava giriş çıkışını izle. Serin hava giriyor, ılık hava çıkıyor.", cue: "Hava akışını izle" },
      { time: 100, text: "Aklına gelen yapılacaklar listesini zihnindeki bir çekmeceye koy ve çekmeceyi kapat.", cue: "Zihinsel çekmeceyi kapat" },
      { time: 180, text: "Tek bir hedef, tek bir an. Bölünmemiş dikkat, en büyük üretkenlik kaynağındır.", cue: "Tek noktaya odak" },
      { time: 280, text: "Zihnin berrak bir göl gibi durgunlaştı. Artık akıştasın.", cue: "Akıştasın (Flow)" },
      { time: 370, text: "Son bir berrak nefes al ve görevinin başına tam odaklanmayla geç.", cue: "Odaklanmaya hazırsın!" }
    ]
  },
  {
    id: "med_bodyscan",
    title: "Derin Beden Taraması (Body Scan)",
    subtitle: "Baştan ayağa tüm organ ve kaslardaki mikro gerginlikleri çözme.",
    category: "beden",
    categoryName: "Beden Taraması",
    icon: "🫀",
    duration: 600, // 10 dakika
    durationText: "10 Dk",
    ambientPreset: "zen",
    gradient: "from-emerald-950 via-teal-950 to-slate-950",
    accentColor: "#10b981",
    steps: [
      { time: 0, text: "Sırtüstü uzan veya omurgan dik şekilde otur. Dikkatini ayak parmaklarına odakla.", cue: "Ayak parmakların" },
      { time: 60, text: "Ayak tabanların, bileklerin ve bacakların... Oradaki ağırlığı ve sıcaklığı hisset, tamamen serbest bırak.", cue: "Bacaklar serbest" },
      { time: 140, text: "Kalça ve karın bölgesine gel. Karnındaki nefes iniş kalkışını izle. Karnını sıkma, gevşet.", cue: "Karnını serbest bırak" },
      { time: 220, text: "Göğüs kafesin, kalbin ve ciğerlerin... Yaşam ritmine minnetle kulak ver.", cue: "Kalp atışların" },
      { time: 310, text: "Omuzların ve boynun... Günün yükünü en çok taşıyan bu bölgeye sevgi dolu bir nefes gönder.", cue: "Omuzları düşür" },
      { time: 410, text: "Yüz kasların: çenen, dilin, göz kapakların, alnın... Tam bir pürüzsüzlük hissi.", cue: "Yüz kaslarını gevşet" },
      { time: 520, text: "Tüm bedenin artık bir bütün halinde derin bir huzur ve hafiflik içinde.", cue: "Bütünsel huzur" }
    ]
  },
  {
    id: "med_metta",
    title: "Öz Şefkat & Affetme (Metta)",
    subtitle: "Kendine duyduğun sert eleştirileri yumuşat, kalbindeki sıcaklığı uyandır.",
    category: "sefkat",
    categoryName: "Öz Şefkat",
    icon: "🕊️",
    duration: 420, // 7 dakika
    durationText: "7 Dk",
    ambientPreset: "piyano",
    gradient: "from-rose-950 via-pink-950 to-slate-950",
    accentColor: "#f43f5e",
    steps: [
      { time: 0, text: "Elini kalbinin üzerine koy. Kalbinin sıcaklığını ve ritmini avucunun içinde hisset.", cue: "Elini kalbine koy" },
      { time: 40, text: "İçinden tekrar et: 'Ben de herkes gibi hata yapabilirim. İnsanım ve bu halimle sevilmeye layığım.'", cue: "Kendini kucakla" },
      { time: 120, text: "Kendine gösterdiğin acımasız eleştirilerin sesini kıs. Bir dostun sana gelseydi ona nasıl şefkatle yaklaşırdın?", cue: "Dost şefkati" },
      { time: 210, text: "Şimdi kalbinden yeşil-pembe bir sevgi ışığının yayıldığını düşün. Bu ışık önce seni sarsın.", cue: "Şefkat ışığı" },
      { time: 300, text: "Sonra sevdiklerine, ardından tüm canlılara bu huzur ve esenlik dileğini gönder: 'Huzurlu olun, güvende olun.'", cue: "Tüm evrene sevgi" }
    ]
  },
  {
    id: "med_mountain",
    title: "Dağ Gibi Sarsılmaz Meditasyonu",
    subtitle: "Fırtınalara, rüzgarlara ve değişen mevsimlere karşı sağlam ve vakur duruş.",
    category: "odak",
    categoryName: "Denge & Güç",
    icon: "🏔️",
    duration: 480, // 8 dakika
    durationText: "8 Dk",
    ambientPreset: "okyanus",
    gradient: "from-slate-900 via-stone-900 to-black",
    accentColor: "#a8a29e",
    steps: [
      { time: 0, text: "Gözlerinin önünde ulu, heybetli bir dağ canlandır. Kökleri yerin derinliklerinde, zirvesi göklere uzanan bir dağ.", cue: "Ulu dağı hayal et" },
      { time: 60, text: "Şimdi o dağın senin kendi bedenin olduğunu hisset. Oturuşun sağlam, başın vakur, sırtın dimdik.", cue: "Dağ ol" },
      { time: 150, text: "Dağın üzerinden mevsimler geçer: kar yağar, fırtınalar kopar, güneş yakar. Ama dağ daima sabırla ve dinginlikle durur.", cue: "Mevsimler geçer, dağ kalır" },
      { time: 260, text: "Hayatındaki olaylar, eleştiriler, inişler ve çıkışlar da sadece hava durumudur. Sen dağsın; hava durumu geçicidir.", cue: "Olaylar geçici, sen dağsın" },
      { time: 380, text: "Bu sarsılmaz gücü günlük hayatına da taşı. Derin bir nefes al ve dağın sessizliğini hisset.", cue: "Sarsılmaz güç" }
    ]
  }
];

const BREATHWORK_TECHNIQUES = [
  {
    id: "breath_478",
    name: "4-7-8 Uyku & Rahatlama",
    subtitle: "Dr. Andrew Weil tarafından geliştirilen, sinir sistemini yatıştıran doğal sakinleştirici.",
    tag: "Parasempatik Aktivasyon",
    icon: "🌙",
    color: "#818cf8",
    phases: [
      { action: "Nefes Al", duration: 4, desc: "Burnundan sakin ve derin bir nefes al" },
      { action: "Nefesini Tut", duration: 7, desc: "Ciğerlerindeki oksijeni sakince tut" },
      { action: "Yavaşça Ver", duration: 8, desc: "Ağzından üflercesine yavaşça bırak" }
    ],
    totalCycleDuration: 19
  },
  {
    id: "breath_box",
    name: "Kutu Nefesi (Box 4-4-4-4)",
    subtitle: "Navy SEALs askerlerinin ve cerrahların kritik anlarda panik savar odaklanma tekniği.",
    tag: "Keskin Odak & Sükunet",
    icon: "📦",
    color: "#38bdf8",
    phases: [
      { action: "Nefes Al", duration: 4, desc: "4 saniye boyunca burnundan dol" },
      { action: "Nefesini Tut", duration: 4, desc: "Dolu ciğerlerle 4 saniye bekle" },
      { action: "Nefes Ver", duration: 4, desc: "4 saniyede sakince boşalt" },
      { action: "Boşlukta Kal", duration: 4, desc: "Boş ciğerlerle 4 saniye bekle" }
    ],
    totalCycleDuration: 16
  },
  {
    id: "breath_equal",
    name: "4-4 Denge Nefesi (Sama Vritti)",
    subtitle: "Antik Pranayama tekniği. Kalp ritmi ile nefes uyumunu senkronize ederek dinginlik sağlar.",
    tag: "Zihin & Beden Dengesi",
    icon: "⚖️",
    color: "#34d399",
    phases: [
      { action: "Nefes Al", duration: 4, desc: "Eşit hızda derin nefes al" },
      { action: "Nefes Ver", duration: 4, desc: "Eşit hızda nefesini ver" }
    ],
    totalCycleDuration: 8
  },
  {
    id: "breath_711",
    name: "7-11 Sakinleşme Nefesi",
    subtitle: "Vagus sinirini uyararak kalp atış hızını düşüren ve kaygıyı eriten teknik.",
    tag: "Anksiyete Giderici",
    icon: "🍃",
    color: "#2dd4bf",
    phases: [
      { action: "Nefes Al", duration: 7, desc: "7 saniye boyunca derin al" },
      { action: "Nefes Ver", duration: 11, desc: "11 saniye boyunca çok yavaş ver" }
    ],
    totalCycleDuration: 18
  },
  {
    id: "breath_energy",
    name: "Canlandırıcı Sabah Nefesi",
    subtitle: "Uykulu anlarda beyne bol oksijen pompalayan hızlı enerji tekniği.",
    tag: "Enerji & Canlılık",
    icon: "⚡",
    color: "#f59e0b",
    phases: [
      { action: "Hızlı Al", duration: 2, desc: "Burnundan güçlü nefes çek" },
      { action: "Güçlü Ver", duration: 2, desc: "Ağzından kuvvetle bırak" }
    ],
    totalCycleDuration: 4
  }
];

const ZEN_WISDOM = [
  {
    quote: "Kusur arayan göz, güzelliği göremez. Sen kalbini temiz tut, çiçekler zaten açar.",
    author: "Mevlana Celaleddin-i Rumi",
    theme: "Huzur & Şefkat"
  },
  {
    quote: "Akıp giden suya benzer hayat; ona karşı kürek çekmek yerine akışa güvenmeyi öğren.",
    author: "Lao Tzu",
    theme: "Akışta Kalmak"
  },
  {
    quote: "Ruhun huzuru, dışarıdaki olayların kontrolünde değil; senin onlara verdiğin anlamdadır.",
    author: "Marcus Aurelius",
    theme: "İçsel Egemenlik"
  },
  {
    quote: "Dün zekiydim, dünyayı değiştirmek istedim. Bugün bilgeyim, kendimi değiştiriyorum.",
    author: "Şems-i Tebrizi",
    theme: "Dönüşüm"
  },
  {
    quote: "İnsanları rahatsız eden olaylar değil, o olaylar hakkındaki peşin fikirleridir.",
    author: "Epiktetos",
    theme: "Zihin Özgürlüğü"
  },
  {
    quote: "Sessizlik en derin cevaptır; bazen zihnin susması, en büyük aydınlanmadır.",
    author: "Buda (Gautama Buddha)",
    theme: "Farkındalık"
  },
  {
    quote: "Gönül Çalab’ın tahtı, Çalap gönüle baktı. İki cihan bedbahtı, kim gönül yıkar ise.",
    author: "Yunus Emre",
    theme: "Gönül Zenginliği"
  }
];
