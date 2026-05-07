/**
 * ========================================
 * FOCUSFLOW — PREMIUM POMODORO TIMER
 * Vanilla JavaScript Application
 * ========================================
 */

// ========================================
// APP STATE
// ========================================
const AppState = {
    // Timer
    mode: 'pomodoro',       // pomodoro | shortBreak | longBreak
    timeLeft: 25 * 60,      // seconds
    totalTime: 25 * 60,     // seconds
    isRunning: false,
    isPaused: false,
    timerInterval: null,

    // Durations (minutes)
    durations: {
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15
    },

    // Sessions
    completedSessions: 0,
    totalFocusMinutes: 0,
    currentSession: 1,
    maxSessionsBeforeLongBreak: 4,

    // Tasks
    tasks: [],
    nextTaskId: 1,

    // Settings
    soundEnabled: true,
    notificationsEnabled: false,
    autoStartBreak: false,
    autoStartFocus: false,
    volume: 50,

    // Theme
    darkMode: false,

    // Focus Mode
    focusMode: false,

    // Ambient
    activeAmbient: null,
    ambientAudio: null,

    // Streak
    streak: 0,
    lastActiveDate: null,

    // Stats
    tasksCompleted: 0
};

// ========================================
// QUOTES (Arabic)
// ========================================
const Quotes = [
    { text: "سر التقدم هو البدء.", author: "مارك توين" },
    { text: "يبدو الأمر مستحيلاً دائماً حتى يتم إنجازه.", author: "نيلسون مانديلا" },
    { text: "لا تراقب الساعة؛ افعل ما تفعله هي. استمر في المضي.", author: "سام ليفنسون" },
    { text: "الطريقة الوحيدة للقيام بعمل عظيم هي أن تحب ما تفعله.", author: "ستيف جوبز" },
    { text: "النجاح هو مجموع الجهود الصغيرة المتكررة يوماً بعد يوم.", author: "روبرت كولييه" },
    { text: "مستقبلك يُصنع بما تفعله اليوم وليس غداً.", author: "روبرت كيوساكي" },
    { text: "التركيز على الإنتاجية أهم من الانشغال.", author: "تيم فيريس" },
    { text: "لا يجب أن تكون عظيماً لتبدأ، لكن يجب أن تبدأ لتكون عظيماً.", author: "زيغ زيغلر" },
    { text: "التقدم البطيء لا يزال تقدماً.", author: "مجهول" },
    { text: "الخبير في أي شيء كان مبتدئاً ذات يوم.", author: "هيلين هايز" },
    { text: "احلم بكبر. ابدأ بصغر. تصرف الآن.", author: "روبن شارما" },
    { text: "ما تفعله اليوم يمكن أن يحسن كل غدٍ لك.", author: "رالف مارستون" },
    { text: "صدّق أنك تستطيع وأنت في منتصف الطريق.", author: "ثيودور روزفلت" },
    { text: "ادفع نفسك لأنه لن يفعل ذلك أحد عنك.", author: "مجهول" },
    { text: "الأشياء العظيمة لا تأتي أبداً من مناطق الراحة.", author: "مجهول" },
    { text: "العقل المركّز مطلوب في كل إنجاز.", author: "توماس إديسون" },
    { text: "كل خطوة صغيرة إلى الأمام هي انتصار.", author: "مجهول" },
    { text: "الإرادة القوية تجعل المستحيل ممكناً.", author: "مجهول" },
    { text: "من صبر وثابر نال ما أراد.", author: "حكمة عربية" },
    { text: "العلم في الصغر كالنقش على الحجر.", author: "حكمة عربية" }
];

// ========================================
// AMBIENT SOUND URLs (Web Audio API generated sounds)
// ========================================
// We'll use Web Audio API to generate ambient sounds

// ========================================
// DOM ELEMENTS
// ========================================
const DOM = {};

