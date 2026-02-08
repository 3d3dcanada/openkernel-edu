/**
 * OpenKernel EDU - Execution Service
 * Manages in-memory VM sessions for step-by-step execution
 * 
 * @module api/services/execution.service
 */

import { v4 as uuidv4 } from 'uuid';
import { VirtualMachine } from '../../core/VirtualMachine';
import { parseEmojiProgram } from '../../parser/parser';
import { validateAndAnalyze } from '../../parser/validator';
import { ApiError } from '../middleware/error-handler';
import { Instruction } from '../../core/types';

interface VMSession {
    id: string;
    vm: VirtualMachine;
    program: Instruction[];
    createdAt: number;
    lastAccessedAt: number;
}

const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const MAX_SESSIONS = 1000; // Prevent memory exhaustion

export class ExecutionService {
    private sessions: Map<string, VMSession> = new Map();

    constructor() {
        // Periodic cleanup
        setInterval(() => this.cleanupSessions(), 60 * 1000);
    }

    /**
     * Create a new execution session
     */
    createSession(code: string): VMSession {
        if (this.sessions.size >= MAX_SESSIONS) {
            this.cleanupSessions(true); // Force cleanup
            if (this.sessions.size >= MAX_SESSIONS) {
                throw ApiError.tooManyRequests();
            }
        }

        const program = parseEmojiProgram(code);
        const analysis = validateAndAnalyze(program);

        if (!analysis.valid) {
            throw ApiError.invalidSyntax(
                'Code contains syntax errors',
                analysis.errors.map(e => e.message)
            );
        }

        const vm = new VirtualMachine();
        vm.loadProgram(program.instructions);

        const session: VMSession = {
            id: uuidv4(),
            vm,
            program: program.instructions,
            createdAt: Date.now(),
            lastAccessedAt: Date.now(),
        };

        this.sessions.set(session.id, session);
        return session;
    }

    /**
     * Get a session by ID
     */
    getSession(id: string): VMSession {
        const session = this.sessions.get(id);
        if (!session) {
            throw ApiError.notFound(`Session ${id}`);
        }

        session.lastAccessedAt = Date.now();
        return session;
    }

    /**
     * Execute a single step in a session
     */
    stepSession(id: string, input?: string[]): VMSession {
        const session = this.getSession(id);

        // Provide input if needed
        if (input && input.length > 0) {
            input.forEach(val => session.vm.provideInput(val));
        }

        try {
            session.vm.step();
        } catch (e) {
            // VM errors are captured in VM state usually, 
            // but stepping might throw if catastrophic
            console.error(`VM Step Error [${id}]:`, e);
        }

        return session;
    }

    /**
     * Run entire program in a new VM (stateless)
     */
    runProgram(code: string, input: string[] = [], maxCycles = 10000) {
        const program = parseEmojiProgram(code);
        const analysis = validateAndAnalyze(program);

        if (!analysis.valid) {
            throw ApiError.invalidSyntax(
                'Code contains syntax errors',
                analysis.errors.map(e => e.message)
            );
        }

        const vm = new VirtualMachine();
        vm.loadProgram(program.instructions);

        if (input.length > 0) {
            input.forEach(val => vm.provideInput(val));
        }

        // Run with cycle limit check
        // note: VM has internal limit but we can enforce stricter one
        const state = vm.run();

        return {
            output: vm.getOutput(),
            error: state.error,
            state: vm.getCPU()
        };
    }

    /**
     * Remove old sessions
     */
    private cleanupSessions(force = false): void {
        const now = Date.now();
        const timeout = force ? SESSION_TIMEOUT_MS / 2 : SESSION_TIMEOUT_MS;

        for (const [id, session] of this.sessions.entries()) {
            if (now - session.lastAccessedAt > timeout) {
                this.sessions.delete(id);
            }
        }
    }
}

export const executionService = new ExecutionService();
