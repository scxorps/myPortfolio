"use strict";

// =============================
// Script principal (propre & unique)
// =============================

// Utilitaires
const $ = (sel, scope=document) => scope.querySelector(sel);
const $$ = (sel, scope=document) => Array.from(scope.querySelectorAll(sel));

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
    $$('video').forEach(v => {
        v.addEventListener('error', () => {
            const ph = document.createElement('div');
            ph.style.cssText='background:linear-gradient(135deg,var(--primary-color),var(--secondary-color));border-radius:10px;padding:40px 20px;color:#fff;font-size:1.1rem;text-align:center;max-width:200px;margin:0 auto;';
            ph.innerHTML='<i class="fa fa-video-camera" style="font-size:2rem;margin-bottom:10px;"></i><br>Demo Video';
            v.parentNode && v.parentNode.replaceChild(ph, v);
        });
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
                // Permettre le shine si on ouvre via le bouton d'en-tête (mobile)
                headerToggle.addEventListener('pointerdown', ()=>{ if(!root.classList.contains('open')) { allowShine(headerToggle); allowShine(mainLangBtn); } });
                headerToggle.addEventListener('click', (e)=>{ e.preventDefault(); if(root.classList.contains('open')) immediateClose(); else openMenu(); });
            }
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

// Écouteur redondant (sécurité) si le script est rechargé dynamiquement
const lateLangBtn = document.getElementById('langToggle');
if(lateLangBtn && !lateLangBtn.__hasLangHandler){
    const __hoverDesktopLate = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (__hoverDesktopLate) {
        lateLangBtn.addEventListener('click', cycleLang);
        lateLangBtn.__hasLangHandler = true;
    }
}
