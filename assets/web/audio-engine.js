/**
 * Huzur - Web Audio API Ortam Sesleri Motoru
 * Harici dosya indirmesi olmadan, saf tarayıcı Web Audio API ile gerçek zamanlı
 * su akıntısı, cırcır böcekleri, kamp ateşi, meditatif piyano, okyanus ve Tibet çanağı üretir.
 */

class AmbientAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.analyser = null;
    this.isPlaying = false;

    // Kanal durumları ve ses seviyeleri (0.0 - 1.0)
    this.volumes = {
      campfire: 0.6,
      crickets: 0.5,
      water: 0.5,
      piano: 0.5,
      ocean: 0.4,
      bowl: 0.3
    };

    this.activeChannels = {
      campfire: false,
      crickets: false,
      water: false,
      piano: false,
      ocean: false,
      bowl: false
    };

    this.nodes = {};
  }

  // AudioContext başlatma
  async initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  // 1. KAMP ATEŞİ & ÇITIRTI (Campfire & Warm Fireplace Crackle)
  _startCampfire() {
    if (!this.ctx || this.nodes.campfire) return;

    // Sıcak alev uğultusu (Low brown noise rumble)
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 2.8;
    }

    const fireNoise = this.ctx.createBufferSource();
    fireNoise.buffer = noiseBuffer;
    fireNoise.loop = true;

    const fireFilter = this.ctx.createBiquadFilter();
    fireFilter.type = 'lowpass';
    fireFilter.frequency.setValueAtTime(260, this.ctx.currentTime);

    const fireRumbleGain = this.ctx.createGain();
    fireRumbleGain.gain.setValueAtTime(this.volumes.campfire * 0.35, this.ctx.currentTime);

    fireNoise.connect(fireFilter);
    fireFilter.connect(fireRumbleGain);
    fireRumbleGain.connect(this.masterGain);

    fireNoise.start();

    // Çıtırtı / Kıvılcım üreticisi (Wood Crackles & Snaps)
    const crackleInterval = setInterval(() => {
      if (!this.activeChannels.campfire || !this.ctx) return;
      this._playFireCrackle();
      if (Math.random() > 0.6) this._playFireCrackle();
    }, 180);

    this.nodes.campfire = {
      sources: [fireNoise],
      gain: fireRumbleGain,
      interval: crackleInterval
    };
  }

  _playFireCrackle() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime + (Math.random() * 0.08);

    // Kısa yüksek frekanslı patlama (high-Q resonant noise pop)
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.035);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const crackle = this.ctx.createBufferSource();
    crackle.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800 + Math.random() * 3200, now);
    filter.Q.setValueAtTime(4.0, now);

    const gain = this.ctx.createGain();
    const isSnap = Math.random() > 0.85; // Bazen daha tok çıtırtı
    const amp = (isSnap ? 0.35 : 0.12) * this.volumes.campfire;
    gain.gain.setValueAtTime(amp, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    crackle.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    crackle.start(now);
    crackle.stop(now + 0.04);
  }

  _stopCampfire() {
    if (this.nodes.campfire) {
      if (this.nodes.campfire.interval) clearInterval(this.nodes.campfire.interval);
      this.nodes.campfire.sources.forEach(s => {
        try { s.stop(); s.disconnect(); } catch (e) {}
      });
      if (this.nodes.campfire.gain) this.nodes.campfire.gain.disconnect();
      this.nodes.campfire = null;
    }
  }

  // 2. CIR CIR BÖCEKLERİ (Summer Night Crickets)
  _startCrickets() {
    if (!this.ctx || this.nodes.crickets) return;

    const cricketsGain = this.ctx.createGain();
    cricketsGain.gain.setValueAtTime(this.volumes.crickets * 0.25, this.ctx.currentTime);
    cricketsGain.connect(this.masterGain);

    const chirpInterval = setInterval(() => {
      if (!this.activeChannels.crickets || !this.ctx) return;
      this._playCricketChirp(cricketsGain);
    }, 1250);

    this.nodes.crickets = {
      gain: cricketsGain,
      interval: chirpInterval
    };
  }

  _playCricketChirp(targetGainNode) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const count = 3 + Math.floor(Math.random() * 3);
    const baseFreq = 4600 + (Math.random() * 300);

    for (let i = 0; i < count; i++) {
      const startTime = now + (i * 0.065);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq + (Math.random() * 80), startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.09, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.055);

      osc.connect(gain);
      gain.connect(targetGainNode);

      osc.start(startTime);
      osc.stop(startTime + 0.06);
    }
  }

  _stopCrickets() {
    if (this.nodes.crickets) {
      if (this.nodes.crickets.interval) clearInterval(this.nodes.crickets.interval);
      if (this.nodes.crickets.gain) this.nodes.crickets.gain.disconnect();
      this.nodes.crickets = null;
    }
  }

  // 3. SU SESİ / DERE AKINTISI (Water Stream & Droplets)
  _startWater() {
    if (!this.ctx || this.nodes.water) return;

    const bufferSize = this.ctx.sampleRate * 5;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.3, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(150, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(800, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(2.0, this.ctx.currentTime);

    const waterGain = this.ctx.createGain();
    waterGain.gain.setValueAtTime(this.volumes.water * 0.4, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(bandpass);
    bandpass.connect(waterGain);
    filter.connect(waterGain);
    waterGain.connect(this.masterGain);

    whiteNoise.start();
    lfo.start();

    const dropInterval = setInterval(() => {
      if (!this.activeChannels.water || !this.ctx) return;
      if (Math.random() > 0.4) this._playWaterDrop();
    }, 1800);

    this.nodes.water = {
      sources: [whiteNoise, lfo],
      gain: waterGain,
      interval: dropInterval
    };
  }

  _playWaterDrop() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    const baseFreq = 900 + Math.random() * 800;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 400, now + 0.12);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(this.volumes.water * 0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  _stopWater() {
    if (this.nodes.water) {
      if (this.nodes.water.interval) clearInterval(this.nodes.water.interval);
      this.nodes.water.sources.forEach(s => {
        try { s.stop(); s.disconnect(); } catch (e) {}
      });
      if (this.nodes.water.gain) this.nodes.water.gain.disconnect();
      this.nodes.water = null;
    }
  }

  // 4. MEDİTATİF PİYANO (432Hz Ambient Piano)
  _startPiano() {
    if (!this.ctx || this.nodes.piano) return;

    const delay = this.ctx.createDelay();
    delay.delayTime.setValueAtTime(0.5, this.ctx.currentTime);
    const feedback = this.ctx.createGain();
    feedback.gain.setValueAtTime(0.42, this.ctx.currentTime);
    const delayFilter = this.ctx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.setValueAtTime(1600, this.ctx.currentTime);

    delay.connect(feedback);
    feedback.connect(delayFilter);
    delayFilter.connect(delay);

    const pianoGain = this.ctx.createGain();
    pianoGain.gain.setValueAtTime(this.volumes.piano * 0.35, this.ctx.currentTime);

    delay.connect(pianoGain);
    pianoGain.connect(this.masterGain);

    const chordProgressions = [
      [256.87, 323.63, 384.87, 484.90], // Cmaj7
      [216.00, 256.87, 323.63, 484.90], // Am9
      [171.43, 216.00, 256.87, 323.63], // Fmaj7
      [192.43, 256.87, 288.33, 384.87], // Gsus4
      [242.45, 305.47, 363.27, 432.00]  // Em7
    ];

    let chordIndex = 0;

    const playNextChord = () => {
      if (!this.activeChannels.piano || !this.ctx) return;
      const chord = chordProgressions[chordIndex % chordProgressions.length];
      chordIndex++;

      chord.forEach((freq, noteIdx) => {
        const offset = noteIdx * (0.18 + Math.random() * 0.08);
        this._playPianoNote(freq, offset, delay, pianoGain);
      });
    };

    playNextChord();
    const interval = setInterval(playNextChord, 5200);

    this.nodes.piano = {
      gain: pianoGain,
      delay: delay,
      interval: interval
    };
  }

  _playPianoNote(freq, delayOffset, delayNode, mainGainNode) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime + delayOffset;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.09, now + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.02, now + 1.2);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

    osc1.connect(noteGain);
    osc2.connect(noteGain);

    noteGain.connect(mainGainNode);
    noteGain.connect(delayNode);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 4.6);
    osc2.stop(now + 4.6);
  }

  _stopPiano() {
    if (this.nodes.piano) {
      if (this.nodes.piano.interval) clearInterval(this.nodes.piano.interval);
      if (this.nodes.piano.gain) this.nodes.piano.gain.disconnect();
      if (this.nodes.piano.delay) this.nodes.piano.delay.disconnect();
      this.nodes.piano = null;
    }
  }

  // 5. OKYANUS DALGALARI (Ocean Waves)
  _startOcean() {
    if (!this.ctx || this.nodes.ocean) return;

    const bufferSize = this.ctx.sampleRate * 6;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.1, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(320, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const oceanGain = this.ctx.createGain();
    oceanGain.gain.setValueAtTime(this.volumes.ocean * 0.5, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(oceanGain);
    oceanGain.connect(this.masterGain);

    noise.start();
    lfo.start();

    this.nodes.ocean = {
      sources: [noise, lfo],
      gain: oceanGain
    };
  }

  _stopOcean() {
    if (this.nodes.ocean) {
      this.nodes.ocean.sources.forEach(s => {
        try { s.stop(); s.disconnect(); } catch (e) {}
      });
      if (this.nodes.ocean.gain) this.nodes.ocean.gain.disconnect();
      this.nodes.ocean = null;
    }
  }

  // 6. TİBET ÇANAĞI & ŞİFALI FREKANS
  _startBowl() {
    if (!this.ctx || this.nodes.bowl) return;

    const bowlGain = this.ctx.createGain();
    bowlGain.gain.setValueAtTime(this.volumes.bowl * 0.4, this.ctx.currentTime);
    bowlGain.connect(this.masterGain);

    const playBowl = () => {
      if (!this.activeChannels.bowl || !this.ctx) return;
      this._strikeBowl(bowlGain);
    };

    playBowl();
    const interval = setInterval(playBowl, 9000);

    this.nodes.bowl = {
      gain: bowlGain,
      interval: interval
    };
  }

  _strikeBowl(targetGain) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const freqs = [432.0, 434.2, 864.0, 1296.5];
    const amplitudes = [0.25, 0.22, 0.08, 0.04];

    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(amplitudes[idx], now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 8.5);

      osc.connect(gain);
      gain.connect(targetGain);

      osc.start(now);
      osc.stop(now + 8.8);
    });
  }

  _stopBowl() {
    if (this.nodes.bowl) {
      if (this.nodes.bowl.interval) clearInterval(this.nodes.bowl.interval);
      if (this.nodes.bowl.gain) this.nodes.bowl.gain.disconnect();
      this.nodes.bowl = null;
    }
  }

  // Kanal Aç / Kapat
  async toggleChannel(channelName) {
    await this.initContext();
    this.activeChannels[channelName] = !this.activeChannels[channelName];

    if (this.activeChannels[channelName]) {
      this._startChannel(channelName);
    } else {
      this._stopChannel(channelName);
    }

    this._updateOverallPlayingState();
    return this.activeChannels[channelName];
  }

  setChannelState(channelName, isActive) {
    if (this.activeChannels[channelName] === isActive) return;
    this.activeChannels[channelName] = isActive;
    if (isActive) {
      this._startChannel(channelName);
    } else {
      this._stopChannel(channelName);
    }
    this._updateOverallPlayingState();
  }

  _startChannel(name) {
    switch (name) {
      case 'campfire': this._startCampfire(); break;
      case 'crickets': this._startCrickets(); break;
      case 'water': this._startWater(); break;
      case 'piano': this._startPiano(); break;
      case 'ocean': this._startOcean(); break;
      case 'bowl': this._startBowl(); break;
    }
  }

  _stopChannel(name) {
    switch (name) {
      case 'campfire': this._stopCampfire(); break;
      case 'crickets': this._stopCrickets(); break;
      case 'water': this._stopWater(); break;
      case 'piano': this._stopPiano(); break;
      case 'ocean': this._stopOcean(); break;
      case 'bowl': this._stopBowl(); break;
    }
  }

  setChannelVolume(channelName, value) {
    this.volumes[channelName] = parseFloat(value);
    if (this.nodes[channelName] && this.nodes[channelName].gain && this.ctx) {
      let multiplier = 0.35;
      if (channelName === 'crickets') multiplier = 0.25;
      if (channelName === 'water') multiplier = 0.4;
      if (channelName === 'campfire') multiplier = 0.35;
      this.nodes[channelName].gain.gain.setValueAtTime(this.volumes[channelName] * multiplier, this.ctx.currentTime);
    }
  }

  setMasterVolume(val) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(parseFloat(val), this.ctx.currentTime);
    }
  }

  // Hazır Ambiyans Şablonları (Presets)
  async applyPreset(presetName) {
    await this.initContext();
    const presets = {
      kamp: { campfire: 0.8, crickets: 0.4, water: 0.0, piano: 0.2, ocean: 0.0, bowl: 0.0, active: ['campfire', 'crickets'] },
      gece: { campfire: 0.3, crickets: 0.8, water: 0.2, piano: 0.35, ocean: 0.0, bowl: 0.0, active: ['crickets', 'piano'] },
      yagmur: { campfire: 0.0, crickets: 0.0, water: 0.85, piano: 0.5, ocean: 0.2, bowl: 0.0, active: ['water', 'piano'] },
      piyano: { campfire: 0.0, crickets: 0.1, water: 0.2, piano: 0.85, ocean: 0.0, bowl: 0.2, active: ['piano'] },
      okyanus: { campfire: 0.0, crickets: 0.0, water: 0.1, piano: 0.3, ocean: 0.8, bowl: 0.2, active: ['ocean', 'piano'] },
      zen: { campfire: 0.0, crickets: 0.1, water: 0.3, piano: 0.45, ocean: 0.0, bowl: 0.7, active: ['bowl', 'water', 'piano'] },
      sessiz: { campfire: 0.0, crickets: 0.0, water: 0.0, piano: 0.0, ocean: 0.0, bowl: 0.0, active: [] }
    };

    const target = presets[presetName];
    if (!target) return;

    ['campfire', 'crickets', 'water', 'piano', 'ocean', 'bowl'].forEach(ch => {
      this.setChannelVolume(ch, target[ch]);
      this.setChannelState(ch, target.active.includes(ch));
    });
  }

  // Hepsini Durdur / Başlat (Varsayılan: Kamp ateşi & Cırcır böceği & Piyano)
  async toggleAll() {
    await this.initContext();
    if (this.isPlaying) {
      ['campfire', 'crickets', 'water', 'piano', 'ocean', 'bowl'].forEach(ch => this.setChannelState(ch, false));
    } else {
      this.setChannelState('campfire', true);
      this.setChannelState('crickets', true);
      this.setChannelState('piano', true);
    }
  }

  _updateOverallPlayingState() {
    this.isPlaying = Object.values(this.activeChannels).some(v => v === true);
  }

  getVisualizerData() {
    if (!this.analyser) return new Uint8Array(0);
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

window.audioEngine = new AmbientAudioEngine();
