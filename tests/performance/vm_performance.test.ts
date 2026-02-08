import { describe, it, expect, beforeEach } from 'vitest';
import { VirtualMachine } from '../../src/core/VirtualMachine';
import { Opcode } from '../../src/core/types';

describe('Performance Benchmark', () => {
    let vm: VirtualMachine;

    beforeEach(() => {
        vm = new VirtualMachine();
    });

    it('benchmark: tight loop 10,000 iterations', () => {
        // Program: R0 = 0; Loop 10,000 times: R0 += 1; Halt
        const ITERATIONS = 10000;
        vm.loadProgram([
            { opcode: Opcode.LOAD, operands: [0, 'R0'], line: 1, raw: '' },
            { opcode: Opcode.LOOP, operands: [ITERATIONS], line: 2, raw: '' },
            { opcode: Opcode.ADD, operands: [1], line: 3, raw: '' },
            { opcode: Opcode.RETURN, operands: [], line: 4, raw: '' },
            { opcode: Opcode.HALT, operands: [], line: 5, raw: '' }
        ]);

        vm.setFastMode(true);
        const start = performance.now();
        vm.run();
        const end = performance.now();

        const duration = end - start;
        const instructions = ITERATIONS * 2 + 2; // Loop start + (ADD+RETURN)*ITER + HALT
        const msPerInstruction = duration / instructions;

        console.log(`\n--- Baseline Benchmark ---`);
        console.log(`Total Duration: ${duration.toFixed(2)}ms`);
        console.log(`Iterations: ${ITERATIONS}`);
        console.log(`Total Instructions: ${instructions}`);
        console.log(`ms per instruction: ${msPerInstruction.toFixed(4)}ms`);

        expect(vm.getCPU().registers.R0).toBe(ITERATIONS);
    });
});
