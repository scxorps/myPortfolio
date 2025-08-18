"use strict";

// =============================
// Script principal (propre & unique)
// =============================

// Utilitaires
const $ = (sel, scope=document) => scope.querySelector(sel);
const $$ = (sel, scope=document) => Array.from(scope.querySelectorAll(sel));

// Resolve path to assets for both local server (/) and GitHub Pages (/myPortfolio/)
function assetsUrl(file) {
    try {
        const p = location.pathname || '';
        const base = p.indexOf('/myPortfolio/') !== -1 ? '/myPortfolio/' : '/';
        return base + 'assets/' + file;
    } catch(_) {
        return 'assets/' + file;
    }
}

// Détection légère d’environnement mobile/tactile
function isMobileLike(){
    try {
        const mm = window.matchMedia('(hover: none) and (pointer: coarse)');
        return (mm && mm.matches) || /Mobi|Android|iP(hone|ad|od)|Mobile/i.test(navigator.userAgent || '');
    } catch(_) {
        return false;
    }
}

// Détection du type de réseau (pour limiter le préchargement sur réseaux lents)
function isFastConnection(){
    try {
        const c = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
        if (!c || !c.effectiveType) return true; // suppose rapide si inconnu
        // considère 4g comme rapide, 3g/2g/slo-2g comme lent
        return String(c.effectiveType).toLowerCase() === '4g';
    } catch(_) { return true; }
}

// Prépare la source d'une vidéo sans la révéler ni afficher un loader
function primeVideoSource(vid){
    if (!vid) return;
    try {
        const source = vid.querySelector('source');
        const dataSrc = vid.getAttribute('data-src');
        if (!source || !dataSrc || vid.__primed) return;
        if (!source.getAttribute('src')) {
            source.setAttribute('src', dataSrc);
            // En mode prime, on garde data-src pour laisser la logique principale gérer la révélation
            try { vid.load(); } catch(_) {}
            vid.__primed = true;
        }
    } catch(_) {}
}

// Délais de repli pour masquer le loader si la lecture tarde
const LOADER_FALLBACK_MOBILE_MS = 900;
const LOADER_FALLBACK_DESKTOP_MS = 1600;

// Effet machine à écrire
function runTypewriter(el, segments, speed=120, pause=1800) {
    if (!el || !segments.length) return;
    let part = 0, idx = 0;
    function step() {
        const text = segments[part];
        if (idx < text.length) {
            el.textContent += text.charAt(idx++);
            setTimeout(step, speed);
        } else if (++part < segments.length) {
            setTimeout(()=>{ idx = 0; step(); }, pause);
        }
    }
    step();
}

// Tracker d'état du bouton "See projects"
function isSeeProjectsOpen(){
    const el = document.querySelector('.skip-link');
    return !!(el && el.classList.contains('show'));
}
function emitSeeProjectsState(open){
    try { document.dispatchEvent(new CustomEvent('skiplink:state', { detail: { open } })); } catch(_) {}
}

