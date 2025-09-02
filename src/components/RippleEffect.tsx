import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface RippleEffectProps {
  trigger: string;
  color?: string;
  size?: number;
}

export const RippleEffect: React.FC<RippleEffectProps> = ({ 
  trigger, 
  color = 'rgba(59, 130, 246, 0.3)', 
  size = 100 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const triggerElements = document.querySelectorAll(trigger);
    
    const createRipple = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const ripple = document.createElement('div');
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, ${color} 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${x - size/2}px;
        top: ${y - size/2}px;
        transform: scale(0);
      `;
      
      containerRef.current.appendChild(ripple);
      
      gsap.to(ripple, {
        scale: 3,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => ripple.remove()
      });
    };
    
    triggerElements.forEach(el => {
      el.addEventListener('click', createRipple as EventListener);
    });
    
    return () => {
      triggerElements.forEach(el => {
        el.removeEventListener('click', createRipple as EventListener);
      });
    };
  }, [trigger, color, size]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50" />;
};

export default RippleEffect;