function cacheDOM() {
    // Header
    DOM.clockTime = document.getElementById('clockTime');
    DOM.liveDate = document.getElementById('liveDate');
    DOM.themeToggle = document.getElementById('themeToggle');
    DOM.themeIcon = document.getElementById('themeIcon');
    DOM.focusToggle = document.getElementById('focusToggle');
    DOM.settingsToggle = document.getElementById('settingsToggle');

    // Stats
    DOM.sessionsCount = document.getElementById('sessionsCount');
    DOM.minutesCount = document.getElementById('minutesCount');
    DOM.tasksCompletedEl = document.getElementById('tasksCompleted');
    DOM.streakCount = document.getElementById('streakCount');

    // Tasks
    DOM.taskInput = document.getElementById('taskInput');
    DOM.taskAddBtn = document.getElementById('taskAddBtn');
    DOM.taskList = document.getElementById('taskList');
    DOM.taskEmpty = document.getElementById('taskEmpty');
    DOM.taskCount = document.getElementById('taskCount');

    // Timer
    DOM.tabPomodoro = document.getElementById('tabPomodoro');
    DOM.tabShortBreak = document.getElementById('tabShortBreak');
    DOM.tabLongBreak = document.getElementById('tabLongBreak');
    DOM.timerTime = document.getElementById('timerTime');
    DOM.timerModeLabel = document.getElementById('timerModeLabel');
    DOM.timerStatus = document.getElementById('timerStatus');
    DOM.ringProgress = document.getElementById('ringProgress');
    DOM.btnMain = document.getElementById('btnMain');
    DOM.btnMainIcon = document.getElementById('btnMainIcon');
    DOM.btnMainText = document.getElementById('btnMainText');
    DOM.btnReset = document.getElementById('btnReset');
    DOM.btnSkip = document.getElementById('btnSkip');
    DOM.dotsContainer = document.getElementById('dotsContainer');
    DOM.sessionDots = document.getElementById('sessionDots');

    // Quote
    DOM.quoteText = document.getElementById('quoteText');
    DOM.quoteAuthor = document.getElementById('quoteAuthor');
    DOM.quoteRefresh = document.getElementById('quoteRefresh');

    // Ambient
    DOM.btnRain = document.getElementById('btnRain');
    DOM.btnForest = document.getElementById('btnForest');
    DOM.btnCafe = document.getElementById('btnCafe');
    DOM.btnWaves = document.getElementById('btnWaves');
    DOM.volumeSlider = document.getElementById('volumeSlider');

    // Quick Settings
    DOM.valPomodoro = document.getElementById('valPomodoro');
    DOM.valShortBreak = document.getElementById('valShortBreak');
    DOM.valLongBreak = document.getElementById('valLongBreak');
    DOM.soundToggle = document.getElementById('soundToggle');
    DOM.notifToggle = document.getElementById('notifToggle');

    // App wrapper
    DOM.appWrapper = document.getElementById('appWrapper');
}

// ========================================
// AUDIO ENGINE (Web Audio API)
// ========================================
const AudioEngine = {
    ctx: null,
    ambientNode: null,
    ambientGain: null,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + duration);
    },

    playSessionEnd() {
        if (!AppState.soundEnabled) return;
        const vol = (AppState.volume / 100) * 0.3;
        this.playTone(523.25, 0.3, 'sine', vol);
        setTimeout(() => this.playTone(659.25, 0.3, 'sine', vol), 200);
        setTimeout(() => this.playTone(783.99, 0.5, 'sine', vol), 400);
    },

    playBreakStart() {
        if (!AppState.soundEnabled) return;
        const vol = (AppState.volume / 100) * 0.3;
        this.playTone(440, 0.3, 'sine', vol);
        setTimeout(() => this.playTone(349.23, 0.4, 'sine', vol), 250);
    },

    playTimerStart() {
        if (!AppState.soundEnabled) return;
        const vol = (AppState.volume / 100) * 0.15;
        this.playTone(880, 0.08, 'sine', vol);
        setTimeout(() => this.playTone(1046.5, 0.12, 'sine', vol), 80);
    },

    playTimerPause() {
        if (!AppState.soundEnabled) return;
        const vol = (AppState.volume / 100) * 0.12;
        this.playTone(660, 0.1, 'sine', vol);
        setTimeout(() => this.playTone(523.25, 0.15, 'sine', vol * 0.8), 100);
    },

    playClick() {
        if (!AppState.soundEnabled) return;
        const vol = (AppState.volume / 100) * 0.1;
        this.playTone(800, 0.05, 'sine', vol);
    },

    // Generate ambient noise
    createNoiseBuffer() {
        this.init();
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    },

    startAmbient(type) {
        this.init();
        this.stopAmbient();

        const buffer = this.createNoiseBuffer();
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        const vol = (AppState.volume / 100) * 0.15;

        switch(type) {
            case 'rain':
                filter.type = 'lowpass';
                filter.frequency.value = 800;
                gain.gain.value = vol;
                break;
            case 'forest':
                filter.type = 'bandpass';
                filter.frequency.value = 2000;
                filter.Q.value = 0.5;
                gain.gain.value = vol * 0.7;
                break;
            case 'cafe':
                filter.type = 'lowpass';
                filter.frequency.value = 1200;
                gain.gain.value = vol * 0.8;
                break;
            case 'waves':
                filter.type = 'lowpass';
                filter.frequency.value = 400;
                gain.gain.value = vol;
                // Add LFO for wave effect
                const lfo = this.ctx.createOscillator();
                lfo.frequency.value = 0.1;
                const lfoGain = this.ctx.createGain();
                lfoGain.gain.value = vol * 0.5;
                lfo.connect(lfoGain);
                lfoGain.connect(gain.gain);
                lfo.start();
                this.ambientLfo = lfo;
                break;
        }

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        source.start();

        this.ambientNode = source;
        this.ambientGain = gain;
        this.ambientFilter = filter;
    },

    stopAmbient() {
        if (this.ambientNode) {
            try {
                this.ambientNode.stop();
                this.ambientNode.disconnect();
            } catch(e) {}
            this.ambientNode = null;
        }
        if (this.ambientLfo) {
            try {
                this.ambientLfo.stop();
                this.ambientLfo.disconnect();
            } catch(e) {}
            this.ambientLfo = null;
        }
    },

    updateAmbientVolume() {
        if (this.ambientGain) {
            const vol = (AppState.volume / 100) * 0.15;
            this.ambientGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.1);
        }
    }
};

