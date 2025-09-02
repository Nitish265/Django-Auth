import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Technology {
  name: string;
  reason: string;
  icon: string;
  color: string;
}

interface TechStackShowcaseProps {
  title: string;
  technologies: Technology[];
}

export const TechStackShowcase: React.FC<TechStackShowcaseProps> = ({ title, technologies }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const connectionsRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
            // TRUE PARALLAX - Background moves much slower than scroll
      gsap.to(backgroundRef.current, {
        y: "-40%", // Dramatic background movement
        rotation: 5,
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
          y: 120,
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

      // Create animated connections between tech cards
      const createConnections = () => {
        if (!connectionsRef.current) return;
        
        const svg = connectionsRef.current;
        const paths = svg.querySelectorAll('path');
        
        paths.forEach((path, index) => {
          const length = (path as SVGPathElement).getTotalLength();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
            opacity: 0
          });
          
          gsap.to(path, {
            strokeDashoffset: 0,
            opacity: 0.3,
            duration: 2,
            delay: index * 0.3,
            ease: "power2.inOut"
          });
        });
      };

      // Tech cards parallax animations
      cardsRef.current.forEach((card, index) => {
        if (card) {
          // Orbital entrance animation
          const angle = (index * 72) * (Math.PI / 180);
          const radius = 200;
          const startX = Math.cos(angle) * radius;
          const startY = Math.sin(angle) * radius;
          
          gsap.fromTo(card,
            {
              x: startX,
              y: startY,
              opacity: 0,
              scale: 0.3,
              rotation: angle * (180 / Math.PI),
              filter: 'blur(20px)'
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
              rotation: 0,
              filter: 'blur(0px)',
              duration: 2,
              delay: index * 0.2,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );

          // TRUE PARALLAX - Each tech card moves at different speeds
          gsap.to(card, {
            y: (index % 2 === 0 ? 120 : -80), // Dramatic movement differences
            x: (index % 3 === 0 ? 40 : -40),
            rotation: (index % 2 === 0 ? 8 : -8),
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true // Real parallax - immediate response
            }
          });

          // Orbital floating animation
          gsap.to(card, {
            rotation: 360,
            duration: 20 + index * 5,
            repeat: -1,
            ease: "none"
          });

          // Pulsing glow effect
          gsap.to(card, {
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.6), 0 0 60px rgba(147, 51, 234, 0.4)',
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: index * 0.4
          });

          // Interactive hover effects
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              scale: 1.15,
              z: 100,
              boxShadow: '0 0 50px rgba(59, 130, 246, 0.8), 0 0 100px rgba(147, 51, 234, 0.6)',
              duration: 0.3,
              ease: "power2.out"
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              scale: 1,
              z: 0,
              duration: 0.3,
              ease: "power2.out"
            });
          });
        }
      });

      // Trigger connections animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        onEnter: createConnections
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 relative overflow-hidden">
      {/* Animated parallax background */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-blue-900"
      >
        <div className="absolute inset-0 opacity-10">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-px bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Animated connection lines */}
      <svg
        ref={connectionsRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        
        {/* Create connecting paths between technologies */}
        <path
          d="M 200 300 Q 400 200 600 300"
          stroke="url(#connectionGradient)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 600 300 Q 800 400 1000 300"
          stroke="url(#connectionGradient)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 300 500 Q 500 300 700 500"
          stroke="url(#connectionGradient)"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            {title}
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-12">
          {technologies.map((tech, index) => (
            <div
              key={index}
              ref={el => { if (el) cardsRef.current[index] = el; }}
              className="bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl max-w-sm"
              style={{ perspective: '1000px' }}
            >
              <div className="text-center">
                <div className={`w-20 h-20 bg-gradient-to-r ${tech.color} rounded-2xl flex items-center justify-center text-4xl shadow-lg mx-auto mb-6`}>
                  {tech.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{tech.name}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{tech.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackShowcase;