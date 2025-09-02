import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  title: string;
  details: string[];
  icon: string;
  color: string;
}

interface FeatureShowcaseProps {
  title: string;
  features: Feature[];
}

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({ title, features }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
            // TRUE PARALLAX - Background moves slower than scroll
      gsap.to(backgroundRef.current, {
        y: "-30%", // Much more dramatic movement
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true // Immediate response to scroll
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

      // Cards parallax effects
      cardsRef.current.forEach((card, index) => {
        if (card) {
          const direction = index % 2 === 0 ? -1 : 1;
          
          // Entrance animation with parallax
          gsap.fromTo(card,
            {
              y: 200,
              x: direction * 300,
              opacity: 0,
              rotateY: direction * 45,
              scale: 0.5,
              filter: 'blur(10px)'
            },
            {
              y: 0,
              x: 0,
              opacity: 1,
              rotateY: 0,
              scale: 1,
              filter: 'blur(0px)',
              duration: 1.5,
              delay: index * 0.2,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );

          // TRUE PARALLAX - Cards move at different speeds during scroll
          gsap.to(card, {
            y: direction * 150, // Much more dramatic parallax movement
            x: direction * 30,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true // Immediate response = true parallax
            }
          });

          // Continuous floating animation
          gsap.to(card, {
            y: -15,
            rotation: direction * 2,
            duration: 3 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: index * 0.3
          });

          // Spectacular hover effects
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              scale: 1.08,
              rotateY: direction * 8,
              z: 50,
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)',
              duration: 0.4,
              ease: "power2.out"
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              scale: 1,
              rotateY: 0,
              z: 0,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              duration: 0.4,
              ease: "power2.out"
            });
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 relative overflow-hidden">
      {/* Animated parallax background */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
      >
        <div className="absolute inset-0 opacity-20">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {title}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={el => { if (el) cardsRef.current[index] = el; }}
              className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl"
              style={{ perspective: '1000px' }}
            >
              <div className="flex items-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-3xl shadow-lg mr-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
              </div>
              
              <ul className="space-y-3">
                {feature.details.map((detail, detailIndex) => (
                  <motion.li
                    key={detailIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: detailIndex * 0.1 }}
                    viewport={{ once: true }}
                    className="text-gray-300 flex items-start"
                  >
                    <span className="text-blue-400 mr-3 mt-1">•</span>
                    {detail}
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;