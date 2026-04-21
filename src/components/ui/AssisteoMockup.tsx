"use client";

import { motion } from "motion/react";

/**
 * ASSISTEO product mockup — a stylized phone showing the video-diagnostic flow.
 * Pure SVG + CSS, no real screenshots required.
 */
export function AssisteoMockup() {
  return (
    <div className="relative mx-auto" style={{ width: 280, height: 560 }}>
      {/* Phone frame */}
      <div
        className="absolute inset-0 rounded-[44px]"
        style={{
          background: "linear-gradient(160deg, #1a1a20 0%, #0a0a0c 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.3), inset 0 0 0 2px rgba(255,255,255,0.04)",
        }}
      />
      {/* Screen */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
          borderRadius: 36,
          background: "#0d0d12",
        }}
      >
        {/* Dynamic Island */}
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 rounded-full z-10"
          style={{ background: "#000" }}
        />

        {/* Status bar */}
        <div className="absolute top-2 left-6 right-6 flex justify-between items-center text-[10px] text-white/70 font-mono z-10">
          <span>09:42</span>
          <span className="text-right">●●●●</span>
        </div>

        {/* App content */}
        <div className="absolute inset-0 pt-12 px-4 pb-4 flex flex-col">
          {/* App header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-copper">ASSISTEO</p>
              <p className="font-display text-sm font-bold text-white">Diagnostic en cours</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/60">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              LIVE
            </div>
          </div>

          {/* Video feed area */}
          <div
            className="relative flex-1 rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1a1a20 0%, #2a2520 50%, #1a1a20 100%)",
            }}
          >
            {/* Simulated video noise */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: "radial-gradient(ellipse at 40% 60%, rgba(196, 133, 92, 0.4), transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(225, 16, 33, 0.25), transparent 50%)",
              }}
            />

            {/* AR reticle — pulsing focus target */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="10" y="10" width="80" height="80" fill="none" stroke="#E8792B" strokeWidth="1.5" strokeDasharray="10 6" opacity="0.8" />
                <path d="M 10 25 L 10 10 L 25 10" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                <path d="M 75 10 L 90 10 L 90 25" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                <path d="M 10 75 L 10 90 L 25 90" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                <path d="M 90 75 L 90 90 L 75 90" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                <circle cx="50" cy="50" r="3" fill="#E11021" />
              </svg>
            </motion.div>

            {/* Detected component label */}
            <motion.div
              className="absolute bottom-16 left-4 right-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="inline-block px-3 py-1.5 rounded-lg" style={{ background: "rgba(10,10,12,0.8)", backdropFilter: "blur(8px)", border: "1px solid rgba(232, 121, 43, 0.4)" }}>
                <p className="text-[10px] font-mono text-copper">DETECTE</p>
                <p className="text-sm font-semibold text-white">Ressort de torsion</p>
                <p className="text-[10px] text-white/60">Usure = 78% · Remplacement requis</p>
              </div>
            </motion.div>

            {/* Technical overlay */}
            <div className="absolute top-3 left-3 font-mono text-[8px] text-copper/80 tracking-wider">
              00:01:34 · 4K
            </div>
            <div className="absolute top-3 right-3 font-mono text-[8px] text-white/50 tracking-wider">
              Technicien: J.M.
            </div>
          </div>

          {/* Action bar */}
          <div className="mt-3 flex gap-2">
            <motion.button
              className="flex-1 py-3 rounded-xl bg-primary text-white text-xs font-semibold"
              whileTap={{ scale: 0.98 }}
              aria-label="Valider diagnostic"
            >
              Valider diagnostic
            </motion.button>
            <button
              className="p-3 rounded-xl border border-white/10 text-white"
              aria-label="Partager"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Floating annotations outside phone */}
      <motion.div
        className="absolute -right-20 top-24 font-mono text-[10px] uppercase tracking-[0.2em]"
        style={{ color: "var(--color-copper)" }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <span className="inline-block h-px w-6 bg-current mr-2 align-middle" />
        Video HD
      </motion.div>
      <motion.div
        className="absolute -left-24 top-60 font-mono text-[10px] uppercase tracking-[0.2em]"
        style={{ color: "var(--color-copper)" }}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        AR reticle
        <span className="inline-block h-px w-6 bg-current ml-2 align-middle" />
      </motion.div>
      <motion.div
        className="absolute -right-24 bottom-40 font-mono text-[10px] uppercase tracking-[0.2em]"
        style={{ color: "var(--color-copper)" }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.5, duration: 0.6 }}
      >
        <span className="inline-block h-px w-6 bg-current mr-2 align-middle" />
        Diagnostic IA
      </motion.div>
    </div>
  );
}
