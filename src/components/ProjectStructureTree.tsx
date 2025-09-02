import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TreeNode {
  name: string;
  type: 'file' | 'folder';
  description?: string;
  children?: TreeNode[];
}

interface ProjectStructureTreeProps {
  structure: TreeNode[];
  title: string;
  description: string;
}

export const ProjectStructureTree: React.FC<ProjectStructureTreeProps> = ({
  structure,
  title,
  description
}) => {
  const treeRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: treeRef.current,
        start: 'top 70%',
        onEnter: () => {
          // Animate tree nodes with ripple effect
          nodesRef.current.forEach((node, index) => {
            if (node) {
              gsap.fromTo(node,
                {
                  x: -50,
                  opacity: 0,
                  scale: 0.9
                },
                {
                  x: 0,
                  opacity: 1,
                  scale: 1,
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "back.out(1.7)"
                }
              );

              // Add ripple effect on click
              node.addEventListener('click', (e) => {
                const ripple = document.createElement('div');
                const rect = node.getBoundingClientRect();
                const size = 100;
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                  position: absolute;
                  width: ${size}px;
                  height: ${size}px;
                  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
                  border-radius: 50%;
                  pointer-events: none;
                  left: ${x}px;
                  top: ${y}px;
                  transform: scale(0);
                `;

                node.style.position = 'relative';
                node.appendChild(ripple);

                gsap.to(ripple, {
                  scale: 2,
                  opacity: 0,
                  duration: 0.6,
                  ease: "power2.out",
                  onComplete: () => ripple.remove()
                });
              });
            }
          });
        }
      });
    }, treeRef);

    return () => ctx.revert();
  }, []);

  const renderNode = (node: TreeNode, depth = 0, index = 0) => {
    const Icon = node.type === 'folder' ? Folder : File;
    const isFolder = node.type === 'folder';
    
    return (
      <div key={`${node.name}-${depth}-${index}`} className="tree-node">
        <div
          ref={el => { if (el) nodesRef.current.push(el); }}
          className={`flex items-center space-x-3 py-2 px-4 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-700/50 ${
            isFolder ? 'text-blue-400' : 'text-gray-300'
          }`}
          style={{ marginLeft: `${depth * 24}px` }}
        >
          {isFolder && (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
          <Icon className={`w-5 h-5 ${isFolder ? 'text-blue-400' : 'text-gray-400'}`} />
          <span className="font-mono text-sm">{node.name}</span>
          {node.description && (
            <span className="text-xs text-gray-500 ml-2">// {node.description}</span>
          )}
        </div>
        
        {node.children && (
          <div className="ml-4">
            {node.children.map((child, childIndex) => 
              renderNode(child, depth + 1, childIndex)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={treeRef} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <h3 className="text-3xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </motion.div>

      <div className="space-y-1">
        {structure.map((node, index) => renderNode(node, 0, index))}
      </div>
    </div>
  );
};

export default ProjectStructureTree;