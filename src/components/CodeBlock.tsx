import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CodeBlockProps {
  code: string;
  language?: string;
  fileName?: string;
  animated?: boolean;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ 
  code, 
  language = 'javascript', 
  fileName, 
  animated = false,
  className = '' 
}) => {
  const [copied, setCopied] = useState(false);
  const [displayedCode, setDisplayedCode] = useState(animated ? '' : code);

  useEffect(() => {
    if (animated && code) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= code.length) {
          setDisplayedCode(code.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [code, animated]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {fileName && (
        <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono border-b border-gray-700 rounded-t-lg">
          {fileName}
        </div>
      )}
      
      <div className="relative bg-gray-900 rounded-lg overflow-hidden">
        <button
          onClick={copyToClipboard}
          className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-10"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </button>

        <pre className="p-6 overflow-x-auto text-sm">
          <code className={`language-${language} text-gray-100`}>
            {displayedCode}
            {animated && displayedCode.length < code.length && (
              <span className="animate-pulse bg-blue-400 w-2 h-5 inline-block ml-1" />
            )}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;