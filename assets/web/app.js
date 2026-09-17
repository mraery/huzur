/**
 * Huzur - Günlük Olumlama & Meditasyon Uygulama Mantığı
 * - Robotik seslendirme kaldırıldı.
 * - Yenilenmiş yüzen estetik kontrol dock'u.
 * - Sağ üstte kamp ateşi, cırcır böceği, piyano ve su seslerini içeren ambiyans seçici.
 * - Telefon ana ekran widget simülatörü & kurulum rehberi.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Öğeleri
  const cardStack = document.getElementById('card-stack');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnShuffle = document.getElementById('btn-shuffle');
  const btnFavorite = document.getElementById('btn-favorite');
  const btnShare = document.getElementById('btn-share');
  const btnDownloadCard = document.getElementById('btn-download-card');
  const btnAddCustom = document.getElementById('btn-add-custom');
  
  // Modallar ve Çekmeceler
  const mixerModal = document.getElementById('mixer-modal');
  const btnMixerToggle = document.getElementById('btn-mixer-toggle');
  const btnCloseMixer = document.getElementById('btn-close-mixer');
  const btnSoundMuteAll = document.getElementById('btn-sound-mute-all');
  
  const widgetGuideModal = document.getElementById('widget-guide-modal');
  const btnWidgetGuideToggle = document.getElementById('btn-widget-guide-toggle');
  const btnCloseWidgetGuide = document.getElementById('btn-close-widget-guide');

  const timerModal = document.getElementById('timer-modal');
  const btnTimerToggle = document.getElementById('btn-timer-toggle');
  const btnCloseTimer = document.getElementById('btn-close-timer');
  const btnTimerStart = document.getElementById('btn-timer-start');
  const btnTimerReset = document.getElementById('btn-timer-reset');
  const timerDisplay = document.getElementById('timer-display');
  const timerProgress = document.getElementById('timer-progress');
  const timerStatusText = document.getElementById('timer-status-text');

  const customModal = document.getElementById('custom-modal');
  const btnCloseCustom = document.getElementById('btn-close-custom');
  const formCustomAffirmation = document.getElementById('form-custom-affirmation');

  // Ses Görselleştirici & Master Vol
  const soundVisualizer = document.getElementById('sound-visualizer');
  const masterVolumeSlider = document.getElementById('master-volume');
  const streakText = document.getElementById('streak-text');
  const categoryFilters = document.getElementById('category-filters');

  // Durum Değişkenleri
  let favorites = JSON.parse(localStorage.getItem('huzur_favorites') || '[]');
  let customAffirmations = JSON.parse(localStorage.getItem('huzur_custom') || '[]');
  let currentCategory = 'all';
  let filteredList = [];
  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let currentCardElement = null;

  function getAllAffirmations() {
    return [...AFFIRMATIONS_DATA, ...customAffirmations];
  }

  function updateFilteredList() {
    const all = getAllAffirmations();
    if (currentCategory === 'all') {
      filteredList = all;
    } else if (currentCategory === 'favorites') {
      filteredList = all.filter(item => favorites.includes(item.id));
    } else {
      filteredList = all.filter(item => item.category === currentCategory);
    }

    if (filteredList.length === 0) {
      if (currentCategory === 'favorites') {
        filteredList = [{
          id: -1,
          category: "favorites",
          categoryName: "Favorilerim",
          text: "Henüz bir olumlama beğenmediniz. Kartı sağa kaydırarak veya ortadaki kalp butonuna basarak sevdiklerinizi buraya toplayabilirsiniz.",
          subtext: "Kendinize iyi gelen cümleleri biriktirin.",
          icon: "❤️",
          gradient: "from-rose-950 via-pink-950 to-slate-950",
          accentColor: "#fb7185",
          bgPattern: "radial-gradient(circle at 50% 50%, rgba(251, 113, 133, 0.25) 0%, transparent 60%)"
        }];
      } else {
        filteredList = all;
      }
    }

    currentIndex = 0;
    renderCardStack();
  }

  function renderCardStack() {
    cardStack.innerHTML = '';
    if (filteredList.length === 0) return;

    const currentItem = filteredList[currentIndex];
    const nextItem = filteredList[(currentIndex + 1) % filteredList.length];
    const thirdItem = filteredList[(currentIndex + 2) % filteredList.length];

    if (filteredList.length > 2) {
      const card3 = createCardElement(thirdItem, 'card-tertiary');
      cardStack.appendChild(card3);
    }

    if (filteredList.length > 1) {
      const card2 = createCardElement(nextItem, 'card-secondary');
      cardStack.appendChild(card2);
    }

    const activeCard = createCardElement(currentItem, 'card-primary z-20');
    cardStack.appendChild(activeCard);
    currentCardElement = activeCard;

    attachDragEvents(activeCard);
    updateFavoriteButtonState(currentItem.id);
  }

  function createCardElement(item, extraClasses = '') {
    const card = document.createElement('div');
    card.className = `affirmation-card absolute inset-0 rounded-3xl p-7 md:p-10 flex flex-col justify-between shadow-2xl overflow-hidden cursor-grab bg-gradient-to-br ${item.gradient} border border-white/10 ${extraClasses}`;
    
    if (item.bgPattern) {
      const bgLight = document.createElement('div');
      bgLight.className = 'absolute inset-0 pointer-events-none';
      bgLight.style.background = item.bgPattern;
      card.appendChild(bgLight);
    }

    // Sağa ve Sola Kaydırma Rozetleri
    const badgeLike = document.createElement('div');
    badgeLike.className = 'swipe-badge-like absolute top-8 left-8 border-2 border-emerald-400 bg-emerald-950/80 text-emerald-300 font-bold px-4 py-1.5 rounded-xl uppercase tracking-wider text-xs pointer-events-none z-30 shadow-lg';
    badgeLike.textContent = '❤️ Kalbime Dokundu';

    const badgePass = document.createElement('div');
    badgePass.className = 'swipe-badge-pass absolute top-8 right-8 border-2 border-sky-400 bg-sky-950/80 text-sky-300 font-bold px-4 py-1.5 rounded-xl uppercase tracking-wider text-xs pointer-events-none z-30 shadow-lg';
    badgePass.textContent = '🍃 Sonraki Huzur';

    card.appendChild(badgeLike);
    card.appendChild(badgePass);

    // Üst Bar: Kategori & Sayaç
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between z-10';
    header.innerHTML = `
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium tracking-wide text-white/90">
        <span>${item.icon}</span>
        <span>${item.categoryName}</span>
      </div>
      <div class="text-white/40 text-xs font-mono">
        ${currentIndex + 1} / ${filteredList.length}
      </div>
    `;
    card.appendChild(header);

    // Orta Alan: Olumlama Cümlesi
    const body = document.createElement('div');
    body.className = 'my-auto py-6 z-10 text-center relative';
    body.innerHTML = `
      <div class="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-light tracking-tight text-white leading-relaxed mb-6 font-serif">
        “${item.text}”
      </div>
      <div class="h-0.5 w-16 mx-auto rounded-full mb-6 opacity-60" style="background-color: ${item.accentColor}"></div>
      <p class="text-sm md:text-base text-white/70 font-light max-w-md mx-auto italic">
        ${item.subtext}
      </p>
    `;
    card.appendChild(body);

    // Alt Alan
    const footer = document.createElement('div');
    footer.className = 'flex items-center justify-between z-10 text-white/40 text-xs';
    footer.innerHTML = `
      <span class="flex items-center gap-1.5">
        <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        Sağa veya sola kaydırın
      </span>
      <span class="flex items-center gap-1">
        <svg class="w-3.5 h-3.5 text-amber-400/80" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
        Günün Olumlaması
      </span>
    `;
    card.appendChild(footer);

    return card;
  }

  // Sürükleme ve Kaydırma Fiziği
  function attachDragEvents(card) {
    const handleStart = (clientX, clientY) => {
      isDragging = true;
      startX = clientX;
      startY = clientY;
      currentX = clientX;
      currentY = clientY;
      card.classList.add('is-dragging');
    };

    const handleMove = (clientX, clientY) => {
      if (!isDragging) return;
      currentX = clientX;
      currentY = clientY;
      const dx = currentX - startX;
      const dy = currentY - startY;

      const rotate = dx * 0.07;
      card.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${rotate}deg)`;

      const badgeLike = card.querySelector('.swipe-badge-like');
      const badgePass = card.querySelector('.swipe-badge-pass');
      
      if (dx > 30) {
        const opacity = Math.min((dx - 30) / 90, 1);
        badgeLike.style.opacity = opacity;
        badgePass.style.opacity = 0;
      } else if (dx < -30) {
        const opacity = Math.min((-dx - 30) / 90, 1);
        badgePass.style.opacity = opacity;
        badgeLike.style.opacity = 0;
      } else {
        badgeLike.style.opacity = 0;
        badgePass.style.opacity = 0;
      }
    };

    const handleEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      card.classList.remove('is-dragging');
      const dx = currentX - startX;

      const threshold = 95;
      if (dx > threshold) {
        swipeCard('right');
      } else if (dx < -threshold) {
        swipeCard('left');
      } else {
        card.style.transform = '';
        const badgeLike = card.querySelector('.swipe-badge-like');
        const badgePass = card.querySelector('.swipe-badge-pass');
        if (badgeLike) badgeLike.style.opacity = 0;
        if (badgePass) badgePass.style.opacity = 0;
      }
    };

    card.addEventListener('mousedown', (e) => handleStart(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => { if (isDragging) handleMove(e.clientX, e.clientY); });
    window.addEventListener('mouseup', () => { if (isDragging) handleEnd(); });

    card.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && isDragging) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    card.addEventListener('touchend', () => { if (isDragging) handleEnd(); });
  }

  function swipeCard(direction) {
    if (!currentCardElement) return;

    if (direction === 'right') {
      currentCardElement.classList.add('swiped-right');
      const currentItem = filteredList[currentIndex];
      if (currentItem && currentItem.id > 0 && !favorites.includes(currentItem.id)) {
        favorites.push(currentItem.id);
        localStorage.setItem('huzur_favorites', JSON.stringify(favorites));
        showToast('❤️ Kalbinize kaydedildi');
      }
    } else {
      currentCardElement.classList.add('swiped-left');
    }

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % filteredList.length;
      renderCardStack();
    }, 280);
  }

  function prevCard() {
    currentIndex = (currentIndex - 1 + filteredList.length) % filteredList.length;
    renderCardStack();
  }

  function shuffleCard() {
    if (filteredList.length <= 1) return;
    let nextIdx = currentIndex;
    while (nextIdx === currentIndex) {
      nextIdx = Math.floor(Math.random() * filteredList.length);
    }
    currentIndex = nextIdx;
    renderCardStack();
    showToast('✨ Yeni bir olumlama seçildi');
  }

  function updateFavoriteButtonState(id) {
    const isFav = favorites.includes(id);
    if (isFav) {
      btnFavorite.classList.add('text-rose-400', 'border-rose-500/40', 'bg-rose-500/15');
      btnFavorite.querySelector('svg').setAttribute('fill', 'currentColor');
    } else {
      btnFavorite.classList.remove('text-rose-400', 'border-rose-500/40', 'bg-rose-500/15');
      btnFavorite.querySelector('svg').setAttribute('fill', 'none');
    }
  }

  function toggleFavorite() {
    const currentItem = filteredList[currentIndex];
    if (!currentItem || currentItem.id < 0) return;

    const idx = favorites.indexOf(currentItem.id);
    if (idx > -1) {
      favorites.splice(idx, 1);
      showToast('Favorilerden çıkarıldı');
    } else {
      favorites.push(currentItem.id);
      showToast('❤️ Favorilere eklendi');
    }
    localStorage.setItem('huzur_favorites', JSON.stringify(favorites));
    updateFavoriteButtonState(currentItem.id);

    if (currentCategory === 'favorites') {
      updateFilteredList();
    }
  }

  function shareAffirmation() {
    const currentItem = filteredList[currentIndex];
    if (!currentItem) return;

    const shareText = `✨ Günün Olumlaması:\n“${currentItem.text}”\n\n— ${currentItem.subtext}\n\n🌿 Huzur`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        showToast('📋 Olumlama metni panoya kopyalandı!');
      });
    }
  }

  function showToast(msg) {
    const existing = document.getElementById('toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-slate-900/90 border border-white/20 text-white text-xs md:text-sm font-medium shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce';
    toast.textContent = msg;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 2400);
  }

  function initCategories() {
    categoryFilters.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `category-tab px-4 py-2 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
        currentCategory === cat.id 
          ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 border-transparent' 
          : 'glass-button text-slate-300 hover:text-white'
      }`;
      btn.innerHTML = `<span>${cat.icon}</span><span>${cat.name}</span>`;
      btn.addEventListener('click', () => {
        currentCategory = cat.id;
        document.querySelectorAll('.category-tab').forEach(b => {
          b.className = 'category-tab px-4 py-2 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 glass-button text-slate-300 hover:text-white';
        });
        btn.className = 'category-tab px-4 py-2 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 bg-sky-500 text-white shadow-lg shadow-sky-500/25 border-transparent';
        updateFilteredList();
      });
      categoryFilters.appendChild(btn);
    });
  }

  // --- SES MİKSERİ VE AMBİYANS YÖNETİMİ ---
  function initSoundControls() {
    const channels = ['campfire', 'crickets', 'water', 'piano'];

    channels.forEach(ch => {
      const toggle = document.getElementById(`toggle-${ch}`);
      const slider = document.getElementById(`vol-${ch}`);

      if (toggle) {
        toggle.addEventListener('click', async () => {
          const isActive = await window.audioEngine.toggleChannel(ch);
          updateChannelUi(ch, isActive);
        });
      }

      if (slider) {
        slider.addEventListener('input', (e) => {
          window.audioEngine.setChannelVolume(ch, e.target.value);
        });
      }
    });

    if (masterVolumeSlider) {
      masterVolumeSlider.addEventListener('input', (e) => {
        window.audioEngine.setMasterVolume(e.target.value);
      });
    }

    // Hepsini Sustur
    if (btnSoundMuteAll) {
      btnSoundMuteAll.addEventListener('click', async () => {
        await window.audioEngine.applyPreset('sessiz');
        channels.forEach(ch => updateChannelUi(ch, false));
        showToast('🔇 Sesler susturuldu');
      });
    }

    // Hazır Ön Ayarlar (Kamp, Gece, Yağmur, Piyano, Okyanus, Zen)
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const preset = btn.getAttribute('data-preset');
        await window.audioEngine.applyPreset(preset);
        channels.forEach(ch => {
          updateChannelUi(ch, window.audioEngine.activeChannels[ch]);
          const slider = document.getElementById(`vol-${ch}`);
          if (slider && window.audioEngine.volumes[ch] !== undefined) {
            slider.value = window.audioEngine.volumes[ch];
          }
        });
        showToast(`🎵 Ambiyans başlatıldı`);
      });
    });

    startVisualizerLoop();
  }

  function updateChannelUi(ch, isActive) {
    const toggle = document.getElementById(`toggle-${ch}`);
    const card = document.getElementById(`card-ch-${ch}`);
    if (!toggle) return;

    if (isActive) {
      toggle.classList.add('bg-sky-500', 'text-white');
      toggle.classList.remove('bg-white/10', 'text-slate-400');
      toggle.textContent = 'Açık';
      if (card) card.classList.add('border-sky-500/40', 'bg-sky-500/10');
    } else {
      toggle.classList.remove('bg-sky-500', 'text-white');
      toggle.classList.add('bg-white/10', 'text-slate-400');
      toggle.textContent = 'Kapalı';
      if (card) card.classList.remove('border-sky-500/40', 'bg-sky-500/10');
    }
  }

  function startVisualizerLoop() {
    const bars = soundVisualizer ? soundVisualizer.querySelectorAll('.sound-wave-bar') : [];
    function draw() {
      requestAnimationFrame(draw);
      if (window.audioEngine.isPlaying && bars.length > 0) {
        const data = window.audioEngine.getVisualizerData();
        for (let i = 0; i < bars.length; i++) {
          const val = data[i * 2] || 0;
          const height = Math.max(3, (val / 255) * 16);
          bars[i].style.height = `${height}px`;
        }
      } else {
        bars.forEach(b => b.style.height = '3px');
      }
    }
    draw();
  }

  // --- ZEN ATEŞBÖCEKLERİ CANVAS PARÇACIKLARI ---
  function initZenParticles() {
    const canvas = document.getElementById('zen-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(Math.floor(width / 35), 45);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35 - 0.1,
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulseAngle: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.5 ? 190 : 45
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulseAngle += p.pulseSpeed;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulseAngle));
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${currentAlpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 65%, ${currentAlpha * 0.8})`;
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(render);
    }
    render();
  }

  // --- GÜNLÜK SERİ TAKİPÇİSİ ---
  function initStreakTracker() {
    const today = new Date().toISOString().slice(0, 10);
    const lastVisit = localStorage.getItem('huzur_last_visit');
    let streak = parseInt(localStorage.getItem('huzur_streak') || '1', 10);

    if (lastVisit) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (lastVisit === yesterday) {
        streak += 1;
        localStorage.setItem('huzur_streak', streak.toString());
      } else if (lastVisit !== today) {
        streak = 1;
        localStorage.setItem('huzur_streak', '1');
      }
    }
    localStorage.setItem('huzur_last_visit', today);

    if (streakText) {
      streakText.textContent = `${streak}. Gün Serisi`;
    }
  }

  // --- MEDİTASYON ZAMANLAYICISI ---
  let timerDuration = 300;
  let timerRemaining = 300;
  let timerInterval = null;
  let timerRunning = false;

  function initMeditationTimer() {
    const durationButtons = document.querySelectorAll('.timer-duration-btn');
    durationButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (timerRunning) return;
        durationButtons.forEach(b => {
          b.className = 'timer-duration-btn py-2.5 rounded-xl text-xs font-semibold glass-button border-white/10 hover:border-amber-400/50';
        });
        btn.className = 'timer-duration-btn py-2.5 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/40';
        
        timerDuration = parseInt(btn.getAttribute('data-duration'), 10);
        timerRemaining = timerDuration;
        updateTimerDisplay();
      });
    });

    if (btnTimerStart) btnTimerStart.addEventListener('click', toggleTimer);
    if (btnTimerReset) btnTimerReset.addEventListener('click', resetTimer);
    updateTimerDisplay();
  }

  async function toggleTimer() {
    if (timerRunning) {
      clearInterval(timerInterval);
      timerRunning = false;
      btnTimerStart.textContent = 'Devam Et';
      btnTimerStart.className = 'flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm shadow-lg';
      if (timerStatusText) timerStatusText.textContent = 'Duraklatıldı';
    } else {
      await window.audioEngine.initContext();
      if (!window.audioEngine.isPlaying) {
        window.audioEngine.applyPreset('piyano');
      }

      timerRunning = true;
      btnTimerStart.textContent = 'Duraklat';
      btnTimerStart.className = 'flex-1 py-3 rounded-xl bg-amber-600/60 text-white font-semibold text-sm border border-amber-400/30';
      if (timerStatusText) timerStatusText.textContent = 'Meditasyondasınız...';

      timerInterval = setInterval(() => {
        timerRemaining--;
        updateTimerDisplay();

        if (timerRemaining <= 0) {
          clearInterval(timerInterval);
          timerRunning = false;
          btnTimerStart.textContent = 'Yeni Seans Başlat';
          btnTimerStart.className = 'flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm shadow-lg';
          if (timerStatusText) timerStatusText.textContent = 'Tamamlandı ✨';

          window.audioEngine._strikeBowl(window.audioEngine.masterGain);
          setTimeout(() => {
            window.audioEngine._strikeBowl(window.audioEngine.masterGain);
          }, 3500);

          showToast('🔔 Dinginlik seansınız tamamlandı.');
        }
      }, 1000);
    }
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerRemaining = timerDuration;
    btnTimerStart.textContent = 'Seansı Başlat';
    btnTimerStart.className = 'flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm shadow-lg';
    if (timerStatusText) timerStatusText.textContent = 'Hazır';
    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    const mins = Math.floor(timerRemaining / 60);
    const secs = timerRemaining % 60;
    if (timerDisplay) {
      timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    if (timerProgress) {
      const circumference = 2 * Math.PI * 76;
      const offset = circumference * (1 - (timerRemaining / timerDuration));
      timerProgress.style.strokeDashoffset = offset;
    }
  }

  // --- KARTI GÖRSEL OLARAK İNDİRME (PNG) ---
  function exportCardAsImage() {
    const currentItem = filteredList[currentIndex];
    if (!currentItem) return;

    const canvas = document.getElementById('card-export-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const W = 1080;
    const H = 1350;
    canvas.width = W;
    canvas.height = H;

    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#060a15');
    bgGrad.addColorStop(0.5, '#0c1322');
    bgGrad.addColorStop(1, '#04070e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    const glowGrad = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 450);
    glowGrad.addColorStop(0, currentItem.accentColor + '35');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, W, H);

    const cX = 90, cY = 140, cW = W - 180, cH = H - 280, r = 50;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cX, cY, cW, cH, r);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();
    ctx.clip();

    const cardGlow = ctx.createRadialGradient(cX + cW * 0.7, cY + 180, 50, cX + cW * 0.7, cY + 180, 400);
    cardGlow.addColorStop(0, currentItem.accentColor + '40');
    cardGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = cardGlow;
    ctx.fillRect(cX, cY, cW, cH);
    ctx.restore();

    ctx.save();
    const badgeText = `${currentItem.icon}  ${currentItem.categoryName}`;
    ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, W / 2, cY + 110);
    ctx.restore();

    ctx.save();
    ctx.font = 'italic 120px Georgia, serif';
    ctx.fillStyle = currentItem.accentColor + '60';
    ctx.textAlign = 'center';
    ctx.fillText('“', W / 2, cY + 280);
    ctx.restore();

    ctx.save();
    ctx.font = '300 52px -apple-system, BlinkMacSystemFont, "Segoe UI", serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const words = currentItem.text.split(' ');
    let line = '';
    const lines = [];
    const maxTextWidth = cW - 140;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextWidth && i > 0) {
        lines.push(line);
        line = words[i] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const lineHeight = 76;
    const startY = cY + (cH / 2) - ((lines.length - 1) * lineHeight / 2) - 40;

    lines.forEach((l, idx) => {
      ctx.fillText(l.trim(), W / 2, startY + (idx * lineHeight));
    });
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(W / 2 - 80, cY + cH - 240);
    ctx.lineTo(W / 2 + 80, cY + cH - 240);
    ctx.strokeStyle = currentItem.accentColor;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.font = 'italic 30px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'center';
    ctx.fillText(currentItem.subtext, W / 2, cY + cH - 160);
    ctx.restore();

    ctx.save();
    ctx.font = '500 24px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Huzur • Günlük Olumlama', W / 2, H - 60);
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `huzur-olumlama-${currentItem.id}.png`;
    link.href = dataUrl;
    link.click();
    showToast('📸 Olumlama görsel olarak indirildi!');
  }

  // Özel Olumlama Ekleme
  if (formCustomAffirmation) {
    formCustomAffirmation.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = document.getElementById('custom-text').value.trim();
      const subtext = document.getElementById('custom-subtext').value.trim() || 'Kendi niyetin.';
      const category = document.getElementById('custom-category').value;

      if (!text) return;

      const newAffirmation = {
        id: Date.now(),
        category: category,
        categoryName: CATEGORIES.find(c => c.id === category)?.name || 'Kişisel',
        text: text,
        subtext: subtext,
        icon: '💫',
        gradient: 'from-violet-950 via-purple-900 to-slate-950',
        accentColor: '#c084fc',
        bgPattern: 'radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.25) 0%, transparent 60%)'
      };

      customAffirmations.unshift(newAffirmation);
      localStorage.setItem('huzur_custom', JSON.stringify(customAffirmations));
      customModal.classList.add('hidden');
      formCustomAffirmation.reset();

      updateFilteredList();
      showToast('✨ Özel olumlamanız desteye eklendi!');
    });
  }

  // Klavye Kısayolları
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.code === 'ArrowRight' || e.code === 'Space') {
      e.preventDefault();
      swipeCard('left');
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      prevCard();
    } else if (e.code === 'KeyF') {
      toggleFavorite();
    } else if (e.code === 'KeyM') {
      btnMixerToggle.click();
    }
  });

  // Buton Bağlantıları
  btnNext.addEventListener('click', () => swipeCard('left'));
  btnPrev.addEventListener('click', prevCard);
  btnShuffle.addEventListener('click', shuffleCard);
  btnFavorite.addEventListener('click', toggleFavorite);
  btnShare.addEventListener('click', shareAffirmation);
  if (btnDownloadCard) btnDownloadCard.addEventListener('click', exportCardAsImage);

  // Modallar
  btnMixerToggle.addEventListener('click', () => mixerModal.classList.remove('hidden'));
  btnCloseMixer.addEventListener('click', () => mixerModal.classList.add('hidden'));

  if (btnWidgetGuideToggle) btnWidgetGuideToggle.addEventListener('click', () => widgetGuideModal.classList.remove('hidden'));
  if (btnCloseWidgetGuide) btnCloseWidgetGuide.addEventListener('click', () => widgetGuideModal.classList.add('hidden'));

  if (btnTimerToggle) btnTimerToggle.addEventListener('click', () => timerModal.classList.remove('hidden'));
  if (btnCloseTimer) btnCloseTimer.addEventListener('click', () => timerModal.classList.add('hidden'));

  if (btnAddCustom) btnAddCustom.addEventListener('click', () => customModal.classList.remove('hidden'));
  if (btnCloseCustom) btnCloseCustom.addEventListener('click', () => customModal.classList.add('hidden'));

  [mixerModal, widgetGuideModal, timerModal, customModal].forEach(m => {
    if (!m) return;
    m.addEventListener('click', (e) => {
      if (e.target === m) m.classList.add('hidden');
    });
  });

  // Başlatma
  initCategories();
  updateFilteredList();
  initSoundControls();
  initZenParticles();
  initStreakTracker();
  initMeditationTimer();
});
