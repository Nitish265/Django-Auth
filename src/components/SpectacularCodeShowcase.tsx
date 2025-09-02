import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CodeBlock from './CodeBlock';
import { FileText, Database, Shield, Zap, Code, Settings, Terminal, Key, Lock, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CodeFile {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
}

interface SpectacularCodeShowcaseProps {
  title: string;
  description: string;
  codeFiles: CodeFile[];
  className?: string;
}

export const SpectacularCodeShowcase: React.FC<SpectacularCodeShowcaseProps> = ({
  title,
  description,
  codeFiles,
  className = ''
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create floating code particles with amazing effects
      const createSpectacularParticles = () => {
        const particles = ['{}', '[]', '()', '<>', '/>', '&&', '||', '==', 'def', 'class', 'import', 'from', 'async', 'await'];
        
        for (let i = 0; i < 50; i++) {
          const particle = document.createElement('div');
          particle.className = 'code-particle-spectacular';
          particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
          
          const size = 12 + Math.random() * 16;
          const hue = Math.random() * 360;
          
          particle.style.cssText = `
            position: absolute;
            color: hsl(${hue}, 70%, 60%);
            font-family: 'Fira Code', monospace;
            font-size: ${size}px;
            font-weight: bold;
            pointer-events: none;
            z-index: 1;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            text-shadow: 0 0 10px currentColor;
            opacity: 0;
          `;
          
          if (particlesRef.current) {
            particlesRef.current.appendChild(particle);
          }
          
          // Spectacular floating animation with color changes
          gsap.to(particle, {
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 400,
            rotation: Math.random() * 720,
            opacity: 0.8,
            scale: 0.5 + Math.random() * 1.5,
            duration: 10 + Math.random() * 10,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: Math.random() * 3
          });
          
          // Color morphing animation
          gsap.to(particle, {
            filter: `hue-rotate(${Math.random() * 360}deg)`,
            duration: 5 + Math.random() * 5,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
          });
        }
      };

      // Spectacular card entrance animations
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => {
          createSpectacularParticles();
          
          cardsRef.current.forEach((card, index) => {
            if (card) {
              const isEven = index % 2 === 0;
              const direction = isEven ? -1 : 1;
              
              // Epic entrance animation
              gsap.fromTo(card, 
                { 
                  x: direction * 500,
                  y: 200,
                  opacity: 0,
                  rotateY: direction * 45,
                  rotateX: -30,
                  scale: 0.3,
                  filter: 'blur(20px)'
                },
                {
                  x: 0,
                  y: 0,
                  opacity: 1,
                  rotateY: 0,
                  rotateX: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                  duration: 1.8,
                  delay: index * 0.3,
                  ease: "back.out(2)"
                }
              );
              
              // Continuous floating animation
              gsap.to(card, {
                y: -20,
                rotateX: 2,
                rotateY: isEven ? 2 : -2,
                duration: 3 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut",
                delay: index * 0.5
              });

              // Spectacular hover effects
              card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                  scale: 1.05,
                  rotateY: isEven ? 8 : -8,
                  z: 100,
                  boxShadow: '0 30px 60px rgba(59, 130, 246, 0.4), 0 0 50px rgba(147, 51, 234, 0.3)',
                  filter: 'brightness(1.1)',
                  duration: 0.4,
                  ease: "power2.out"
                });
                
                // Create ripple effect on hover
                const ripple = document.createElement('div');
                const rect = card.getBoundingClientRect();
                
                ripple.style.cssText = `
                  position: absolute;
                  width: 200px;
                  height: 200px;
                  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
                  border-radius: 50%;
                  pointer-events: none;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%) scale(0);
                  z-index: 10;
                `;
                
                card.style.position = 'relative';
                card.appendChild(ripple);
                
                gsap.to(ripple, {
                  scale: 3,
                  opacity: 0,
                  duration: 1.2,
                  ease: "power2.out",
                  onComplete: () => ripple.remove()
                });
              });
              
              card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                  scale: 1,
                  rotateY: 0,
                  z: 0,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                  filter: 'brightness(1)',
                  duration: 0.4,
                  ease: "power2.out"
                });
              });
            }
          });
        }
      });

      // Dynamic background morphing
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const bg = sectionRef.current?.querySelector('.morphing-bg') as HTMLElement;
          if (bg) {
            const hue1 = 220 + progress * 60;
            const hue2 = 280 + progress * 80;
            const intensity = 0.1 + progress * 0.2;
            
            gsap.to(bg, {
              background: `
                radial-gradient(circle at ${30 + progress * 40}% ${20 + Math.sin(progress * Math.PI * 2) * 30}%, 
                  hsla(${hue1}, 70%, 50%, ${intensity}) 0%, 
                  hsla(${hue2}, 80%, 60%, ${intensity * 0.7}) 30%,
                  transparent 70%),
                conic-gradient(from ${progress * 360}deg at 80% 80%, 
                  hsla(${hue1 + 30}, 60%, 40%, ${intensity * 0.5}) 0deg,
                  transparent 120deg,
                  hsla(${hue2 - 30}, 70%, 50%, ${intensity * 0.6}) 240deg,
                  transparent 360deg)
              `,
              duration: 0.3
            });
          }
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getFileIcon = (id: string) => {
    const icons = {
      env: Terminal,
      settings: Settings,
      apps: Code,
      mongo: Database,
      indexes: Key,
      security: Shield,
      otp: Lock,
      senders: Zap,
      repositories: Database,
      serializers: FileText,
      authentication: Key,
      views: Users,
      default: FileText
    };
    return icons[id as keyof typeof icons] || icons.default;
  };

  const getFileColor = (id: string) => {
    const colors = {
      env: 'from-green-500 to-emerald-500',
      settings: 'from-blue-500 to-cyan-500',
      apps: 'from-purple-500 to-pink-500',
      mongo: 'from-green-600 to-lime-500',
      indexes: 'from-yellow-500 to-orange-500',
      security: 'from-red-500 to-rose-500',
      otp: 'from-indigo-500 to-purple-500',
      senders: 'from-orange-500 to-red-500',
      repositories: 'from-teal-500 to-cyan-500',
      serializers: 'from-pink-500 to-rose-500',
      authentication: 'from-violet-500 to-purple-500',
      views: 'from-blue-600 to-indigo-500',
      default: 'from-gray-500 to-gray-400'
    };
    return colors[id as keyof typeof colors] || colors.default;
  };

  return (
    <section ref={sectionRef} className={`relative py-32 px-6 overflow-hidden ${className}`}>
      {/* Spectacular morphing background */}
      <div className="morphing-bg absolute inset-0" />
      
      {/* Floating particles container */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {description}
          </p>
        </motion.div>

        <div className="grid gap-16">
          {codeFiles.map((file, index) => {
            const Icon = getFileIcon(file.id);
            const colorClass = getFileColor(file.id);
            
            return (
              <div
                key={file.id}
                ref={el => { if (el) cardsRef.current[index] = el; }}
                className="spectacular-code-card bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-700/50 overflow-hidden shadow-2xl"
                style={{ perspective: '1000px' }}
              >
                <div className="p-8 border-b border-gray-700/50">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${colorClass} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">{file.title}</h3>
                      <p className="text-gray-400 text-lg">{file.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <CodeBlock
                    code={file.code}
                    language={file.language}
                    className="max-h-[600px] overflow-y-auto"
                    animated={true}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpectacularCodeShowcase;