import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CodeBlock from './CodeBlock';
import { FileText, Database, Shield, Zap, Code, Settings } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CodeFile {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
}

interface EnhancedCodeSectionProps {
  title: string;
  description: string;
  codeFiles: CodeFile[];
  className?: string;
}

export const EnhancedCodeSection: React.FC<EnhancedCodeSectionProps> = ({
  title,
  description,
  codeFiles,
  className = ''
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating code particles animation
      const createFloatingParticles = () => {
        for (let i = 0; i < 20; i++) {
          const particle = document.createElement('div');
          particle.className = 'code-particle';
          particle.innerHTML = ['{}', '[]', '()', '<>', '/>', '&&', '||', '=='][Math.floor(Math.random() * 8)];
          particle.style.cssText = `
            position: absolute;
            color: rgba(59, 130, 246, 0.1);
            font-family: monospace;
            font-size: ${12 + Math.random() * 8}px;
            pointer-events: none;
            z-index: 1;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
          `;
          
          if (sectionRef.current) {
            sectionRef.current.appendChild(particle);
          }
          
          gsap.to(particle, {
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            rotation: Math.random() * 360,
            opacity: 0.3,
            duration: 8 + Math.random() * 4,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: Math.random() * 2
          });
        }
      };

      // Side-sliding cards animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => {
          createFloatingParticles();
          
          cardsRef.current.forEach((card, index) => {
            if (card) {
              const isEven = index % 2 === 0;
              gsap.fromTo(card, 
                { 
                  x: isEven ? -200 : 200,
                  opacity: 0,
                  rotateY: isEven ? -15 : 15,
                  scale: 0.9
                },
                {
                  x: 0,
                  opacity: 1,
                  rotateY: 0,
                  scale: 1,
                  duration: 1.2,
                  delay: index * 0.2,
                  ease: "power3.out"
                }
              );
              
              // Ripple effect on hover
              card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                  scale: 1.02,
                  boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)',
                  duration: 0.3
                });
              });
              
              card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                  scale: 1,
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                  duration: 0.3
                });
              });
            }
          });
        }
      });

      // Morphing background animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const bg = sectionRef.current?.querySelector('.morphing-bg') as HTMLElement;
          if (bg) {
            gsap.to(bg, {
              background: `radial-gradient(circle at ${50 + progress * 20}% ${50 + Math.sin(progress * Math.PI) * 20}%, 
                          rgba(59, 130, 246, ${0.1 + progress * 0.1}) 0%, 
                          rgba(147, 51, 234, ${0.05 + progress * 0.05}) 50%, 
                          transparent 100%)`,
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
      settings: Settings,
      authentication: Shield,
      repositories: Database,
      views: Code,
      default: FileText
    };
    return icons[id as keyof typeof icons] || icons.default;
  };

  return (
    <section ref={sectionRef} className={`relative py-20 px-6 overflow-hidden ${className}`}>
      {/* Morphing background */}
      <div className="morphing-bg absolute inset-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </motion.div>

        <div className="grid gap-8">
          {codeFiles.map((file, index) => {
            const Icon = getFileIcon(file.id);
            return (
              <div
                key={file.id}
                ref={el => { if (el) cardsRef.current[index] = el; }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{file.title}</h3>
                      <p className="text-gray-400">{file.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <CodeBlock
                    code={file.code}
                    language={file.language}
                    className="max-h-96 overflow-y-auto"
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

export default EnhancedCodeSection;