import { describe, it, expect, beforeEach } from 'vitest';
import { Memory } from '../../src/core/Memory';

describe('Memory', () => {
  let memory: Memory;

  beforeEach(() => {
    memory = new Memory(256);
  });

  it('should initialize with all zeros', () => {
    expect(memory.read(0)).toBe(0);
    expect(memory.read(255)).toBe(0);
  });

  it('should write and read a byte', () => {
    memory.write(0, 42);
    expect(memory.read(0)).toBe(42);
  });

  it('should mask values to 8 bits', () => {
    memory.write(0, 256);
    expect(memory.read(0)).toBe(0); // 256 & 0xFF = 0

    memory.write(1, 300);
    expect(memory.read(1)).toBe(44); // 300 & 0xFF = 44
  });

  it('should throw on out-of-bounds read', () => {
    expect(() => memory.read(256)).toThrow('out of bounds');
    expect(() => memory.read(-1)).toThrow('out of bounds');
  });

  it('should throw on out-of-bounds write', () => {
    expect(() => memory.write(256, 1)).toThrow('out of bounds');
    expect(() => memory.write(-1, 1)).toThrow('out of bounds');
  });

  it('should write and read words (16-bit)', () => {
    memory.writeWord(10, 0x1234);
    expect(memory.readWord(10)).toBe(0x1234);
    expect(memory.read(10)).toBe(0x12);
    expect(memory.read(11)).toBe(0x34);
  });

  it('should clear all memory', () => {
    memory.write(0, 42);
    memory.write(100, 99);
    memory.clear();
    expect(memory.read(0)).toBe(0);
    expect(memory.read(100)).toBe(0);
  });

  it('should track last accessed address', () => {
    memory.read(42);
    const state = memory.getState();
    expect(state.lastAccessed).toBe(42);
  });

  it('should track last written address', () => {
    memory.write(77, 1);
    const state = memory.getState();
    expect(state.lastWritten).toBe(77);
  });

  it('should report used bytes', () => {
    expect(memory.getUsedBytes()).toBe(0);
    memory.write(0, 1);
    memory.write(10, 2);
    memory.write(20, 3);
    expect(memory.getUsedBytes()).toBe(3);
  });

  it('should dump memory range', () => {
    memory.write(0, 10);
    memory.write(1, 20);
    memory.write(2, 30);
    expect(memory.dump(0, 3)).toEqual([10, 20, 30]);
  });

  it('should notify write listeners', () => {
    const writes: { address: number; value: number }[] = [];
    memory.onWrite((address, value) => writes.push({ address, value }));

    memory.write(5, 42);
    memory.write(10, 99);

    expect(writes).toEqual([
      { address: 5, value: 42 },
      { address: 10, value: 99 },
    ]);
  });

  it('should unsubscribe listeners', () => {
    const writes: number[] = [];
    const unsub = memory.onWrite((_, value) => writes.push(value));

    memory.write(0, 1);
    unsub();
    memory.write(1, 2);

    expect(writes).toEqual([1]);
  });
});
