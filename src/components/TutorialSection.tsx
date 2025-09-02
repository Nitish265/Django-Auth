import React from 'react';
import { motion } from 'framer-motion';
import CodeBlock from './CodeBlock';

interface TutorialSectionProps {
  id: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

export const TutorialSection: React.FC<TutorialSectionProps> = ({
  id,
  title,
  description,
  children,
  className = ''
}) => {
  return (
    <section 
      id={id} 
      className={`tutorial-section min-h-screen py-20 px-6 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </motion.div>
        
        <div className="section-content">
          {children}
        </div>
      </div>
    </section>
  );
};

export default TutorialSection;