// ========================================
// LOCAL STORAGE
// ========================================
const Storage = {
    save() {
        const data = {
            durations: AppState.durations,
            completedSessions: AppState.completedSessions,
            totalFocusMinutes: AppState.totalFocusMinutes,
            tasks: AppState.tasks,
            nextTaskId: AppState.nextTaskId,
            soundEnabled: AppState.soundEnabled,
            notificationsEnabled: AppState.notificationsEnabled,
            autoStartBreak: AppState.autoStartBreak,
            autoStartFocus: AppState.autoStartFocus,
            volume: AppState.volume,
            darkMode: AppState.darkMode,
            streak: AppState.streak,
            lastActiveDate: AppState.lastActiveDate,
            tasksCompleted: AppState.tasksCompleted,
            currentQuoteIndex: AppState.currentQuoteIndex
        };
        localStorage.setItem('focusflow_data', JSON.stringify(data));
    },

    load() {
        try {
            const data = JSON.parse(localStorage.getItem('focusflow_data'));
            if (data) {
                if (data.durations) AppState.durations = data.durations;
                if (data.completedSessions !== undefined) AppState.completedSessions = data.completedSessions;
                if (data.totalFocusMinutes !== undefined) AppState.totalFocusMinutes = data.totalFocusMinutes;
                if (data.tasks) AppState.tasks = data.tasks;
                if (data.nextTaskId !== undefined) AppState.nextTaskId = data.nextTaskId;
                if (data.soundEnabled !== undefined) AppState.soundEnabled = data.soundEnabled;
                if (data.notificationsEnabled !== undefined) AppState.notificationsEnabled = data.notificationsEnabled;
                if (data.autoStartBreak !== undefined) AppState.autoStartBreak = data.autoStartBreak;
                if (data.autoStartFocus !== undefined) AppState.autoStartFocus = data.autoStartFocus;
                if (data.volume !== undefined) AppState.volume = data.volume;
                if (data.darkMode !== undefined) AppState.darkMode = data.darkMode;
                if (data.streak !== undefined) AppState.streak = data.streak;
                if (data.lastActiveDate) AppState.lastActiveDate = data.lastActiveDate;
                if (data.tasksCompleted !== undefined) AppState.tasksCompleted = data.tasksCompleted;
                if (data.currentQuoteIndex !== undefined) AppState.currentQuoteIndex = data.currentQuoteIndex;
            }
        } catch (e) {
            console.error('Error loading data:', e);
        }
    },

    clear() {
        localStorage.removeItem('focusflow_data');
    }
};

// ========================================
// CLOCK & DATE
// ========================================
function updateClock() {
    const now = new Date();
    
    // Convert to 12-hour format
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert 24-hour to 12-hour (1-12, no leading zero)
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    
    DOM.clockTime.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    DOM.liveDate.textContent = now.toLocaleDateString('ar-SA', options);
}

// ========================================
// THEME
// ========================================
function toggleTheme() {
    AppState.darkMode = !AppState.darkMode;
    applyTheme();
    Storage.save();
}

function applyTheme() {
    if (AppState.darkMode) {
        document.documentElement.classList.add('dark');
        DOM.themeIcon.classList.remove('uil-moon');
        DOM.themeIcon.classList.add('uil-sun');
    } else {
        document.documentElement.classList.remove('dark');
        DOM.themeIcon.classList.remove('uil-sun');
        DOM.themeIcon.classList.add('uil-moon');
    }
}

// ========================================
// FOCUS MODE
// ========================================
function toggleFocusMode() {
    AppState.focusMode = !AppState.focusMode;

    const exitBtn = document.getElementById('focusExitBtn');

    if (AppState.focusMode) {
        document.body.classList.add('focus-mode');
        DOM.focusToggle.classList.add('active');
        DOM.focusOverlay.classList.add('active');
        if (exitBtn) {
            exitBtn.style.opacity = '';
            exitBtn.style.pointerEvents = '';
        }
    } else {
        document.body.classList.remove('focus-mode');
        DOM.focusToggle.classList.remove('active');
        DOM.focusOverlay.classList.remove('active');
        if (exitBtn) {
            exitBtn.style.opacity = '';
            exitBtn.style.pointerEvents = '';
        }
    }
}

// ========================================
// TIMER
// ========================================
function setMode(mode) {
    if (AppState.isRunning) {
        pauseTimer();
    }

    AppState.mode = mode;
    AppState.totalTime = AppState.durations[mode] * 60;
    AppState.timeLeft = AppState.totalTime;
    AppState.isPaused = false;

    updateModeTabs();
    updateTimerDisplay();
    updateRingProgress();
    updateTimerStatus();
    updateRingColors();
}

