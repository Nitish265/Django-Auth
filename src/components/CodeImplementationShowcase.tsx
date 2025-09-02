import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CodeSection {
  title: string;
  description: string;
  code: string;
  language: string;
  icon: string;
}

const codeSections: CodeSection[] = [
  {
    title: "User Registration",
    description: "Complete user registration with email verification and security features",
    language: "python",
    icon: "👤",
    code: `@api_view(['POST'])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        send_verification_email(user.email)
        return Response({
            'message': 'User registered successfully',
            'user_id': user.id
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)`
  },
  {
    title: "JWT Authentication",
    description: "Secure JWT token generation with refresh token mechanism",
    language: "python",
    icon: "🔐",
    code: `def generate_tokens(user):
    refresh = RefreshToken.for_user(user)
    access_token = refresh.access_token
    
    # Add custom claims
    access_token['user_id'] = user.id
    access_token['email'] = user.email
    
    return {
        'access': str(access_token),
        'refresh': str(refresh),
        'expires_in': settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
    }`
  },
  {
    title: "Database Integration",
    description: "Seamless MongoDB and MySQL integration with automatic routing",
    language: "python",
    icon: "🗄️",
    code: `class DatabaseRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'profiles':
            return 'mongodb'
        return 'default'
    
    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'profiles':
            return 'mongodb'
        return 'default'`
  },
  {
    title: "Email Verification",
    description: "Automated email verification with OTP and beautiful templates",
    language: "python",
    icon: "📧",
    code: `def send_verification_email(email):
    otp = generate_otp()
    cache.set(f'otp_{email}', otp, timeout=300)
    
    send_mail(
        subject='Verify Your Email',
        message=f'Your verification code: {otp}',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        html_message=render_email_template('verification', {'otp': otp})
    )`
  }
];

export default function CodeImplementationShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background parallax
      gsap.to(backgroundRef.current, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Code blocks entrance
      gsap.fromTo(".code-block", 
        {
          y: 100,
          opacity: 0,
          rotateX: 15
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.2,
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
        className="absolute inset-0 bg-gradient-to-br from-red-900 via-pink-900 to-purple-900"
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Complete Django Implementation
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Every line of code you need for production-ready Django REST API authentication with advanced security features
          </p>
        </div>

        <div ref={containerRef} className="grid lg:grid-cols-2 gap-8">
          {codeSections.map((section, index) => (
            <div
              key={index}
              className="code-block bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:bg-gray-800/50 transition-all duration-300"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{section.icon}</span>
                  <h3 className="text-2xl font-semibold text-white">{section.title}</h3>
                </div>
                <p className="text-gray-300">{section.description}</p>
              </div>

              {/* Code */}
              <div className="relative">
                <div className="absolute top-4 right-4 px-3 py-1 bg-pink-600/20 text-pink-300 rounded-full text-sm border border-pink-500/30">
                  {section.language}
                </div>
                <pre className="p-6 overflow-x-auto text-sm">
                  <code className="text-green-300 font-mono leading-relaxed">
                    {section.code}
                  </code>
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Build?</h3>
            <p className="text-gray-300 mb-6">
              Get the complete source code with detailed documentation and examples
            </p>
            <button className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
              Download Complete Code
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
