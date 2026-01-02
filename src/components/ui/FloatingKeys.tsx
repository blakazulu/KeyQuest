'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const KEY_IMAGES = [
  '/images/key/key1.png',
  '/images/key/key2.png',
  '/images/key/key3.png',
  '/images/key/key4.png',
  '/images/key/key5.png',
  '/images/key/key6.png',
  '/images/key/key7.png',
];

interface FloatingKey {
  id: number;
  image: string;
  side: 'left' | 'right';
  top: number; // percentage from top
  isExiting: boolean;
  wasClicked: boolean;
}

function getRandomPosition(excludeTop?: number): { side: 'left' | 'right'; top: number } {
  const side = Math.random() > 0.5 ? 'left' : 'right';
  let top: number;

  // Generate a position that's not too close to the excluded one
  do {
    top = 15 + Math.random() * 60; // 15% to 75% from top
  } while (excludeTop !== undefined && Math.abs(top - excludeTop) < 20);

  return { side, top };
}

function getRandomImage(excludeImage?: string): string {
  let image: string;
  do {
    image = KEY_IMAGES[Math.floor(Math.random() * KEY_IMAGES.length)];
  } while (excludeImage !== undefined && image === excludeImage);
  return image;
}

export function FloatingKeys() {
  const [currentKey, setCurrentKey] = useState<FloatingKey | null>(null);
  const [keyCounter, setKeyCounter] = useState(0);

  const spawnNewKey = useCallback((excludeImage?: string, excludeTop?: number) => {
    const { side, top } = getRandomPosition(excludeTop);
    const image = getRandomImage(excludeImage);

    setKeyCounter((prev) => prev + 1);
    setCurrentKey({
      id: keyCounter + 1,
      image,
      side,
      top,
      isExiting: false,
      wasClicked: false,
    });
  }, [keyCounter]);

  const handleClick = useCallback(() => {
    if (!currentKey || currentKey.isExiting) return;

    // Mark as clicked for the pop animation
    setCurrentKey((prev) => prev ? { ...prev, wasClicked: true, isExiting: true } : null);

    // Immediately spawn a new one at a different location
    setTimeout(() => {
      spawnNewKey(currentKey.image, currentKey.top);
    }, 300);
  }, [currentKey, spawnNewKey]);

  useEffect(() => {
    // Initial spawn after a short delay
    const initialTimer = setTimeout(() => {
      spawnNewKey();
    }, 2000);

    return () => clearTimeout(initialTimer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!currentKey || currentKey.isExiting) return;

    // After 6 seconds, start exit animation
    const exitTimer = setTimeout(() => {
      setCurrentKey((prev) => prev ? { ...prev, isExiting: true } : null);
    }, 6000);

    return () => clearTimeout(exitTimer);
  }, [currentKey?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!currentKey?.isExiting || currentKey.wasClicked) return;

    // After exit animation completes, spawn new key
    const respawnTimer = setTimeout(() => {
      spawnNewKey(currentKey.image, currentKey.top);
    }, 1500); // Wait for exit animation + pause

    return () => clearTimeout(respawnTimer);
  }, [currentKey?.isExiting, currentKey?.wasClicked]); // eslint-disable-line react-hooks/exhaustive-deps

  // Swirl in animation - using type assertion to satisfy framer-motion's strict typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swirlInVariants: any = {
    initial: (side: 'left' | 'right') => ({
      opacity: 0,
      scale: 0.3,
      rotate: side === 'left' ? -180 : 180,
      x: side === 'left' ? -100 : 100,
    }),
    animate: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
      },
    },
    exit: (key: FloatingKey) =>
      key.wasClicked
        ? {
            // Pop/burst animation on click
            opacity: 0,
            scale: 1.5,
            transition: { duration: 0.25, ease: 'easeOut' as const },
          }
        : {
            // Swirl out animation
            opacity: 0,
            scale: 0.3,
            rotate: key.side === 'left' ? 180 : -180,
            x: key.side === 'left' ? -100 : 100,
            transition: { duration: 0.7, ease: 'easeInOut' as const },
          },
  };

  // Idle floating animation
  const floatVariants = {
    animate: {
      y: [0, -8, 0, 8, 0],
      rotate: [0, 3, 0, -3, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <AnimatePresence mode="wait">
        {currentKey && (
          <motion.div
            key={currentKey.id}
            custom={currentKey.isExiting ? currentKey : currentKey.side}
            variants={swirlInVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              [currentKey.side]: '1rem',
              top: `${currentKey.top}%`,
            }}
            onClick={handleClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              variants={floatVariants}
              animate="animate"
            >
              <Image
                src={currentKey.image}
                alt=""
                width={80}
                height={80}
                className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg select-none"
                aria-hidden="true"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
