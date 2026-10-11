'use client';

import { useEffect, useRef } from 'react';

export function getAlphabetStrokeWidth(fontSize) {
  if (typeof document !== 'undefined') {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(fontSize * 2);
      canvas.height = Math.ceil(fontSize * 2);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = `${fontSize}px 'Alata', sans-serif`;
        ctx.fillStyle = '#000000';
        ctx.textBaseline = 'middle';
        ctx.fillText('l', fontSize * 0.5, fontSize);
        const imgData = ctx.getImageData(0, Math.floor(fontSize), canvas.width, 1).data;
        let start = -1;
        let end = -1;
        for (let x = 0; x < canvas.width; x++) {
          const alpha = imgData[x * 4 + 3];
          if (alpha > 120) {
            if (start === -1) start = x;
            end = x;
          }
        }
        if (start !== -1 && end >= start) {
          const measured = end - start + 1;
          if (measured > 0) return measured;
        }
      }
    } catch {
      // fallback
    }
  }
  return Math.max(1.5, fontSize * 0.082);
}

function dist(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function getScreenSteps(width) {
  if (width >= 1440) return 7;
  if (width >= 1024) return 6;
  if (width >= 768) return 5;
  return 4;
}

class PointMass {
  constructor(x, y, col, row) {
    this.x = x;
    this.y = y;
    this.lastX = x;
    this.lastY = y;
    this.origX = x;
    this.origY = y;
    this.col = col;
    this.row = row;
    this.isTopRail = (row === 0);
    this.isDragged = false;
  }

  update(dt, mouse, DAMPING, GRAV) {
    if (this.isDragged) return;

    if (this.isTopRail) {
      this.y = 0;
      this.lastY = 0;

      let dmx = 0;
      if (mouse.down && mouse.x !== undefined && mouse.lastX !== undefined) {
        const d = Math.abs(this.x - mouse.x);
        if (d < 80 && mouse.y < 100) {
          dmx = (mouse.x - mouse.lastX) * 0.15;
        }
      }

      const vx = (this.x - this.lastX) * 0.88 + dmx;
      this.lastX = this.x;
      this.x += vx;
      return;
    }

    let dmx = 0;
    let dmy = 0;
    if (mouse.down && mouse.x !== undefined && mouse.lastX !== undefined) {
      const d = dist(this.x, this.y, mouse.x, mouse.y);
      if (d < 70) {
        dmx = (mouse.x - mouse.lastX) * 0.12;
        dmy = (mouse.y - mouse.lastY) * 0.12;
      }
    }

    const vx = (this.x - this.lastX) * DAMPING + dmx;
    const vy = (this.y - this.lastY) * DAMPING + dmy;

    this.lastX = this.x;
    this.lastY = this.y;

    this.x += vx + GRAV[0] * dt * dt;
    this.y += vy + GRAV[1] * dt * dt;
  }
}

class Link {
  constructor(pointA, pointB, rest) {
    this.pointA = pointA;
    this.pointB = pointB;
    this.restDist = rest;
  }

  solve() {
    const dx = this.pointB.x - this.pointA.x;
    const dy = this.pointB.y - this.pointA.y;
    const d = Math.sqrt(dx * dx + dy * dy);

    if (d > 0.0001) {
      const diff = (this.restDist - d) / d;
      const transX = dx * 0.5 * diff;
      const transY = dy * 0.5 * diff;

      if (!this.pointA.isDragged) {
        if (!this.pointA.isTopRail) {
          this.pointA.x -= transX;
          this.pointA.y -= transY;
        } else {
          this.pointA.x -= transX * 0.7;
        }
      }

      if (!this.pointB.isDragged) {
        if (!this.pointB.isTopRail) {
          this.pointB.x += transX;
          this.pointB.y += transY;
        } else {
          this.pointB.x += transX * 0.7;
        }
      }
    }
  }
}

export default function CurtainLoader({
  onComplete = () => {},
  onDock = () => {},
  onSkip = () => {},
  targetSelector = '#landing-brand-square-inner',
  squareSize = 0,
  borderWidth = 0,
}) {
  const canvasRef = useRef(null);

  // Constants
  const BEAT_DURATION = 400;
  const DRAG_OUT_DURATION = 2300;
  const RELAX_DURATION = 400;
  const ROLL_BACK_DURATION = 1200;
  const SETTLE_DURATION = 700;
  const REST_TILT_DEG = 15;

  const FPS = 60;
  const STEP = 1000 / FPS;
  const SOLVES = 3;
  const GRAV = [0, 1600];
  const DAMPING = 0.965;
  const GROMMET_SPACING = 6;

  const stateRef = useRef({
    points: [],
    links: [],
    cols: 0,
    rows: 0,
    restDist: 34,
    lastTime: 0,
    leftoverTime: 0,
    hasDocked: false,
    animationFrameId: null,
    mouse: {
      x: undefined,
      y: undefined,
      lastX: undefined,
      lastY: undefined,
      down: false,
    },
    square: {
      x: -100,
      y: 0,
      lastX: -100,
      lastY: 0,
      angle: 0,
      outerSize: 38.4,
      strokeWidth: 10.5,
      floorY: 0,
      targetLogoX: 0,
      targetLogoY: 0,
      startTime: 0,
      isComplete: false,
    },
  });

  const updateTargetLogoPosition = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();
    const squareInnerEl = document.querySelector(targetSelector)
      || document.querySelector('#landing-brand-square-inner')
      || document.querySelector('#landing-brand-square');
    const brandTextEl = document.querySelector('.hero-brand-text')
      || document.querySelector('#landing-brand-s');

    let currentFontSize = (window.innerWidth < 640 ? 52 : (window.innerWidth < 768 ? 68 : (window.innerWidth < 1024 ? 92 : 120)));
    if (brandTextEl) {
      const parsedFs = parseFloat(window.getComputedStyle(brandTextEl).fontSize);
      if (parsedFs > 0) currentFontSize = parsedFs;
    }

    const calculatedTextHeight = (brandTextEl && brandTextEl.getBoundingClientRect().height > 0)
      ? brandTextEl.getBoundingClientRect().height
      : currentFontSize;

    const ratio = window.innerWidth < 640 ? 0.35 : 0.30;
    const calculatedSize = (squareSize > 0 ? squareSize : (calculatedTextHeight * ratio));
    const calculatedBorder = (borderWidth > 0 ? borderWidth : getAlphabetStrokeWidth(currentFontSize));

    const sq = stateRef.current.square;
    sq.outerSize = calculatedSize;
    sq.strokeWidth = calculatedBorder;

    if (squareInnerEl) {
      const sqRect = squareInnerEl.getBoundingClientRect();
      if (sqRect.width > 0 && sqRect.height > 0) {
        sq.targetLogoX = (sqRect.left + sqRect.right) / 2 - canvasRect.left;
        sq.targetLogoY = (sqRect.top + sqRect.bottom) / 2 - canvasRect.top;
        sq.floorY = sq.targetLogoY + calculatedSize / 2;
        return;
      }
    }

    sq.targetLogoX = window.innerWidth / 2 + (window.innerWidth < 640 ? 60 : 100);
    sq.targetLogoY = window.innerHeight * 0.35;
    sq.floorY = sq.targetLogoY + calculatedSize / 2;
  };

  const initFabric = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const canvasRect = canvas.getBoundingClientRect();
    const width = canvasRect.width || window.innerWidth;
    const height = canvasRect.height || window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const s = stateRef.current;
    s.restDist = width < 640
      ? Math.max(26, Math.floor(width / 16))
      : Math.max(30, Math.min(38, Math.floor(width / 34)));

    const extraRight = width < 640 ? 250 : 350;
    const totalWidth = width + extraRight;
    s.cols = Math.ceil(totalWidth / s.restDist) + 2;

    const extendedHeight = height + 1000;
    s.rows = Math.ceil(extendedHeight / s.restDist) + 8;

    s.points = [];
    s.links = [];

    const startX = 0;
    const startY = 0;

    for (let y = 0; y < s.rows; y++) {
      for (let x = 0; x < s.cols; x++) {
        const px = startX + x * s.restDist;
        const py = startY + y * s.restDist;
        const point = new PointMass(px, py, x, y);

        if (x > 0) {
          const leftPoint = s.points[y * s.cols + (x - 1)];
          s.links.push(new Link(point, leftPoint, s.restDist));
        }

        if (y > 0) {
          const topPoint = s.points[(y - 1) * s.cols + x];
          s.links.push(new Link(point, topPoint, s.restDist));
        }

        s.points.push(point);
      }
    }

    updateTargetLogoPosition();

    const S = s.square.outerSize;
    s.square.x = -S * 2.0;
    s.square.y = s.square.floorY - S / 2;
    s.square.lastX = s.square.x;
    s.square.lastY = s.square.y;
    s.square.angle = 0;
    s.square.isComplete = false;
    s.square.startTime = performance.now();
    s.hasDocked = false;
  };

  const updateSquare = (now) => {
    const s = stateRef.current;
    const sq = s.square;
    updateTargetLogoPosition();
    const elapsed = now - sq.startTime;
    const width = window.innerWidth;
    const S = sq.outerSize;

    // Phase 0: Initial beat
    if (elapsed < BEAT_DURATION) {
      return;
    }

    // Phase 1: Dragging curtain out
    const tDrag = elapsed - BEAT_DURATION;
    if (tDrag < DRAG_OUT_DURATION) {
      const u = Math.min(1, Math.max(0, tDrag / DRAG_OUT_DURATION));
      const startX = -S * 1.5;
      const endX = width + S * 1.5 + 20;
      const totalDist = endX - startX;

      const totalSteps = getScreenSteps(width);
      const stepProgress = u * totalSteps;
      const currentStep = Math.min(totalSteps - 1, Math.floor(stepProgress));
      const localT = stepProgress - currentStep;

      const easeT = localT < 0.5 ? 2 * localT * localT : -1 + (4 - 2 * localT) * localT;
      const currentX = startX + (currentStep + easeT) * (totalDist / totalSteps);
      const liftHeight = Math.sin(localT * Math.PI) * (S * 0.21);
      const currentY = sq.floorY - S / 2 - liftHeight;
      const currentAngle = (currentStep + easeT) * (Math.PI / 2);

      sq.lastX = sq.x;
      sq.lastY = sq.y;
      sq.x = currentX;
      sq.y = currentY;
      sq.angle = currentAngle;

      const halfS = S / 2;
      const rightEdgeOffset = halfS * (Math.abs(Math.cos(currentAngle)) + Math.abs(Math.sin(currentAngle)));
      const leadingEdgeX = currentX + rightEdgeOffset;
      const dragRow = Math.max(0, Math.min(s.rows - 1, Math.round(currentY / s.restDist)));

      for (let y = 0; y < s.rows; y++) {
        const rowOffset = y * s.cols;
        const distFromDragRow = Math.abs(y - dragRow);
        const verticalLag = distFromDragRow * 2.8;
        const edgeX = leadingEdgeX - verticalLag;

        for (let x = 0; x < s.cols; x++) {
          const pt = s.points[rowOffset + x];
          if (!pt) continue;

          const minColX = edgeX + (x * GROMMET_SPACING);
          if (minColX > pt.origX) {
            if (x === 0 && y === dragRow) {
              pt.x = leadingEdgeX;
              pt.lastX = leadingEdgeX - 1;
            } else if (minColX > pt.x) {
              pt.x += (minColX - pt.x) * 0.25;
            }
          }
        }
      }

      for (let c = 1; c < s.cols; c++) {
        const prev = s.points[c - 1];
        const curr = s.points[c];
        if (prev && curr && curr.x < prev.x + GROMMET_SPACING) {
          curr.x = prev.x + GROMMET_SPACING;
        }
      }
      return;
    }

    // Phase 1.5: Relaxing at right edge
    const tRelax = tDrag - DRAG_OUT_DURATION;
    if (tRelax < RELAX_DURATION) {
      const restRightX = width + S * 1.5 + 20;
      sq.x = restRightX;
      sq.y = sq.floorY - S / 2;
      sq.angle = Math.PI * 2;

      const minRelaxX = width - 4;
      for (let y = 0; y < s.rows; y++) {
        const rowOffset = y * s.cols;
        for (let x = 0; x < s.cols; x++) {
          const pt = s.points[rowOffset + x];
          if (pt && pt.x < minRelaxX) {
            pt.x = minRelaxX;
          }
        }
      }
      return;
    }

    // Phase 2: Rolling back to hero position
    const tRollBack = tRelax - RELAX_DURATION;
    if (tRollBack < ROLL_BACK_DURATION) {
      const u = Math.min(1, Math.max(0, tRollBack / ROLL_BACK_DURATION));
      updateTargetLogoPosition();

      const startRollX = width + S * 1.5 + 20;
      const targetX = sq.targetLogoX;
      const targetY = sq.targetLogoY;

      const easeU = u < 0.5 ? 2 * u * u : -1 + (4 - 2 * u) * u;
      const currentX = startRollX + (targetX - startRollX) * easeU;
      const currentY = targetY;

      const totalRevRoll = -Math.PI * 6;
      const restAngleRad = REST_TILT_DEG * Math.PI / 180;
      const currentAngle = totalRevRoll * (1 - easeU) + restAngleRad * easeU;

      sq.lastX = sq.x;
      sq.lastY = sq.y;
      sq.x = currentX;
      sq.y = currentY;
      sq.angle = currentAngle;

      const minRelaxX = width - 4;
      for (let y = 0; y < s.rows; y++) {
        const rowOffset = y * s.cols;
        for (let x = 0; x < s.cols; x++) {
          const pt = s.points[rowOffset + x];
          if (pt && pt.x < minRelaxX) {
            pt.x = minRelaxX;
          }
        }
      }
      return;
    }

    // Phase 3: Settled next to brand mark at 15°
    const tSettle = tRollBack - ROLL_BACK_DURATION;
    if (tSettle < SETTLE_DURATION) {
      updateTargetLogoPosition();
      sq.x = sq.targetLogoX;
      sq.y = sq.targetLogoY;
      sq.angle = REST_TILT_DEG * Math.PI / 180;

      if (!s.hasDocked) {
        s.hasDocked = true;
        onDock();
      }

      const minRelaxX = width - 4;
      for (let y = 0; y < s.rows; y++) {
        const rowOffset = y * s.cols;
        for (let x = 0; x < s.cols; x++) {
          const pt = s.points[rowOffset + x];
          if (pt && pt.x < minRelaxX) {
            pt.x = minRelaxX;
          }
        }
      }
      return;
    }

    // Phase 4: Completion handoff
    if (!sq.isComplete) {
      sq.isComplete = true;
      if (!s.hasDocked) {
        s.hasDocked = true;
        onDock();
      }
      onComplete();
    }
  };

  const drawSolidCurtain = (pen) => {
    const s = stateRef.current;
    if (!s.points.length) return;
    const width = window.innerWidth;

    pen.fillStyle = '#000000';
    pen.strokeStyle = '#000000';
    pen.lineWidth = 1.0;

    pen.beginPath();
    for (let y = 0; y < s.rows - 1; y++) {
      const rowOffset = y * s.cols;
      const nextRowOffset = (y + 1) * s.cols;

      for (let x = 0; x < s.cols - 1; x++) {
        const p00 = s.points[rowOffset + x];
        const p10 = s.points[rowOffset + (x + 1)];
        const p11 = s.points[nextRowOffset + (x + 1)];
        const p01 = s.points[nextRowOffset + x];

        if (!p00 || !p10 || !p11 || !p01) continue;

        pen.moveTo(p00.x, p00.y);
        pen.lineTo(p10.x, p10.y);
        pen.lineTo(p11.x, p11.y);
        pen.lineTo(p01.x, p01.y);
        pen.closePath();
      }
    }
    pen.fill();
    pen.stroke();

    // Fold shadows
    for (let y = 0; y < s.rows - 1; y++) {
      const rowOffset = y * s.cols;
      const nextRowOffset = (y + 1) * s.cols;

      for (let x = 0; x < s.cols - 1; x++) {
        const p00 = s.points[rowOffset + x];
        const p10 = s.points[rowOffset + (x + 1)];
        const p11 = s.points[nextRowOffset + (x + 1)];
        const p01 = s.points[nextRowOffset + x];

        if (!p00 || !p10 || !p11 || !p01) continue;
        if (p00.x > width + 10 && p10.x > width + 10) continue;

        const curDx = Math.max(1, p10.x - p00.x);
        if (curDx < s.restDist * 0.65) {
          const compression = (s.restDist * 0.65 - curDx) / (s.restDist * 0.65);

          pen.beginPath();
          pen.moveTo(p00.x, p00.y);
          pen.lineTo(p10.x, p10.y);
          pen.lineTo(p11.x, p11.y);
          pen.lineTo(p01.x, p01.y);
          pen.closePath();

          pen.fillStyle = `rgba(20, 24, 30, ${(compression * 0.38).toFixed(3)})`;
          pen.fill();
        }
      }
    }
  };

  const drawSteppingSquare = (pen) => {
    const sq = stateRef.current.square;
    pen.save();
    pen.translate(sq.x, sq.y);
    pen.rotate(sq.angle);

    const outerS = sq.outerSize;
    const strokeW = sq.strokeWidth;
    const drawS = Math.max(1, outerS - strokeW);
    const half = drawS / 2;

    pen.shadowBlur = 0;
    pen.strokeStyle = '#239C05';
    pen.lineWidth = strokeW;
    pen.lineJoin = 'miter';
    pen.miterLimit = 10;
    pen.strokeRect(-half, -half, drawS, drawS);

    pen.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    initFabric();

    const loop = (now) => {
      const pen = canvas.getContext('2d');
      if (!pen) return;
      const s = stateRef.current;
      const dpr = window.devicePixelRatio || 1;

      if (!s.lastTime) s.lastTime = now;
      let elapsedTime = now - s.lastTime;
      s.lastTime = now;

      elapsedTime = Math.min(elapsedTime, 35);
      elapsedTime += s.leftoverTime;
      const timesteps = Math.floor(elapsedTime / STEP);
      s.leftoverTime = elapsedTime - timesteps * STEP;

      updateSquare(now);

      for (let i = 0; i < timesteps; i++) {
        for (let solve = 0; solve < SOLVES; solve++) {
          for (let l = 0; l < s.links.length; l++) {
            s.links[l].solve();
          }
        }

        for (let p = 0; p < s.points.length; p++) {
          s.points[p].update(STEP / 1000, s.mouse, DAMPING, GRAV);
        }
      }

      pen.clearRect(0, 0, canvas.width, canvas.height);
      pen.save();
      pen.scale(dpr, dpr);

      drawSolidCurtain(pen);
      drawSteppingSquare(pen);

      pen.restore();

      s.animationFrameId = requestAnimationFrame(loop);
    };

    stateRef.current.animationFrameId = requestAnimationFrame(loop);

    const handleResize = () => {
      initFabric();
    };

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        initFabric();
      } else if (e.code === 'Escape') {
        onSkip();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (stateRef.current.animationFrameId) {
        cancelAnimationFrame(stateRef.current.animationFrameId);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const m = stateRef.current.mouse;
    m.lastX = m.x;
    m.lastY = m.y;
    m.x = e.clientX - rect.left;
    m.y = e.clientY - rect.top;
  };

  const handleMouseDown = () => {
    stateRef.current.mouse.down = true;
  };

  const handleMouseUp = () => {
    stateRef.current.mouse.down = false;
  };

  const handleTouchStart = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches.length) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const m = stateRef.current.mouse;
    m.lastX = touch.clientX - rect.left;
    m.lastY = touch.clientY - rect.top;
    m.x = m.lastX;
    m.y = m.lastY;
    m.down = true;
  };

  const handleTouchMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches.length) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const m = stateRef.current.mouse;
    m.lastX = touch.clientX - rect.left;
    m.lastY = touch.clientY - rect.top;
    m.x = touch.clientX - rect.left;
    m.y = touch.clientY - rect.top;
    m.down = true;
  };

  const handleTouchEnd = () => {
    stateRef.current.mouse.down = false;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: '-250px',
        minHeight: 'calc(100vh + 250px)',
        zIndex: 9999,
        overflow: 'hidden',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: 'grab',
          touchAction: 'none',
          pointerEvents: 'auto',
          display: 'block',
        }}
      />
      {/* Skip button pill */}
      <button
        onClick={onSkip}
        style={{
          position: 'absolute',
          bottom: '280px',
          right: '24px',
          pointerEvents: 'auto',
          background: 'rgba(255, 255, 255, 0.15)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: '9999px',
          padding: '8px 18px',
          fontSize: '12px',
          fontFamily: "'Space Grotesk', sans-serif",
          cursor: 'pointer',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontWeight: 600,
          transition: 'all 0.2s ease',
          zIndex: 10000,
        }}
      >
        Skip Intro
      </button>
    </div>
  );
}
