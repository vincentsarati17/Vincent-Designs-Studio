
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TypingEffectProps {
  text: string;
  className?: string;
}

const TypingEffect = ({ text, className }: TypingEffectProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, 50); // Adjust typing speed here (in ms)

    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <p className={className}>
      {displayedText}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: isTyping ? [0, 1, 0] : 1 }}
        transition={isTyping ? { duration: 0.7, repeat: Infinity } : { duration: 0 }}
        className="inline-block w-[2px] h-[1em] bg-current ml-1 relative"
        style={{ top: '0.1em'}}
      ></motion.span>
    </p>
  );
};

export default TypingEffect;
