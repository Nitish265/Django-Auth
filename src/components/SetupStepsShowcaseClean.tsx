import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Step {
  title: string;
  description: string;
  code: string;
  icon: string;
}

const steps: Step[] = [
  {
    title: "Clone & Setup",
    description: "Get the complete codebase and set up your development environment",
    code: "git clone https://github.com/your-repo/django-auth\ncd django-auth\npip install -r requirements.txt",
    icon: "📁"
  },
  {
    title: "Database Configuration",
    description: "Configure both MongoDB and MySQL connections",
    code: "# settings.py\nDATABASES = {\n    'default': {...},\n    'mongodb': {...}\n}",
    icon: "🗄️"
  },
  {
    title: "Environment Variables",
    description: "Set up your environment variables for security",
    code: "SECRET_KEY=your-secret-key\nMONGO_URI=mongodb://localhost:27017\nEMAIL_HOST_PASSWORD=your-password",
    icon: "🔐"
  },
  {
    title: "Run Migrations",
    description: "Initialize your database with the authentication schema",
    code: "python manage.py makemigrations\npython manage.py migrate\npython manage.py createsuperuser",
    icon: "⚡"
  },
  {
    title: "Start Development",
    description: "Launch your authentication server and start building",
    code: "python manage.py runserver\n# Visit http://localhost:8000/api/docs/",
    icon: "🚀"
  }
];

export default function SetupStepsShowcaseClean() {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background parallax
      gsap.to(backgroundRef.current, {
        yPercent: -60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Timeline appears
      gsap.fromTo(timelineRef.current,
        {
          scaleY: 0,
          opacity: 0
        },
        {
          scaleY: 1,
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Steps entrance
      gsap.fromTo(".setup-step", 
        {
          x: (index) => index % 2 === 0 ? -60 : 60,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 70%",
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
        className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-teal-900 to-green-900"
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent mb-6">
            Getting Started
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Follow these simple steps to get your authentication system running
          </p>
        </div>

        <div ref={stepsRef} className="relative max-w-4xl mx-auto">
          {/* Timeline */}
          <div 
            ref={timelineRef}
            className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-teal-400 to-green-400 h-full rounded-full"
          />

          {/* Steps */}
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`setup-step flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Step Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                    <div className={`text-3xl mb-4 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-300 mb-4">{step.description}</p>
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/30">
                      <pre className="text-green-300 text-sm overflow-x-auto">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className="w-2/12 flex justify-center">
                  <div className="w-6 h-6 bg-teal-400 rounded-full border-4 border-gray-900 z-10" />
                </div>

                {/* Empty Space */}
                <div className="w-5/12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
