import { describe, it, expect } from 'vitest';
import {
  qwertyLayout,
  getKeyData,
  getFingerForKey,
  fingerToClass,
  fingerNames,
  type KeyData,
  type Finger,
} from './keyboard-layout';

describe('keyboard-layout', () => {
  describe('qwertyLayout', () => {
    it('has 5 rows', () => {
      expect(qwertyLayout).toHaveLength(5);
    });

    it('has number row as first row', () => {
      const numberRow = qwertyLayout[0];
      expect(numberRow.keys[0].key).toBe('`');
      expect(numberRow.keys[1].key).toBe('1');
      expect(numberRow.keys[2].key).toBe('2');
    });

    it('has home row indicators on correct keys', () => {
      // Home row is row index 2 (ASDF JKL;)
      const homeRow = qwertyLayout[2];
      const homeRowKeys = homeRow.keys.filter((k) => k.isHomeRow);

      // Should have F and J marked as home row
      const fKey = homeRowKeys.find((k) => k.key === 'f');
      const jKey = homeRowKeys.find((k) => k.key === 'j');

      expect(fKey).toBeDefined();
      expect(jKey).toBeDefined();
    });

    it('has correct finger assignments for home row', () => {
      const homeRow = qwertyLayout[2];

      const aKey = homeRow.keys.find((k) => k.key === 'a');
      const sKey = homeRow.keys.find((k) => k.key === 's');
      const dKey = homeRow.keys.find((k) => k.key === 'd');
      const fKey = homeRow.keys.find((k) => k.key === 'f');
      const jKey = homeRow.keys.find((k) => k.key === 'j');
      const kKey = homeRow.keys.find((k) => k.key === 'k');
      const lKey = homeRow.keys.find((k) => k.key === 'l');

      expect(aKey?.finger).toBe('left-pinky');
      expect(sKey?.finger).toBe('left-ring');
      expect(dKey?.finger).toBe('left-middle');
      expect(fKey?.finger).toBe('left-index');
      expect(jKey?.finger).toBe('right-index');
      expect(kKey?.finger).toBe('right-middle');
      expect(lKey?.finger).toBe('right-ring');
    });

    it('has space bar with thumb finger', () => {
      const bottomRow = qwertyLayout[4];
      const spaceBar = bottomRow.keys.find((k) => k.key === ' ');

      expect(spaceBar).toBeDefined();
      expect(spaceBar?.finger).toBe('thumb');
      expect(spaceBar?.width).toBe(6.25); // Wide space bar
      expect(spaceBar?.code).toBe('Space');
    });
  });

  describe('getKeyData', () => {
    it('returns key data for lowercase letters', () => {
      const keyData = getKeyData('a');
      expect(keyData).toBeDefined();
      expect(keyData?.key).toBe('a');
      expect(keyData?.finger).toBe('left-pinky');
    });

    it('returns key data for uppercase letters (case insensitive)', () => {
      const keyData = getKeyData('A');
      expect(keyData).toBeDefined();
      expect(keyData?.key).toBe('a');
    });

    it('returns key data for numbers', () => {
      const keyData = getKeyData('5');
      expect(keyData).toBeDefined();
      expect(keyData?.key).toBe('5');
    });

    it('returns key data for space', () => {
      const keyData = getKeyData(' ');
      expect(keyData).toBeDefined();
      expect(keyData?.key).toBe(' ');
      expect(keyData?.finger).toBe('thumb');
    });

    it('returns key data for shift symbols', () => {
      // The @ symbol is on the 2 key
      const keyData = getKeyData('@');
      expect(keyData).toBeDefined();
      expect(keyData?.shiftLabel).toBe('@');
    });

    it('returns undefined for unknown keys', () => {
      const keyData = getKeyData('€');
      expect(keyData).toBeUndefined();
    });
  });

  describe('getFingerForKey', () => {
    it('returns correct finger for home row keys', () => {
      expect(getFingerForKey('a')).toBe('left-pinky');
      expect(getFingerForKey('s')).toBe('left-ring');
      expect(getFingerForKey('d')).toBe('left-middle');
      expect(getFingerForKey('f')).toBe('left-index');
      expect(getFingerForKey('j')).toBe('right-index');
      expect(getFingerForKey('k')).toBe('right-middle');
      expect(getFingerForKey('l')).toBe('right-ring');
      expect(getFingerForKey(';')).toBe('right-pinky');
    });

    it('returns thumb for space', () => {
      expect(getFingerForKey(' ')).toBe('thumb');
    });

    it('handles uppercase letters', () => {
      expect(getFingerForKey('F')).toBe('left-index');
      expect(getFingerForKey('J')).toBe('right-index');
    });

    it('returns undefined for unknown keys', () => {
      expect(getFingerForKey('€')).toBeUndefined();
    });
  });

  describe('fingerToClass', () => {
    it('has classes for all finger types', () => {
      const fingers: Finger[] = [
        'left-pinky',
        'left-ring',
        'left-middle',
        'left-index',
        'right-index',
        'right-middle',
        'right-ring',
        'right-pinky',
        'thumb',
      ];

      fingers.forEach((finger) => {
        expect(fingerToClass[finger]).toBeDefined();
        expect(typeof fingerToClass[finger]).toBe('string');
      });
    });

    it('returns correct class prefixes', () => {
      expect(fingerToClass['left-pinky']).toBe('finger-lpinky');
      expect(fingerToClass['right-index']).toBe('finger-rindex');
      expect(fingerToClass['thumb']).toBe('finger-thumb');
    });
  });

  describe('fingerNames', () => {
    it('has names in both English and Hebrew', () => {
      const fingers: Finger[] = [
        'left-pinky',
        'left-ring',
        'left-middle',
        'left-index',
        'right-index',
        'right-middle',
        'right-ring',
        'right-pinky',
        'thumb',
      ];

      fingers.forEach((finger) => {
        expect(fingerNames[finger].en).toBeDefined();
        expect(fingerNames[finger].he).toBeDefined();
        expect(typeof fingerNames[finger].en).toBe('string');
        expect(typeof fingerNames[finger].he).toBe('string');
      });
    });

    it('has correct English names', () => {
      expect(fingerNames['left-index'].en).toBe('Left Index');
      expect(fingerNames['right-pinky'].en).toBe('Right Pinky');
      expect(fingerNames['thumb'].en).toBe('Thumb');
    });

    it('has correct Hebrew names', () => {
      expect(fingerNames['left-index'].he).toBe('אצבע שמאל');
      expect(fingerNames['thumb'].he).toBe('אגודל');
    });
  });
});
