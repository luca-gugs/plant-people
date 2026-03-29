import { Link, Navigate } from "react-router";
import { useConvexAuth } from "convex/react";
import { motion } from "framer-motion";

export default function Landing() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  // Already signed in — skip to dashboard
  if (!isLoading && isAuthenticated)
    return <Navigate to="/dashboard" replace />;

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center text-center px-8 bg-parchment font-body selection:bg-selection">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      >
        {/* Botanical illustration */}
        <motion.div
          className="w-56 md:w-72"
          style={{ height: "340px" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <img
            src="/blue-hibiscus.png"
            alt="Blue Hibiscus"
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Brand name */}
        <motion.h1
          className="text-6xl md:text-8xl font-light italic mt-2 mb-10 text-ink"
          style={{ letterSpacing: "-0.03em", lineHeight: 1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.3, ease: "easeOut" }}
        >
          tend
        </motion.h1>

        {/* Hairline divider */}
        <motion.div
          className="mb-10 bg-border"
          style={{ width: "32px", height: "1px" }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
        />

        {/* Quote */}
        <motion.blockquote
          className="mb-12 max-w-[400px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.9, ease: "easeOut" }}
        >
          <p
            className="text-sm md:text-base font-light italic text-ink-muted"
            style={{ lineHeight: "1.9" }}
          >
            "To plant a garden is to believe in tomorrow."
          </p>
          <footer className="label-xs mt-3 tracking-[0.4em]">
            — Audrey Hepburn
          </footer>
        </motion.blockquote>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
        >
          <Link
            to="/sign-in"
            className="inline-block border border-botanical text-botanical font-label text-[10px] uppercase tracking-[0.35em] px-8 py-3 hover:bg-botanical hover:text-parchment transition-colors"
          >
            Begin your journal
          </Link>
        </motion.div>
      </motion.div>

    </main>
  );
}
