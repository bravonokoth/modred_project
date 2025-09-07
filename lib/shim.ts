// lib/shim.ts
import { Buffer } from "buffer";
import process from "process";

export function shim() {
  if (typeof window !== "undefined") {
    // Polyfill Buffer and process for browser environment
    if (!window.Buffer) {
      (window as any).Buffer = Buffer;
    }
    
    if (!window.process) {
      (window as any).process = process;
    }
    
    if (!(window as any).global) {
      (window as any).global = globalThis;
    }

    // Additional polyfills for crypto and other Node.js modules
    if (!(window as any).crypto && (window as any).msCrypto) {
      (window as any).crypto = (window as any).msCrypto;
    }

    // Polyfill for TextEncoder/TextDecoder if not available
    if (typeof TextEncoder === 'undefined') {
      const { TextEncoder, TextDecoder } = require('util');
      (window as any).TextEncoder = TextEncoder;
      (window as any).TextDecoder = TextDecoder;
    }

    // Additional shims for hashconnect and blockchain libraries
    if (typeof (window as any).require === 'undefined') {
      (window as any).require = () => {};
    }

    console.log('Browser shims applied successfully');
  }
}