// Thème
// =============================
// Internationalisation simple (EN / FR / AR)
const I18N = {
    en: {
    'skip.projects': 'See projects',
    'hero.name': 'Mehadji Mohamed El Habib',
        'hero.greeting.prefix': 'Hi, my name is',
    'hero.type1': "I'm not famous",
    'hero.type2': ", Just Effective",
        'hero.knowMore': 'Know more',
        'about.title': 'About me',
        'about.p1': "Hi, I'm Mehadji Mohamed El Habib — a developer who thinks in logic and builds with purpose.\n                            I enjoy breaking down complex problems, finding solutions, and turning ideas into working systems.",
        'about.p2': "Let's build something smart together.",
        'about.resume': 'View Resume',
        'projects.title': 'Projects',
        'projects.source': 'Source Code',
        'projects.demio.desc': 'A smart tool for predicting and organizing the fight against tuberculosis. Demio is an AI-powered web app designed to help healthcare teams predict future TB outbreaks across regions.',
        'projects.dawra.desc': 'Dawra is a fresh idea of a trip app that I developed on my Flutter learning path. It presents traveling trips by categories, trips details, trips filtering and favorites section.',
        'projects.weatherly.desc': "A weather app that displays your position's weather condition, sunrise time, sunset time, max/min temp. This project showcases API integration, geolocation services, and responsive design.",
    'projects.handvolume.desc': 'Hand Gesture Volume Control – Real-time OpenCV & MediaPipe app: left-hand pinch enables control and right-hand pinch distance adjusts system volume via PyCaw, with visual feedback & FPS tracking.',
        'contact.title': 'Contact',
        'contact.p1': "I'm always up for smart projects, cool ideas, or interesting conversations.",
        'contact.p2': "Drop a message — let's make it happen.",
        'contact.email': 'Email Me',
        'contact.call': 'Call Me'
    ,'footer.rights': '© 2025 Mehadji Mohamed El Habib. All rights reserved.'
    ,'aria.themeToggle': 'Toggle dark mode'
    ,'aria.langToggle': 'Switch language'
    },
    fr: {
    'skip.projects': 'Voir les projets',
    'hero.name': 'Mehadji Mohamed El Habib',
        'hero.greeting.prefix': 'Salut, je suis',
    'hero.type1': 'Pas une star',
    'hero.type2': ', juste efficace',
        'hero.knowMore': 'En savoir plus',
        'about.title': 'À propos',
        'about.p1': "Salut, je suis Mehadji Mohamed El Habib — un développeur qui pense logiquement et construit avec intention.\nJ’aime décomposer les problèmes complexes, trouver des solutions et transformer les idées en systèmes fonctionnels.",
        'about.p2': 'Construisons quelque chose d’intelligent ensemble.',
        'about.resume': 'Voir le CV',
        'projects.title': 'Projets',
        'projects.source': 'Code Source',
        'projects.demio.desc': "Un outil intelligent pour prédire et organiser la lutte contre la tuberculose. Demio est une application web IA aidant les équipes de santé à anticiper les futures flambées.",
        'projects.dawra.desc': "Dawra est une idée d’application de voyage créée durant mon apprentissage Flutter : catégories, détails, filtres et favoris.",
        'projects.weatherly.desc': "Une application météo affichant les conditions locales, lever/coucher du soleil et températures min/max. Montre l’intégration d’API et la conception responsive.",
    'projects.handvolume.desc': "Contrôle du volume par gestes – Application temps réel OpenCV & MediaPipe : pincement main gauche active le mode contrôle, distance du pincement main droite ajuste le volume système via PyCaw, avec retour visuel et FPS.",
        'contact.title': 'Contact',
        'contact.p1': 'Ouvert aux projets intelligents, idées originales ou discussions intéressantes.',
        'contact.p2': 'Écris-moi — réalisons cela.',
        'contact.email': 'M’écrire',
        'contact.call': 'Appeler'
    ,'footer.rights': '© 2025 Mehadji Mohamed El Habib. Tous droits réservés.'
    ,'aria.themeToggle': 'Basculer mode sombre'
    ,'aria.langToggle': 'Changer la langue'
    },
    ar: {
    'skip.projects': 'اذهب إلى المشاريع',
    'hero.name': 'مهاجي محمد الحبيب',
        'hero.greeting.prefix': 'مرحباً، اسمي',
    'hero.type1': 'لست مشهوراً',
    'hero.type2': '، بل فعّال',
        'hero.knowMore': 'اعرف المزيد',
        'about.title': 'نبذة عني',
    'about.p1': 'مرحباً، أنا مهاجي محمد الحبيب — مطوّر يفكر بمنطق ويبني بهدف. أحب تفكيك المشكلات المعقدة وإيجاد الحلول وتحويل الأفكار إلى أنظمة عملية.',
        'about.p2': 'لنبنِ شيئاً ذكياً معاً.',
        'about.resume': 'عرض السيرة الذاتية',
        'projects.title': 'المشاريع',
        'projects.source': 'الكود المصدري',
        'projects.demio.desc': 'أداة ذكية للتنبؤ وتنظيم مكافحة السل. ديميو تطبيق ويب مدعوم بالذكاء الاصطناعي يساعد الفرق الطبية على توقع الفاشيات المستقبلية.',
        'projects.dawra.desc': 'دورة: فكرة تطبيق رحلات أنشأتها خلال تعلم Flutter — تصنيفات، تفاصيل، ترشيح، ومفضلة.',
        'projects.weatherly.desc': 'تطبيق طقس يعرض حالة موقعك، الشروق، الغروب، ودرجات الحرارة. مثال على تكامل API وتصميم متجاوب.',
    'projects.handvolume.desc': 'التحكّم في مستوى الصوت بإيماءات اليد – تطبيق آنٍ باستخدام OpenCV و MediaPipe: قرص (pince) اليد اليسرى يفعل التحكم و مسافة قرص اليد اليمنى تضبط مستوى الصوت عبر PyCaw مع عرض مرئي وتتبع عدد الإطارات.',
        'contact.title': 'تواصل',
        'contact.p1': 'دائماً متاح لمشاريع ذكية أو أفكار مميزة أو نقاشات مفيدة.',
        'contact.p2': 'راسلني — لنجعلها حقيقة.',
        'contact.email': 'أرسل رسالة',
        'contact.call': 'اتصل بي'
    ,'footer.rights': '© 2025 مهاجي محمد الحبيب. جميع الحقوق محفوظة.'
    ,'aria.themeToggle': 'تبديل الوضع الداكن'
    ,'aria.langToggle': 'تغيير اللغة'
    }
};
let currentLang = (localStorage.getItem('lang') || 'en').toLowerCase();
if(!['en','fr','ar'].includes(currentLang)) currentLang='en';
let typewriterToken = 0;
let projectSwiper = null; // Swiper instance (projects)
function startTypewriter(lang){
    const el = $('#typewriter');
    if(!el) return;
    const dict = I18N[lang] || I18N.en;
    const segs = [dict['hero.type1'] || "I'm not famous", dict['hero.type2'] || ", Just Effective"]; 
    const token = ++typewriterToken;
    const typeSpeed = 120;
    const midPause = 1800; // pause entre les deux segments
    const loopDelay = 5000; // redémarrage toutes les 5s après la fin
    el.textContent = '';
    (function run(idxPart=0, idxChar=0){
        if(token !== typewriterToken) return; // abort si une nouvelle langue a été choisie
        const part = segs[idxPart];
        if(idxChar < part.length){
            el.textContent += part.charAt(idxChar);
            setTimeout(()=>run(idxPart, idxChar+1), typeSpeed);
        } else if(idxPart+1 < segs.length){
            setTimeout(()=>run(idxPart+1, 0), midPause);
        } else {
            // boucle: attendre loopDelay puis recommencer (si pas annulé)
            setTimeout(()=>{
                if(token !== typewriterToken) return;
                el.textContent='';
                run(0,0);
            }, loopDelay);
        }
    })();
}
function applyLang(lang){
    // Ancre scroll au centre du viewport pour conserver strictement la position
    const cx = Math.floor(window.innerWidth/2);
    const cy = Math.floor(window.innerHeight/2);
    let anchor = document.elementFromPoint(cx, cy);
    while (anchor && (anchor === document.body || anchor === document.documentElement)) anchor = anchor.parentElement;
    const anchorTop = anchor ? anchor.getBoundingClientRect().top : null;
    const prevDocSb = document.documentElement.style.scrollBehavior;
    const prevBodySb = document.body.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';

    const dict = I18N[lang] || I18N.en;
    document.documentElement.setAttribute('lang', lang);
    // Direction RTL pour l'arabe
    if(lang === 'ar') document.documentElement.setAttribute('dir','rtl');
    else document.documentElement.removeAttribute('dir');
    $$('[data-i18n]').forEach(el=>{
        const key = el.getAttribute('data-i18n');
        if(dict[key]) el.textContent = dict[key];
    });
    // Fixe la direction sur le conteneur Swiper aussi (certains moteurs Swiper la lisent directement)
    const swiperEl = document.querySelector('.projects-swiper');
    if (swiperEl) swiperEl.setAttribute('dir', (lang === 'ar') ? 'rtl' : 'ltr');
    // Attributs i18n (aria-label / title)
    $$('[data-i18n-aria-label]').forEach(el=>{
        const key = el.getAttribute('data-i18n-aria-label');
        if(dict[key]) el.setAttribute('aria-label', dict[key]);
    });
    $$('[data-i18n-title]').forEach(el=>{
        const key = el.getAttribute('data-i18n-title');
        if(dict[key]) el.setAttribute('title', dict[key]);
    });
    const badge = $('#langCode');
    if(badge) badge.textContent = lang.toUpperCase();
    localStorage.setItem('lang', lang);
    currentLang = lang;
    // Masquer l'option courante
    $$('.lang-option').forEach(opt=>{
        const l = opt.getAttribute('data-lang');
        if(l === currentLang) opt.classList.add('hidden'); else opt.classList.remove('hidden');
    });
    // Si le menu est ouvert, réapplique les délais séquentiels (fonction locale définie plus bas au démarrage)
    try {
        const root = document.querySelector('.lang-bubbles.open .lang-options');
        if(root){
            document.dispatchEvent(new CustomEvent('langOptionsChanged'));
        }
    } catch(_){ }
    startTypewriter(lang);

    // Mettre à jour Swiper (re-init pour prendre en compte RTL)
    try {
        const el = document.querySelector('.projects-swiper');
        if (el && projectSwiper) {
            const idx = typeof projectSwiper.activeIndex === 'number' ? projectSwiper.activeIndex : 0;
            try { projectSwiper.destroy(true, true); } catch(_) {}
            projectSwiper = null;
            el.__swiperInited = false;
            initProjectsSlider(idx);
            // Réattacher les observers vidéo pour les slides non encore vus
            initVideos();
        }
    } catch(_) {}

    // Corrections de scroll (immédiate + différées) pour compenser les reflows
    const correct = ()=>{
        if(!anchor || anchorTop == null) return;
        const newTop = anchor.getBoundingClientRect().top;
        const delta = newTop - anchorTop;
        if (delta) window.scrollBy({ top: delta, behavior: 'auto' });
    };
    requestAnimationFrame(()=>{
        correct();
        setTimeout(correct, 70);
        setTimeout(correct, 160);
        setTimeout(()=>{
            document.documentElement.style.scrollBehavior = prevDocSb || '';
            document.body.style.scrollBehavior = prevBodySb || '';
        }, 200);
    });

    // En dernier: s'assurer que la vidéo du slide actif est bien chargée si visible
    revealVisibleVideos();
}
function cycleLang(){
    const order = ['en','fr','ar'];
    let idx = order.indexOf(currentLang);
    if(idx === -1){ idx = 0; currentLang='en'; }
    const next = order[(idx+1)%order.length];
    applyLang(next);
}
function applyTheme(mode) {
    const body = document.body;
    const sun = $('.sun-icon');
    const moon = $('.moon-icon');
    const dark = mode === 'dark';
    if (dark) body.setAttribute('data-theme','dark'); else body.removeAttribute('data-theme');
    if (sun) sun.style.display = dark ? 'none':'block';
    if (moon) moon.style.display = dark ? 'block':'none';
}
function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) applyTheme(saved);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark');
    else applyTheme('light');
    try {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) applyTheme(e.matches ? 'dark':'light');
        });
    } catch(_) {}
}
function toggleTheme() {
    const body = document.body;
    const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    // Ajoute une classe de transition si pas déjà présente
    if (!body.classList.contains('theme-transition')) {
        body.classList.add('theme-transition');
    // Retire la classe après la durée unique (.5s) + marge sécurité
    setTimeout(() => body.classList.remove('theme-transition'), 600);
    }
    applyTheme(next);
    localStorage.setItem('theme', next);
}

// Scroll flag
function initScrollFlag() {
    let ticking = false;
    function update() {
        if (window.scrollY > 50) document.body.classList.add('scrolled');
        else document.body.classList.remove('scrolled');
        ticking = false;
    }
    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive:true });
    update();
}