function updateModeTabs() {
    [DOM.tabPomodoro, DOM.tabShortBreak, DOM.tabLongBreak].forEach(tab => {
        tab.classList.remove('active');
    });

    if (AppState.mode === 'pomodoro') DOM.tabPomodoro.classList.add('active');
    else if (AppState.mode === 'shortBreak') DOM.tabShortBreak.classList.add('active');
    else if (AppState.mode === 'longBreak') DOM.tabLongBreak.classList.add('active');
}

function updateRingColors() {
    const root = document.documentElement;
    const ringStop1 = document.querySelector('.ring-stop-1');
    const ringStop2 = document.querySelector('.ring-stop-2');

    if (AppState.mode === 'pomodoro') {
        root.style.setProperty('--ring-color-1', '#22c55e');
        root.style.setProperty('--ring-color-2', '#4ade80');
    } else if (AppState.mode === 'shortBreak') {
        root.style.setProperty('--ring-color-1', '#f59e0b');
        root.style.setProperty('--ring-color-2', '#fbbf24');
    } else {
        root.style.setProperty('--ring-color-1', '#3b82f6');
        root.style.setProperty('--ring-color-2', '#60a5fa');
    }
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateTimerDisplay() {
    DOM.timerTime.textContent = formatTime(AppState.timeLeft);
    document.title = `${formatTime(AppState.timeLeft)} — فوكس فلو`;
}

function updateTimerStatus() {
    if (AppState.isRunning) {
        DOM.timerStatus.textContent = AppState.mode === 'pomodoro' ? 'جارٍ التركيز...' : 'في وقت الاستراحة...';
        DOM.timerModeLabel.textContent = AppState.mode === 'pomodoro' ? 'جلسة تركيز' : 
                                        AppState.mode === 'shortBreak' ? 'استراحة قصيرة' : 'استراحة طويلة';
    } else if (AppState.isPaused) {
        DOM.timerStatus.textContent = 'متوقف مؤقتاً';
    } else {
        DOM.timerStatus.textContent = AppState.mode === 'pomodoro' ? 'جاهز للتركيز' : 'جاهز للاستراحة';
        DOM.timerModeLabel.textContent = AppState.mode === 'pomodoro' ? 'جلسة تركيز' : 
                                        AppState.mode === 'shortBreak' ? 'استراحة قصيرة' : 'استراحة طويلة';
    }
}

function updateRingProgress() {
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const progress = AppState.timeLeft / AppState.totalTime;
    const offset = circumference * (1 - progress);

    DOM.ringProgress.style.strokeDasharray = `${circumference}`;
    DOM.ringProgress.style.strokeDashoffset = `${offset}`;
}

function startTimer() {
    if (AppState.isRunning) return;

    AudioEngine.init();
    AudioEngine.playTimerStart();

    AppState.isRunning = true;
    AppState.isPaused = false;

    DOM.btnMainText.textContent = 'إيقاف';
    DOM.btnMainIcon.classList.remove('uil-play');
    DOM.btnMainIcon.classList.add('uil-pause');
    DOM.appWrapper.classList.add('timer-running');

    updateTimerStatus();

    AppState.timerInterval = setInterval(() => {
        if (AppState.timeLeft > 0) {
            AppState.timeLeft--;
            updateTimerDisplay();
            updateRingProgress();
        } else {
            completeTimer();
        }
    }, 1000);
}

function pauseTimer() {
    if (!AppState.isRunning) return;

    AudioEngine.playTimerPause();

    clearInterval(AppState.timerInterval);
    AppState.isRunning = false;
    AppState.isPaused = true;

    DOM.btnMainText.textContent = 'استمرار';
    DOM.btnMainIcon.classList.remove('uil-pause');
    DOM.btnMainIcon.classList.add('uil-play');
    DOM.appWrapper.classList.remove('timer-running');

    updateTimerStatus();
}

function resetTimer() {
    clearInterval(AppState.timerInterval);
    AppState.isRunning = false;
    AppState.isPaused = false;
    AppState.timeLeft = AppState.totalTime;

    DOM.btnMainText.textContent = 'ابدأ';
    DOM.btnMainIcon.classList.remove('uil-pause');
    DOM.btnMainIcon.classList.add('uil-play');
    DOM.appWrapper.classList.remove('timer-running');

    updateTimerDisplay();
    updateRingProgress();
    updateTimerStatus();

    document.title = 'فوكس فلو — مؤقت بومودورو المتميز';
}

function skipTimer() {
    resetTimer();
    // Move to next mode
    if (AppState.mode === 'pomodoro') {
        if (AppState.currentSession % AppState.maxSessionsBeforeLongBreak === 0) {
            setMode('longBreak');
        } else {
            setMode('shortBreak');
        }
    } else {
        setMode('pomodoro');
    }
}

function completeTimer() {
    clearInterval(AppState.timerInterval);
    AppState.isRunning = false;
    AppState.isPaused = false;
    DOM.appWrapper.classList.remove('timer-running');

    // Play sound
    if (AppState.soundEnabled) {
        AudioEngine.playSessionEnd();
    }

    // Show notification
    if (AppState.notificationsEnabled && 'Notification' in window) {
        new Notification('فوكس فلو', {
            body: AppState.mode === 'pomodoro' ? 'اكتملت جلسة التركيز! حان وقت الاستراحة.' : 'انتهت الاستراحة! هل أنت مستعد للتركيز؟',
            icon: 'https://unicons.iconscout.com/release/v4.0.8/svg/line/focus-target.svg'
        });
    }

    if (AppState.mode === 'pomodoro') {
        AppState.completedSessions++;
        AppState.totalFocusMinutes += AppState.durations.pomodoro;
        AppState.currentSession++;

        updateStats();
        updateSessionDots();
        Storage.save();

        // Show SweetAlert2 completion popup
        Swal.fire({
            customClass: {
                popup: 'swal-focus-popup',
                confirmButton: 'swal-confirm-focus'
            },
            icon: 'success',
            title: 'اكتملت الجلسة!',
            html: `
                <div style="text-align:center; margin-bottom: 1rem;">
                    <p style="color:var(--text-secondary); font-family:'Cairo','Tajawal',sans-serif; font-size:0.9rem; line-height:1.7;">
                        أحسنت! لقد أكملت جلسة تركيز كاملة.<br>
                        <strong style="color:var(--accent-focus-light);">استحق استراحتك المكتسبة.</strong>
                    </p>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: 'متابعة <i class="uil uil-check"></i>',
            buttonsStyling: false,
            timer: AppState.autoStartBreak ? 2500 : undefined,
            timerProgressBar: AppState.autoStartBreak,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });

        // Auto-start break
        if (AppState.autoStartBreak) {
            setTimeout(() => {
                if (AppState.currentSession % AppState.maxSessionsBeforeLongBreak === 0) {
                    setMode('longBreak');
                } else {
                    setMode('shortBreak');
                }
                AudioEngine.playBreakStart();
                startTimer();
            }, 2500);
        } else {
            if (AppState.currentSession % AppState.maxSessionsBeforeLongBreak === 0) {
                setMode('longBreak');
            } else {
                setMode('shortBreak');
            }
        }
    } else {
        // Break complete
        if (AppState.soundEnabled) AudioEngine.playBreakStart();

        Swal.fire({
            customClass: {
                popup: 'swal-break-popup',
                confirmButton: 'swal-confirm-break'
            },
            icon: 'info',
            title: 'انتهت الاستراحة!',
            html: `
                <div style="text-align:center; margin-bottom: 1rem;">
                    <p style="color:var(--text-secondary); font-family:'Cairo','Tajawal',sans-serif; font-size:0.9rem; line-height:1.7;">
                        هل أنت مستعد للعودة إلى العمل؟<br>
                        <strong style="color:var(--accent-short-light);">حافظ على تركيزك وحقق أهدافك!</strong>
                    </p>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: 'لنبدأ! <i class="uil uil-rocket"></i>',
            buttonsStyling: false,
            timer: AppState.autoStartFocus ? 2500 : undefined,
            timerProgressBar: AppState.autoStartFocus,
        });

        if (AppState.autoStartFocus) {
            setTimeout(() => {
                setMode('pomodoro');
                startTimer();
            }, 2500);
        } else {
            setMode('pomodoro');
        }
    }

    DOM.btnMainText.textContent = 'ابدأ';
    DOM.btnMainIcon.classList.remove('uil-pause');
    DOM.btnMainIcon.classList.add('uil-play');
    updateTimerStatus();
}

function handleMainButton() {
    AudioEngine.init();
    if (AppState.isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

// ========================================
// SESSION DOTS
// ========================================
function updateSessionDots() {
    const dots = DOM.dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index < AppState.completedSessions % AppState.maxSessionsBeforeLongBreak) {
            dot.classList.add('active');
        }
    });
}

