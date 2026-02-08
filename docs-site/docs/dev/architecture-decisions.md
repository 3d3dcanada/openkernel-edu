# Architecture Decision Records (ADRs) 🏗️

This document tracks significant design decisions made for OpenKernel EDU.

## ADR 001: Choice of Emoji for Instructions
**Status:** Accepted
**Context:** We needed a universal visual language.
**Decision:** Use Unicode standard emojis for opcodes to ensure compatibility across all operating systems and fonts.
**Consequences:** High accessibility, but requires "Noto Color Emoji" fallback for consistent rendering on Linux.

## ADR 002: 256-Byte Virtual Memory
**Status:** Accepted
**Context:** Students need to visualize memory without being overwhelmed.
**Decision:** Limit addressable memory to 256 bytes (8-bit addressing).
**Consequences:** Perfectly fits in a 16x16 grid visualization. Simple for beginners to track.

## ADR 003: Zustand for State Management
**Status:** Accepted
**Context:** Real-time synchronization is needed between the Editor, VM, and Visualizers.
**Decision:** Use Zustand for global state.
**Consequences:** Low boilerplate, high performance, and easy debugging with Redux DevTools.

## ADR 004: Hexagonal Architecture for Core Logic
**Status:** Accepted
**Context:** The VM logic should be independent of the React UI.
**Decision:** Implement the VM and Parser as pure TypeScript modules with clearly defined ports.
**Consequences:** Allows for easy unit testing and potential reuse in a CLI or Mobile environment.