// Liens ancre
function initAnchors() {
    $$('a[href^="#"]:not(.skip-link)').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            if (!id || id === '#') return;
            const target = $(id);
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth' }); }
        });
    });
}

// Vidéos fallback
function initVideos() {
    const videos = $$('video');
    // Marquer la 1ère vidéo du carrousel pour supprimer le loader et garantir l'autoplay sans icônes
    try {
        const firstVid = document.querySelector('.projects-swiper .swiper-slide:first-child video');
        if (firstVid) {
            firstVid.__noLoader = true;
            firstVid.setAttribute('data-no-loader','');
            firstVid.__isFirstProjectVideo = true;
            firstVid.setAttribute('data-first-video','');
        }
    } catch(_) {}
    // Attach error placeholders
    videos.forEach(v => {
        v.addEventListener('error', () => {
            const ph = document.createElement('div');
            ph.style.cssText='background:linear-gradient(135deg,var(--primary-color),var(--secondary-color));border-radius:10px;padding:40px 20px;color:#fff;font-size:1.1rem;text-align:center;max-width:200px;margin:0 auto;';
            ph.innerHTML='<i class="fa fa-video-camera" style="font-size:2rem;margin-bottom:10px;"></i><br>Demo Video';
            v.parentNode && v.parentNode.replaceChild(ph, v);
        });
    });

    // Lazy-load sources when in view
    const tryAutoPlay = (vid, attempts=6)=>{
        try {
            // Ensure autoplay-friendly settings
            vid.muted = true;
            vid.setAttribute('muted','');
            vid.playsInline = true;
            vid.setAttribute('playsinline','');
            vid.setAttribute('webkit-playsinline','');
            vid.setAttribute('autoplay','');
            try { vid.preload = 'auto'; vid.setAttribute('preload','auto'); } catch(_) {}
            vid.removeAttribute('controls');
            vid.setAttribute('controlsList', 'nodownload noplaybackrate nofullscreen noremoteplayback');
            const p = vid.play();
            if (p && typeof p.catch === 'function') {
                p.catch(()=>{
                    if (attempts > 0) setTimeout(()=>tryAutoPlay(vid, attempts-1), 180);
                });
            }
        } catch(_) {}
    };

    const loadVideo = (vid)=>{
        try {
            const src = vid.getAttribute('data-src');
            if (!src) return;
            const source = vid.querySelector('source');
            if (source && !source.getAttribute('src')) {
                source.setAttribute('src', src);
                try { vid.preload = 'auto'; vid.setAttribute('preload','auto'); } catch(_) {}
                vid.load();
            }
            // force autoplay muted inline
            tryAutoPlay(vid, 4);
            // Mark as loaded to avoid rework
            vid.removeAttribute('data-src');
        } catch(_) {}
    };

    // Forcer la lecture avec plusieurs tentatives et callbacks media
    const forcePlayNow = (vid, maxRetries=10, intervalMs=140)=>{
        if (!vid) return;
        try {
            vid.muted = true; vid.setAttribute('muted','');
            vid.playsInline = true; vid.setAttribute('playsinline',''); vid.setAttribute('webkit-playsinline','');
            vid.setAttribute('autoplay','');
            vid.removeAttribute('controls'); vid.setAttribute('controlsList', 'nodownload noplaybackrate nofullscreen noremoteplayback');
            // Révéler
            try { vid.classList.remove('video-hidden'); } catch(_) {}
            // Tentative immédiate
            let attempts = 0;
            const tryOnce = () => {
                attempts++;
                let p;
                try { p = vid.play(); } catch(_) { p = null; }
                if (p && typeof p.catch === 'function') {
                    p.catch(()=>{
                        if (attempts < maxRetries) setTimeout(tryOnce, intervalMs);
                    });
                } else {
                    // Pas de promesse: recheck état
                    if ((vid.paused || vid.readyState < 2) && attempts < maxRetries) setTimeout(tryOnce, intervalMs);
                }
            };
            // Évènements media aident à déclencher
            const onReady = ()=>{ tryOnce(); };
            try {
                vid.addEventListener('loadeddata', onReady, { once:true });
                vid.addEventListener('canplay', onReady, { once:true });
                vid.addEventListener('canplaythrough', onReady, { once:true });
                vid.addEventListener('loadedmetadata', onReady, { once:true });
            } catch(_) {}
            // Démarre la boucle
            tryOnce();
        } catch(_) {}
    };

    const isVideoPlaying = (vid)=>{
        try { return vid && !vid.paused && !vid.ended && vid.readyState > 2; } catch(_) { return false; }
    };

    const ensureLoader = (vid)=>{
        // Supprimer le loader pour les vidéos marquées no-loader
        try { if (vid && (vid.__noLoader || vid.hasAttribute('data-no-loader'))) { hideLoader(vid); return null; } } catch(_) {}
        // n'affiche le loader que si la vidéo n'est pas en lecture
        try { if (isVideoPlaying(vid)) { hideLoader(vid); return null; } } catch(_) {}
        const wrap = vid.closest('.video-frame') || vid.closest('.project-wrapper__image');
        if (!wrap) return null;
        const badge = wrap.querySelector('.video-loader');
        if (!badge) return null;
        badge.style.display = 'flex';
        if (!badge.__lottie && window.lottie) {
            try { badge.__lottie = window.lottie.loadAnimation({ container: badge, renderer: 'svg', loop: true, autoplay: true, path: assetsUrl('Loading.json') }); } catch(_) {}
        }
        return badge;
    };
    const hideLoader = (vid)=>{
        const wrap = vid.closest('.video-frame') || vid.closest('.project-wrapper__image');
        if (!wrap) return;
        const badge = wrap.querySelector('.video-loader');
        if (badge) {
            badge.style.display = 'none';
            if (badge.__lottie) { try { badge.__lottie.destroy(); } catch(_) {} badge.__lottie = null; }
        }
    };
    const scheduleLoaderIfStuck = (vid, delayMs)=>{
        try { if (vid.__stuckTimer) { clearTimeout(vid.__stuckTimer); } } catch(_) {}
        // Ne jamais montrer de loader pour les vidéos no-loader
        try { if (vid && (vid.__noLoader || vid.hasAttribute('data-no-loader'))) { return; } } catch(_) {}
        vid.__stuckTimer = setTimeout(()=>{
            try {
                const stuck = vid.paused || vid.readyState < 2;
                if (stuck) ensureLoader(vid); else hideLoader(vid);
            } catch(_) {}
        }, Math.max(120, delayMs || (isMobileLike() ? 240 : 500)));
    };

    if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const vid = entry.target;
            // Si déjà en lecture, ne pas montrer le loader et ne pas reprocess
            try { if (!vid.paused && !vid.ended && vid.readyState > 2) { hideLoader(vid); vid.classList.remove('video-hidden'); obs.unobserve(entry.target); return; } } catch(_) {}
                    // Révéler immédiatement, tenter la lecture, et n'afficher le loader que si bloqué
            const cleanup = ()=>{
                        try {
                            vid.removeEventListener('playing', onPlaying);
                            vid.removeEventListener('loadeddata', onLoaded);
                            vid.removeEventListener('canplay', onLoaded);
                vid.removeEventListener('canplaythrough', onLoaded);
                vid.removeEventListener('loadedmetadata', onLoaded);
                            vid.removeEventListener('waiting', onWaiting);
                            vid.removeEventListener('stalled', onWaiting);
                        } catch(_) {}
                        if (vid.__loaderTimer) { clearTimeout(vid.__loaderTimer); vid.__loaderTimer = null; }
                        if (vid.__stuckTimer) { clearTimeout(vid.__stuckTimer); vid.__stuckTimer = null; }
                    };
                    const reveal = ()=>{
                        hideLoader(vid);
                        vid.classList.remove('video-hidden');
                    };
                    const onLoaded = ()=>{ reveal(); cleanup(); };
                    const onPlaying = ()=>{ reveal(); cleanup(); };
                    const onWaiting = ()=>{ if (!(vid && (vid.__noLoader || vid.hasAttribute('data-no-loader')))) ensureLoader(vid); };
                    vid.addEventListener('loadeddata', onLoaded, { once:true });
                    vid.addEventListener('canplay', onLoaded, { once:true });
                    vid.addEventListener('canplaythrough', onLoaded, { once:true });
                    vid.addEventListener('loadedmetadata', onLoaded, { once:true });
                    vid.addEventListener('playing', onPlaying, { once:false });
                    vid.addEventListener('waiting', onWaiting);
                    vid.addEventListener('stalled', onWaiting);
                    // Fallback: afficher le loader seulement si la lecture tarde
                    if (!(vid && (vid.__noLoader || vid.hasAttribute('data-no-loader')))) scheduleLoaderIfStuck(vid, isMobileLike() ? 240 : 500);
                    loadVideo(vid);
                    // Toujours tenter l’autoplay même si aucune data-src (déjà primée)
                    forcePlayNow(vid, 12, 120);
                    // Révéler tout de suite et tenter lecture
                    reveal();
                    obs.unobserve(entry.target);
                }
            });
    }, { rootMargin: (isMobileLike() ? '2000px 0px' : '600px 0px'), threshold: 0.01 });
        videos.forEach(v => {
            // Ne pas attacher l'IO générique à la 1ère vidéo; elle a un IO dédié avec seuil plus strict
            if (v && v.hasAttribute('data-first-video')) return;
            io.observe(v);
        });

        // Observer dédié pour la toute 1ère vidéo: seuil de visibilité plus élevé et jamais de loader
        try {
            const firstV = document.querySelector('.projects-swiper .swiper-slide:first-child video');
            if (firstV) {
        const firstIO = new IntersectionObserver((ents, ob) => {
                    ents.forEach(en => {
            if (en.isIntersecting && en.intersectionRatio >= 0.12) {
                            const v = en.target;
                            // Préparer la source si besoin
                            try {
                                const src = v.getAttribute('data-src');
                                if (src) {
                                    const s = v.querySelector('source');
                                    if (s && !s.getAttribute('src')) { s.setAttribute('src', src); try { v.preload='auto'; v.setAttribute('preload','auto'); } catch(_) {} v.load(); }
                                    try { v.removeAttribute('data-src'); } catch(_) {}
                                }
                            } catch(_) {}
                            // Forcer autoplay inline sans controls ni loader
                            try {
                v.__noLoader = true; v.setAttribute('data-no-loader','');
                forcePlayNow(v, 14, 110);
                                v.__firstPlayed = true; v.setAttribute('data-first-played','');
                            } catch(_) {}
                            ob.unobserve(v);
                        }
                    });
        }, { threshold: [0.12, 0.2, 0.35, 0.5], rootMargin: '0px' });
                firstIO.observe(firstV);
            }
        } catch(_) {}
    } else {
        // Fallback: eager load immediately
        videos.forEach(v => {
            // Traiter aussi les vidéos déjà primées (sans data-src)
                // pas de loader immédiat; on ne l'affichera que si bloqué
        const cleanup = ()=>{
                    try {
                        v.removeEventListener('playing', onPlaying);
                        v.removeEventListener('loadeddata', onLoaded);
                        v.removeEventListener('canplay', onLoaded);
            v.removeEventListener('canplaythrough', onLoaded);
            v.removeEventListener('loadedmetadata', onLoaded);
                        v.removeEventListener('waiting', onWaiting);
                        v.removeEventListener('stalled', onWaiting);
                    } catch(_) {}
                    if (v.__loaderTimer) { clearTimeout(v.__loaderTimer); v.__loaderTimer = null; }
                    if (v.__stuckTimer) { clearTimeout(v.__stuckTimer); v.__stuckTimer = null; }
                };
                const reveal = ()=>{ hideLoader(v); v.classList.remove('video-hidden'); };
                const onLoaded = ()=>{ reveal(); cleanup(); };
                const onPlaying = ()=>{ reveal(); cleanup(); };
                const onWaiting = ()=>{ if (!(v && (v.__noLoader || v.hasAttribute('data-no-loader')))) ensureLoader(v); };
                v.addEventListener('loadeddata', onLoaded, { once:true });
                v.addEventListener('canplay', onLoaded, { once:true });
                v.addEventListener('canplaythrough', onLoaded, { once:true });
                v.addEventListener('loadedmetadata', onLoaded, { once:true });
                v.addEventListener('playing', onPlaying, { once:false });
                v.addEventListener('waiting', onWaiting);
                v.addEventListener('stalled', onWaiting);
                if (!(v && (v.__noLoader || v.hasAttribute('data-no-loader')))) scheduleLoaderIfStuck(v, isMobileLike() ? 240 : 500);
                loadVideo(v);
                // Même sans data-src, tenter la lecture
                forcePlayNow(v, 12, 120);
                // Révélation immédiate et tentative de lecture
                reveal();
        });
    }
}

