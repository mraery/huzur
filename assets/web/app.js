/**
 * Huzur v2.0 - Bütünsel Meditasyon, Nefes & Farkındalık Platformu
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==================== 1. VERİ & DURUM YÖNETİMİ ====================
  const STATE = {
    activeTab: 'tab-meditation',
    streakDays: parseInt(localStorage.getItem('huzur_streak') || '1', 10),
    totalMins: parseInt(localStorage.getItem('huzur_total_mins') || '0', 10),
    totalSessions: parseInt(localStorage.getItem('huzur_total_sessions') || '0', 10),
    favorites: JSON.parse(localStorage.getItem('huzur_favorites') || '[]'),
    customAffirmations: JSON.parse(localStorage.getItem('huzur_custom') || '[]'),
    gratitudeEntries: JSON.parse(localStorage.getItem('huzur_gratitude') || '[]'),
    selectedMood: localStorage.getItem('huzur_today_mood') || '',
    activeBreathTech: BREATHWORK_TECHNIQUES[0],
    isBreathing: false,
    activeMeditation: null,
    isMeditationPlaying: false
  };

  // ==================== 2. TAB NAVİGASYONU ====================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  function switchTab(tabId) {
    STATE.activeTab = tabId;
    tabButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', isTarget);
      if (isTarget) {
        btn.classList.add('text-sky-400');
        btn.classList.remove('text-slate-400');
      } else {
        btn.classList.remove('text-sky-400', 'active');
        btn.classList.add('text-slate-400');
      }
    });

    tabPanes.forEach(pane => {
      const isTarget = pane.id === tabId;
      pane.classList.toggle('hidden', !isTarget);
      pane.classList.toggle('active', isTarget);
    });

    if (tabId === 'tab-affirmations') {
      renderCardStack();
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab'));
    });
  });

  // ==================== 3. REHBERLİ MEDİTASYON SİSTEMİ ====================
  const meditationsGrid = document.getElementById('meditations-grid');
  const playerModal = document.getElementById('meditation-player-modal');
  const btnClosePlayer = document.getElementById('btn-close-player');
  const btnPlayerPlayPause = document.getElementById('btn-player-play-pause');
  const btnPlayerBell = document.getElementById('btn-player-bell');
  const btnPlayerPrevStep = document.getElementById('btn-player-prev-step');
  const btnPlayerNextStep = document.getElementById('btn-player-next-step');
  const playerCategory = document.getElementById('player-category');
  const playerTitle = document.getElementById('player-title');
  const playerTimeDisplay = document.getElementById('player-time-display');
  const playerCueDisplay = document.getElementById('player-cue-display');
  const playerGuideText = document.getElementById('player-guide-text');
  const playerCircleProgress = document.getElementById('player-circle-progress');

  let meditationTimer = null;
  let meditationSecondsRemaining = 0;
  let meditationTotalSeconds = 0;
  let currentStepIndex = 0;

  function renderMeditationsList() {
    if (!meditationsGrid) return;
    meditationsGrid.innerHTML = GUIDED_MEDITATIONS.map(med => `
      <div class="glass-card rounded-2xl p-4 flex items-center justify-between gap-3.5 hover:border-sky-400/40 transition-all cursor-pointer group" onclick="startMeditationById('${med.id}')">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            ${med.icon}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">${med.title}</h4>
              <span class="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-slate-300 font-medium">${med.durationText}</span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5 line-clamp-1">${med.subtitle}</p>
          </div>
        </div>
        <button class="w-10 h-10 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-all shadow-md">
          <svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
    `).join('');
  }

  window.startMeditationById = async function(medId) {
    const med = GUIDED_MEDITATIONS.find(m => m.id === medId);
    if (!med) return;

    STATE.activeMeditation = med;
    playerCategory.textContent = med.categoryName;
    playerTitle.textContent = med.title;
    meditationTotalSeconds = med.duration;
    meditationSecondsRemaining = med.duration;
    currentStepIndex = 0;

    playerModal.classList.remove('hidden');
    updatePlayerDisplay();

    // Başlangıçta Tibet Çanı çal
    if (window.audioEngine) {
      window.audioEngine.strikeBell();
      if (med.ambientPreset) {
        window.audioEngine.applyPreset(med.ambientPreset);
        updateQuickSoundButton();
      }
    }

    startMeditationInterval();
  };

  function startMeditationInterval() {
    STATE.isMeditationPlaying = true;
    btnPlayerPlayPause.textContent = '⏸';
    clearInterval(meditationTimer);

    meditationTimer = setInterval(() => {
      if (meditationSecondsRemaining > 0) {
        meditationSecondsRemaining--;
        updatePlayerDisplay();
      } else {
        finishMeditation();
      }
    }, 1000);
  }

  function pauseMeditation() {
    STATE.isMeditationPlaying = false;
    btnPlayerPlayPause.textContent = '▶';
    clearInterval(meditationTimer);
  }

  function updatePlayerDisplay() {
    const elapsed = meditationTotalSeconds - meditationSecondsRemaining;
    const mins = Math.floor(meditationSecondsRemaining / 60);
    const secs = meditationSecondsRemaining % 60;
    playerTimeDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    // Progress circle (dasharray: 578)
    const progress = elapsed / meditationTotalSeconds;
    const offset = 578 - (578 * progress);
    playerCircleProgress.style.strokeDashoffset = offset;

    // Check step transition
    const steps = STATE.activeMeditation.steps;
    for (let i = steps.length - 1; i >= 0; i--) {
      if (elapsed >= steps[i].time) {
        if (currentStepIndex !== i) {
          currentStepIndex = i;
          playerCueDisplay.textContent = steps[i].cue;
          playerGuideText.textContent = steps[i].text;
          playerGuideText.classList.remove('animate-fade-in');
          void playerGuideText.offsetWidth; // trigger reflow
          playerGuideText.classList.add('animate-fade-in');
        }
        break;
      }
    }
  }

  function finishMeditation() {
    pauseMeditation();
    if (window.audioEngine) {
      window.audioEngine.strikeBell();
    }

    const durationMins = Math.round(meditationTotalSeconds / 60);
    STATE.totalMins += durationMins;
    STATE.totalSessions += 1;
    localStorage.setItem('huzur_total_mins', STATE.totalMins.toString());
    localStorage.setItem('huzur_total_sessions', STATE.totalSessions.toString());
    updateStatsDisplay();

    playerCueDisplay.textContent = "Seans Tamamlandı ✨";
    playerGuideText.textContent = "Tebrikler. Bu dinginliği ve içsel huzuru günün geri kalanına taşı.";

    setTimeout(() => {
      playerModal.classList.add('hidden');
    }, 3500);
  }

  btnClosePlayer.addEventListener('click', () => {
    pauseMeditation();
    playerModal.classList.add('hidden');
  });

  btnPlayerPlayPause.addEventListener('click', () => {
    if (STATE.isMeditationPlaying) {
      pauseMeditation();
    } else {
      startMeditationInterval();
    }
  });

  btnPlayerBell.addEventListener('click', () => {
    if (window.audioEngine) window.audioEngine.strikeBell();
  });

  btnPlayerPrevStep.addEventListener('click', () => {
    if (currentStepIndex > 0) {
      currentStepIndex--;
      const step = STATE.activeMeditation.steps[currentStepIndex];
      meditationSecondsRemaining = meditationTotalSeconds - step.time;
      updatePlayerDisplay();
    }
  });

  btnPlayerNextStep.addEventListener('click', () => {
    if (currentStepIndex < STATE.activeMeditation.steps.length - 1) {
      currentStepIndex++;
      const step = STATE.activeMeditation.steps[currentStepIndex];
      meditationSecondsRemaining = meditationTotalSeconds - step.time;
      updatePlayerDisplay();
    }
  });

  // ==================== 4. İNTERAKTİF NEFES KOÇU ====================
  const breathBubble = document.getElementById('breath-bubble');
  const breathHalo = document.getElementById('breath-halo');
  const breathActionText = document.getElementById('breath-action-text');
  const breathSecondsText = document.getElementById('breath-seconds-text');
  const breathSubCue = document.getElementById('breath-sub-cue');
  const breathCycleCount = document.getElementById('breath-cycle-count');
  const breathTotalTime = document.getElementById('breath-total-time');
  const btnBreathStart = document.getElementById('btn-breath-start');
  const btnBreathReset = document.getElementById('btn-breath-reset');
  const breathTechBtns = document.querySelectorAll('.breath-tech-btn');
  const breathTechTitle = document.getElementById('breath-tech-title');
  const breathTechDesc = document.getElementById('breath-tech-desc');

  let breathInterval = null;
  let breathPhaseIndex = 0;
  let breathSecondsInPhase = 0;
  let totalBreathSeconds = 0;
  let breathCycles = 0;

  breathTechBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const techId = btn.getAttribute('data-tech');
      const tech = BREATHWORK_TECHNIQUES.find(t => t.id === techId);
      if (!tech) return;

      STATE.activeBreathTech = tech;
      breathTechTitle.textContent = tech.name;
      breathTechDesc.textContent = tech.subtitle;

      breathTechBtns.forEach(b => {
        b.classList.remove('bg-sky-500/20', 'text-sky-300', 'border-sky-400/40');
        b.classList.add('glass-button');
      });
      btn.classList.remove('glass-button');
      btn.classList.add('bg-sky-500/20', 'text-sky-300', 'border-sky-400/40');

      resetBreathwork();
    });
  });

  btnBreathStart.addEventListener('click', () => {
    if (STATE.isBreathing) {
      pauseBreathwork();
    } else {
      startBreathwork();
    }
  });

  btnBreathReset.addEventListener('click', resetBreathwork);

  function startBreathwork() {
    STATE.isBreathing = true;
    btnBreathStart.textContent = "Egzersizi Duraklat";
    btnBreathStart.classList.replace('from-sky-400', 'from-amber-500');
    btnBreathStart.classList.replace('to-indigo-600', 'to-orange-600');

    if (breathSecondsInPhase === 0) {
      breathPhaseIndex = 0;
      breathSecondsInPhase = STATE.activeBreathTech.phases[0].duration;
      triggerBreathPhase(STATE.activeBreathTech.phases[0]);
    }

    clearInterval(breathInterval);
    breathInterval = setInterval(() => {
      totalBreathSeconds++;
      updateBreathTimerDisplay();

      if (breathSecondsInPhase > 1) {
        breathSecondsInPhase--;
        breathSecondsText.textContent = breathSecondsInPhase.toString();
      } else {
        // Next phase
        breathPhaseIndex = (breathPhaseIndex + 1) % STATE.activeBreathTech.phases.length;
        if (breathPhaseIndex === 0) {
          breathCycles++;
          breathCycleCount.textContent = breathCycles.toString();
          // Record 1 minute if reached
          if (totalBreathSeconds % 60 === 0) {
            STATE.totalMins++;
            localStorage.setItem('huzur_total_mins', STATE.totalMins.toString());
            updateStatsDisplay();
          }
        }
        const nextPhase = STATE.activeBreathTech.phases[breathPhaseIndex];
        breathSecondsInPhase = nextPhase.duration;
        triggerBreathPhase(nextPhase);
      }
    }, 1000);
  }

  function triggerBreathPhase(phase) {
    breathActionText.textContent = phase.action;
    breathSecondsText.textContent = phase.duration.toString();
    breathSubCue.textContent = phase.desc;

    // Reset bubble classes
    breathBubble.className = "w-48 h-48 rounded-full border-2 flex flex-col items-center justify-center shadow-2xl relative transition-transform ease-in-out duration-1000";

    if (phase.action.includes('Al')) {
      breathBubble.classList.add('breath-inhale');
      breathBubble.style.borderColor = "#38bdf8";
      breathHalo.style.transform = "scale(1.5)";
      breathHalo.style.backgroundColor = "rgba(56, 189, 248, 0.25)";
    } else if (phase.action.includes('Tut')) {
      breathBubble.classList.add('breath-hold');
      breathBubble.style.borderColor = "#818cf8";
      breathHalo.style.transform = "scale(1.5)";
      breathHalo.style.backgroundColor = "rgba(129, 140, 248, 0.2)";
    } else if (phase.action.includes('Ver')) {
      breathBubble.classList.add('breath-exhale');
      breathBubble.style.borderColor = "#34d399";
      breathHalo.style.transform = "scale(0.8)";
      breathHalo.style.backgroundColor = "rgba(52, 211, 153, 0.15)";
    } else {
      breathBubble.classList.add('breath-rest');
      breathBubble.style.borderColor = "rgba(255, 255, 255, 0.3)";
      breathHalo.style.transform = "scale(1.0)";
      breathHalo.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    }
  }

  function pauseBreathwork() {
    STATE.isBreathing = false;
    btnBreathStart.textContent = "Devam Et";
    btnBreathStart.classList.replace('from-amber-500', 'from-sky-400');
    btnBreathStart.classList.replace('to-orange-600', 'to-indigo-600');
    clearInterval(breathInterval);
  }

  function resetBreathwork() {
    pauseBreathwork();
    btnBreathStart.textContent = "Egzersizi Başlat";
    breathPhaseIndex = 0;
    breathSecondsInPhase = 0;
    totalBreathSeconds = 0;
    breathCycles = 0;
    breathCycleCount.textContent = "0";
    breathTotalTime.textContent = "00:00";
    breathActionText.textContent = "Hazır";
    breathSecondsText.textContent = "--";
    breathSubCue.textContent = "Başlat'a dokunun";
    breathBubble.className = "w-48 h-48 rounded-full bg-gradient-to-tr from-sky-500/20 via-indigo-500/30 to-purple-500/20 border-2 border-sky-400/50 flex flex-col items-center justify-center shadow-2xl relative transition-transform ease-in-out duration-1000";
    breathHalo.style.transform = "scale(1)";
  }

  function updateBreathTimerDisplay() {
    const mins = Math.floor(totalBreathSeconds / 60);
    const secs = totalBreathSeconds % 60;
    breathTotalTime.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // ==================== 5. 3D OLUMLAMA KARTLARI ====================
  const cardStack = document.getElementById('card-stack');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnShuffle = document.getElementById('btn-shuffle');
  const btnFavorite = document.getElementById('btn-favorite');
  const btnDownloadCard = document.getElementById('btn-download-card');
  const categoryFilters = document.getElementById('category-filters');

  let currentCategory = 'all';
  let filteredList = [];
  let currentIndex = 0;

  const CATEGORIES = [
    { id: 'all', name: 'Tümü', icon: '✨' },
    { id: 'huzur', name: 'İç Huzur', icon: '🌊' },
    { id: 'ozsevgi', name: 'Öz Sevgi', icon: '💖' },
    { id: 'basari', name: 'Bolluk & Başarı', icon: '🌟' },
    { id: 'sukran', name: 'Şükran', icon: '🙏' },
    { id: 'saglik', name: 'Sağlık', icon: '🌿' },
    { id: 'cesaret', name: 'Cesaret', icon: '🦁' },
    { id: 'favorites', name: 'Favoriler', icon: '❤️' }
  ];

  function renderCategoryFilters() {
    if (!categoryFilters) return;
    categoryFilters.innerHTML = CATEGORIES.map(cat => `
      <button data-cat="${cat.id}" class="cat-filter-btn px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${cat.id === currentCategory ? 'bg-sky-500 text-white shadow-md' : 'glass-button text-slate-300 hover:text-white'}">
        <span>${cat.icon}</span>
        <span>${cat.name}</span>
      </button>
    `).join('');

    categoryFilters.querySelectorAll('.cat-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.getAttribute('data-cat');
        renderCategoryFilters();
        updateFilteredList();
      });
    });
  }

  function getAllAffirmations() {
    return [...AFFIRMATIONS_DATA, ...STATE.customAffirmations];
  }

  function updateFilteredList() {
    const all = getAllAffirmations();
    if (currentCategory === 'all') {
      filteredList = all;
    } else if (currentCategory === 'favorites') {
      filteredList = all.filter(c => STATE.favorites.includes(c.id));
    } else {
      filteredList = all.filter(c => c.category === currentCategory);
    }

    if (filteredList.length === 0) {
      filteredList = [{
        id: -1,
        category: "favorites",
        categoryName: "Favorilerim",
        text: "Henüz favori kart eklemediniz. Kalp butonuna dokunarak beğendiklerinizi toplayabilirsiniz.",
        subtext: "Kendine iyi gelen sözleri biriktir.",
        icon: "❤️",
        gradient: "from-rose-950 via-pink-950 to-slate-950",
        accentColor: "#fb7185"
      }];
    }

    currentIndex = 0;
    renderCardStack();
  }

  function renderCardStack() {
    if (!cardStack || filteredList.length === 0) return;
    const card = filteredList[currentIndex % filteredList.length];
    const isFav = STATE.favorites.includes(card.id);

    if (btnFavorite) {
      btnFavorite.innerHTML = isFav
        ? `<svg class="w-4 h-4 text-rose-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
        : `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`;
    }

    cardStack.innerHTML = `
      <div id="active-card" class="affirmation-card absolute inset-0 rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${card.gradient || 'from-sky-950 to-indigo-950'} border border-white/20 shadow-2xl flex flex-col justify-between cursor-pointer select-none">
        <!-- Üst Kategori -->
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 rounded-full bg-black/40 text-white/90 text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm">
            <span>${card.icon || '✨'}</span>
            <span>${card.categoryName || 'Olumlama'}</span>
          </span>
          <span class="text-xs text-white/50 font-mono">${(currentIndex % filteredList.length) + 1} / ${filteredList.length}</span>
        </div>

        <!-- Ana Metin -->
        <div class="my-auto py-6 text-center">
          <p class="text-xl sm:text-2xl font-serif font-medium text-white leading-relaxed drop-shadow-sm">
            “${card.text}”
          </p>
          ${card.subtext ? `<p class="text-xs text-white/70 italic mt-4">${card.subtext}</p>` : ''}
        </div>

        <!-- Alt Not -->
        <div class="flex items-center justify-between text-[11px] text-white/40 pt-2 border-t border-white/10">
          <span>Huzur Meditasyon</span>
          <span>Derin nefes al 🍃</span>
        </div>
      </div>
    `;

    setupCardSwipe();
  }

  function setupCardSwipe() {
    const el = document.getElementById('active-card');
    if (!el) return;

    let startX = 0, currentX = 0, isDragging = false;

    const onStart = (e) => {
      isDragging = true;
      startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      el.classList.add('is-dragging');
    };

    const onMove = (e) => {
      if (!isDragging) return;
      currentX = (e.type.includes('touch') ? e.touches[0].clientX : e.clientX) - startX;
      el.style.transform = `translate3d(${currentX}px, 0, 0) rotate(${currentX * 0.06}deg)`;
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      el.classList.remove('is-dragging');

      if (currentX > 90) {
        // Sağa kaydırıldı -> Favori ekle & sonraki
        toggleFavoriteCurrent();
        nextCard();
      } else if (currentX < -90) {
        // Sola kaydırıldı -> sonraki
        nextCard();
      } else {
        el.style.transform = '';
      }
    };

    el.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: true });
    el.addEventListener('touchend', onEnd);
  }

  function nextCard() {
    currentIndex++;
    renderCardStack();
  }

  function prevCard() {
    if (currentIndex > 0) currentIndex--;
    else currentIndex = filteredList.length - 1;
    renderCardStack();
  }

  function toggleFavoriteCurrent() {
    const card = filteredList[currentIndex % filteredList.length];
    if (card.id === -1) return;

    const idx = STATE.favorites.indexOf(card.id);
    if (idx >= 0) {
      STATE.favorites.splice(idx, 1);
    } else {
      STATE.favorites.push(card.id);
    }
    localStorage.setItem('huzur_favorites', JSON.stringify(STATE.favorites));
    renderCardStack();
  }

  if (btnNext) btnNext.addEventListener('click', nextCard);
  if (btnPrev) btnPrev.addEventListener('click', prevCard);
  if (btnFavorite) btnFavorite.addEventListener('click', toggleFavoriteCurrent);
  if (btnShuffle) {
    btnShuffle.addEventListener('click', () => {
      filteredList.sort(() => Math.random() - 0.5);
      currentIndex = 0;
      renderCardStack();
    });
  }

  if (btnDownloadCard) {
    btnDownloadCard.addEventListener('click', () => {
      const card = filteredList[currentIndex % filteredList.length];
      const canvas = document.getElementById('card-export-canvas');
      if (!canvas) return;
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      // Gradient background
      const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
      grad.addColorStop(0, '#060913');
      grad.addColorStop(0.5, '#0f172a');
      grad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);

      // Card Box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.roundRect(100, 460, 880, 1000, 48);
      ctx.fill();

      // Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${card.icon || '✨'} ${card.categoryName || 'Günün Olumlaması'}`, 540, 580);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'italic 52px serif';
      wrapText(ctx, `“${card.text}”`, 540, 860, 760, 75);

      if (card.subtext) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '32px sans-serif';
        ctx.fillText(card.subtext, 540, 1340);
      }

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('Huzur - Bütünsel Meditasyon & Farkındalık', 540, 1780);

      // Trigger download
      const a = document.createElement('a');
      a.download = `huzur_olumlama_${Date.now()}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    });
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  // ==================== 6. AMBİYANS SESLERİ & MİKSER ====================
  const btnQuickSound = document.getElementById('btn-quick-sound');
  const quickSoundLabel = document.getElementById('quick-sound-label');
  const sleepTimerSelect = document.getElementById('sleep-timer-select');

  const soundChannels = ['campfire', 'crickets', 'water', 'piano', 'ocean', 'bowl'];

  soundChannels.forEach(ch => {
    const toggleBtn = document.getElementById(`toggle-${ch}`);
    const slider = document.getElementById(`vol-${ch}`);

    if (toggleBtn && window.audioEngine) {
      toggleBtn.addEventListener('click', async () => {
        const isActive = await window.audioEngine.toggleChannel(ch);
        toggleBtn.textContent = isActive ? "Açık" : "Kapalı";
        toggleBtn.classList.toggle('bg-sky-500', isActive);
        toggleBtn.classList.toggle('text-white', isActive);
        toggleBtn.classList.toggle('bg-white/10', !isActive);
        toggleBtn.classList.toggle('text-slate-400', !isActive);
        updateQuickSoundButton();
      });
    }

    if (slider && window.audioEngine) {
      slider.addEventListener('input', (e) => {
        window.audioEngine.setChannelVolume(ch, e.target.value);
      });
    }
  });

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const preset = btn.getAttribute('data-preset');
      if (window.audioEngine) {
        await window.audioEngine.applyPreset(preset);
        updateAllSoundUI();
        updateQuickSoundButton();
      }
    });
  });

  function updateAllSoundUI() {
    if (!window.audioEngine) return;
    soundChannels.forEach(ch => {
      const toggleBtn = document.getElementById(`toggle-${ch}`);
      const slider = document.getElementById(`vol-${ch}`);
      const isActive = window.audioEngine.activeChannels[ch];

      if (toggleBtn) {
        toggleBtn.textContent = isActive ? "Açık" : "Kapalı";
        toggleBtn.classList.toggle('bg-sky-500', isActive);
        toggleBtn.classList.toggle('text-white', isActive);
        toggleBtn.classList.toggle('bg-white/10', !isActive);
        toggleBtn.classList.toggle('text-slate-400', !isActive);
      }
      if (slider) {
        slider.value = window.audioEngine.volumes[ch];
      }
    });
  }

  function updateQuickSoundButton() {
    if (!quickSoundLabel || !window.audioEngine) return;
    const isAnyActive = window.audioEngine.isPlaying;
    quickSoundLabel.textContent = isAnyActive ? "Çalıyor" : "Ambiyans";
    btnQuickSound.classList.toggle('border-sky-400', isAnyActive);
    btnQuickSound.classList.toggle('text-white', isAnyActive);
  }

  if (btnQuickSound && window.audioEngine) {
    btnQuickSound.addEventListener('click', async () => {
      await window.audioEngine.toggleAll();
      updateAllSoundUI();
      updateQuickSoundButton();
    });
  }

  if (sleepTimerSelect && window.audioEngine) {
    sleepTimerSelect.addEventListener('change', (e) => {
      const mins = parseInt(e.target.value, 10);
      window.audioEngine.setSleepTimer(mins, () => {
        updateAllSoundUI();
        updateQuickSoundButton();
      });
    });
  }

  // ==================== 7. PROFİL, RUH HALİ & GÜNLÜK ====================
  const moodButtons = document.querySelectorAll('.mood-btn');
  const moodAdvice = document.getElementById('mood-advice');
  const btnSaveGratitude = document.getElementById('btn-save-gratitude');
  const statTotalMins = document.getElementById('stat-total-mins');
  const statTotalSessions = document.getElementById('stat-total-sessions');
  const statStreak = document.getElementById('stat-streak');
  const streakText = document.getElementById('streak-text');
  const zenQuoteText = document.getElementById('zen-quote-text');
  const zenQuoteAuthor = document.getElementById('zen-quote-author');

  const MOOD_ADVICE = {
    huzurlu: "Bu dinginliği kutla. Şimdi bir rehberli 'Öz Şefkat & Metta' meditasyonuyla kalbini tüm evrene açabilirsin.",
    enerjik: "Yüksek enerjini verimli bir şeye yönlendirmek için 7 dakikalık 'Derin Odaklanma & Akış' seansını dene.",
    kaygili: "Yalnız değilsin. Hemen 4-7-8 Nefesini veya 3 dakikalık 'Hızlı Stres Savar' seansını başlatmanı tavsiye ederiz.",
    minnettar: "Minnettarlık kalbin en yüksek titreşimidir. Aşağıdaki Şükran Günlüğü'ne bu duyguyu besleyen 3 şeyi yazmayı unutma.",
    yorgun: "Bedenin dinlenmek istiyor. 'Derin Uykuya Geçiş' seansını başlat ve gece ormanı sesleriyle rahatça gevşe."
  };

  moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.getAttribute('data-mood');
      STATE.selectedMood = mood;
      localStorage.setItem('huzur_today_mood', mood);

      moodButtons.forEach(b => b.classList.remove('border-sky-400', 'bg-sky-500/20'));
      btn.classList.add('border-sky-400', 'bg-sky-500/20');

      if (moodAdvice && MOOD_ADVICE[mood]) {
        moodAdvice.textContent = `💡 Tavsiyemiz: ${MOOD_ADVICE[mood]}`;
        moodAdvice.classList.remove('hidden');
      }
    });
  });

  if (btnSaveGratitude) {
    btnSaveGratitude.addEventListener('click', () => {
      const g1 = document.getElementById('gratitude-1').value.trim();
      const g2 = document.getElementById('gratitude-2').value.trim();
      const g3 = document.getElementById('gratitude-3').value.trim();

      if (!g1 && !g2 && !g3) return;

      const entry = { date: new Date().toLocaleDateString('tr-TR'), items: [g1, g2, g3].filter(Boolean) };
      STATE.gratitudeEntries.unshift(entry);
      localStorage.setItem('huzur_gratitude', JSON.stringify(STATE.gratitudeEntries));

      btnSaveGratitude.textContent = "Kaydedildi! Kalbin Ferah Olsun ✨";
      btnSaveGratitude.classList.replace('text-sky-300', 'text-emerald-300');
      setTimeout(() => {
        btnSaveGratitude.textContent = "Günün Şükranını Kaydet ✨";
        btnSaveGratitude.classList.replace('text-emerald-300', 'text-sky-300');
      }, 3000);
    });
  }

  function updateStatsDisplay() {
    if (statTotalMins) statTotalMins.textContent = STATE.totalMins.toString();
    if (statTotalSessions) statTotalSessions.textContent = STATE.totalSessions.toString();
    if (statStreak) statStreak.textContent = STATE.streakDays.toString();
    if (streakText) streakText.textContent = `${STATE.streakDays}. Gün`;
  }

  function setupZenWisdom() {
    if (!zenQuoteText || !zenQuoteAuthor || typeof ZEN_WISDOM === 'undefined') return;
    const randomQuote = ZEN_WISDOM[Math.floor(Math.random() * ZEN_WISDOM.length)];
    zenQuoteText.textContent = `“${randomQuote.quote}”`;
    zenQuoteAuthor.textContent = `— ${randomQuote.author} (${randomQuote.theme})`;
  }

  // ==================== 8. ZEN PARÇACIK EFEKTİ (CANVAS) ====================
  const canvas = document.getElementById('zen-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.1,
      alpha: Math.random() * 0.6 + 0.2
    }));

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#38bdf8';
        ctx.fill();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ==================== 9. BAŞLANGIÇ ÇAĞRILARI ====================
  renderMeditationsList();
  renderCategoryFilters();
  updateFilteredList();
  updateStatsDisplay();
  setupZenWisdom();
});
