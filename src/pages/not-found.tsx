import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

// Wilted botanical illustration for the 404 state
function BotanicalWiltedFlower() {
  return (
    <img
      src="/salvia-patens.png"
      alt="Salvia Patens"
      className="w-full h-full object-contain"
    />
  );
}

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 bg-parchment text-ink selection:bg-selection">
      <motion.div
        className="max-w-2xl w-full flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Wilted flower illustration */}
        <motion.div
          className="w-48 md:w-64 mb-8"
          style={{ height: "300px" }}
          variants={itemVariants}
        >
          <BotanicalWiltedFlower />
        </motion.div>

        {/* Error label */}
        <motion.span className="label-wide mb-4" variants={itemVariants}>
          Error 404
        </motion.span>

        {/* Heading */}
        <motion.h1
          className="text-5xl md:text-7xl font-light italic mb-6"
          style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}
          variants={itemVariants}
        >
          Lost in the overgrowth
        </motion.h1>

        {/* Divider */}
        <motion.div
          className="divider-botanical mb-8"
          variants={itemVariants}
        />

        {/* Description */}
        <motion.p
          className="text-muted-italic text-sm md:text-base max-w-md mb-12"
          variants={itemVariants}
        >
          It seems the path you were following has been reclaimed by nature. The
          page you are looking for may have moved or no longer exists in our
          journal.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-center"
          variants={itemVariants}
        >
          <button
            onClick={() => void navigate(-1)}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={12} />
            Go back
          </button>

          <Link
            to="/"
            className="btn-outline-botanical w-auto flex items-center gap-2 px-6"
          >
            <Home size={12} />
            Return home
          </Link>
        </motion.div>

        {/* Search hint */}
        <motion.div
          className="mt-20 flex items-center gap-2 opacity-50"
          variants={itemVariants}
        >
          <Search size={14} strokeWidth={1} />
          <span className="label-xs">Try exploring our archives</span>
        </motion.div>
      </motion.div>

      {/* Background decorative elements */}
      <div className="fixed bottom-0 right-0 w-64 h-64 pointer-events-none opacity-[0.03]">
        <BotanicalWiltedFlower />
      </div>
      <div className="fixed top-0 left-0 w-64 h-64 pointer-events-none opacity-[0.03] rotate-180">
        <BotanicalWiltedFlower />
      </div>
    </main>
  );
}