// Swiper init (carrousel de projets)
function initProjectsSlider(initialSlideIndex){
    if (!window.Swiper) return;
    const el = document.querySelector('.projects-swiper');
    if (!el) return;
    // Avoid double init
    if (el.__swiperInited && projectSwiper) return; el.__swiperInited = true;
    projectSwiper = new Swiper(el, {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: false,
        speed: 450,
    initialSlide: (typeof initialSlideIndex === 'number' ? initialSlideIndex : 0),
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        watchOverflow: true,
        keyboard: { enabled: true },
        mousewheel: { forceToAxis: true },
        pagination: { el: '.projects-swiper .swiper-pagination', clickable: true },
        navigation: { nextEl: '.projects-swiper .swiper-button-next', prevEl: '.projects-swiper .swiper-button-prev' },
        on: {
            init: function(){
                // Charger la vidéo du slide actif si nécessaire
                revealVisibleVideos();
                // Forcer la lecture immédiate sur le slide actif
                try {
                    const active = document.querySelector('.projects-swiper .swiper-slide-active video');
                    if (active) {
                        active.classList.remove('video-hidden');
                        active.muted = true; active.setAttribute('muted','');
                        active.playsInline = true; active.setAttribute('playsinline',''); active.setAttribute('webkit-playsinline','');
                        active.removeAttribute('controls'); active.setAttribute('controlsList','nodownload noplaybackrate nofullscreen noremoteplayback');
                        const p = active.play(); if (p && typeof p.catch === 'function') p.catch(()=>{});
                    }
                } catch(_) {}
                // Mobile: prime la source des slides voisins pour un démarrage plus rapide
                try {
                    if (isMobileLike() && isFastConnection()) {
                        const act = this.activeIndex || 0;
                        const slides = this.slides || [];
                        [act-2, act-1, act+1, act+2].forEach(i=>{
                            const s = slides[i];
                            if (!s) return;
                            const v = s.querySelector('video');
                            primeVideoSource(v);
                        });
                    }
                } catch(_) {}
            },
            slideChange: function(){
                try {
                    // Pause off-screen videos to save CPU
                    document.querySelectorAll('.projects-swiper video').forEach(v=>{ if (!v.closest('.swiper-slide-active')) { try{ v.pause(); }catch(_){ } } });
                } catch(_){}
                // S'assurer que la vidéo visible est chargée
                revealVisibleVideos();
                // Mobile: prime la vidéo du prochain slide (préparation discrète)
                try {
                    if (isMobileLike() && isFastConnection()) {
                        const act = (typeof this.activeIndex === 'number') ? this.activeIndex : 0;
                        const idxs = [act-2, act-1, act+1, act+2];
                        idxs.forEach(i => {
                            const sl = this.slides && this.slides[i];
                            if (!sl) return;
                            primeVideoSource(sl.querySelector('video'));
                        });
                    }
                } catch(_) {}
            },
            slideChangeTransitionEnd: function(){
                revealVisibleVideos();
                // Forcer l'autoplay direct du slide devenu actif
                try {
                    const active = document.querySelector('.projects-swiper .swiper-slide-active video');
                    if (active) {
                        active.classList.remove('video-hidden');
                        active.muted = true; active.setAttribute('muted','');
                        active.playsInline = true; active.setAttribute('playsinline',''); active.setAttribute('webkit-playsinline','');
                        active.removeAttribute('controls'); active.setAttribute('controlsList','nodownload noplaybackrate nofullscreen noremoteplayback');
                        const p = active.play(); if (p && typeof p.catch === 'function') p.catch(()=>{});
                    }
                } catch(_) {}
                },
            slideChangeTransitionStart: function(){
                // Pause agressive dès le début de la transition pour éviter lectures concurrentes
                try {
                    document.querySelectorAll('.projects-swiper video').forEach(v=>{ if (!v.closest('.swiper-slide-next') && !v.closest('.swiper-slide-active')) { try{ v.pause(); }catch(_){ } } });
                } catch(_){ }
                // Pré-démarrer la vidéo du prochain slide pour un autoplay instantané à l'arrivée
                try {
                    const nextSlide = document.querySelector('.projects-swiper .swiper-slide-next');
                    const prevSlide = document.querySelector('.projects-swiper .swiper-slide-prev');
                    const candidates = [nextSlide, prevSlide];
                    candidates.forEach(sl => {
                        const v = sl && sl.querySelector('video');
                        if (!v) return;
                        // Révéler visuellement et tenter lecture tout de suite
                        try { v.classList.remove('video-hidden'); } catch(_) {}
                        // Affecter la source si nécessaire
                        const src = v.getAttribute('data-src');
                        if (src) {
                            const source = v.querySelector('source');
                            if (source && !source.getAttribute('src')) { source.setAttribute('src', src); try { v.preload = 'auto'; v.setAttribute('preload','auto'); } catch(_) {} v.load(); }
                            try { v.removeAttribute('data-src'); } catch(_) {}
                        }
                        // Autoplay-friendly
                        v.muted = true; v.setAttribute('muted',''); v.playsInline = true; v.setAttribute('playsinline',''); v.setAttribute('webkit-playsinline',''); v.setAttribute('autoplay','');
                        v.removeAttribute('controls'); v.setAttribute('controlsList', 'nodownload noplaybackrate nofullscreen noremoteplayback');
                        try { const p = v.play(); if (p && typeof p.catch === 'function') p.catch(()=>{}); } catch(_) {}
                    });
                } catch(_) {}
            },
                resize: function(){
                    revealVisibleVideos();
            }
        }
    });
}

