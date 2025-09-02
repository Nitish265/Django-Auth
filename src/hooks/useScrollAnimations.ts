import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimations = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animations
      gsap.fromTo('.hero-title .word', 
        { 
          opacity: 0, 
          y: 100,
          rotateX: -90 
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out"
        }
      );

      gsap.fromTo('.hero-subtitle', 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          delay: 1.5,
          ease: "power2.out"
        }
      );

      // Floating icons animation
      gsap.to('.floating-icon', {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        stagger: 0.3
      });

      // Hero scroll-out animation
      ScrollTrigger.create({
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to('.hero-content', {
            y: -progress * 200,
            opacity: 1 - progress * 0.8,
            duration: 0.3
          });
          gsap.to('.hero-bg', {
            y: -progress * 100,
            scale: 1 + progress * 0.2,
            duration: 0.3
          });
        }
      });

      // Section reveal animations
      gsap.utils.toArray<HTMLElement>('.tutorial-section').forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          onEnter: () => {
            const titleElement = section.querySelector('.section-title');
            const contentElements = section.querySelectorAll('.section-content > *');
            
            if (titleElement) {
              gsap.fromTo(titleElement, 
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
              );
            }
            
            if (contentElements.length > 0) {
              gsap.fromTo(contentElements, 
                { opacity: 0, y: 30 },
                { 
                  opacity: 1, 
                  y: 0, 
                  duration: 0.8, 
                  stagger: 0.1,
                  delay: 0.2,
                  ease: "power2.out" 
                }
              );
            }
          }
        });
      });

      // Code typing animation
      const animateCodeTyping = (element: Element, text: string) => {
        const lines = text.split('\n');
        let currentLine = 0;
        
        const typeNextLine = () => {
          if (currentLine < lines.length) {
            const lineElement = document.createElement('div');
            lineElement.className = 'code-line';
            element.appendChild(lineElement);
            
            gsap.to(lineElement, {
              duration: 0.02 * lines[currentLine].length,
              ease: "none",
              onUpdate: function() {
                const progress = this.progress();
                const currentText = lines[currentLine].substring(0, Math.floor(progress * lines[currentLine].length));
                lineElement.textContent = currentText;
              },
              onComplete: () => {
                // Add glow effect to completed line
                gsap.to(lineElement, {
                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                  duration: 0.3,
                  yoyo: true,
                  repeat: 1
                });
                currentLine++;
                setTimeout(typeNextLine, 200);
              }
            });
          }
        };
        
        typeNextLine();
      };

      // Setup section typing animation
      ScrollTrigger.create({
        trigger: '.env-code-block',
        start: 'top 60%',
        onEnter: () => {
          const codeBlock = document.querySelector('.env-code-block code');
          if (codeBlock) {
            animateCodeTyping(codeBlock, codeBlock.textContent || '');
          }
        }
      });

      // OTP lifecycle timeline
      ScrollTrigger.create({
        trigger: '.otp-timeline',
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to('.timeline-progress', {
            scaleX: progress,
            duration: 0.3
          });
          
          // Animate timeline steps
          gsap.utils.toArray<HTMLElement>('.timeline-step').forEach((step, index) => {
            const stepProgress = Math.max(0, Math.min(1, (progress * 4) - index));
            gsap.to(step, {
              opacity: stepProgress,
              scale: 0.8 + (stepProgress * 0.2),
              duration: 0.3
            });
          });
        }
      });

      // Playground section animations
      ScrollTrigger.create({
        trigger: '.playground-section',
        start: 'top 60%',
        onEnter: () => {
          gsap.fromTo('.playground-form', 
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 1, ease: "power2.out" }
          );
          gsap.fromTo('.playground-response', 
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 1, delay: 0.3, ease: "power2.out" }
          );
        }
      });

      // API cards stagger animation
      ScrollTrigger.create({
        trigger: '.api-reference',
        start: 'top 70%',
        onEnter: () => {
          gsap.fromTo('.api-card', 
            { opacity: 0, y: 50, rotateY: -15 },
            { 
              opacity: 1, 
              y: 0, 
              rotateY: 0,
              duration: 0.8, 
              stagger: 0.15,
              ease: "power2.out" 
            }
          );
        }
      });

      // FAQ accordion animations
      ScrollTrigger.create({
        trigger: '.faq-section',
        start: 'top 70%',
        onEnter: () => {
          gsap.fromTo('.faq-item', 
            { opacity: 0, x: -30 },
            { 
              opacity: 1, 
              x: 0,
              duration: 0.6, 
              stagger: 0.1,
              ease: "power2.out" 
            }
          );
        }
      });

      // Finale confetti animation
      ScrollTrigger.create({
        trigger: '.finale-section',
        start: 'top 50%',
        onEnter: () => {
          // Create confetti particles
          for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-particle';
            confetti.style.cssText = `
              position: absolute;
              width: 10px;
              height: 10px;
              background: hsl(${Math.random() * 360}, 70%, 60%);
              top: 50%;
              left: 50%;
              pointer-events: none;
              z-index: 1000;
            `;
            document.body.appendChild(confetti);
            
            gsap.to(confetti, {
              x: (Math.random() - 0.5) * 800,
              y: (Math.random() - 0.5) * 600,
              rotation: Math.random() * 360,
              opacity: 0,
              duration: 2 + Math.random() * 2,
              ease: "power2.out",
              onComplete: () => confetti.remove()
            });
          }
          
          gsap.fromTo('.finale-title', 
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, duration: 1.5, ease: "back.out(1.7)" }
          );
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
};