'use client';

import { useState, useEffect, useRef } from 'react';
import CurtainLoader, { getAlphabetStrokeWidth } from '@/components/CurtainLoader';
import ProjectCardCinematic from '@/components/ProjectCardCinematic';

// Mathematical helper to generate organic liquid teardrop bulge path along the pointer angle
function buildBulgePath(cx, cy, baseR, angleRad, bulgeAmt, pointsCount = 36) {
  const sigma = 0.58; // Angular spread of the bulge in radians (~33 deg)
  const pts = [];
  for (let i = 0; i < pointsCount; i++) {
    const theta = (i / pointsCount) * 2 * Math.PI;
    let diff = theta - angleRad;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;

    // Organic teardrop Gaussian bulge with slight elastic flank suction for volume balance
    const gauss = Math.exp(-(diff * diff) / (2 * sigma * sigma));
    const flankDiff = Math.abs(diff) - 1.25;
    const flank = Math.exp(-(flankDiff * flankDiff) / 0.35);
    const r = baseR + (bulgeAmt * gauss) - (bulgeAmt * 0.12 * flank);

    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    pts.push({ x, y });
  }

  // C1 continuous closed cubic bezier curve
  let d = 'M ' + pts[0].x.toFixed(4) + ' ' + pts[0].y.toFixed(4);
  for (let i = 0; i < pointsCount; i++) {
    const pPrev = pts[(i - 1 + pointsCount) % pointsCount];
    const pCurr = pts[i];
    const pNext = pts[(i + 1) % pointsCount];
    const pNextNext = pts[(i + 2) % pointsCount];

    const cp1x = pCurr.x + (pNext.x - pPrev.x) / 6;
    const cp1y = pCurr.y + (pNext.y - pPrev.y) / 6;
    const cp2x = pNext.x - (pNextNext.x - pCurr.x) / 6;
    const cp2y = pNext.y - (pNextNext.y - pCurr.y) / 6;

    d += ' C ' + cp1x.toFixed(4) + ' ' + cp1y.toFixed(4) + ', ' +
                 cp2x.toFixed(4) + ' ' + cp2y.toFixed(4) + ', ' +
                 pNext.x.toFixed(4) + ' ' + pNext.y.toFixed(4);
  }
  d += ' Z';
  return d;
}

const BASE_R_OUTER = 0.396;
const RING_THICKNESS = 0.0245;
const WHITE_THICKNESS = 0.0190;
const BASE_R_WHITE = BASE_R_OUTER - RING_THICKNESS;
const BASE_R_PHOTO = BASE_R_WHITE - WHITE_THICKNESS;

const INITIAL_OUTER_PATH = buildBulgePath(0.5, 0.5, BASE_R_OUTER, -Math.PI / 2, 0.055);
const INITIAL_WHITE_PATH = buildBulgePath(0.5, 0.5, BASE_R_WHITE, -Math.PI / 2, 0.055);
const INITIAL_PHOTO_PATH = buildBulgePath(0.5, 0.5, BASE_R_PHOTO, -Math.PI / 2, 0.055);

function SectionCvCta({ onPreview }) {
  return (
    <div className="section-cta-wrap">
      <button
        onClick={onPreview}
        className="btn-section-cv-check"
        title="Check my CV / Resume online"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <span>Check my CV/Resume</span>
      </button>

      <a
        href="/resume.pdf"
        download="Joshua_Samuel_Equere_CV.pdf"
        className="btn-section-cv-download"
        title="Download Joshua Samuel Equere's CV / Resume"
        aria-label="Download CV/Resume PDF"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span className="btn-download-text">Download</span>
      </a>
    </div>
  );
}