function initSessionDots() {
    DOM.dotsContainer.innerHTML = '';
    for (let i = 0; i < AppState.maxSessionsBeforeLongBreak; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        DOM.dotsContainer.appendChild(dot);
    }
    updateSessionDots();
}

// ========================================
// STATS
// ========================================
function updateStats() {
    DOM.sessionsCount.textContent = AppState.completedSessions;
    DOM.minutesCount.textContent = AppState.totalFocusMinutes;
    DOM.tasksCompletedEl.textContent = AppState.tasksCompleted;
    DOM.streakCount.textContent = AppState.streak;
}

function checkStreak() {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (AppState.lastActiveDate === yesterday) {
        // Continued streak
    } else if (AppState.lastActiveDate !== today) {
        // Streak broken or new
        if (AppState.lastActiveDate && AppState.lastActiveDate !== yesterday) {
            AppState.streak = 0;
        }
    }

    AppState.lastActiveDate = today;
    Storage.save();
    updateStats();
}

// ========================================
// TASKS
// ========================================
function addTask() {
    const text = DOM.taskInput.value.trim();
    if (!text) return;

    const task = {
        id: AppState.nextTaskId++,
        text: text,
        completed: false,
        createdAt: Date.now()
    };

    AppState.tasks.push(task);
    DOM.taskInput.value = '';

    renderTasks();
    Storage.save();
    AudioEngine.playClick();
}

