
import React, { useEffect } from 'react';
import './CursorGlow.css';

const CursorGlow = () => {
  useEffect(() => {
    const dots = [];
    const trailLength = 15;
    let animationFrameId;
    let isMoving = false;

    for (let i = 0; i < trailLength; i++) {
      const dot = document.createElement('div');
      dot.className = 'trail-dot';
      dot.style.opacity = '0'; // Initially hidden
      document.body.appendChild(dot);
      dots.push({ element: dot, x: 0, y: 0 });
    }

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let lastMoveTime = Date.now();

    const move = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      lastMoveTime = Date.now();
      isMoving = true;

      dots.forEach((dot) => {
        dot.element.style.opacity = '1';
      });
    };


const animate = () => {
  let x = mouse.x;
  let y = mouse.y;

  dots.forEach((dot, index) => {
    dot.x += (x - dot.x) * 0.2;
    dot.y += (y - dot.y) * 0.2;

    dot.element.style.left = dot.x + 'px';
    dot.element.style.top = dot.y + 'px';

    x = dot.x;
    y = dot.y;
  });

  // 🧠 Auto-hide if no movement for 300ms
  if (Date.now() - lastMoveTime > 300) {
    dots.forEach(dot => {
      dot.element.style.opacity = '0';
      dot.element.style.display = 'none'; // 👈 this line added
    });
  } else {
    dots.forEach(dot => {
      dot.element.style.display = 'block'; // 👈 show when moving
    });
  }

  requestAnimationFrame(animate);
};

    document.addEventListener('mousemove', move);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('mousemove', move);
      dots.forEach((dot) => dot.element.remove());
    };
  }, []);

  return null;
};

export default CursorGlow;