'use client';

import { useState, useEffect, useRef } from 'react';

export default function ProjectCardCinematic({
  id = '01',
  name = '',
  tagline = '',
  desc = '',
  services = [],
  bgColor = '#F7EFDA',
  bgImage = null,
  aspectRatio = '2338 / 1792',
  logoImage = '',
  iconImage = '',
  infoImage = '',
  appImages = [],
  webImage = '',
  webUrl = '',
  appUrl = '',
  reverse = false,
}) {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [isMinimizingLogo, setIsMinimizingLogo] = useState(false);
  const [searchState, setSearchState] = useState('idle'); // 'idle' | 'expanded' | 'tapped' | 'typing' | 'suggested' | 'launching'
  const [typedText, setTypedText] = useState('');
  const [autocompleteSuffix, setAutocompleteSuffix] = useState('');
  const [phase3State, setPhase3State] = useState('preview'); // 'preview' | 'shifted' | 'typing' | 'typed' | 'tapped'
  const [phase3TypedUrl, setPhase3TypedUrl] = useState('');
  const [isPushing3to4, setIsPushing3to4] = useState(false);
  const [isPushing4to1, setIsPushing4to1] = useState(false);

  const cardRef = useRef(null);
  const timersRef = useRef([]);

  const addTimer = (id) => {
    timersRef.current.push(id);
    return id;
  };

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const getSearchQuery = () => {
    const isLola = id === '01' || name.toLowerCase().includes('lola');
    const isDoneThat = id === '02' || name.toLowerCase().includes('donethat');
    const isBible = id === '03' || name.toLowerCase().includes('bible');
    if (isLola) return 'LOLA - JAMB and WAEC prep';
    if (isDoneThat) return 'DoneThat: Sync';
    if (isBible) return 'Bible Words: Play';
    return name;
  };

  const getWebsiteUrl = () => {
    if (webUrl) return webUrl;
    const isLola = id === '01' || name.toLowerCase().includes('lola');
    const isDoneThat = id === '02' || name.toLowerCase().includes('donethat');
    const isBible = id === '03' || name.toLowerCase().includes('bible');
    if (isLola) return 'https://lolaschools.com';
    if (isBible) return 'https://play.lolaschools.com';
    if (isDoneThat) return 'https://donethat.online';
    return 'https://donethat.online';
  };

  const getInfoAnimClass = () => {
    const isLola = id === '01' || name.toLowerCase().includes('lola');
    const isDoneThat = id === '02' || name.toLowerCase().includes('donethat');
    const isBible = id === '03' || name.toLowerCase().includes('bible');
    if (isLola) return 'anim-lola-info';
    if (isDoneThat) return 'anim-donethat-info';
    if (isBible) return 'anim-bible-info';
    return '';
  };

  const getAppAnimClass = (index) => {
    const isLola = id === '01' || name.toLowerCase().includes('lola');
    const isDoneThat = id === '02' || name.toLowerCase().includes('donethat');
    const isBible = id === '03' || name.toLowerCase().includes('bible');
    if (isLola) return `anim-lola-app-${index}`;
    if (isDoneThat) return `anim-donethat-app-${index}`;
    if (isBible) return `anim-bible-app-${index}`;
    return '';
  };

  // Phase 1 -> Phase 2 Transition
  const advanceFromPhase1 = () => {
    clearAllTimers();
    setIsMinimizingLogo(true);
    addTimer(
      setTimeout(() => {
        setIsMinimizingLogo(false);
        setCurrentPhase(2);
        runPhase2SearchSequence();
      }, 380)
    );
  };

  // Phase 2: iPhone Glass Dock + Spotlight Search Sequence
  const runPhase2SearchSequence = () => {
    setSearchState('idle');
    setTypedText('');
    setAutocompleteSuffix('');

    const query = getSearchQuery();
    const targetLength = Math.min(query.length, Math.floor(Math.random() * 4) + 3);

    // Step 1: Pause after dock & search appear (800ms) -> Expand search bar
    addTimer(
      setTimeout(() => {
        setSearchState('expanded');

        // Step 2: Show blinking cursor & focus (500ms after expanding)
        addTimer(
          setTimeout(() => {
            setSearchState('tapped');

            // Step 3: Start typing lowercase characters (400ms after focus)
            addTimer(
              setTimeout(() => {
                setSearchState('typing');
                let currentIdx = 0;

                const typeNextChar = () => {
                  if (currentIdx < targetLength) {
                    currentIdx++;
                    setTypedText(query.slice(0, currentIdx).toLowerCase());
                    const typingSpeed = 130 + Math.floor(Math.random() * 40);
                    addTimer(setTimeout(typeNextChar, typingSpeed));
                  } else {
                    // Step 4: Autocomplete activates
                    setAutocompleteSuffix(query.slice(targetLength));
                    setSearchState('suggested');

                    // Step 5: Pause (1400ms) for user to see Top Hit card
                    addTimer(
                      setTimeout(() => {
                        setSearchState('launching');

                        // Step 6: Transition to Slide 3
                        addTimer(
                          setTimeout(() => {
                            setCurrentPhase(3);
                            runPhase3WebsiteSequence();
                          }, 350)
                        );
                      }, 1400)
                    );
                  }
                };

                typeNextChar();
              }, 400)
            );
          }, 500)
        );
      }, 800)
    );
  };

  // Phase 3: Mobile App Previews & Website Typing Sequence
  const runPhase3WebsiteSequence = () => {
    setPhase3State('preview');
    setPhase3TypedUrl('');
    setIsPushing3to4(false);

    const url = getWebsiteUrl();

    // Step 1: Previews animate in and rest for 1900ms
    addTimer(
      setTimeout(() => {
        setPhase3State('shifted');

        // Step 2: Pause 550ms before typing begins
        addTimer(
          setTimeout(() => {
            setPhase3State('typing');
            let currentIdx = 0;

            const typeNextUrlChar = () => {
              if (currentIdx < url.length) {
                currentIdx++;
                setPhase3TypedUrl(url.slice(0, currentIdx));
                const speed = 35 + Math.floor(Math.random() * 20);
                addTimer(setTimeout(typeNextUrlChar, speed));
              } else {
                setPhase3State('typed');

                // Step 3: Short pause (500ms), tap effect on Visit button
                addTimer(
                  setTimeout(() => {
                    setPhase3State('tapped');

                    // Step 4: Slide 4 pushes Slide 3 upwards
                    addTimer(
                      setTimeout(() => {
                        setIsPushing3to4(true);
                        setCurrentPhase(4);

                        // Step 5: Hold on Slide 4
                        addTimer(
                          setTimeout(() => {
                            setIsPushing3to4(false);
                            setPhase3State('preview');
                            setPhase3TypedUrl('');

                            // Hold on Slide 4 for 2200ms, then Slide 1 pushes Slide 4 down
                            addTimer(
                              setTimeout(() => {
                                advanceToPhase1FromTop();
                              }, 2200)
                            );
                          }, 750)
                        );
                      }, 220)
                    );
                  }, 500)
                );
              }
            };

            typeNextUrlChar();
          }, 550)
        );
      }, 1900)
    );
  };

  // Phase 4 -> Phase 1: Slide 1 comes from top and pushes Slide 4 downwards
  const advanceToPhase1FromTop = () => {
    clearAllTimers();
    setIsPushing4to1(true);
    setCurrentPhase(1);

    addTimer(
      setTimeout(() => {
        setIsPushing4to1(false);
        // Hold on Phase 1, then repeat loop
        addTimer(
          setTimeout(() => {
            advanceFromPhase1();
          }, 2400)
        );
      }, 750)
    );
  };

  // Start sequence when component mounts or comes into view
  useEffect(() => {
    let observer;
    if (typeof IntersectionObserver !== 'undefined' && cardRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              clearAllTimers();
              // Initial hold on Phase 1
              addTimer(
                setTimeout(() => {
                  advanceFromPhase1();
                }, 1800)
              );
            } else {
              clearAllTimers();
              setCurrentPhase(1);
              setIsMinimizingLogo(false);
              setSearchState('idle');
              setPhase3State('preview');
              setIsPushing3to4(false);
              setIsPushing4to1(false);
            }
          });
        },
        { threshold: 0.25 }
      );
      observer.observe(cardRef.current);
    } else {
      addTimer(
        setTimeout(() => {
          advanceFromPhase1();
        }, 1800)
      );
    }

    return () => {
      clearAllTimers();
      if (observer && cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <article
      ref={cardRef}
      className={`project-case-study-card ${reverse ? 'is-reversed' : ''}`}
      aria-label={`${name} Showcase`}
    >
      {/* ========================================================
           LEFT / DETAILS COLUMN (Matching NexaLabs 100%)
           ======================================================== */}
      <div className="project-card-details-col">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Title */}
          <div>
            <h3
              style={{
                fontFamily: "'Anybody', sans-serif",
                fontSize: '1.55rem',
                fontWeight: 900,
                color: '#0a0a0a',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {name}
            </h3>
          </div>

          {/* Subtitle / Narrative Description */}
          <p
            style={{
              fontSize: '13px',
              color: '#525252',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {desc}
          </p>

          {/* Direct Web & App Live Links Matching NexaLabs */}
          {(webUrl || appUrl) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', paddingTop: '2px' }}>
              {webUrl && (
                <a
                  href={webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link-pill"
                  title="Visit website"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <span>visit website</span>
                </a>
              )}

              {appUrl && (
                <a
                  href={appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link-pill"
                  title="See the iOS app"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <span>see the iOS app</span>
                </a>
              )}
            </div>
          )}

          {/* Capabilities chips */}
          {services && services.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '4px' }}>
              {services.map((srv, idx) => (
                <span key={idx} className="project-srv-chip">
                  {srv}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Direct Project CTA: "Build Yours ↗" */}
        <div style={{ paddingTop: '8px' }}>
          <a
            href="#contact"
            className="project-build-btn"
          >
            <span>Build Yours</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>
      </div>

      {/* ========================================================
           RIGHT / EXPANSIVE SHOWCASE STAGE (Exact Aspect Ratio of NexaLabs)
           ======================================================== */}
      <div className="project-card-stage-col">
        {/* Ambient Subtle Light Green Water Wave Aura */}
        <div className="anim-green-aura" style={{ position: 'absolute', inset: '-6px', borderRadius: '30px', background: 'radial-gradient(circle, rgba(35, 156, 5, 0.12) 0%, transparent 70%)', filter: 'blur(16px)', pointerEvents: 'none', zIndex: 0 }} />

        {/* Presentation Canvas Stage with full rounded border */}
        <div
          className="anim-presentation-glow project-card-canvas-stage"
          style={{
            backgroundColor: bgColor,
            aspectRatio: aspectRatio || '2338 / 1792',
          }}
        >
          {bgImage && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundImage: `url(${bgImage})`,
                opacity: 1,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* ----------------------------------------------------
               PHASE 1: BRAND LOGO (FULL SCREEN CENTERED AT 80%)
               ---------------------------------------------------- */}
          {(currentPhase === 1 || isPushing4to1) && (
            <div
              className={`absolute inset-0 flex items-center justify-center p-6 z-10 ${
                isPushing4to1 ? 'anim-push-down-in z-20' : ''
              }`}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: isPushing4to1 ? 20 : 10,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80%',
                  height: '80%',
                  transition: 'all 0.38s cubic-bezier(0.32, 0, 0.2, 1)',
                  transform: isMinimizingLogo ? 'scale(0)' : 'scale(1)',
                  opacity: isMinimizingLogo ? 0 : 1,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '240px',
                    height: '240px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.65)',
                    filter: 'blur(36px)',
                    pointerEvents: 'none',
                  }}
                />

                <img
                  src={logoImage}
                  alt={`${name} Brand Logo`}
                  className={id === '02' || name.toLowerCase().includes('donethat') ? 'donethat-logo-masked' : ''}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    position: 'relative',
                    zIndex: 10,
                    filter: 'drop-shadow(0 16px 32px rgba(0, 0, 0, 0.12))',
                  }}
                />
              </div>
            </div>
          )}

          {/* ----------------------------------------------------
               PHASE 2: IPHONE GLASS BOTTOM NAV (DOCK) + SPOTLIGHT SEARCH
               ---------------------------------------------------- */}
          {currentPhase === 2 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                zIndex: 10,
                userSelect: 'none',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '320px',
                  height: '320px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.4)',
                  filter: 'blur(40px)',
                  pointerEvents: 'none',
                }}
              />

              <div
                style={{
                  position: 'relative',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  maxWidth: '380px',
                  gap: '14px',
                }}
              >
                {/* Spotlight Search & Top Hit Wrapper */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  {/* Top Hit App Result Card */}
                  {(searchState === 'suggested' || searchState === 'launching') && (
                    <div
                      className="anim-spotlight-card"
                      style={{
                        position: 'absolute',
                        bottom: 'calc(100% + 8px)',
                        zIndex: 30,
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '18px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.95)',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), inset 0 1px 1px #ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        transform: searchState === 'launching' ? 'scale(0.97)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                        <img
                          src={iconImage || logoImage}
                          alt={`${name} App Icon`}
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            objectFit: 'contain',
                            border: '1px solid #f0f0f0',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                          <span
                            style={{
                              fontSize: '12.5px',
                              fontWeight: 700,
                              color: '#0a0a0a',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              lineHeight: 1.2,
                            }}
                          >
                            {getSearchQuery()}
                          </span>
                          <span style={{ fontSize: '10px', color: '#737373', fontWeight: 500, marginTop: '2px' }}>
                            Application • Top Hit
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          background: '#0a0a0a',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          color: '#ffffff',
                          flexShrink: 0,
                        }}
                      >
                        Open
                      </div>
                    </div>
                  )}

                  {/* Spotlight Search Bar */}
                  <div
                    className="anim-dock-search"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      background: searchState === 'idle' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 3px 12px rgba(0,0,0,0.04), inset 0 1px 1px rgba(255,255,255,0.8)',
                      transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                      width: searchState === 'idle' ? '120px' : '100%',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#525252', flexShrink: 0 }}>
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>

                      {searchState === 'idle' ? (
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#525252' }}>Search</span>
                      ) : searchState === 'expanded' ? (
                        <span style={{ fontSize: '11px', color: '#a1a1aa' }}>Search</span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '11.5px', whiteSpace: 'nowrap', overflow: 'hidden', minWidth: 0 }}>
                          <span style={{ color: '#0a0a0a', fontWeight: 600 }}>{typedText}</span>
                          {(searchState === 'tapped' || searchState === 'typing') && (
                            <span style={{ display: 'inline-block', width: '1.5px', height: '14px', background: '#3b82f6', marginLeft: '2px', animation: 'pulse 1s infinite' }} />
                          )}
                          {(searchState === 'suggested' || searchState === 'launching') && (
                            <span style={{ background: 'rgba(0,0,0,0.08)', borderRadius: '4px', padding: '1px 5px', color: '#0a0a0a', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <span>{autocompleteSuffix}</span>
                              <span style={{ color: '#737373' }}>- Open</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Glass iPhone Bottom Nav Dock */}
                <div
                  className="anim-dock-container"
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    borderRadius: '32px',
                    background: 'rgba(255, 255, 255, 0.55)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.06), inset 0 1px 1.5px rgba(255,255,255,0.9)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    alignItems: 'center',
                    justifyItems: 'center',
                  }}
                >
                  {/* Left: Phone Icon */}
                  <div className="anim-dock-icon-left" style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src="/projects/phone-icon.png" alt="Phone" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                  </div>

                  {/* Center: App Icon */}
                  <div className="anim-dock-icon-center" style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                      src={iconImage || logoImage}
                      alt={`${name} App Icon`}
                      style={{
                        width: '52px',
                        height: '52px',
                        objectFit: 'contain',
                        borderRadius: '12px',
                        boxShadow: '0 5px 12px rgba(0,0,0,0.12)',
                      }}
                    />
                  </div>

                  {/* Right: Messages Icon */}
                  <div className="anim-dock-icon-right" style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src="/projects/text-icon.png" alt="Messages" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------
               PHASE 3: MOBILE APP PREVIEWS & WEBSITE URL FIELD
               ---------------------------------------------------- */}
          {(currentPhase === 3 || isPushing3to4) && (
            <div
              className={`absolute inset-0 bg-white flex flex-col items-center justify-center p-4 z-10 overflow-hidden ${
                isPushing3to4 ? 'anim-push-up-out z-10' : ''
              }`}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                zIndex: 10,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '58%',
                  maxWidth: '460px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease-out',
                }}
              >
                {/* Search Input Bar Directly Above info banner */}
                {phase3State !== 'preview' && (
                  <div
                    className="anim-web-search-bar"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      background: 'rgba(245, 245, 245, 0.95)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 3px 12px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#737373', flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>

                      {phase3State === 'shifted' ? (
                        <div style={{ fontSize: '10px', color: '#a1a1aa' }}>
                          <span>enter website</span>
                          <span style={{ display: 'inline-block', width: '1.5px', height: '11px', background: '#3b82f6', marginLeft: '3px' }} />
                        </div>
                      ) : (
                        <div style={{ fontSize: '10.5px', color: '#0a0a0a', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                          <span>{phase3TypedUrl}</span>
                          <span style={{ display: 'inline-block', width: '1.5px', height: '11px', background: '#3b82f6', marginLeft: '2px' }} />
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        padding: '2px 10px',
                        borderRadius: '9999px',
                        fontSize: '9.5px',
                        fontWeight: 700,
                        background: phase3State === 'tapped' ? '#000000' : '#171717',
                        color: '#ffffff',
                        transform: phase3State === 'tapped' ? 'scale(0.92)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Visit
                    </div>
                  </div>
                )}

                {/* Top Info Banner */}
                {infoImage && (
                  <div
                    className={phase3State === 'preview' ? getInfoAnimClass() : ''}
                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                  >
                    <img src={infoImage} alt={`${name} Information`} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                  </div>
                )}

                {/* Bottom 3 App Preview Screenshots */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', width: '100%' }}>
                  {appImages.map((appImg, i) => (
                    <div
                      key={i}
                      className={phase3State === 'preview' ? getAppAnimClass(i) : ''}
                      style={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <img
                        src={appImg}
                        alt={`${name} Preview ${i + 1}`}
                        style={{
                          width: '100%',
                          height: 'auto',
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.12))',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------
               PHASE 4: WEB PLATFORM FULL SCREEN IMAGE SCREENSHOT (CARD PUSH)
               ---------------------------------------------------- */}
          {(currentPhase === 4 || isPushing3to4 || isPushing4to1) && (
            <div
              className={`absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-white ${
                isPushing3to4 ? 'anim-push-up-in z-20' : ''
              } ${isPushing4to1 ? 'anim-push-down-out z-10' : ''} ${
                !isPushing3to4 && !isPushing4to1 ? 'z-10' : ''
              }`}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: isPushing3to4 ? 20 : isPushing4to1 ? 10 : 10,
              }}
            >
              <img
                src={webImage}
                alt={`${name} Web Screenshot`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  display: 'block',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
