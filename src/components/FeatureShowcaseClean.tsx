import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  title: string;
  description: string;
  icon: string;
  technologies: string[];
}

const features: Feature[] = [
  {
    title: "Advanced JWT Authentication",
    description: "Production-ready JWT implementation with refresh tokens, blacklist management, and secure cookie handling.",
    icon: "🔐",
    technologies: ["JWT", "Refresh Tokens", "Secure Cookies"]
  },
  {
    title: "Multi-Database Support",
    description: "Seamlessly work with both MongoDB and MySQL databases with automatic failover and data synchronization.",
    icon: "🗄️",
    technologies: ["MongoDB", "MySQL", "Data Sync"]
  },
  {
    title: "Email & SMS Verification",
    description: "Complete OTP verification system with email templates and SMS integration for secure user onboarding.",
    icon: "📧",
    technologies: ["Email OTP", "SMS Gateway", "Templates"]
  },
  {
    title: "Advanced Security Features",
    description: "CSRF protection, rate limiting, password encryption, and security headers for enterprise-grade protection.",
    icon: "🛡️",
    technologies: ["CSRF", "Rate Limiting", "Encryption"]
  },
  {
    title: "Profile Management",
    description: "Complete user profile system with image uploads, data validation, and privacy controls.",
    icon: "👤",
    technologies: ["File Upload", "Validation", "Privacy"]
  },
  {
    title: "Admin Dashboard",
    description: "Comprehensive admin interface for user management, analytics, and system monitoring.",
    icon: "📊",
    technologies: ["Admin Panel", "Analytics", "Monitoring"]
  }
];

export default function FeatureShowcaseClean() {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fixed background parallax effect - moves slower than scroll
      gsap.to(backgroundRef.current, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Cards smooth entrance - no crazy animations
      gsap.fromTo(".feature-card", 
        {
          y: 60,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
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
      id="features" 
      className="relative min-h-screen py-20 overflow-hidden"
    >
      {/* Fixed Background - stays in place while content moves */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"
      />
      
      {/* Content Layer */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
            What We're Building
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A complete authentication system with enterprise-grade security features
          </p>
        </div>

        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/50 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">{feature.description}</p>
              <div className="flex flex-wrap gap-2">
                {feature.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
