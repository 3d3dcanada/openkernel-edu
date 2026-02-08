// OpenKernel EDU - Memory Manager
// 256-byte virtual memory with visualization support

import { MemoryState } from './types';

export class Memory {
  private data: Uint8Array;
  private size: number;
  private lastAccessed: number | null = null;
  private lastWritten: number | null = null;
  private changeListeners: ((address: number, value: number) => void)[] = [];

  constructor(size: number = 256) {
    this.size = size;
    this.data = new Uint8Array(size);
  }

  read(address: number): number {
    if (address < 0 || address >= this.size) {
      throw new Error(`Memory access violation: address ${address} out of bounds (0-${this.size - 1})`);
    }
    this.lastAccessed = address;
    return this.data[address];
  }

  write(address: number, value: number): void {
    if (address < 0 || address >= this.size) {
      throw new Error(`Memory write violation: address ${address} out of bounds (0-${this.size - 1})`);
    }
    this.data[address] = value & 0xFF;
    this.lastAccessed = address;
    this.lastWritten = address;
    this.changeListeners.forEach(listener => listener(address, this.data[address]));
  }

  readWord(address: number): number {
    const high = this.read(address);
    const low = this.read(address + 1);
    return (high << 8) | low;
  }

  writeWord(address: number, value: number): void {
    this.write(address, (value >> 8) & 0xFF);
    this.write(address + 1, value & 0xFF);
  }

  clear(): void {
    this.data.fill(0);
    this.lastAccessed = null;
    this.lastWritten = null;
  }

  getState(): MemoryState {
    return {
      data: new Uint8Array(this.data),
      size: this.size,
      lastAccessed: this.lastAccessed,
      lastWritten: this.lastWritten,
    };
  }

  onWrite(listener: (address: number, value: number) => void): () => void {
    this.changeListeners.push(listener);
    return () => {
      this.changeListeners = this.changeListeners.filter(l => l !== listener);
    };
  }

  dump(start: number = 0, end?: number): number[] {
    const actualEnd = end ?? this.size;
    return Array.from(this.data.slice(start, actualEnd));
  }

  getUsedBytes(): number {
    let count = 0;
    for (let i = 0; i < this.size; i++) {
      if (this.data[i] !== 0) count++;
    }
    return count;
  }
}