// Animations reveal
function initReveal() {
    const els = $$('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(el=>el.classList.add('active')); return; }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (!reduced) entry.target.style.transitionDelay = (Math.random()*150)+'ms';
                obs.unobserve(entry.target);
            }
        });
    }, { threshold:0.15, rootMargin:'0px 0px -10% 0px' });
    els.forEach(el => io.observe(el));
}

// Démarrage
document.addEventListener('DOMContentLoaded', () => {
    const container = $('#darkModeContainer');
    if (container) { container.style.display='block'; container.style.opacity='1'; }
    initTheme();
    applyLang(currentLang);
    initScrollFlag();
    initAnchors();
    initVideos();
    initReveal();
    initProjectsSlider();
    // Kickstart: lancer immédiatement (et dans la première seconde) les vidéos du slide actif et voisins
    try {
        const kick = () => {
            const slides = Array.from(document.querySelectorAll('.projects-swiper .swiper-slide'));
            if (!slides.length) return;
            // Trouver l’index actif si dispo
            let activeIdx = 0;
            const actEl = document.querySelector('.projects-swiper .swiper-slide-active');
            if (actEl) activeIdx = Math.max(0, slides.indexOf(actEl));
            const pickIdxs = new Set([activeIdx, activeIdx-1, activeIdx+1]);
            pickIdxs.forEach(i => {
                const sl = slides[i];
                if (!sl) return;
                const v = sl.querySelector('video');
                if (!v) return;
                // Ne pas déclencher la 1ère vidéo via kick tant que la section projects n’est pas visible
                if (v.hasAttribute('data-first-video')) return;
                // Assure la source et le preload
                const src = v.getAttribute('data-src');
                if (src) {
                    const s = v.querySelector('source');
                    if (s && !s.getAttribute('src')) { s.setAttribute('src', src); try { v.preload='auto'; v.setAttribute('preload','auto'); } catch(_) {} v.load(); }
                    try { v.removeAttribute('data-src'); } catch(_) {}
                }
                // Autoplay inline
                try {
                    v.muted = true; v.setAttribute('muted','');
                    v.playsInline = true; v.setAttribute('playsinline',''); v.setAttribute('webkit-playsinline',''); v.setAttribute('autoplay','');
                    v.removeAttribute('controls'); v.setAttribute('controlsList','nodownload noplaybackrate nofullscreen noremoteplayback');
                    v.classList.remove('video-hidden');
                    const p = v.play(); if (p && typeof p.catch === 'function') p.catch(()=>{});
                } catch(_) {}
            });
        };
        // Essai immédiat, puis une seconde plus tard pour couvrir les cas d’init Swiper/IO
        setTimeout(kick, 0);
        setTimeout(kick, 700);
    } catch(_) {}
    // Primer sans révélation la toute 1ère vidéo pour un démarrage instantané dès visibilité (même sur réseau lent)
    try {
        const firstV = document.querySelector('.projects-swiper .swiper-slide:first-child video');
        if (firstV) {
            const src = firstV.getAttribute('data-src');
            const s = firstV.querySelector('source');
            if (src && s && !s.getAttribute('src')) {
                s.setAttribute('src', src);
                try { firstV.preload = 'auto'; firstV.setAttribute('preload','auto'); } catch(_) {}
                try { firstV.load(); } catch(_) {}
                try { firstV.removeAttribute('data-src'); } catch(_) {}
            }
        }
    } catch(_) {}
    // Relance automatique dès que #projects entre dans le viewport
    try {
        const section = document.getElementById('projects');
        if (section && 'IntersectionObserver' in window) {
            const ioProj = new IntersectionObserver((entries, obs)=>{
                entries.forEach(ent=>{
                    if (ent.isIntersecting) {
                        // Force play du slide actif
                        try {
                            let active = document.querySelector('.projects-swiper .swiper-slide-active video');
                            // Si pour une raison quelconque le 1er slide n’est pas actif, cibler la 1ère vidéo
                            if (!active) active = document.querySelector('.projects-swiper .swiper-slide:first-child video');
                            if (active) {
                                active.classList.remove('video-hidden');
                                active.muted = true; active.setAttribute('muted','');
                                active.playsInline = true; active.setAttribute('playsinline',''); active.setAttribute('webkit-playsinline',''); active.setAttribute('autoplay','');
                                active.removeAttribute('controls'); active.setAttribute('controlsList','nodownload noplaybackrate nofullscreen noremoteplayback');
                                active.setAttribute('data-no-loader',''); active.__noLoader = true; // pas de loader pour la 1ère
                                const src = active.getAttribute('data-src');
                                if (src) {
                                    const s = active.querySelector('source');
                                    if (s && !s.getAttribute('src')) { s.setAttribute('src', src); try { active.preload='auto'; active.setAttribute('preload','auto'); } catch(_) {} active.load(); }
                                    try { active.removeAttribute('data-src'); } catch(_) {}
                                }
                                const p = active.play(); if (p && typeof p.catch === 'function') p.catch(()=>{});
                            }
                        } catch(_) {}
                        // Une fois relancé à l’entrée, on peut arrêter d’observer
                        obs.unobserve(section);
                    }
                });
            }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });
            ioProj.observe(section);
        }
    } catch(_) {}
    // Préchargement initial (mobile): précharge agressivement toutes les vidéos si connexion rapide (seulement quelques vidéos)
    try {
        if (isMobileLike() && isFastConnection()) {
            const vids = Array.from(document.querySelectorAll('.projects-swiper .swiper-slide video'));
            vids.forEach(v => {
                const src = v && v.getAttribute('data-src');
                if (!src) return;
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'video';
                link.href = src;
                link.type = 'video/mp4';
                document.head.appendChild(link);
                // Prime la source dans le tag video (sans révélation)
                primeVideoSource(v);
                // Conseille au navigateur de bufferiser
                try { v.preload = 'auto'; v.setAttribute('preload','auto'); } catch(_) {}
            });
        }
    } catch(_) {}
    // Effet machine à écrire géré par i18n dynamique uniquement
    startTypewriter(currentLang);
    const btn = $('#darkModeToggle');
    if (btn) btn.addEventListener('click', toggleTheme);
    const langBtn = $('#langToggle');
    const __hoverDesktop = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (langBtn && __hoverDesktop) langBtn.addEventListener('click', cycleLang);
    else if (!__hoverDesktop && langBtn) {
        // sur mobile: ce bouton n’alterne pas la langue, il ouvre/ferme les bulles (géré plus bas si présent)
    } else {
        document.addEventListener('click', (e)=>{ if(e.target && e.target.id==='langToggle' && __hoverDesktop) cycleLang(); });
    }

    // Nouveau menu bulles de langue
    const mainLangBtn = $('#langMain');
    const optionsWrap = $('.lang-options');
    if(mainLangBtn && optionsWrap){
        let closeTimer;
        const root = optionsWrap.closest('.lang-bubbles');
        const hoverCapable = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const touchLike = ('ontouchstart' in window) || (navigator.maxTouchPoints>0) || (navigator.msMaxTouchPoints>0);
    // Reset visuel du bouton: ramène taille/halo/bordure à l'état normal et neutralise le hover jusqu'à sortie du pointeur
        const resetBtnVisual = (btn)=>{
            if(!btn) return;
            // Supprime un éventuel état actif personnalisé
            btn.classList.remove('lang-btn-active');
            // Neutralise hover/active pour éviter l'effet zoom/halo résiduel
            btn.classList.add('suppress-hover');
            try { btn.blur(); } catch(_) {}
            // Forcer immédiatement un transform neutre (sécurité, en plus du CSS)
            btn.style.transform = 'none';
            // Désactive brièvement la transition pour éviter un flash
            const prev = btn.style.transition;
            btn.style.transition = 'none';
            // Reflow
            void btn.offsetHeight;
            btn.style.transition = prev;
            // En desktop, ne réactive le hover qu'après sortie du pointeur
            const onLeave = ()=>{ btn.classList.remove('suppress-hover'); btn.removeEventListener('mouseleave', onLeave); };
            btn.addEventListener('mouseleave', onLeave, { once:true });
            // En environnement tactile: retirer suppress-hover seulement au prochain touchstart en dehors du bouton (évite :hover sticky)
            if (!hoverCapable) {
                const onTouchStart = (ev)=>{
                    if (!btn.contains(ev.target)) {
                        btn.classList.remove('suppress-hover');
                        document.removeEventListener('touchstart', onTouchStart, true);
                    }
                };
                document.addEventListener('touchstart', onTouchStart, true);
            }
        };
    // Autoriser à nouveau le “shine” (retire suppress-hover) juste avant une nouvelle ouverture
    const allowShine = (btn)=>{ if(!btn) return; btn.classList.remove('suppress-hover'); btn.style.transform=''; };
        // Gestion du clic/tap extérieur (mobile & desktop) pour fermer
        let outsideAttached = false;
        const onOutside = (evt)=>{
            if(!root.classList.contains('open')) return;
            const t = evt.target;
            if (root.contains(t) || (mainLangBtn && mainLangBtn.contains(t))) return;
            immediateClose();
        };
        const attachOutside = ()=>{
            if(outsideAttached) return;
            document.addEventListener('click', onOutside, true);
            if(touchLike) document.addEventListener('touchstart', onOutside, { passive:true });
            outsideAttached = true;
        };
        const detachOutside = ()=>{
            if(!outsideAttached) return;
            document.removeEventListener('click', onOutside, true);
            if(touchLike) document.removeEventListener('touchstart', onOutside);
            outsideAttached = false;
        };
        // Calcule et applique des délais séquentiels uniquement sur les bulles visibles (non .hidden)
        const applySequentialDelays = ()=>{
            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const visibles = $$('.lang-option:not(.hidden)', optionsWrap);
            optionsWrap.setAttribute('data-count', visibles.length);
            const total = visibles.length;
            visibles.forEach((btn,i)=>{
                // i = 0 en haut, dernier = bas (proche bouton). On veut bas d'abord => delay 0 pour le dernier.
                const orderFromBottom = (total - 1 - i); // dernier => 0
                btn.style.transitionDelay = prefersReduced ? '0s' : (orderFromBottom * 0.12).toFixed(2)+'s';
            });
        };
        // Délais de fermeture: haut d'abord (i=0 => 0s) puis descend
        const applyClosingDelays = ()=>{
            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const visibles = $$('.lang-option:not(.hidden)', optionsWrap);
            visibles.forEach((btn,i)=>{
                btn.style.transitionDelay = prefersReduced ? '0s' : (i * 0.12).toFixed(2)+'s';
            });
        };
        const clearDelays = ()=>{ $$('.lang-option', optionsWrap).forEach(b=>{ b.style.transitionDelay=''; }); };
        const openMenu = ()=>{ if(root){ applySequentialDelays(); root.classList.add('open'); mainLangBtn.setAttribute('aria-expanded','true'); attachOutside(); } };
        const scheduleClose = ()=>{
            clearTimeout(closeTimer);
            // Fermeture après 1s sans survol ni focus
            closeTimer = setTimeout(()=>{
                // Vérifie si on survole encore une bulle ou le conteneur
                const hovered = document.querySelectorAll(':hover');
                let stillInside = false;
                hovered.forEach(h=>{ if(root.contains(h)) stillInside = true; });
                if(stillInside) { scheduleClose(); return; }
                if(root){
                    // Séquence de disparition (haut d'abord)
                    applyClosingDelays();
                    root.classList.add('closing');
                    // Retire la classe open pour déclencher l'opacité 1->0 après un tick
                    requestAnimationFrame(()=>{
                        root.classList.remove('open');
                        mainLangBtn.setAttribute('aria-expanded','false');
                        detachOutside();
                        // Reset visuel strictement identique au clic extérieur
                        resetBtnVisual(mainLangBtn);
                        const headerToggle = document.getElementById('langToggle');
                        if (headerToggle) resetBtnVisual(headerToggle);
                    });
                    // Nettoyage après durée max (delai dernier + transition .35s)
                    const visibles = $$('.lang-option:not(.hidden)', optionsWrap).length;
                    const maxDelay = (visibles-1)*0.12 + 0.35; // s
                    setTimeout(()=>{ root.classList.remove('closing'); clearDelays(); }, Math.ceil((maxDelay+0.15)*1000));
                }
            }, 200);
        };
        const immediateClose = ()=>{
            clearTimeout(closeTimer);
            if(root){
                // Fermeture en cascade top -> bas
                applyClosingDelays();
                root.classList.add('closing');
                requestAnimationFrame(()=>{
                    root.classList.remove('open');
                    mainLangBtn.setAttribute('aria-expanded','false');
                    detachOutside();
                    // Reset visuel strict: 2e clic = clic extérieur
                    resetBtnVisual(mainLangBtn);
                    const headerToggle = document.getElementById('langToggle');
                    if (headerToggle) resetBtnVisual(headerToggle);
                });
                const visibles = $$('.lang-option:not(.hidden)', optionsWrap).length;
                const maxDelay = (visibles-1)*0.12 + 0.35;
                setTimeout(()=>{ root.classList.remove('closing'); clearDelays(); }, Math.ceil((maxDelay+0.15)*1000));
            }
        };

    const cancelClose = ()=>{ clearTimeout(closeTimer); };
    if (hoverCapable) {
        root.addEventListener('mouseenter', ()=>{ cancelClose(); openMenu(); });
        root.addEventListener('mouseleave', ()=>{ scheduleClose(); });
        // Survol des bulles (délégation) pour empêcher fermeture
        optionsWrap.addEventListener('mouseenter', cancelClose, true);
        optionsWrap.addEventListener('mouseleave', ()=>{ scheduleClose(); }, true);
    }
    // Focus clavier dans une option garde ouvert
    root.addEventListener('focusin', ()=>{ cancelClose(); openMenu(); });
    root.addEventListener('focusout', ()=>{ scheduleClose(); });
    // Recalcule lorsqu'on reçoit l'événement custom (par applyLang)
    document.addEventListener('langOptionsChanged', ()=>{ if(root.classList.contains('open')) { applySequentialDelays(); } });

        optionsWrap.addEventListener('click', (e)=>{
            const btn = e.target.closest('.lang-option');
            if(!btn) return;
            const lang = btn.getAttribute('data-lang');
            if(lang && lang !== currentLang){
                applyLang(lang);
                // Recalcule les délais pour le nouvel ensemble si le menu reste ouvert
                requestAnimationFrame(()=>{ if(root.classList.contains('open')) applySequentialDelays(); });
            }
            immediateClose();
        });
        // ouvrir sur focus clavier
        mainLangBtn.addEventListener('focus', openMenu);
        mainLangBtn.addEventListener('blur', scheduleClose);
    // clic bouton principal: toggle (mobile/desktop)
    // Permettre le shine si on est en train d'ouvrir (3e clic et suivants)
    mainLangBtn.addEventListener('pointerdown', ()=>{ if(!root.classList.contains('open')) { allowShine(mainLangBtn); const headerToggle = document.getElementById('langToggle'); if(headerToggle) allowShine(headerToggle); } });
    mainLangBtn.addEventListener('click', (e)=>{
            e.preventDefault();
            if(root.classList.contains('open')) immediateClose(); else openMenu();
        });
        // sur mobile, #langToggle agit aussi comme toggle d’ouverture/fermeture
        if (!hoverCapable) {
            const headerToggle = document.getElementById('langToggle');
            if (headerToggle) {
                let tapLock = false; // anti double-événements (pointerdown + click)
                const safeOpenClose = (e)=>{
                    e && e.preventDefault();
                    if (tapLock) return;
                    tapLock = true;
                    if(root.classList.contains('open')) immediateClose(); else openMenu();
                    setTimeout(()=> tapLock = false, 300);
                };
                // Permettre le shine si on ouvre via le bouton d'en-tête (mobile)
                headerToggle.addEventListener('pointerdown', (e)=>{ if(!root.classList.contains('open')) { allowShine(headerToggle); allowShine(mainLangBtn); } safeOpenClose(e); });
                headerToggle.addEventListener('touchstart', (e)=>{ safeOpenClose(e); }, {passive:false});
                headerToggle.addEventListener('click', (e)=>{ safeOpenClose(e); });
            }
            // Sur certains navigateurs, capter pointerdown/touchstart sur le bouton principal aussi
            let mainTapLock = false;
            const safeToggleMain = (e)=>{
                e && e.preventDefault();
                if (mainTapLock) return;
                mainTapLock = true;
                if(root.classList.contains('open')) immediateClose(); else openMenu();
                setTimeout(()=> mainTapLock = false, 300);
            };
            mainLangBtn.addEventListener('pointerdown', safeToggleMain);
            mainLangBtn.addEventListener('touchstart', safeToggleMain, {passive:false});
        }
        // Accessibilité clavier: Enter/Espace ouvre et Tab circule
        mainLangBtn.addEventListener('keydown', e=>{
            if(['Enter',' '].includes(e.key)){
                e.preventDefault();
                if(root.classList.contains('open')) immediateClose(); else openMenu();
            } else if(e.key==='Escape') {
                immediateClose();
            }
        });
    }

    // Gestion skip-link: apparition au survol + persistance temporaire
    const skip = document.querySelector('.skip-link');
    if (skip) {
        let hideTimer;
    let openedFully = false; // vrai uniquement quand l'ouverture est terminée
    let tapCount = 0; // compteur de taps (mobile)
    let lastOpenedAt = 0; // timestamp de l'ouverture
        const OPEN_FALLBACK_MS = 350; // repli si pas d'événement CSS
    const SECOND_TAP_MIN_DELAY = 250; // ms avant d'accepter le 2e tap (anti double-clic synthétique)
        const show = () => {
            clearTimeout(hideTimer);
            if(!skip.classList.contains('show')){
                skip.classList.add('show');
                emitSeeProjectsState(true);
                // Marque comme non encore totalement ouvert
                openedFully = false;
        lastOpenedAt = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
                let done = false;
                const onEnd = (ev)=>{
                    if(done) return;
                    // Valide si on est toujours en état "show"
                    if(skip.classList.contains('show')){
                        openedFully = true;
                    }
                    done = true;
                    skip.removeEventListener('transitionend', onEnd);
                };
                // Écoute l'animation/transition d'ouverture; repli par timeout
                try { skip.addEventListener('transitionend', onEnd, { once:false }); } catch(_) {}
                setTimeout(()=> onEnd(), OPEN_FALLBACK_MS);
            }
        };
        const scheduleHide = () => {
            clearTimeout(hideTimer);
            hideTimer = setTimeout(()=> {
                if(skip.classList.contains('show')){
                    skip.classList.remove('show');
                    emitSeeProjectsState(false);
                    openedFully = false;
                    tapCount = 0;
            lastOpenedAt = 0;
                }
            }, 3000);
        };
        const isHoverCapable = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (isHoverCapable) {
            // Desktop: survol/blur ouvrent/ferment avec un petit délai
            skip.addEventListener('mouseenter', show);
            skip.addEventListener('mouseleave', () => {
                // fermeture douce en 200ms
                clearTimeout(hideTimer);
                hideTimer = setTimeout(()=>{
                    if(skip.classList.contains('show')){
                        skip.classList.remove('show');
                        emitSeeProjectsState(false);
                        openedFully = false;
                        tapCount = 0;
                        lastOpenedAt = 0;
                    }
                }, 200);
            });
            skip.addEventListener('focus', show);
            skip.addEventListener('blur', () => {
                clearTimeout(hideTimer);
                hideTimer = setTimeout(()=>{
                    if(skip.classList.contains('show')){
                        skip.classList.remove('show');
                        emitSeeProjectsState(false);
                        openedFully = false;
                        tapCount = 0;
                        lastOpenedAt = 0;
                    }
                }, 200);
            });
        }

        // Comportement spécial appareils tactiles : 1er tap révèle, 2e tap scrolle
        const isTouchCapable = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
        if (isTouchCapable) {
            const EXTRA_SCROLL_OFFSET_MOBILE = 80; // px: aller un peu plus bas que le début de section
            skip.addEventListener('click', (e) => {
        if (!skip.classList.contains('show')) {
                    e.preventDefault();
                    show();
            tapCount = 1; // 1er tap
                    clearTimeout(hideTimer);
                    hideTimer = setTimeout(()=> {
                        if(skip.classList.contains('show')){
                            skip.classList.remove('show');
                            emitSeeProjectsState(false);
                            openedFully = false;
                tapCount = 0;
                            lastOpenedAt = 0;
                        }
                    }, 5000);
                    return;
                }
                // 2e tap: ne scrolle que si complètement ouvert
                e.preventDefault();
                // Anti double-clic synthétique juste après l'ouverture
                const nowTs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
                if (nowTs - (lastOpenedAt || 0) < SECOND_TAP_MIN_DELAY) {
                    return;
                }
                if (!openedFully) {
                    // Ignore le tap tant que l'ouverture n'est pas finie
                    return;
                }
                if (tapCount < 1) { tapCount = 1; return; }
                const target = document.getElementById('projects');
                if (target) {
                    const rect = target.getBoundingClientRect();
                    const y = rect.top + window.pageYOffset + EXTRA_SCROLL_OFFSET_MOBILE;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
                setTimeout(()=> {
                    if(skip.classList.contains('show')){
                        skip.classList.remove('show');
                        emitSeeProjectsState(false);
                        openedFully = false;
            tapCount = 0;
                        lastOpenedAt = 0;
                    }
                }, 1500);
            }, { passive: false });

            // Touch en dehors ferme le lien si affiché
        document.addEventListener('touchstart', (evt)=>{
                if (!skip.classList.contains('show')) return;
                if (!skip.contains(evt.target)){
                    skip.classList.remove('show');
                    emitSeeProjectsState(false);
            openedFully = false;
                    tapCount = 0;
                    lastOpenedAt = 0;
                }
            }, {passive:true});
        }
    }
});

