import { describe, it, expect } from 'vitest';
import {
  calculateWPM,
  calculateNetWPM,
  calculateAccuracy,
  formatTime,
  calculateProgress,
  calculateRating,
  getPerformanceFeedback,
} from './typing-utils';

describe('typing-utils', () => {
  describe('calculateWPM', () => {
    it('should return 0 when no time has elapsed', () => {
      expect(calculateWPM(50, 0)).toBe(0);
    });

    it('should return 0 when no characters typed', () => {
      expect(calculateWPM(0, 60000)).toBe(0);
    });

    it('should calculate correct WPM for standard case', () => {
      // 50 characters in 1 minute = 10 words (50/5) per minute
      expect(calculateWPM(50, 60000)).toBe(10);
    });

    it('should calculate correct WPM for 30 seconds', () => {
      // 25 characters in 30 seconds = 5 words in 0.5 minutes = 10 WPM
      expect(calculateWPM(25, 30000)).toBe(10);
    });

    it('should calculate correct WPM for fast typing', () => {
      // 300 characters in 1 minute = 60 words per minute
      expect(calculateWPM(300, 60000)).toBe(60);
    });

    it('should round to nearest integer', () => {
      // 53 characters in 1 minute = 10.6 WPM, rounds to 11
      expect(calculateWPM(53, 60000)).toBe(11);
    });

    it('should never return negative values', () => {
      expect(calculateWPM(-10, 60000)).toBe(0);
    });
  });

  describe('calculateNetWPM', () => {
    it('should return 0 when no time has elapsed', () => {
      expect(calculateNetWPM(50, 5, 0)).toBe(0);
    });

    it('should return same as gross WPM when no errors', () => {
      expect(calculateNetWPM(50, 0, 60000)).toBe(10);
    });

    it('should subtract error penalty from gross WPM', () => {
      // 50 chars in 1 min = 10 gross WPM, 5 errors in 1 min = 5 penalty
      // Net WPM = 10 - 5 = 5
      expect(calculateNetWPM(50, 5, 60000)).toBe(5);
    });

    it('should never return negative values', () => {
      // Many errors should not result in negative WPM
      expect(calculateNetWPM(50, 100, 60000)).toBe(0);
    });
  });

  describe('calculateAccuracy', () => {
    it('should return 100% when no typing has occurred', () => {
      expect(calculateAccuracy(0, 0)).toBe(100);
    });

    it('should return 100% when all correct', () => {
      expect(calculateAccuracy(50, 50)).toBe(100);
    });

    it('should return 0% when all incorrect', () => {
      expect(calculateAccuracy(0, 50)).toBe(0);
    });

    it('should calculate correct percentage', () => {
      // 45 correct out of 50 = 90%
      expect(calculateAccuracy(45, 50)).toBe(90);
    });

    it('should round to one decimal place', () => {
      // 46 correct out of 50 = 92%
      expect(calculateAccuracy(46, 50)).toBe(92);
      // 47 correct out of 50 = 94%
      expect(calculateAccuracy(47, 50)).toBe(94);
    });

    it('should handle fractional percentages', () => {
      // 1 correct out of 3 = 33.333...% rounds to 33.3
      expect(calculateAccuracy(1, 3)).toBeCloseTo(33.3, 1);
    });
  });

  describe('formatTime', () => {
    it('should format 0 milliseconds', () => {
      expect(formatTime(0)).toBe('0:00');
    });

    it('should format seconds only', () => {
      expect(formatTime(5000)).toBe('0:05');
      expect(formatTime(45000)).toBe('0:45');
    });

    it('should format minutes and seconds', () => {
      expect(formatTime(65000)).toBe('1:05');
      expect(formatTime(125000)).toBe('2:05');
    });

    it('should handle large values', () => {
      expect(formatTime(600000)).toBe('10:00');
    });

    it('should pad seconds with leading zero', () => {
      expect(formatTime(61000)).toBe('1:01');
      expect(formatTime(69000)).toBe('1:09');
    });
  });

  describe('calculateProgress', () => {
    it('should return 0 when total length is 0', () => {
      expect(calculateProgress(0, 0)).toBe(0);
    });

    it('should return 0 at start', () => {
      expect(calculateProgress(0, 100)).toBe(0);
    });

    it('should return 100 when complete', () => {
      expect(calculateProgress(100, 100)).toBe(100);
    });

    it('should calculate correct percentage', () => {
      expect(calculateProgress(50, 100)).toBe(50);
      expect(calculateProgress(25, 100)).toBe(25);
    });

    it('should round to nearest integer', () => {
      expect(calculateProgress(33, 100)).toBe(33);
      expect(calculateProgress(1, 3)).toBe(33);
    });
  });

  describe('calculateRating', () => {
    it('should return 5 stars for excellent performance', () => {
      expect(calculateRating(100, 80)).toBe(5);
      expect(calculateRating(98, 60)).toBe(5);
    });

    it('should return 4 stars for great performance', () => {
      expect(calculateRating(95, 40)).toBe(4);
    });

    it('should return 3 stars for good performance', () => {
      expect(calculateRating(90, 25)).toBe(3);
    });

    it('should return 2 stars for okay performance', () => {
      expect(calculateRating(80, 15)).toBe(2);
    });

    it('should return 1 star for poor performance', () => {
      expect(calculateRating(50, 10)).toBe(1);
    });

    it('should weight accuracy more than speed', () => {
      // High accuracy, low speed should score better than low accuracy, high speed
      const highAccuracyLowSpeed = calculateRating(98, 20);
      const lowAccuracyHighSpeed = calculateRating(70, 80);
      expect(highAccuracyLowSpeed).toBeGreaterThan(lowAccuracyHighSpeed);
    });
  });

  describe('getPerformanceFeedback', () => {
    it('should return excellent for high accuracy and speed', () => {
      expect(getPerformanceFeedback(98, 40)).toBe('excellent');
      expect(getPerformanceFeedback(100, 50)).toBe('excellent');
    });

    it('should return great for good accuracy and speed', () => {
      expect(getPerformanceFeedback(95, 30)).toBe('great');
      expect(getPerformanceFeedback(97, 35)).toBe('great');
    });

    it('should return good for decent accuracy', () => {
      expect(getPerformanceFeedback(90, 20)).toBe('good');
      expect(getPerformanceFeedback(93, 15)).toBe('good');
    });

    it('should return keepPracticing for moderate accuracy', () => {
      expect(getPerformanceFeedback(80, 20)).toBe('keepPracticing');
      expect(getPerformanceFeedback(85, 25)).toBe('keepPracticing');
    });

    it('should return needsWork for low accuracy', () => {
      expect(getPerformanceFeedback(70, 20)).toBe('needsWork');
      expect(getPerformanceFeedback(50, 30)).toBe('needsWork');
    });
  });
});
