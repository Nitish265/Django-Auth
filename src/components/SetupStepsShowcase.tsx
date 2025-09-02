import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CodeBlock from './CodeBlock';
import { Terminal, Download, Settings } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SetupStep {
  step: number;
  title: string;
  description: string;
  commands: string[];
}

interface SetupStepsShowcaseProps {
  title: string;
  steps: SetupStep[];
}

export const SetupStepsShowcase: React.FC<SetupStepsShowcaseProps> = ({ title, steps }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background parallax effect
      // TRUE PARALLAX - Background moves dramatically slower
      gsap.to(backgroundRef.current, {
        y: "-50%", // Much more dramatic movement
        rotation: 10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true // Real parallax
        }
      });

      // Title parallax entrance
      gsap.fromTo(titleRef.current,
        {
          y: 100,
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Timeline animation
      if (timelineRef.current) {
        gsap.fromTo(timelineRef.current,
          { scaleY: 0, transformOrigin: 'top' },
          { 
            scaleY: 1, 
            duration: 2, 
            ease: "power2.out",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Steps parallax animations
      stepsRef.current.forEach((step, index) => {
        if (step) {
          const isEven = index % 2 === 0;
          
          // Entrance animation
          gsap.fromTo(step,
            {
              x: isEven ? -400 : 400,
              y: 100,
              opacity: 0,
              rotateY: isEven ? -30 : 30,
              scale: 0.7,
              filter: 'blur(10px)'
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              rotateY: 0,
              scale: 1,
              filter: 'blur(0px)',
              duration: 1.5,
              delay: index * 0.4,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: step,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );

          // TRUE PARALLAX - Steps move at different speeds during scroll
          gsap.to(step, {
            y: isEven ? 100 : -100, // Dramatic alternating movement
            x: isEven ? 30 : -30,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true // Real parallax movement
            }
          });

          // Continuous subtle animation
          gsap.to(step, {
            y: -10,
            duration: 3 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: index * 0.5
          });

          // Hover effects
          step.addEventListener('mouseenter', () => {
            gsap.to(step, {
              scale: 1.05,
              rotateY: isEven ? 5 : -5,
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3), 0 0 30px rgba(147, 51, 234, 0.2)',
              duration: 0.3,
              ease: "power2.out"
            });
          });

          step.addEventListener('mouseleave', () => {
            gsap.to(step, {
              scale: 1,
              rotateY: 0,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              duration: 0.3,
              ease: "power2.out"
            });
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getStepIcon = (stepNumber: number) => {
    const icons = [Download, Terminal, Settings];
    const Icon = icons[stepNumber] || Terminal;
    return Icon;
  };

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {title}
          </h2>
        </motion.div>

        <div className="relative">
          {/* Animated timeline */}
          <div 
            ref={timelineRef}
            className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 shadow-lg"
            style={{ height: '100%', zIndex: 1 }}
          />

          <div className="space-y-24">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              const Icon = getStepIcon(step.step);
              
              return (
                <div
                  key={step.step}
                  ref={el => { if (el) stepsRef.current[index] = el; }}
                  className={`flex items-center ${isEven ? 'flex-row' : 'flex-row-reverse'} relative z-10`}
                  style={{ perspective: '1000px' }}
                >
                  {/* Step content */}
                  <div className={`w-5/12 ${isEven ? 'pr-16' : 'pl-16'}`}>
                    <div className="bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                          <p className="text-gray-400">{step.description}</p>
                        </div>
                      </div>
                      
                      <CodeBlock
                        code={step.commands.join('\n')}
                        language="bash"
                        className="max-h-64 overflow-y-auto"
                        animated={true}
                      />
                    </div>
                  </div>

                  {/* Step number circle */}
                  <div className="w-2/12 flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg border-4 border-gray-800">
                      {step.step}
                    </div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="w-5/12" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SetupStepsShowcase;