function toggleTask(id) {
    const task = AppState.tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        if (task.completed) {
            AppState.tasksCompleted++;
        } else {
            AppState.tasksCompleted = Math.max(0, AppState.tasksCompleted - 1);
        }
        renderTasks();
        updateStats();
        Storage.save();
    }
}

function deleteTask(id) {
    const task = AppState.tasks.find(t => t.id === id);
    if (task && task.completed) {
        AppState.tasksCompleted = Math.max(0, AppState.tasksCompleted - 1);
    }
    AppState.tasks = AppState.tasks.filter(t => t.id !== id);
    renderTasks();
    updateStats();
    Storage.save();
}

function renderTasks() {
    DOM.taskList.innerHTML = '';

    if (AppState.tasks.length === 0) {
        DOM.taskEmpty.style.display = 'block';
        DOM.taskCount.textContent = '0';
        return;
    }

    DOM.taskEmpty.style.display = 'none';
    DOM.taskCount.textContent = AppState.tasks.length;

    AppState.tasks.forEach(task => {
        const item = document.createElement('div');
        item.className = `task-item${task.completed ? ' completed' : ''}`;

        item.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}">
                ${task.completed ? '<i class="uil uil-check"></i>' : ''}
            </div>
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="task-delete" data-id="${task.id}">
                <i class="uil uil-trash-alt"></i>
            </button>
        `;

        DOM.taskList.appendChild(item);
    });

    // Add event listeners
    DOM.taskList.querySelectorAll('.task-checkbox').forEach(cb => {
        cb.addEventListener('click', () => toggleTask(parseInt(cb.dataset.id)));
    });

    DOM.taskList.querySelectorAll('.task-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteTask(parseInt(btn.dataset.id)));
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// QUOTES
// ========================================
function loadQuote() {
    let index = AppState.currentQuoteIndex || 0;
    if (index >= Quotes.length) index = 0;

    const quote = Quotes[index];
    DOM.quoteText.textContent = `"${quote.text}"`;
    DOM.quoteAuthor.textContent = `— ${quote.author}`;
}

function nextQuote() {
    AppState.currentQuoteIndex = (AppState.currentQuoteIndex || 0) + 1;
    if (AppState.currentQuoteIndex >= Quotes.length) {
        AppState.currentQuoteIndex = 0;
    }
    loadQuote();
    Storage.save();

    // Animate
    DOM.quoteText.style.opacity = '0';
    DOM.quoteAuthor.style.opacity = '0';
    setTimeout(() => {
        DOM.quoteText.style.transition = 'opacity 0.3s';
        DOM.quoteAuthor.style.transition = 'opacity 0.3s';
        DOM.quoteText.style.opacity = '1';
        DOM.quoteAuthor.style.opacity = '1';
    }, 100);
}

// ========================================
// AMBIENT SOUNDS
// ========================================
function toggleAmbient(type) {
    AudioEngine.init();

    const buttons = {
        rain: DOM.btnRain,
        forest: DOM.btnForest,
        cafe: DOM.btnCafe,
        waves: DOM.btnWaves
    };

    if (AppState.activeAmbient === type) {
        // Turn off
        AudioEngine.stopAmbient();
        AppState.activeAmbient = null;
        buttons[type].classList.remove('active');
    } else {
        // Turn off current
        if (AppState.activeAmbient) {
            buttons[AppState.activeAmbient].classList.remove('active');
        }

        // Turn on new
        AppState.activeAmbient = type;
        buttons[type].classList.add('active');
        AudioEngine.startAmbient(type);
    }
}

// ========================================
// SETTINGS
// ========================================
function updateDurationDisplay() {
    DOM.valPomodoro.textContent = AppState.durations.pomodoro;
    DOM.valShortBreak.textContent = AppState.durations.shortBreak;
    DOM.valLongBreak.textContent = AppState.durations.longBreak;
}

function changeDuration(setting, direction) {
    const current = AppState.durations[setting];
    const min = setting === 'pomodoro' ? 1 : 1;
    const max = setting === 'pomodoro' ? 60 : 30;
    const newValue = Math.max(min, Math.min(max, current + direction));

    AppState.durations[setting] = newValue;
    updateDurationDisplay();

    // If timer is not running, update current time
    if (!AppState.isRunning && !AppState.isPaused) {
        if (AppState.mode === setting) {
            AppState.totalTime = newValue * 60;
            AppState.timeLeft = AppState.totalTime;
            updateTimerDisplay();
            updateRingProgress();
        }
    }

    Storage.save();
}

function openSettings() {
    Swal.fire({
        title: '<i class="uil uil-setting"></i> الإعدادات',
        html: `
            <div class="settings-body" style="text-align: right; direction: rtl; padding: 0;">
                <div class="settings-section">
                    <h3>مدد المؤقت</h3>
                    <div class="settings-row">
                        <label>مدة التركيز</label>
                        <div class="settings-input-group">
                            <input type="number" id="swalPomodoro" min="1" max="60" value="${AppState.durations.pomodoro}">
                            <span>د</span>
                        </div>
                    </div>
                    <div class="settings-row">
                        <label>استراحة قصيرة</label>
                        <div class="settings-input-group">
                            <input type="number" id="swalShortBreak" min="1" max="30" value="${AppState.durations.shortBreak}">
                            <span>د</span>
                        </div>
                    </div>
                    <div class="settings-row">
                        <label>استراحة طويلة</label>
                        <div class="settings-input-group">
                            <input type="number" id="swalLongBreak" min="1" max="60" value="${AppState.durations.longBreak}">
                            <span>د</span>
                        </div>
                    </div>
                </div>
                <div class="settings-section">
                    <h3>التفضيلات</h3>
                    <div class="settings-row">
                        <label>بدء الاستراحة تلقائياً</label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="swalAutoStartBreak" ${AppState.autoStartBreak ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="settings-row">
                        <label>بدء التركيز تلقائياً</label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="swalAutoStartFocus" ${AppState.autoStartFocus ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="settings-row">
                        <label>مستوى الصوت</label>
                        <input type="range" id="swalVolume" min="0" max="100" value="${AppState.volume}" class="settings-range">
                    </div>
                </div>
                <div class="settings-section" style="margin-bottom: 0;">
                    <h3>البيانات</h3>
                    <button class="settings-danger-btn" id="swalBtnResetData" type="button">
                        <i class="uil uil-trash-alt"></i> إعادة تعيين جميع البيانات
                    </button>
                </div>
            </div>
        `,
        customClass: {
            popup: 'swal-settings-popup',
            confirmButton: 'swal-confirm-focus',
            cancelButton: 'swal-cancel-btn'
        },
        showCancelButton: true,
        confirmButtonText: 'حفظ التغييرات',
        cancelButtonText: 'إلغاء',
        buttonsStyling: false,
        didOpen: () => {
            const btnReset = document.getElementById('swalBtnResetData');
            btnReset.addEventListener('click', resetAllData);
        },
        preConfirm: () => {
            const pomodoro = parseInt(document.getElementById('swalPomodoro').value) || 25;
            const shortBreak = parseInt(document.getElementById('swalShortBreak').value) || 5;
            const longBreak = parseInt(document.getElementById('swalLongBreak').value) || 15;
            const autoStartBreak = document.getElementById('swalAutoStartBreak').checked;
            const autoStartFocus = document.getElementById('swalAutoStartFocus').checked;
            const volume = parseInt(document.getElementById('swalVolume').value) || 50;
            
            return { pomodoro, shortBreak, longBreak, autoStartBreak, autoStartFocus, volume };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            saveSettings(result.value);
        }
    });
}

function saveSettings(values) {
    AppState.durations.pomodoro = Math.max(1, Math.min(60, values.pomodoro));
    AppState.durations.shortBreak = Math.max(1, Math.min(30, values.shortBreak));
    AppState.durations.longBreak = Math.max(1, Math.min(60, values.longBreak));

    AppState.autoStartBreak = values.autoStartBreak;
    AppState.autoStartFocus = values.autoStartFocus;
    AppState.volume = values.volume;

    updateDurationDisplay();

    // Update current timer if not running
    if (!AppState.isRunning && !AppState.isPaused) {
        AppState.totalTime = AppState.durations[AppState.mode] * 60;
        AppState.timeLeft = AppState.totalTime;
        updateTimerDisplay();
        updateRingProgress();
    }

    // Update ambient volume
    AudioEngine.updateAmbientVolume();

    Storage.save();
}

function resetAllData() {
    // Close the settings modal first
    Swal.close();

    Swal.fire({
        customClass: {
            popup: 'swal-danger-popup',
            confirmButton: 'swal-confirm-danger',
            cancelButton: 'swal-cancel-btn'
        },
        icon: 'warning',
        title: 'إعادة تعيين البيانات',
        html: `
            <div style="text-align:center;">
                <p style="color:var(--text-secondary); font-family:'Cairo','Tajawal',sans-serif; font-size:0.875rem; line-height:1.7;">
                    هل أنت متأكد أنك تريد إعادة تعيين جميع البيانات؟<br>
                    <strong style="color:var(--accent-rose);">لا يمكن التراجع عن هذه العملية.</strong>
                </p>
            </div>
        `,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'نعم، إعادة التعيين',
        cancelButtonText: 'إلغاء',
        buttonsStyling: false,
        reverseButtons: false,
    }).then((result) => {
        if (result.isConfirmed) {
            Storage.clear();

            AppState.durations = { pomodoro: 25, shortBreak: 5, longBreak: 15 };
            AppState.completedSessions = 0;
            AppState.totalFocusMinutes = 0;
            AppState.tasks = [];
            AppState.nextTaskId = 1;
            AppState.soundEnabled = true;
            AppState.notificationsEnabled = false;
            AppState.autoStartBreak = false;
            AppState.autoStartFocus = false;
            AppState.volume = 50;
            AppState.streak = 0;
            AppState.tasksCompleted = 0;
            AppState.currentSession = 1;

            resetTimer();
            setMode('pomodoro');
            updateDurationDisplay();
            renderTasks();
            updateStats();
            initSessionDots();

            DOM.soundToggle.checked = true;
            DOM.notifToggle.checked = false;
            DOM.volumeSlider.value = 50;

            Storage.save();

            Swal.fire({
                customClass: { popup: 'swal-focus-popup', confirmButton: 'swal-confirm-focus' },
                icon: 'success',
                title: 'تمت إعادة التعيين',
                html: `<div style="text-align:center;"><p style="color:var(--text-secondary);font-family:'Cairo','Tajawal',sans-serif;">تمت إعادة تعيين جميع البيانات بنجاح.</p></div>`,
                showConfirmButton: false,
                timer: 2000,
                buttonsStyling: false
            });
        } else {
            // Re-open settings if cancelled
            openSettings();
        }
    });
}



// ========================================
// PARTICLES
// ========================================
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${15 + Math.random() * 20}s`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.opacity = `${0.1 + Math.random() * 0.3}`;

        const size = 2 + Math.random() * 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        container.appendChild(particle);
    }
}

// ========================================
// NOTIFICATIONS
// ========================================
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            AppState.notificationsEnabled = permission === 'granted';
            DOM.notifToggle.checked = AppState.notificationsEnabled;
            Storage.save();
        });
    }
}

