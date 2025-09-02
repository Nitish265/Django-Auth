import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Technology {
  name: string;
  description: string;
  icon: string;
  reason: string;
}

const technologies: Technology[] = [
  {
    name: "Django REST Framework",
    description: "Powerful and flexible toolkit for building Web APIs",
    icon: "🐍",
    reason: "Industry standard for Python APIs with excellent security features"
  },
  {
    name: "MongoDB",
    description: "NoSQL database for flexible document storage",
    icon: "🍃",
    reason: "Perfect for user profiles and dynamic data structures"
  },
  {
    name: "MySQL",
    description: "Reliable relational database for structured data",
    icon: "🐬",
    reason: "ACID compliance and proven reliability for authentication data"
  },
  {
    name: "Redis",
    description: "In-memory data structure store for caching",
    icon: "⚡",
    reason: "Lightning-fast session management and rate limiting"
  },
  {
    name: "JWT",
    description: "JSON Web Tokens for secure authentication",
    icon: "🔑",
    reason: "Stateless authentication perfect for microservices"
  },
  {
    name: "Celery",
    description: "Distributed task queue for background jobs",
    icon: "🌾",
    reason: "Handle email sending and heavy operations asynchronously"
  }
];

export default function TechStackShowcaseClean() {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background parallax - fixed background effect
      gsap.to(backgroundRef.current, {
        yPercent: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Tech cards entrance
      gsap.fromTo(".tech-card", 
        {
          y: 80,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen py-20 overflow-hidden"
    >
      {/* Fixed Background */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900"
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Tech Stack & Why
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Carefully chosen technologies that work together seamlessly
          </p>
        </div>

        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="tech-card bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/50 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{tech.icon}</div>
              <h3 className="text-2xl font-semibold text-white mb-3">{tech.name}</h3>
              <p className="text-gray-300 mb-4">{tech.description}</p>
              <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-3">
                <p className="text-purple-300 text-sm font-medium">Why we chose it:</p>
                <p className="text-purple-200 text-sm mt-1">{tech.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