// Fin

// Helper: forcer le chargement des vidéos réellement visibles (slide actif)
function revealVisibleVideos(){
    try {
        const vids = document.querySelectorAll('.projects-swiper .swiper-slide-active video');
        vids.forEach(v => {
            if (!v) return;
            // Si la vidéo joue déjà, cacher toute trace de loader et sortir
            try {
                if (!v.paused && !v.ended && v.readyState > 2) {
                    const wrap0 = v.closest('.video-frame') || v.closest('.project-wrapper__image');
                    if (wrap0) {
                        const badge0 = wrap0.querySelector('.video-loader');
                        if (badge0) { badge0.style.display = 'none'; if (badge0.__lottie) { try { badge0.__lottie.destroy(); } catch(_) {} badge0.__lottie = null; } }
                    }
                    v.classList.remove('video-hidden');
                    return;
                }
            } catch(_) {}
            const needsLoad = v.hasAttribute('data-src');
            const isHidden = v.classList && v.classList.contains('video-hidden');
            if (needsLoad || isHidden) {
                // Révélation immédiate + listeners; n'affiche le loader que si bloqué
                (function prime(vid){
                    const wrap = vid.closest('.video-frame') || vid.closest('.project-wrapper__image');
                    const cleanup = ()=>{
                        try {
                            vid.removeEventListener('playing', onPlaying);
                            vid.removeEventListener('loadeddata', onLoaded);
                            vid.removeEventListener('canplay', onLoaded);
                            vid.removeEventListener('waiting', onWaiting);
                            vid.removeEventListener('stalled', onWaiting);
                        } catch(_) {}
                        if (vid.__loaderTimer) { clearTimeout(vid.__loaderTimer); vid.__loaderTimer = null; }
                        if (vid.__stuckTimer) { clearTimeout(vid.__stuckTimer); vid.__stuckTimer = null; }
                    };
                    const reveal = ()=>{
                        // Hide loader
                        const wrap2 = vid.closest('.video-frame') || vid.closest('.project-wrapper__image');
                        if (wrap2) {
                            const badge2 = wrap2.querySelector('.video-loader');
                            if (badge2) {
                                badge2.style.display = 'none';
                                if (badge2.__lottie) { try { badge2.__lottie.destroy(); } catch(_) {} badge2.__lottie = null; }
                            }
                        }
                        vid.classList.remove('video-hidden');
                    };
                    const onLoaded = ()=>{ reveal(); };
                    const onPlaying = ()=>{ reveal(); cleanup(); };
                    const onWaiting = ()=>{
                        // Afficher le loader si attente réseau
                        const ww = vid.closest('.video-frame') || vid.closest('.project-wrapper__image');
                        if (ww) {
                            const badge = ww.querySelector('.video-loader');
                            if (badge) {
                                badge.style.display = 'flex';
                                if (!badge.__lottie && window.lottie) { try { badge.__lottie = window.lottie.loadAnimation({ container: badge, renderer: 'svg', loop: true, autoplay: true, path: assetsUrl('Loading.json') }); } catch(_) {} }
                            }
                        }
                    };
                    vid.addEventListener('loadeddata', onLoaded, { once:true });
                    vid.addEventListener('canplay', onLoaded, { once:true });
                    vid.addEventListener('playing', onPlaying, { once:false });
                    vid.addEventListener('waiting', onWaiting);
                    vid.addEventListener('stalled', onWaiting);
                    // Assign source if needed
                    try {
                        const src = vid.getAttribute('data-src');
                        if (src) {
                            const source = vid.querySelector('source');
                            if (source && !source.getAttribute('src')) { source.setAttribute('src', src); vid.load(); }
                            // autoplay-friendly
                            vid.muted = true; vid.setAttribute('muted',''); vid.playsInline = true; vid.setAttribute('playsinline',''); vid.setAttribute('webkit-playsinline','');
                            vid.removeAttribute('controls'); vid.setAttribute('controlsList', 'nodownload noplaybackrate nofullscreen noremoteplayback');
                            const p = vid.play(); if (p && typeof p.catch === 'function') { p.catch(()=>{}); }
                            vid.removeAttribute('data-src');
                        } else {
                            // Même sans data-src, tenter la lecture quand le slide devient actif
                            try {
                                vid.muted = true; vid.setAttribute('muted',''); vid.playsInline = true; vid.setAttribute('playsinline',''); vid.setAttribute('webkit-playsinline','');
                                vid.removeAttribute('controls'); vid.setAttribute('controlsList', 'nodownload noplaybackrate nofullscreen noremoteplayback');
                                const p2 = vid.play(); if (p2 && typeof p2.catch === 'function') p2.catch(()=>{});
                            } catch(_) {}
                        }
                    } catch(_) {}
                    // Afficher le loader uniquement si bloqué
                    try { if (vid.__stuckTimer) clearTimeout(vid.__stuckTimer); } catch(_) {}
                    vid.__stuckTimer = setTimeout(()=>{
                        try { if (vid.paused || vid.readyState < 2) {
                            const ww = vid.closest('.video-frame') || vid.closest('.project-wrapper__image');
                            if (ww) {
                                const badge = ww.querySelector('.video-loader');
                                if (badge) { badge.style.display = 'flex'; if (!badge.__lottie && window.lottie) { try { badge.__lottie = window.lottie.loadAnimation({ container: badge, renderer: 'svg', loop: true, autoplay: true, path: assetsUrl('Loading.json') }); } catch(_) {} } }
                            }
                        } } catch(_) {}
                    }, isMobileLike() ? 350 : 500);
                    // Révélation immédiate
                    reveal();
                })(v);
            } else {
                // Cas: vidéo déjà chargée mais possiblement en pause -> jouer maintenant
                try {
                    const wrap = v.closest('.video-frame') || v.closest('.project-wrapper__image');
                    // Révéler immédiatement
                    if (wrap) {
                        const badge = wrap.querySelector('.video-loader');
                        if (badge) { badge.style.display = 'none'; if (badge.__lottie) { try { badge.__lottie.destroy(); } catch(_) {} badge.__lottie = null; } }
                    }
                    v.classList.remove('video-hidden');
                    v.muted = true; v.setAttribute('muted',''); v.playsInline = true; v.setAttribute('playsinline',''); v.setAttribute('webkit-playsinline','');
                    v.removeAttribute('controls'); v.setAttribute('controlsList', 'nodownload noplaybackrate nofullscreen noremoteplayback');
                    const p3 = v.play(); if (p3 && typeof p3.catch === 'function') p3.catch(()=>{});
                    // Afficher le loader uniquement si bloqué
                    try { if (v.__stuckTimer) clearTimeout(v.__stuckTimer); } catch(_) {}
                    v.__stuckTimer = setTimeout(()=>{
                        try { if (v.paused || v.readyState < 2) {
                            const ww = v.closest('.video-frame') || v.closest('.project-wrapper__image');
                            if (ww) {
                                const badge = ww.querySelector('.video-loader');
                                if (badge) { badge.style.display = 'flex'; if (!badge.__lottie && window.lottie) { try { badge.__lottie = window.lottie.loadAnimation({ container: badge, renderer: 'svg', loop: true, autoplay: true, path: assetsUrl('Loading.json') }); } catch(_) {} } }
                            }
                        } } catch(_) {}
                    }, isMobileLike() ? 350 : 500);
                } catch(_) {}
            }
        });
    } catch(_) {}
}

// Écouteur redondant (sécurité) si le script est rechargé dynamiquement
const lateLangBtn = document.getElementById('langToggle');
if(lateLangBtn && !lateLangBtn.__hasLangHandler){
    const __hoverDesktopLate = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (__hoverDesktopLate) {
        lateLangBtn.addEventListener('click', cycleLang);
        lateLangBtn.__hasLangHandler = true;
    }
}
