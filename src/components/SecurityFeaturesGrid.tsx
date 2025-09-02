import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SecurityFeature {
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface SecurityFeaturesGridProps {
  features: SecurityFeature[];
}

export const SecurityFeaturesGrid: React.FC<SecurityFeaturesGridProps> = ({ features }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: gridRef.current,
        start: 'top 70%',
        onEnter: () => {
          cardsRef.current.forEach((card, index) => {
            if (card) {
              // Staggered entrance with bounce
              gsap.fromTo(card,
                {
                  y: 100,
                  opacity: 0,
                  rotateX: -90,
                  scale: 0.8
                },
                {
                  y: 0,
                  opacity: 1,
                  rotateX: 0,
                  scale: 1,
                  duration: 1,
                  delay: index * 0.15,
                  ease: "back.out(1.7)"
                }
              );

              // Floating animation
              gsap.to(card, {
                y: -10,
                duration: 2 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut",
                delay: index * 0.2
              });

              // Hover effects with ripple
              card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
                  duration: 0.3
                });
              });

              card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                  scale: 1,
                  rotateY: 0,
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                  duration: 0.3
                });
              });
            }
          });
        }
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          ref={el => { if (el) cardsRef.current[index] = el; }}
          className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 overflow-hidden group cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Animated background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
          
          {/* Icon with pulse effect */}
          <div className="relative z-10 mb-6">
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <div className={`absolute -inset-4 bg-gradient-to-r ${feature.color} rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
          </div>
          
          <div className="relative z-10">
            <h4 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
              {feature.title}
            </h4>
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
              {feature.description}
            </p>
          </div>

          {/* Ripple effect overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SecurityFeaturesGrid;