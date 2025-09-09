// lib/polyfills.ts
import { Buffer } from "buffer";
import process from "process";

if (typeof window !== "undefined") {
  (window as any).Buffer = Buffer;
  (window as any).process = process;
}