// ========================================
// EVENT LISTENERS
// ========================================
function bindEvents() {
    // Theme
    DOM.themeToggle.addEventListener('click', toggleTheme);

    // Focus mode
    DOM.focusToggle.addEventListener('click', toggleFocusMode);

    // Settings
    DOM.settingsToggle.addEventListener('click', openSettings);

    // Timer controls
    DOM.btnMain.addEventListener('click', handleMainButton);
    DOM.btnReset.addEventListener('click', resetTimer);
    DOM.btnSkip.addEventListener('click', skipTimer);

    // Mode tabs
    DOM.tabPomodoro.addEventListener('click', () => setMode('pomodoro'));
    DOM.tabShortBreak.addEventListener('click', () => setMode('shortBreak'));
    DOM.tabLongBreak.addEventListener('click', () => setMode('longBreak'));

    // Tasks
    DOM.taskAddBtn.addEventListener('click', addTask);
    DOM.taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Quote
    DOM.quoteRefresh.addEventListener('click', nextQuote);

    // Ambient
    DOM.btnRain.addEventListener('click', () => toggleAmbient('rain'));
    DOM.btnForest.addEventListener('click', () => toggleAmbient('forest'));
    DOM.btnCafe.addEventListener('click', () => toggleAmbient('cafe'));
    DOM.btnWaves.addEventListener('click', () => toggleAmbient('waves'));

    DOM.volumeSlider.addEventListener('input', (e) => {
        AppState.volume = parseInt(e.target.value);
        AudioEngine.updateAmbientVolume();
        Storage.save();
    });

    // Quick settings
    document.querySelectorAll('.setting-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const setting = btn.dataset.setting;
            const dir = parseInt(btn.dataset.dir);
            changeDuration(setting, dir);
        });
    });

    DOM.soundToggle.addEventListener('change', (e) => {
        AppState.soundEnabled = e.target.checked;
        Storage.save();
    });

    DOM.notifToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            requestNotificationPermission();
        } else {
            AppState.notificationsEnabled = false;
            Storage.save();
        }
    });



    // Focus exit button
    if (DOM.focusExitBtn) {
        DOM.focusExitBtn.addEventListener('click', toggleFocusMode);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Space to start/pause
        if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            handleMainButton();
        }
        // R to reset
        if (e.code === 'KeyR' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            resetTimer();
        }
        // Escape to close focus mode
        if (e.code === 'Escape') {
            if (AppState.focusMode) toggleFocusMode();
        }
    });
}

// ========================================
// INITIALIZATION
// ========================================
function init() {
    cacheDOM();
    Storage.load();

    // Apply theme
    applyTheme();

    // Initialize timer
    AppState.totalTime = AppState.durations.pomodoro * 60;
    AppState.timeLeft = AppState.totalTime;

    // Update UI
    updateTimerDisplay();
    updateRingProgress();
    updateTimerStatus();
    updateModeTabs();
    updateRingColors();
    updateDurationDisplay();
    updateStats();
    renderTasks();
    initSessionDots();
    loadQuote();

    // Set toggles
    DOM.soundToggle.checked = AppState.soundEnabled;
    DOM.notifToggle.checked = AppState.notificationsEnabled;
    DOM.volumeSlider.value = AppState.volume;

    // Start clock
    updateClock();
    setInterval(updateClock, 1000);

    // Create particles
    createParticles();

    // Check streak
    checkStreak();

    // Bind events
    bindEvents();

    // Save initial state
    Storage.save();

    console.log('تم تشغيل فوكس فلو بنجاح!');
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