export default function Home() {
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSquareDocked, setIsSquareDocked] = useState(false);
  const [squareSize, setSquareSize] = useState(0);
  const [borderWidth, setBorderWidth] = useState(0);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);

  // Avatar refs for continuous flight docking, organic teardrop bulge & green aura
  const avatarAnchorRef = useRef(null);
  const avatarWrapRef = useRef(null);
  const avatarBubbleRef = useRef(null);
  const avatarRingRef = useRef(null);
  const avatarOuterPathRef = useRef(null);
  const avatarWhitePathRef = useRef(null);
  const avatarPhotoPathRef = useRef(null);
  const avatarTooltipRef = useRef(null);
  const navAvatarSlotRef = useRef(null);
  const headerRef = useRef(null);
  const drawerRef = useRef(null);

  // Measure hero square matching Alata font metrics
  const measureHeroSquare = () => {
    if (typeof window === 'undefined') return;
    const w = window.innerWidth;
    const isMobile = w < 640;
    const brandTextEl = document.querySelector('.hero-brand-text');
    const letterEl = document.querySelector('#landing-brand-s') || document.querySelector('.hero-brand-first');
    
    let currentFontSize = w < 400 ? 28 : (isMobile ? 32 : (w < 768 ? 68 : (w < 1024 ? 92 : 115)));
    if (brandTextEl) {
      const parsedFs = parseFloat(window.getComputedStyle(brandTextEl).fontSize);
      if (parsedFs > 0) currentFontSize = parsedFs;
    }

    const textHeight = (letterEl && letterEl.getBoundingClientRect().height > 0)
      ? letterEl.getBoundingClientRect().height
      : currentFontSize;

    const ratio = isMobile ? 0.35 : 0.31;
    const computedSize = Math.max(10, Math.round(textHeight * ratio));
    const computedBorder = Math.max(2, Math.round(currentFontSize * (isMobile ? 0.085 : 0.082)));

    setSquareSize(computedSize);
    setBorderWidth(computedBorder);
  };

  useEffect(() => {
    measureHeroSquare();
    window.addEventListener('resize', measureHeroSquare);
    return () => window.removeEventListener('resize', measureHeroSquare);
  }, []);

  // Mouse & Scroll tracking: continuous physical flight docking to navbar + mouse-facing bulge & green bubbling aura
  useEffect(() => {
    let animId;
    let targetAngle = -Math.PI / 2;
    let targetBulge = 0.055;
    let targetBubbleOpacity = 0.22; // Base ambient glow visible immediately
    let currentAngle = -Math.PI / 2;
    let currentBulge = 0.055;
    let currentBubbleOpacity = 0.22;
    let currentHoverScale = 1.0;

    let pointerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    let pointerY = typeof window !== 'undefined' ? 300 : 0;
    let isHovered = false;

    const updateFrame = () => {
      // 1. Continuous physical flight docking interpolation to navbar slot
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const DOCK_END = 200; // completes flight within first 200px of scroll
      const rawProgress = Math.min(1, Math.max(0, scrollY / DOCK_END));
      const dockEase = rawProgress * rawProgress * (3 - 2 * rawProgress); // Smooth cubic ease

      const anchor = avatarAnchorRef.current;
      const slot = navAvatarSlotRef.current;
      const wrap = avatarWrapRef.current;
      const isMobileNav = typeof window !== 'undefined' && window.innerWidth <= 768;

      // Exact same height as the Let's Talk button (36px)
      const TARGET_SLOT_SIZE = 36;
      const TARGET_SLOT_MARGIN = 8;
      const BASE_NAV_MAX_W = 560;
      const EXPANDED_NAV_MAX_W = 620;

      // Inside the navigation container: expands smoothly as avatar settles
      if (slot) {
        const currentSlotW = dockEase * TARGET_SLOT_SIZE;
        slot.style.width = `${currentSlotW.toFixed(2)}px`;
        slot.style.height = `${TARGET_SLOT_SIZE}px`;
        slot.style.opacity = dockEase > 0.01 ? (dockEase * 1.0).toFixed(3) : '0';
        slot.style.pointerEvents = dockEase > 0.8 ? 'auto' : 'none';

        if (isMobileNav) {
          slot.style.marginRight = `${(dockEase * TARGET_SLOT_MARGIN).toFixed(2)}px`;
          slot.style.marginLeft = '0px';
        } else {
          slot.style.marginLeft = `${(dockEase * TARGET_SLOT_MARGIN).toFixed(2)}px`;
          slot.style.marginRight = '0px';
        }
      }

      const pill = slot ? slot.closest('.nav-pill') : null;
      if (pill && !isMobileNav) {
        const currentNavMaxW = BASE_NAV_MAX_W + dockEase * (EXPANDED_NAV_MAX_W - BASE_NAV_MAX_W);
        pill.style.maxWidth = `${currentNavMaxW.toFixed(1)}px`;
      }

      let currentCenterX = 0;
      let currentCenterY = 0;
      let baseScale = 1.0;
      let currentAvatarRadius = 60;

      if (slot && wrap) {
        const slotRect = slot.getBoundingClientRect();
        const naturalDiameter = 154 * (2 * BASE_R_OUTER); // ~122px
        const scale1 = TARGET_SLOT_SIZE / naturalDiameter; // ~0.3115

        if (dockEase >= 1.0) {
          // ROCK-SOLID STATIONARY IN NAVBAR:
          // Center is locked strictly to slot center (no anchor dependency, zero scroll bobbing on other sections!)
          currentCenterX = slotRect.left + slotRect.width / 2;
          currentCenterY = slotRect.top + slotRect.height / 2;
          baseScale = scale1;
          currentAvatarRadius = TARGET_SLOT_SIZE / 2;
        } else if (anchor) {
          const anchorRect = anchor.getBoundingClientRect();
          const x0 = anchorRect.left + anchorRect.width / 2;
          const y0 = anchorRect.top + anchorRect.height / 2;
          const scale0 = anchorRect.width / 154;

          const targetSlotCenterX = slotRect.left + (dockEase > 0.1 ? slotRect.width / 2 : TARGET_SLOT_SIZE / 2);
          const targetSlotCenterY = slotRect.top + slotRect.height / 2;

          currentCenterX = (1 - dockEase) * x0 + dockEase * targetSlotCenterX;
          currentCenterY = (1 - dockEase) * y0 + dockEase * targetSlotCenterY;
          baseScale = (1 - dockEase) * scale0 + dockEase * scale1;
          currentAvatarRadius = (1 - dockEase) * (anchorRect.width * BASE_R_OUTER) + dockEase * (TARGET_SLOT_SIZE / 2);
        } else {
          currentCenterX = slotRect.left + slotRect.width / 2;
          currentCenterY = slotRect.top + slotRect.height / 2;
          baseScale = scale1;
          currentAvatarRadius = TARGET_SLOT_SIZE / 2;
        }

        // Smooth expansion on hover (expands by 24% when docked, 6% in hero)
        const targetHoverScale = isHovered ? (dockEase > 0.8 ? 1.24 : 1.06) : 1.0;
        currentHoverScale += (targetHoverScale - currentHoverScale) * 0.18;
        const renderedScale = baseScale * currentHoverScale;

        // Position avatar with position: fixed relative to viewport
        const tx = currentCenterX - 77;
        const ty = currentCenterY - 77;

        wrap.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${renderedScale.toFixed(4)})`;
        wrap.style.zIndex = '110';

        if (dockEase >= 0.95) {
          wrap.classList.add('docked');
          wrap.classList.remove('in-flight');
        } else if (dockEase > 0.05) {
          wrap.classList.add('in-flight');
          wrap.classList.remove('docked');
        } else {
          wrap.classList.remove('in-flight', 'docked');
        }

        // Counter-scale custom bottom tooltip so it stays crisp at 100% readable size
        if (avatarTooltipRef.current) {
          const counterScale = 1 / Math.max(0.1, renderedScale);
          avatarTooltipRef.current.style.transform = `translateX(-50%) scale(${counterScale.toFixed(4)})`;
        }
      }

      // 2. Vector from avatar center to pointer
      const dx = pointerX - currentCenterX;
      const dy = pointerY - currentCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      targetAngle = Math.atan2(dy, dx);

      // 3. Bulge and hover calculations
      const isMobileScreen = typeof window !== 'undefined' && window.innerWidth <= 768;
      const hitRadius = currentAvatarRadius * (isHovered ? 1.25 : 1.0) + (dockEase > 0.8 ? 5 : 2);
      if (isMobileScreen) {
        targetBulge = 0;
        currentBulge = 0;
        targetBubbleOpacity = 0;
        currentBubbleOpacity = 0;
        isHovered = false;
        setIsAvatarHovered(false);
      } else if (dist <= hitRadius) {
        // Pointer is on the avatar
        targetBulge = 0; // perfect circle
        targetBubbleOpacity = 1.0;
        isHovered = true;
        setIsAvatarHovered(true);
      } else {
        isHovered = false;
        setIsAvatarHovered(false);

        // When mouse is on other sections:
        // Bulge happens dynamically towards the mouse!
        // In navbar, maxBulge is 0.092 so it visibly bulges and pushes out of the nav bar!
        const distFromEdge = dist - hitRadius;
        const rampDist = dockEase > 0.8 ? 50 : 130;
        const ramp = Math.min(1, Math.max(0, distFromEdge / rampDist));
        const maxBulge = dockEase > 0.8 ? 0.092 : 0.078;
        targetBulge = maxBulge * ramp;

        if (dockEase > 0.8) {
          targetBubbleOpacity = 0.15;
        } else {
          const proximity = Math.max(0, 1 - distFromEdge / 300);
          targetBubbleOpacity = 0.18 + 0.82 * Math.pow(proximity, 1.15);
        }
      }

      // 4. Smooth angle, bulge, and bubble interpolation
      let angleDiff = targetAngle - currentAngle;
      while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

      currentAngle += angleDiff * 0.22;
      currentBulge += (targetBulge - currentBulge) * 0.18;
      if (Math.abs(targetBulge - currentBulge) < 0.0005 && targetBulge === 0) {
        currentBulge = 0;
      }

      currentBubbleOpacity += (targetBubbleOpacity - currentBubbleOpacity) * 0.16;

      // Bubble aura opacity
      const effectiveBubbleOpacity = isHovered ? currentBubbleOpacity : (dockEase > 0.8 ? (currentBubbleOpacity * 0.3) : currentBubbleOpacity);

      if (avatarBubbleRef.current) {
        avatarBubbleRef.current.style.opacity = effectiveBubbleOpacity.toFixed(3);
      }
      if (wrap) {
        wrap.style.setProperty('--bubble-opacity', effectiveBubbleOpacity.toFixed(3));
      }

      const ring = avatarRingRef.current;
      if (ring) {
        const deg = currentAngle * (180 / Math.PI) + 90;
        ring.style.setProperty('--mouse-angle', `${deg}deg`);
      }

      // Generate the organic bulge or smooth circle path
      const outerD = buildBulgePath(0.5, 0.5, BASE_R_OUTER, currentAngle, currentBulge);
      const whiteD = buildBulgePath(0.5, 0.5, BASE_R_WHITE, currentAngle, currentBulge);
      const photoD = buildBulgePath(0.5, 0.5, BASE_R_PHOTO, currentAngle, currentBulge);

      if (avatarOuterPathRef.current) avatarOuterPathRef.current.setAttribute('d', outerD);
      if (avatarWhitePathRef.current) avatarWhitePathRef.current.setAttribute('d', whiteD);
      if (avatarPhotoPathRef.current) avatarPhotoPathRef.current.setAttribute('d', photoD);

      animId = requestAnimationFrame(updateFrame);
    };

    const handlePointerMove = (e) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        pointerX = e.touches[0].clientX;
        pointerY = e.touches[0].clientY;
      }
    }, { passive: true });

    animId = requestAnimationFrame(updateFrame);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isCvModalOpen) setIsCvModalOpen(false);
        if (isLoading) {
          setIsLoading(false);
          setIsSquareDocked(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCvModalOpen, isLoading]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleCopy = (text, label) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied ${label} to clipboard!`);
      }).catch(() => {
        showToast(`Copied: ${text}`);
      });
    }
  };

  const handleCopyAtsText = () => {
    const text = `JOSHUA SAMUEL EQUERE
Email: josh.sam.builds@gmail.com | Phone: +2348074681328
GitHub: github.com/marveloper-8 | LinkedIn: linkedin.com/in/marveloper

SOFTWARE ENGINEER (MOBILE, WEB, BACKEND, & CLOUD)
Senior Software Engineer who builds complete digital products from start to finish. I specialize in the four pillars of modern software: mobile apps, web interfaces, robust servers, and reliable cloud infrastructure. I focus on creating fast, scalable systems that can easily handle heavy load/usage without problems.

CORE SKILLS:
- Backend & Data: Go (Golang), Python, Node.js, Nest.js, Express.js, Redis, MySQL, PostgreSQL, MongoDB, Pub/Sub, Kafka, RabbitMQ
- Web & Mobile: React, Next.js, React Native, Redux, D3.js, Tailwind CSS, WebSockets, Rest APIs
- Cloud & DevOps: AWS (EKS, S3, CloudFront), Docker, Kubernetes, Terraform, Ansible, GitHub Actions, Jenkins, CI/CD, Cypress, Playwright
- Architecture: Microservices, GraphQL Federation, Event-Driven, DDD, Offline-First Architecture

PROFESSIONAL EXPERIENCE:
NexaLabs LTD (Jun 2026 - Present)
Owner & Software Engineer (Mobile, Web, & Backend)
- Launched multiple digital products from initial idea to public release by directing the technical strategy and development for a software publishing business.
- Ensured reliable system performance by architecting complete systems that connect mobile and web interfaces to secure cloud infrastructure.
- Environment: Golang, TypeScript, NestJS, React Native, Next.js, Docker, Cloudflare, AWS, Python (https://nexalabs.site)

DoneThat: Sync (Feb 2026 - Present)
Owner & Software Engineer (Mobile, Web, & Backend)
- Enabled instant cross-device synchronization of household tasks by building a real-time React Native mobile application.
- Eliminated data delays and manual refreshes by designing a fast, reliable server backend with WebSockets and PostgreSQL.
- Environment: React Native, Golang, WebSockets, PostgreSQL, Coolify, AWS, Docker (https://donethat.online)

Bible Words: Play (Aug 2025 - Present)
Owner & Software Engineer (Mobile, Web, & Backend)
- Maintained 99.9% uptime for 10,000+ concurrent players by engineering a highly reliable backend server system.
- Accelerated global game load times by 40% by provisioning optimized cloud infrastructure on AWS.
- Environment: React Native, Golang, Docker, AWS S3, AWS CloudFront, Python (https://play.lolaschools.com)

LOLA - JAMB & WAEC PREP (Sep 2024 - Aug 2025)
Owner & Software Engineer (Mobile, Web, & Backend)
- Facilitated national exam success for over 90% of enrolled students by leading the technology strategy for the educational platform.
- Accelerated live message and video transmission by 65% by upgrading the real-time tutoring architecture.
- Environment: React Native, Node.js, JSON APIs, WebSockets, PostgreSQL, Python, Docker (https://lolaschools.com)

LifeApp (Mar 2024 - May 2024)
Backend & Cloud Engineer (Contract)
- Processed 1 million+ daily user actions with a 60% increase in application speed by designing a scalable server system.
- Increased new feature launch speed by 50% by automating the backend CI/CD release pipeline.
- Environment: Go, Python, AWS (EKS), CI/CD, Kubernetes

BioCatlog (Aug 2022 - Mar 2023)
Senior Software Engineer (Mobile, Web, & Backend)
- Supported 50,000+ daily active users by managing the end-to-end development of a high-traffic web application.
- Boosted application speed by 70% for end-users by optimizing data retrieval operations via Redis and GraphQL.
- Environment: React, Next.js, Node.js, GraphQL, Redis, Docker, Python

EDUCATION:
- BSc, Computer Science - Southwestern University (2024)
- Diploma in Software Development & Digital Design - Ekobits Academy (2019)`;

    handleCopy(text, 'ATS Plain Text Resume');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name') || '';
    const email = formData.get('email') || '';
    const message = formData.get('message') || '';

    const subject = encodeURIComponent(`Engineering Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:josh.sam.builds@gmail.com?subject=${subject}&body=${body}`;
    showToast('Opening email client with pre-filled message...');
  };

  // 3 Flagship Projects with full exact NexaLabs animations
  // 3 Flagship Real-World Production Platforms (matching NexaLabs exact assets & data)
  const flagshipProjects = [
    {
      id: '01',
      name: 'LOLA - JAMB and WAEC prep',
      tagline: 'Ambient AI Voice & Personal Assistant',
      category: 'mobile',
      desc: 'Platform to help students better prepare for their exams. Dual platform mobile and web application with live interactive tutoring, automated examination practice banks, and low-latency WebSockets.',
      bgColor: '#F7EFDA',
      aspectRatio: '2338 / 1792',
      logoImage: '/projects/lola.png',
      iconImage: '/projects/lola-icon.png',
      infoImage: '/projects/lola3.png',
      appImages: ['/projects/lola3-1.png', '/projects/lola3-2.png', '/projects/lola3-3.png'],
      webImage: '/projects/lola2.jpg',
      webUrl: 'https://lolaschools.com',
      appUrl: 'https://apps.apple.com/ng/app/lola-jamb-waec-prep/id6785081192',
      services: ['SaaS & Web Apps', 'Websites', 'Mobile Apps', 'Backends & Cloud', 'Brand & Design', 'Publishing', 'QA & Security'],
      reverse: false,
    },
    {
      id: '02',
      name: 'DoneThat: Sync',
      tagline: 'Task Operations & Execution Engine',
      category: 'mobile',
      desc: 'A gamified productivity app to help make chores more enjoyable. Instant multi-device state synchronization powered by custom Go WebSockets and PostgreSQL on AWS.',
      bgColor: '#CDDD71',
      aspectRatio: '2624 / 1632',
      logoImage: '/projects/donethat.png',
      iconImage: '/projects/donethat-icon.png',
      infoImage: '/projects/donethat3.png',
      appImages: ['/projects/donethat3-1.png', '/projects/donethat3-2.png', '/projects/donethat3-3.png'],
      webImage: '/projects/donethat2.jpg',
      webUrl: 'https://donethat.online',
      appUrl: 'https://apps.apple.com/ng/app/donethat-sync/id6762071026',
      services: ['Websites', 'Mobile Apps', 'Backends & Cloud', 'Brand & Design', 'Publishing', 'QA & Security'],
      reverse: true,
    },
    {
      id: '03',
      name: 'Bible Words: Play',
      tagline: 'Spatial Scripture & Literary Engine',
      category: 'backend',
      desc: 'Word game based entirely on the KJV Bible. High-concurrency multiplayer game serving 10,000+ active players with sub-second score verification on AWS.',
      bgColor: '#77A1CB',
      bgImage: '/projects/bible-bg.png',
      aspectRatio: '2342 / 1792',
      logoImage: '/projects/bible.png',
      iconImage: '/projects/bible-icon.png',
      infoImage: '/projects/bible3.png',
      appImages: ['/projects/bible3-1.png', '/projects/bible3-2.png', '/projects/bible3-3.png'],
      webImage: '/projects/bible2.jpg',
      webUrl: 'https://play.lolaschools.com',
      appUrl: 'https://apps.apple.com/ng/app/bible-words-play/id6757534699',
      services: ['Websites', 'Mobile Apps', 'Backends & Cloud', 'Brand & Design', 'Publishing', 'QA & Security'],
      reverse: false,
    },
  ];

  // Secondary architectural systems
  const secondaryProjects = [
    {
      id: '04',
      title: 'NexaLabs LTD',
      tagline: 'Software Publishing & Engineering Studio',
      category: 'web',
      categoryLabel: 'AGENCY & PRODUCT STUDIO',
      desc: 'Digital product studio architecting end-to-end commercial web and mobile products, full-scope deployments, high-performance web systems, and brand technology.',
      badge: '🏢 Commercial Studio',
      tech: ['Golang', 'TypeScript', 'NestJS', 'React Native', 'Next.js', 'Cloudflare', 'AWS'],
      liveUrl: 'https://nexalabs.site',
      githubUrl: 'https://github.com/marveloper-8'
    },
    {
      id: '05',
      title: 'LifeApp Engine',
      tagline: 'Enterprise Cloud System & Microservices',
      category: 'backend',
      categoryLabel: 'CLOUD & DISTRIBUTED SYSTEMS',
      desc: 'Scalable cloud infrastructure handling over 1 million daily user actions with zero bottlenecks. Automated deployment cycles and optimized high-throughput database queries.',
      badge: '🚀 1M+ Daily Actions',
      tech: ['Go (Golang)', 'Python', 'AWS EKS', 'Kubernetes', 'CI/CD Pipelines'],
      liveUrl: null,
      githubUrl: 'https://github.com/marveloper-8'
    },
    {
      id: '06',
      title: 'BioCatlog Platform',
      tagline: 'High-Traffic Web & Data Aggregation Engine',
      category: 'web',
      categoryLabel: 'WEB & DISTRIBUTED CACHING',
      desc: 'High-traffic search and biological catalog platform supporting 50,000+ daily active users with complex relational queries and sub-second rendering.',
      badge: '📊 50k+ Daily Users',
      tech: ['Next.js', 'React', 'Node.js', 'GraphQL', 'Redis', 'Docker'],
      liveUrl: null,
      githubUrl: 'https://github.com/marveloper-8'
    },
    {
      id: '07',
      title: 'SynOption Trading Engine',
      tagline: 'Institutional Financial Trading Interface',
      category: 'web',
      categoryLabel: 'FINTECH & WEB PLATFORMS',
      desc: 'High-stakes web trading terminal processing multi-million dollar institutional transactions with real-time order books, minimal bundle footprint, and hardened data integrity.',
      badge: '💳 $10M+ Daily Volume',
      tech: ['React', 'TypeScript', 'Redux', 'Financial WebSockets', 'Tailwind CSS'],
      liveUrl: 'https://synoption.com',
      githubUrl: 'https://github.com/marveloper-8'
    }
  ];

  return (
    <>
      {/* ========================================================
           PHYSICS CLOTH CURTAIN & STEPPING SQUARE PRELOADER OVERLAY
           ======================================================== */}
      {isLoading && (
        <CurtainLoader
          targetSelector="#landing-brand-square-inner"
          squareSize={squareSize}
          borderWidth={borderWidth}
          onDock={() => setIsSquareDocked(true)}
          onComplete={() => {
            setIsLoading(false);
            setIsSquareDocked(true);
          }}
          onSkip={() => {
            setIsLoading(false);
            setIsSquareDocked(true);
          }}
        />
      )}

      {/* ========================================================
           FLOATING MINIMALIST NAVIGATION BAR (GLASS UI)
           ======================================================== */}
      <header className="site-header" ref={headerRef}>
        <nav className="nav-pill">
          {/* Navigation links (on desktop: placed on the left) */}
          <div className="nav-links">
            <a href="#pastwork">Work</a>
            <a href="#disciplines">Disciplines</a>
            <a href="#timeline">Career</a>
            <a href="#resume" onClick={(e) => { e.preventDefault(); setIsCvModalOpen(true); }}>CV/Resume</a>
          </div>

          {/* Action items: on mobile, avatar and Let's Talk are on the left, hamburger on the right */}
          <div className="nav-actions">
            <div className="nav-actions-left">
              {/* Target Docking Slot for Animated Profile Avatar (inside the nav container) */}
              <div
                ref={navAvatarSlotRef}
                className="nav-avatar-slot"
                onClick={() => setIsCvModalOpen(true)}
                aria-label="Profile Avatar slot in navigation"
              />

              <a href="#contact" className="btn-pill-primary">
                <span>Let&apos;s Talk</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-btn"
              aria-label="Toggle navigation menu"
            >
              <span className="mobile-menu-line" style={{ transform: isMobileMenuOpen ? 'translateY(3.5px) rotate(45deg)' : '' }} />
              <span className="mobile-menu-line" style={{ transform: isMobileMenuOpen ? 'translateY(-3.5px) rotate(-45deg)' : '' }} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer (close up to the nav, no dark backdrop) */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer" ref={drawerRef}>
          <a href="#pastwork" onClick={() => setIsMobileMenuOpen(false)}>Work</a>
          <a href="#disciplines" onClick={() => setIsMobileMenuOpen(false)}>Disciplines</a>
          <a href="#timeline" onClick={() => setIsMobileMenuOpen(false)}>Career</a>
          <a href="#resume" onClick={() => { setIsMobileMenuOpen(false); setIsCvModalOpen(true); }}>CV/Resume</a>
        </div>
      )}

      <main>
        {/* ========================================================
             HERO SECTION (CENTER-ALIGNED & GRAND WITH LARGER MOUSE-FACING AVATAR)
             ======================================================== */}
        <section id="hero" className="hero-section">
          <div className="container">

            {/* FOUNDER PROFILE AVATAR ON HERO (DYNAMIC MOUSE-FACING BULGE & FLIGHT DOCKING) */}
            <div ref={avatarAnchorRef} className="hero-avatar-anchor">
              <div
                ref={avatarWrapRef}
                className="hero-avatar-wrap"
                onClick={() => setIsCvModalOpen(true)}
                onMouseEnter={() => setIsAvatarHovered(true)}
                onMouseLeave={() => setIsAvatarHovered(false)}
              >
                {/* Bubbling green shadowy aura behind the circle */}
                <div
                  ref={avatarBubbleRef}
                  className={`hero-avatar-bubble-aura ${isAvatarHovered ? 'active' : ''}`}
                  aria-hidden="true"
                >
                  <div className="bubble-shadow-glow" />
                  <div className="bubble-blob bubble-blob-1" />
                  <div className="bubble-blob bubble-blob-2" />
                  <div className="bubble-blob bubble-blob-3" />
                  <div className="bubble-satellite bubble-sat-1" />
                  <div className="bubble-satellite bubble-sat-2" />
                  <div className="bubble-satellite bubble-sat-3" />
                  <div className="bubble-satellite bubble-sat-4" />
                  <div className="bubble-satellite bubble-sat-5" />
                </div>

                <div
                  ref={avatarRingRef}
                  className="hero-avatar-ring"
                >
                  {/* Middle white rim */}
                  <div className="hero-avatar-white" />

                  {/* Inner clipped photo - stays steady and does not shift */}
                  <div className="hero-avatar-photo-wrap">
                    <img
                      src="/founder.jpg"
                      alt="Joshua Samuel Equere"
                      className="hero-avatar-img"
                    />
                  </div>
                </div>

                {/* Sleek bottom tooltip (without dot, counters parent scale) */}
                <div
                  ref={avatarTooltipRef}
                  className={`hero-avatar-tooltip ${isAvatarHovered ? 'visible' : ''}`}
                  aria-hidden="true"
                >
                  <span>Tap to view CV / Resume</span>
                </div>
              </div>
            </div>

            {/* Global SVG clip definitions for organic teardrop bulge effect */}
            <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden="true">
              <defs>
                <clipPath id="avatar-bulge-outer" clipPathUnits="objectBoundingBox">
                  <path ref={avatarOuterPathRef} d={INITIAL_OUTER_PATH} />
                </clipPath>
                <clipPath id="avatar-bulge-white" clipPathUnits="objectBoundingBox">
                  <path ref={avatarWhitePathRef} d={INITIAL_WHITE_PATH} />
                </clipPath>
                <clipPath id="avatar-bulge-photo" clipPathUnits="objectBoundingBox">
                  <path ref={avatarPhotoPathRef} d={INITIAL_PHOTO_PATH} />
                </clipPath>
              </defs>
            </svg>

            {/* MAIN BRAND HEADER: joshua equere [■] */}
            <div className="hero-brand-wrap">
              <div className="hero-brand-text">
                <span className="hero-brand-first">joshua</span>
                <span className="hero-brand-last">
                  <span>equer</span>
                  <span id="landing-brand-s">e</span>
                </span>
                {/* Iconic Hollow Green Square at 15 deg tilt */}
                <div id="landing-brand-square">
                  <div
                    id="landing-brand-square-inner"
                    style={{
                      opacity: isSquareDocked ? 1 : 0
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Direct & Minimalist Hero Statement */}
            <p className="hero-statement">
              Senior Software Engineer &amp; Founder of <strong style={{ color: '#0a0a0a' }}>NexaLabs</strong>. I build complete digital products from start to finish: <strong style={{ color: '#0a0a0a' }}>mobile apps</strong>, <strong style={{ color: '#0a0a0a' }}>web platforms</strong>, <strong style={{ color: '#0a0a0a' }}>high-concurrency servers</strong>, and <strong style={{ color: '#0a0a0a' }}>scalable cloud infrastructure</strong>.
            </p>

            {/* Center-Aligned Action Buttons (Commented out per request) */}
            {/*
            <div className="hero-actions">
              <a href="#stuffibuilt" className="hero-btn-primary">
                <span>Explore Selected Work</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </a>

              <button onClick={() => setIsCvModalOpen(true)} className="hero-btn-secondary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <span>Preview Resume PDF</span>
              </button>

              <a
                href="/resume.pdf"
                download="Joshua_Samuel_Equere_CV.pdf"
                className="hero-btn-secondary"
                title="Download official PDF resume directly"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download PDF</span>
              </a>

              <button
                onClick={() => handleCopy('josh.sam.builds@gmail.com', 'Email address')}
                className="hero-btn-ghost"
                title="Copy email to clipboard"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copy Email</span>
              </button>
            </div>
            */}

            {/* Minimalist Stats Strip */}
            <div className="stats-strip">
              <div className="stat-card">
                <div className="stat-value">$10M+</div>
                <div className="stat-label">Daily Volume Secured</div>
                <div className="stat-desc">SynOption Trading Engine</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">10,000+</div>
                <div className="stat-label">Concurrent Players</div>
                <div className="stat-desc">Bible Words (99.9% Uptime)</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">1M+</div>
                <div className="stat-label">Daily User Actions</div>
                <div className="stat-desc">LifeApp Cloud Microservices</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">65%</div>
                <div className="stat-label">Latency Reduction</div>
                <div className="stat-desc">LOLA Real-Time Tutoring</div>
              </div>
            </div>

            {/* Resume Download CTA (Hero - directly after Latency Reduction) */}
            <SectionCvCta onPreview={() => setIsCvModalOpen(true)} />
          </div>
        </section>

        {/* ========================================================
             SELECTED WORKS SHOWCASE SECTION ("past work")
             EXACT 4-PHASE CINEMATIC ANIMATIONS AS ON NEXALABS
             ======================================================== */}
        <section id="pastwork" className="section">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title-anybody">
                <span style={{ color: '#000000' }}>past</span>
                <span style={{ color: '#239C05' }}>work</span>
              </h2>
              <p className="section-desc">
                production platforms built from scratch. see how i architect, build, and deploy dual-platform mobile and web systems in the real world.
              </p>
            </div>

            {/* 3 FLAGSHIP PROJECTS WITH EXACT CINEMATIC ANIMATIONS FROM NEXALABS */}
            <div className="flagship-list">
              {flagshipProjects.map((project) => (
                <ProjectCardCinematic
                  key={project.id}
                  id={project.id}
                  name={project.name}
                  tagline={project.tagline}
                  desc={project.desc}
                  services={project.services}
                  bgColor={project.bgColor}
                  bgImage={project.bgImage}
                  aspectRatio={project.aspectRatio}
                  logoImage={project.logoImage}
                  iconImage={project.iconImage}
                  infoImage={project.infoImage}
                  appImages={project.appImages}
                  webImage={project.webImage}
                  webUrl={project.webUrl}
                  appUrl={project.appUrl}
                  reverse={project.reverse}
                />
              ))}
            </div>

            {/* SECONDARY ARCHITECTURAL SYSTEMS */}
            <div className="secondary-projects-grid" style={{ marginTop: '36px' }}>
              {secondaryProjects.map((p) => (
                <div key={p.id} className="secondary-card">
                  <div>
                    <h4 className="secondary-card-title">{p.title}</h4>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#239C05', marginBottom: '12px' }}>{p.tagline}</div>
                    <p style={{ fontSize: '13.5px', color: '#525252', lineHeight: '1.6', marginBottom: '18px' }}>{p.desc}</p>
                  </div>

                  <div>
                    <div className="tech-chips-row" style={{ marginBottom: '18px' }}>
                      {p.tech.map((t, idx) => (
                        <span key={idx} className="tech-chip">{t}</span>
                      ))}
                    </div>

                    <div style={{ borderTop: '1px solid #f0f2f4', paddingTop: '14px', display: 'flex', gap: '14px' }}>
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-website" style={{ fontSize: '11.5px', padding: '6px 14px' }}>
                          <span>Platform Link</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
                        </a>
                      )}
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-website" style={{ fontSize: '11.5px', padding: '6px 14px' }}>
                          <span>GitHub</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resume Download CTA (Past Work) */}
            <SectionCvCta onPreview={() => setIsCvModalOpen(true)} />
          </div>
        </section>

        {/* ========================================================
             CORE DISCIPLINES ("core disciplines")
             ======================================================== */}
        <section id="disciplines" className="section" style={{ backgroundColor: '#fafafa', borderTop: '1px solid #f0f2f4', borderBottom: '1px solid #f0f2f4' }}>
          <div className="container">
            <div className="section-head">
              <h2 className="section-title-anybody">
                <span style={{ color: '#000000' }}>core</span>
                <span style={{ color: '#239C05' }}>disciplines</span>
              </h2>
              <p className="section-desc">
                four pillars of engineering expertise. from pixel-perfect mobile and web interfaces to resilient cloud backends.
              </p>
            </div>

            <div className="disciplines-grid">
              <div className="discipline-card">
                <div className="discipline-header">
                  <div className="discipline-icon-badge" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  </div>
                  <div className="discipline-number">01 / MOBILE</div>
                </div>
                <h3 className="discipline-title">Mobile Engineering</h3>
                <p className="discipline-desc">
                  Offline-first applications using React Native &amp; Expo for iOS &amp; Android. Real-time background sync, push notifications, and fast touch responsiveness.
                </p>
                <div className="discipline-tags">
                  React Native • Expo • Redux • WebSockets • Offline-First
                </div>
              </div>

              <div className="discipline-card">
                <div className="discipline-header">
                  <div className="discipline-icon-badge" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="2" y1="7" x2="22" y2="7" />
                      <circle cx="6" cy="5" r="0.75" fill="currentColor" />
                      <circle cx="9" cy="5" r="0.75" fill="currentColor" />
                      <circle cx="12" cy="5" r="0.75" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="discipline-number">02 / WEB</div>
                </div>
                <h3 className="discipline-title">Web &amp; Platforms</h3>
                <p className="discipline-desc">
                  High-performance web applications with Next.js, Svelte, &amp; React. Server-side rendering, sub-second TTFB, responsive accessibility, and 60+ FPS micro-interactions.
                </p>
                <div className="discipline-tags">
                  Next.js • Svelte • React • TypeScript • D3.js • Tailwind CSS
                </div>
              </div>

              <div className="discipline-card">
                <div className="discipline-header">
                  <div className="discipline-icon-badge" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                      <line x1="6" y1="6" x2="6.01" y2="6" />
                      <line x1="6" y1="18" x2="6.01" y2="18" />
                    </svg>
                  </div>
                  <div className="discipline-number">03 / BACKEND</div>
                </div>
                <h3 className="discipline-title">Distributed Backends</h3>
                <p className="discipline-desc">
                  High-concurrency servers in Go (Golang), Python, and NestJS. Real-time bidirectional WebSockets, Kafka/RabbitMQ brokers, and low-latency PostgreSQL/Redis caching.
                </p>
                <div className="discipline-tags">
                  Golang • Python • NestJS • WebSockets • Redis • Postgres
                </div>
              </div>

              <div className="discipline-card">
                <div className="discipline-header">
                  <div className="discipline-icon-badge" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                    </svg>
                  </div>
                  <div className="discipline-number">04 / CLOUD</div>
                </div>
                <h3 className="discipline-title">Cloud &amp; DevOps</h3>
                <p className="discipline-desc">
                  Automated CI/CD pipelines and infrastructure provisioning on AWS (EKS, S3, CloudFront). Docker containerization, Kubernetes clusters, and Terraform.
                </p>
                <div className="discipline-tags">
                  AWS • Docker • Kubernetes • Terraform • GitHub Actions
                </div>
              </div>
            </div>

            {/* Resume Download CTA (Disciplines) */}
            <SectionCvCta onPreview={() => setIsCvModalOpen(true)} />
          </div>
        </section>

        {/* ========================================================
             CAREER JOURNEY ("career journey")
             ======================================================== */}
        <section id="timeline" className="section">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title-anybody">
                <span style={{ color: '#000000' }}>career</span>
                <span style={{ color: '#239C05' }}>journey</span>
              </h2>
              <p className="section-desc">
                a track record of building, shipping, and scaling production systems across publishing, fintech, and education.
              </p>
            </div>

            <div className="timeline-list">
              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-meta-row">
                  <span className="timeline-company">NexaLabs LTD</span>
                  <span className="timeline-date">Jun 2026 - Present</span>
                </div>
                <div className="timeline-role">Owner &amp; Senior Software Engineer (Mobile, Web, &amp; Backend)</div>
                <ul className="timeline-bullets">
                  <li>Launched multiple digital products from initial idea to public release by directing technical strategy and development for a software publishing business.</li>
                  <li>Ensured reliable system performance by architecting complete systems that connect mobile and web interfaces to secure cloud infrastructure.</li>
                </ul>
                <div className="timeline-env">Environment: Golang, TypeScript, NestJS, React Native, Next.js, Docker, Cloudflare, AWS, Python</div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-meta-row">
                  <span className="timeline-company">DoneThat: Sync</span>
                  <span className="timeline-date">Feb 2026 - Present</span>
                </div>
                <div className="timeline-role">Owner &amp; Lead Engineer (Mobile &amp; Backend)</div>
                <ul className="timeline-bullets">
                  <li>Enabled instant cross-device synchronization of household tasks by building a real-time React Native mobile application.</li>
                  <li>Eliminated data delays and manual refreshes by designing a fast, reliable server backend with WebSockets and PostgreSQL.</li>
                </ul>
                <div className="timeline-env">Environment: React Native, Golang, WebSockets, PostgreSQL, Coolify, AWS, Docker • <a href="https://apps.apple.com/ng/app/donethat-sync/id6762071026" target="_blank" rel="noopener noreferrer" style={{ color: '#239C05', fontWeight: 600 }}>App Store</a></div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-meta-row">
                  <span className="timeline-company">Bible Words: Play</span>
                  <span className="timeline-date">Aug 2025 - Present</span>
                </div>
                <div className="timeline-role">Owner &amp; Software Engineer</div>
                <ul className="timeline-bullets">
                  <li>Maintained 99.9% uptime for 10,000+ concurrent players by engineering a highly reliable backend server system in Go.</li>
                  <li>Accelerated global game load times by 40% by provisioning optimized cloud infrastructure on AWS S3 and CloudFront.</li>
                </ul>
                <div className="timeline-env">Environment: React Native, Golang, Docker, AWS S3, AWS CloudFront, Python • <a href="https://apps.apple.com/ng/app/bible-words-play/id6757534699" target="_blank" rel="noopener noreferrer" style={{ color: '#239C05', fontWeight: 600 }}>App Store</a></div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-meta-row">
                  <span className="timeline-company">LOLA - JAMB &amp; WAEC PREP</span>
                  <span className="timeline-date">Sep 2024 - Aug 2025</span>
                </div>
                <div className="timeline-role">Owner &amp; Software Engineer (Mobile, Web, &amp; Backend)</div>
                <ul className="timeline-bullets">
                  <li>Facilitated national exam success for over 90% of enrolled students by leading technology strategy for the platform.</li>
                  <li>Accelerated live message and video transmission by 65% by upgrading the real-time tutoring architecture.</li>
                </ul>
                <div className="timeline-env">Environment: React Native, Node.js, JSON APIs, WebSockets, PostgreSQL, Python, Docker • <a href="https://apps.apple.com/ng/app/lola-jamb-waec-prep/id6785081192" target="_blank" rel="noopener noreferrer" style={{ color: '#239C05', fontWeight: 600 }}>App Store</a></div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-meta-row">
                  <span className="timeline-company">LifeApp</span>
                  <span className="timeline-date">Mar 2024 - May 2024</span>
                </div>
                <div className="timeline-role">Backend &amp; Cloud Engineer (Contract)</div>
                <ul className="timeline-bullets">
                  <li>Processed 1 million+ daily user actions with a 60% increase in application speed by designing a scalable server system.</li>
                  <li>Increased new feature launch speed by 50% by automating the backend CI/CD release pipeline.</li>
                </ul>
                <div className="timeline-env">Environment: Go, Python, AWS (EKS), CI/CD, Kubernetes</div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-meta-row">
                  <span className="timeline-company">SynOption</span>
                  <span className="timeline-date">Sep 2021 - Aug 2022</span>
                </div>
                <div className="timeline-role">Web Engineer</div>
                <ul className="timeline-bullets">
                  <li>Secured $10 million+ in daily transactions by helping build a robust financial trading platform.</li>
                  <li>Broadened accessibility for users on slow connections by shrinking the application download size by 60%.</li>
                </ul>
                <div className="timeline-env">Environment: React, TypeScript, Redux, Tailwind CSS • <a href="https://synoption.com" target="_blank" rel="noopener noreferrer" style={{ color: '#239C05', fontWeight: 600 }}>synoption.com</a></div>
              </div>
            </div>

            {/* Resume Download CTA (Career Journey) */}
            <SectionCvCta onPreview={() => setIsCvModalOpen(true)} />
          </div>
        </section>

        {/* ========================================================
             CONTACT & GET IN TOUCH
             ======================================================== */}
        <section id="contact" className="section" style={{ borderTop: '1px solid #f0f2f4' }}>
          <div className="container" style={{ maxWidth: '780px', textAlign: 'center' }}>
            <h2 className="section-title-anybody">
              <span style={{ color: '#000000' }}>get</span>
              <span style={{ color: '#676666' }}>in</span>
              <span style={{ color: '#239C05' }}>touch</span>
            </h2>
            <p className="section-desc" style={{ margin: '0 auto 36px auto' }}>
              have a project, role, or architecture challenge? reach out directly below. inquiries go straight to <strong style={{ color: '#0a0a0a' }}>josh.sam.builds@gmail.com</strong>.
            </p>

            <form onSubmit={handleContactSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div>
                  <label htmlFor="contact-name" style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#525252', marginBottom: '6px' }}>Your Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', background: '#fafafa', fontFamily: 'inherit' }}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#525252', marginBottom: '6px' }}>Your Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="e.g. sarah@company.com"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', background: '#fafafa', fontFamily: 'inherit' }}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#525252', marginBottom: '6px' }}>Project or Role Details</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell me about what you are building, team requirements, or timeline..."
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', background: '#fafafa', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <button type="submit" className="hero-btn-primary" style={{ padding: '14px 40px' }}>
                  <span>Send Message</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* ========================================================
           MINIMALIST FOOTER
           ======================================================== */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span style={{ color: '#0a0a0a' }}>joshua</span>
            <span style={{ color: '#239C05', marginLeft: '2px' }}>equere</span>
            <span className="nav-mini-square" style={{ marginLeft: '6px' }} />
          </div>

          <div className="footer-links">
            <a href="mailto:josh.sam.builds@gmail.com">josh.sam.builds@gmail.com</a>
            <span>•</span>
            <a href="tel:+2348074681328">+2348074681328</a>
            <span>•</span>
            <a href="https://github.com/marveloper-8" target="_blank" rel="noopener noreferrer">GitHub</a>
            <span>•</span>
            <a href="https://linkedin.com/in/marveloper" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span>•</span>
            <a href="https://nexalabs.site" target="_blank" rel="noopener noreferrer">NexaLabs</a>
          </div>

          <div className="footer-copy">
            &copy; 2026 Joshua Samuel Equere. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ========================================================
           ACTUAL PDF RESUME MODAL & VIEWER
           ======================================================== */}
      {isCvModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCvModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div className="modal-header-top">
                <div className="modal-title-group">
                  <span className="modal-title">
                    Official Resume <span className="modal-title-sep">|</span> <span className="modal-title-name">Joshua Samuel Equere</span>
                  </span>
                  <span className="modal-subtitle">Joshua Samuel Equere</span>
                </div>
                <button
                  onClick={() => setIsCvModalOpen(false)}
                  className="modal-close-btn modal-close-btn-mobile"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <div className="modal-actions">
                <a
                  href="/resume.pdf"
                  download="Joshua_Samuel_Equere_CV.pdf"
                  className="btn-pill-primary modal-action-btn"
                  title="Download the official PDF resume"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span className="modal-btn-label-desktop">Download PDF</span>
                  <span className="modal-btn-label-mobile">Download</span>
                </a>

                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-secondary modal-action-btn"
                  title="Open PDF in a new tab"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  <span className="modal-btn-label-desktop">Open New Tab</span>
                  <span className="modal-btn-label-mobile">Open Tab</span>
                </a>

                <button
                  onClick={handleCopyAtsText}
                  className="btn-pill-secondary modal-action-btn"
                  title="Copy Plain Text ATS Resume to clipboard"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span className="modal-btn-label-desktop">Copy ATS Text</span>
                  <span className="modal-btn-label-mobile">Copy ATS</span>
                </button>

                <button
                  onClick={() => setIsCvModalOpen(false)}
                  className="modal-close-btn modal-close-btn-desktop"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Actual PDF Viewer in iframe */}
            <div className="modal-body">
              <div className="pdf-preview-container">
                <iframe
                  src="/resume.pdf#toolbar=1&navpanes=0&scrollbar=1"
                  className="pdf-preview-frame"
                  title="Joshua Samuel Equere - Software Engineer Resume"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notice */}
      {toast && (
        <div className="toast-notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#239C05" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toast}</span>
        </div>
      )}
    </>
  );
}
