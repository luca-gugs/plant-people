import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  Leaf,
  Calendar,
  Settings,
  History,
  Search,
  ChevronRight,
  LogOut,
  Crown,
  User,
} from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const TABS = [
  { id: "ledger", label: "The Ledger", icon: Book, roman: "I" },
  { id: "specimens", label: "Specimens", icon: Leaf, roman: "II" },
  { id: "schedule", label: "Hydration Log", icon: Calendar, roman: "III" },
  { id: "archive", label: "Archives", icon: History, roman: "IV" },
  { id: "settings", label: "Laboratory", icon: Settings, roman: "V" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// Stain artifact positions
const STAINS = [
  { cx: 78, cy: 12, rx: 22, ry: 14, opacity: 0.045, color: "#8B6914" },
  { cx: 15, cy: 55, rx: 18, ry: 10, opacity: 0.035, color: "#7A5C2E" },
  { cx: 88, cy: 72, rx: 14, ry: 20, opacity: 0.04, color: "#6B4423" },
  { cx: 35, cy: 88, rx: 28, ry: 12, opacity: 0.03, color: "#9C7A3C" },
  { cx: 60, cy: 38, rx: 10, ry: 16, opacity: 0.025, color: "#5C3D18" },
  { cx: 5, cy: 20, rx: 12, ry: 8, opacity: 0.038, color: "#A0845C" },
];

// Irregular clip-path for torn/worn edges
const FIELD_NOTE_CLIP = `polygon(
  0% 2%,
  0.5% 0.4%,
  2% 0.8%,
  3.5% 0%,
  6% 1.2%,
  8% 0.2%,
  12% 1.5%,
  16% 0.5%,
  20% 1.8%,
  25% 0.3%,
  30% 1.0%,
  35% 0%,
  40% 1.3%,
  45% 0.6%,
  50% 1.9%,
  55% 0.1%,
  60% 1.4%,
  65% 0.7%,
  70% 1.6%,
  75% 0.2%,
  80% 1.1%,
  85% 0.5%,
  90% 1.7%,
  95% 0.3%,
  98% 1.0%,
  100% 0.5%,
  99.5% 4%,
  100% 8%,
  99.2% 15%,
  100% 22%,
  99.5% 30%,
  100% 38%,
  99.3% 46%,
  100% 54%,
  99.6% 62%,
  100% 70%,
  99.2% 78%,
  100% 86%,
  99.5% 94%,
  98.5% 98%,
  97% 99.4%,
  93% 98.8%,
  88% 100%,
  83% 99.2%,
  78% 100%,
  73% 99.5%,
  68% 98.8%,
  63% 100%,
  58% 99.3%,
  53% 98.6%,
  48% 100%,
  43% 99.4%,
  38% 98.9%,
  33% 100%,
  28% 99.2%,
  23% 98.7%,
  18% 100%,
  13% 99.5%,
  8% 98.8%,
  3% 100%,
  0.5% 99.0%,
  0% 97%,
  0.8% 90%,
  0% 83%,
  0.6% 76%,
  0% 69%,
  0.9% 62%,
  0% 55%,
  0.7% 48%,
  0% 41%,
  0.8% 34%,
  0% 27%,
  0.5% 20%,
  0% 13%,
  0.6% 6%
)`;

// ── Notebook Trigger ──────────────────────────────────
function NotebookTrigger({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const BOOK_W = 72;
  const BOOK_H = 90;
  const SPINE_W = 14;
  const COVER_W = BOOK_W - SPINE_W;
  const PAGE_OFFSETS = [
    { rotate: 0, x: 0, delay: 0 },
    { rotate: -8, x: -1, delay: 0.04 },
    { rotate: -18, x: -2, delay: 0.08 },
    { rotate: -30, x: -3, delay: 0.12 },
    { rotate: -44, x: -4, delay: 0.16 },
  ];

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={isOpen ? "Close navigation" : "Open navigation"}
      style={{
        width: BOOK_W,
        height: BOOK_H,
        perspective: "600px",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        position: "relative",
        display: "block",
      }}
    >
      {/* ── Spine ── */}
      <motion.div
        animate={{ scaleX: isOpen ? 1.08 : 1, opacity: isOpen ? 0 : 1 }}
        transition={{
          type: "spring",
          damping: isOpen ? 16 : 22,
          stiffness: isOpen ? 140 : 300,
          delay: isOpen ? 0 : 0.03,
        }}
        style={{
          position: "absolute",
          left: 0,
          top: 5,
          bottom: 5,
          width: SPINE_W,
          borderRadius: "4px 2px 2px 4px",
          background:
            "linear-gradient(to right, #1F2E1E 0%, #2E4530 45%, #3A4D39 100%)",
          boxShadow:
            "inset -3px 0 4px rgba(0,0,0,0.4), 3px 0 6px rgba(0,0,0,0.3)",
          zIndex: 10,
          transformOrigin: "left center",
        }}
      >
        {/* Spine ribs */}
        {[16, 32, 50, 68, 84].map((pct) => (
          <div
            key={pct}
            style={{
              position: "absolute",
              top: `${pct}%`,
              left: 2,
              right: 2,
              height: 1,
              background: "rgba(0,0,0,0.3)",
              borderRadius: 1,
            }}
          />
        ))}
        {/* Gold inlay */}
        <div
          style={{
            position: "absolute",
            top: 10,
            bottom: 10,
            left: 4,
            width: 1.5,
            background:
              "linear-gradient(to bottom, transparent, rgba(196,180,138,0.6) 25%, rgba(196,180,138,0.6) 75%, transparent)",
          }}
        />
      </motion.div>

      {/* ── Fanned pages ── */}
      {PAGE_OFFSETS.map((p, i) => (
        <motion.div
          key={i}
          animate={{
            rotateY: isOpen ? p.rotate : 0,
            x: isOpen ? p.x : 0,
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 130,
            delay: isOpen ? p.delay : (PAGE_OFFSETS.length - 1 - i) * 0.04,
          }}
          style={{
            position: "absolute",
            left: SPINE_W - 1,
            top: 7,
            bottom: 7,
            width: COVER_W + 1,
            borderRadius: "1px 4px 4px 1px",
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            zIndex: 2 + i,
            overflow: "hidden",
            background:
              i === 0
                ? "linear-gradient(to right, #EDE4D0 0%, #F5EED8 60%, #F8F3E5 100%)"
                : `linear-gradient(to right, #EAE0CA ${i * 2}%, #F2EAD4 60%, #F6F0E0 100%)`,
          }}
        >
          {/* Ruled lines on top page */}
          {i === 0 &&
            [14, 27, 40, 53, 66, 79].map((pct) => (
              <div
                key={pct}
                style={{
                  position: "absolute",
                  top: `${pct}%`,
                  left: 8,
                  right: 6,
                  height: "0.6px",
                  background: "rgba(160,135,90,0.3)",
                }}
              />
            ))}
          {/* Right-edge shadow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(0,0,0,0.04) 0%, transparent 30%, rgba(0,0,0,0.03) 100%)",
            }}
          />
        </motion.div>
      ))}

      {/* ── Front cover ── */}
      <motion.div
        animate={{ rotateY: isOpen ? -158 : 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 140 }}
        style={{
          position: "absolute",
          left: SPINE_W - 1,
          top: 0,
          right: 0,
          bottom: 0,
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
          zIndex: 8,
          borderRadius: "1px 5px 5px 1px",
        }}
      >
        {/* Front face */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "1px 5px 5px 1px",
            background:
              "linear-gradient(148deg, #3E5A3D 0%, #2E4530 55%, #253D26 100%)",
            boxShadow:
              "3px 0 0 rgba(0,0,0,0.2), 5px 3px 16px rgba(0,0,0,0.32), inset 1px 0 0 rgba(255,255,255,0.07)",
            overflow: "hidden",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Cloth grain */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23g)' opacity='0.14'/%3E%3C/svg%3E")`,
              mixBlendMode: "overlay",
            }}
          />
          {/* Inset border */}
          <div
            style={{
              position: "absolute",
              inset: 5,
              border: "0.75px solid rgba(196,180,138,0.32)",
              borderRadius: 3,
            }}
          />
          {/* Cover content */}
          <div
            style={{
              position: "absolute",
              inset: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <div
              style={{
                width: "72%",
                height: "0.6px",
                background:
                  "linear-gradient(to right, transparent, rgba(196,180,138,0.7), transparent)",
              }}
            />
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 2C6 2 2 8 2 14c0 4 2.5 6.5 6 7.5C10 22 12 20 12 20s2 2 4 1.5c3.5-1 6-3.5 6-7.5 0-6-4-12-10-12z"
                fill="rgba(196,180,138,0.55)"
                stroke="rgba(196,180,138,0.4)"
                strokeWidth="0.5"
              />
              <line
                x1="12"
                y1="20"
                x2="12"
                y2="8"
                stroke="rgba(196,180,138,0.35)"
                strokeWidth="0.7"
              />
            </svg>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 7.5,
                letterSpacing: "0.22em",
                color: "rgba(220,205,165,0.72)",
                textTransform: "uppercase",
                lineHeight: 1.4,
                textAlign: "center",
                whiteSpace: "pre-line",
              }}
            >
              {"Field\nNotes"}
            </span>
            <div
              style={{
                width: "72%",
                height: "0.6px",
                background:
                  "linear-gradient(to right, transparent, rgba(196,180,138,0.7), transparent)",
              }}
            />
          </div>
          {/* Gloss shimmer */}
          <motion.div
            animate={
              isHovered || isOpen
                ? { x: ["-100%", "200%"], opacity: [0, 0.55, 0] }
                : { x: "-100%", opacity: 0 }
            }
            transition={{ duration: 0.55, ease: "easeInOut", delay: 0.05 }}
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.38) 50%, transparent 65%)",
              borderRadius: "1px 5px 5px 1px",
              pointerEvents: "none",
            }}
          />
          {/* Static gloss */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 45%, rgba(0,0,0,0.07) 100%)",
              borderRadius: "1px 5px 5px 1px",
            }}
          />
        </div>

        {/* Back face (pastedown) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "1px 5px 5px 1px",
            background: "linear-gradient(148deg, #EDE4D0 0%, #E5D9C0 100%)",
            boxShadow: "inset 3px 0 8px rgba(0,0,0,0.14)",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 6,
              border: "0.75px solid rgba(140,110,60,0.2)",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 40% 40%, rgba(196,180,138,0.09) 0%, transparent 70%)",
            }}
          />
        </div>
      </motion.div>

      {/* ── Shadow ── */}
      <motion.div
        animate={{
          scaleX: isOpen ? 1.6 : 1,
          opacity: isOpen ? 0.28 : 0.14,
        }}
        transition={{ type: "spring", damping: 22, stiffness: 140 }}
        style={{
          position: "absolute",
          bottom: -6,
          left: SPINE_W,
          right: 0,
          height: 10,
          background: "rgba(30,24,12,0.5)",
          filter: "blur(6px)",
          borderRadius: "50%",
          transformOrigin: "left center",
          zIndex: 0,
        }}
      />

      {/* ── Bookmark ribbon ── */}
      <motion.div
        animate={{
          y: isOpen ? 6 : 0,
          scaleY: isOpen ? 1.1 : 1,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 180,
          delay: 0.06,
        }}
        style={{
          position: "absolute",
          right: 10,
          top: -5,
          width: 7,
          height: 22,
          zIndex: 9,
          background: "linear-gradient(to bottom, #9C4A4A, #7A3535)",
          clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
          boxShadow: "0 2px 5px rgba(0,0,0,0.26)",
        }}
      />
    </button>
  );
}

export default function NotebookNavigation() {
  const { signOut } = useAuthActions();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("ledger");
  const [query, setQuery] = useState("");

  const filteredTabs = TABS.filter((t) =>
    t.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col items-end">
      {/* ── Toggle button ── */}
      <NotebookTrigger isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />

      {/* ── Field Note Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96, rotate: -0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.96, rotate: 0.5 }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="mt-3 w-[17rem] origin-top-right"
            style={{
              filter:
                "drop-shadow(0 6px 28px rgba(0,0,0,0.32)) drop-shadow(0 2px 6px rgba(0,0,0,0.18))",
            }}
          >
            {/* Outer: torn-edge field note shape */}
            <div
              className="relative"
              style={{
                clipPath: FIELD_NOTE_CLIP,
                background:
                  "linear-gradient(162deg, #FEFAF0 0%, #F7F0E0 30%, #F1E9D5 65%, #EBE1C8 100%)",
              }}
            >
              {/* ── Intense paper grain texture layer ── */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='6' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23grain)' opacity='0.13'/%3E%3C/svg%3E")`,
                  mixBlendMode: "multiply",
                  zIndex: 1,
                }}
              />

              {/* ── Second coarser grain pass ── */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='g2'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.38' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23g2)' opacity='0.07'/%3E%3C/svg%3E")`,
                  mixBlendMode: "multiply",
                  zIndex: 1,
                }}
              />

              {/* ── Stain artifacts ── */}
              {STAINS.map((s, i) => (
                <div
                  key={i}
                  className="absolute pointer-events-none"
                  style={{
                    inset: 0,
                    background: `radial-gradient(ellipse ${s.rx}% ${s.ry}% at ${s.cx}% ${s.cy}%, ${s.color} 0%, transparent 100%)`,
                    opacity: s.opacity,
                    zIndex: 2,
                    mixBlendMode: "multiply",
                  }}
                />
              ))}

              {/* ── Dog-eared corner: top-right ── */}
              <div
                className="absolute top-0 right-0 pointer-events-none"
                style={{ zIndex: 5 }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M36 0 L36 36 L0 0 Z" fill="#E2D8C0" opacity="0.7" />
                  <path
                    d="M36 0 L0 0 L36 36"
                    stroke="#C8BC9E"
                    strokeWidth="0.8"
                    fill="none"
                    opacity="0.6"
                  />
                  <path
                    d="M36 0 L0 0"
                    stroke="#B0A47E"
                    strokeWidth="0.5"
                    opacity="0.35"
                  />
                </svg>
              </div>

              {/* ── Dog-eared corner: bottom-left ── */}
              <div
                className="absolute bottom-0 left-0 pointer-events-none"
                style={{ zIndex: 5 }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M0 28 L0 0 L28 28 Z" fill="#E4D9C2" opacity="0.6" />
                  <path
                    d="M0 28 L28 28 L0 0"
                    stroke="#C8BC9E"
                    strokeWidth="0.8"
                    fill="none"
                    opacity="0.5"
                  />
                </svg>
              </div>

              {/* ── Edge vignette / worn margin shadows ── */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(140,110,60,0.09) 100%)",
                  zIndex: 3,
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(160,130,70,0.08) 0%, transparent 18%, transparent 80%, rgba(100,75,35,0.10) 100%)",
                  zIndex: 3,
                }}
              />

              {/* ── Content wrapper (above grain/stains) ── */}
              <div className="relative flex flex-col" style={{ zIndex: 10 }}>
                {/* ── Header ── */}
                <div className="px-5 pt-6 pb-3">
                  {/* Top label row */}
                  <div className="flex items-center gap-2 mb-4">
                    {/* Hand-drawn faint squiggle divider */}
                    <svg
                      width="100%"
                      height="6"
                      viewBox="0 0 120 6"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      style={{ flex: 1 }}
                    >
                      <path
                        d="M0 3 Q10 1.2 20 3.5 Q30 5.5 40 2.8 Q50 0.5 60 3.2 Q70 5.8 80 2.5 Q90 0.2 100 3.8 Q110 6 120 3"
                        stroke="#C4B48A"
                        strokeWidth="0.8"
                        fill="none"
                        opacity="0.65"
                      />
                    </svg>
                    <span
                      className="text-[9px] uppercase tracking-[0.35em] text-[#8C7B65] shrink-0"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Field Notes
                    </span>
                    <svg
                      width="100%"
                      height="6"
                      viewBox="0 0 120 6"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      style={{ flex: 1 }}
                    >
                      <path
                        d="M0 3 Q10 4.8 20 2.5 Q30 0.2 40 3.8 Q50 6 60 2.8 Q70 0.5 80 3.5 Q90 5.5 100 2.2 Q110 0.8 120 3"
                        stroke="#C4B48A"
                        strokeWidth="0.8"
                        fill="none"
                        opacity="0.65"
                      />
                    </svg>
                  </div>

                  <h2
                    className="text-[15px] italic text-[#3A4D39] mb-1 leading-tight"
                    style={{
                      fontFamily: "Georgia, serif",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Index of Contents
                  </h2>
                  <p
                    className="text-[9px] uppercase tracking-[0.28em] text-[#9C8B74] mb-4"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    Herbarium Personal Archive
                  </p>

                  {/* Search */}
                  <div className="relative pb-1">
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 text-[#A0917A]" />
                    <input
                      type="text"
                      placeholder="Search sections…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full bg-transparent pl-5 pr-2 py-1 text-[11px] italic text-[#3A4D39] placeholder:text-[#B0A08A] focus:outline-none transition-colors"
                      style={{ fontFamily: "Georgia, serif" }}
                    />
                    {/* Hand-drawn underline for search */}
                    <svg
                      width="100%"
                      height="4"
                      viewBox="0 0 200 4"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      className="absolute bottom-0 left-0"
                    >
                      <path
                        d="M0 2 Q25 0.8 50 2.5 Q75 3.8 100 1.8 Q125 0.2 150 2.8 Q175 4.2 200 2"
                        stroke="#C4B48A"
                        strokeWidth="0.9"
                        fill="none"
                        opacity="0.7"
                      />
                    </svg>
                  </div>
                </div>

                {/* ── Spacing divider ── */}
                <div className="px-5 pt-1 pb-1">
                  <svg
                    width="100%"
                    height="5"
                    viewBox="0 0 260 5"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 2.5 Q30 1 65 3.2 Q100 5 130 2.2 Q160 0 195 2.8 Q225 4.5 260 2.5"
                      stroke="#C4B48A"
                      strokeWidth="0.7"
                      fill="none"
                      opacity="0.55"
                    />
                  </svg>
                </div>

                {/* ── Navigation entries ── */}
                <nav className="relative px-3 py-2 space-y-[2px]">
                  {filteredTabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        whileHover={{ x: 2 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                        className="w-full flex items-center gap-3 px-3 py-[9px] transition-all duration-200 group"
                        style={
                          isActive
                            ? {
                                background:
                                  "linear-gradient(to right, rgba(58,77,57,0.88), rgba(74,94,73,0.80))",
                                boxShadow:
                                  "inset 0 1px 0 rgba(255,255,255,0.07), 0 1px 4px rgba(0,0,0,0.22)",
                                color: "#EDE7D8",
                                borderRadius: "2px",
                              }
                            : {
                                background: "transparent",
                                color: "#5C4F3A",
                              }
                        }
                      >
                        {/* Roman numeral */}
                        <span
                          className="w-5 shrink-0 text-right text-[9px]"
                          style={{
                            fontFamily: "Georgia, serif",
                            fontStyle: "italic",
                            color: isActive
                              ? "rgba(237,231,216,0.5)"
                              : "#B0A08A",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {tab.roman}
                        </span>

                        {/* Thin vertical divider */}
                        <span
                          className="shrink-0 w-[1px] h-4 self-center"
                          style={{
                            background: isActive
                              ? "rgba(255,255,255,0.12)"
                              : "#D4CBB7",
                          }}
                        />

                        <Icon
                          size={13}
                          style={{
                            color: isActive ? "#A8C4A2" : "#8C7B65",
                            flexShrink: 0,
                          }}
                        />

                        <span
                          className="flex-1 text-left text-[12px] tracking-wide"
                          style={{
                            fontFamily: "Georgia, serif",
                            fontStyle: "italic",
                          }}
                        >
                          {tab.label}
                        </span>

                        {isActive && (
                          <ChevronRight
                            size={11}
                            style={{
                              color: "rgba(237,231,216,0.45)",
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </nav>

                {/* ── Ornamental hand-drawn divider ── */}
                <div className="px-4 my-2 flex flex-col items-center gap-1">
                  <svg
                    width="100%"
                    height="12"
                    viewBox="0 0 230 12"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M10 6 Q40 2.5 70 7 Q100 11 115 5.5 Q130 0.5 160 6.5 Q185 11 210 5 Q220 3 230 6"
                      stroke="#C4B48A"
                      strokeWidth="0.85"
                      fill="none"
                      opacity="0.6"
                    />
                    {/* Central diamond flourish */}
                    <text
                      x="50%"
                      y="8"
                      textAnchor="middle"
                      fontSize="7"
                      fill="#C4B48A"
                      opacity="0.7"
                      fontFamily="Georgia, serif"
                    >
                      ✦
                    </text>
                  </svg>
                </div>

                {/* ── Sign out ── */}
                <div className="px-5 pt-1">
                  <button
                    onClick={() => void signOut()}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-sm transition-colors hover:bg-[rgba(58,77,57,0.08)] cursor-pointer"
                  >
                    <LogOut
                      size={12}
                      style={{ color: "#8C7B65" }}
                    />
                    <span
                      className="text-[11px] italic text-[#5C4F3A]"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Sign Out
                    </span>
                  </button>
                </div>

                {/* ── Footer colophon ── */}
                <div className="px-5 pt-1 pb-6 flex flex-col items-center gap-2">
                  <p
                    className="text-[8.5px] uppercase text-center leading-[1.8] text-[#A0917A]"
                    style={{
                      fontFamily: "Arial, sans-serif",
                      letterSpacing: "0.32em",
                    }}
                  >
                    <span>Curated for the</span>
                    <br />
                    <span>Private Conservatory</span>
                  </p>
                  <p
                    className="text-[9px] italic text-[#B0A08A]"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    <span>Est. MMXXIII</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Subtle drop shadow paper stack beneath */}
            <div
              className="-z-10"
              style={{
                position: "absolute",
                inset: 0,
                top: "3px",
                left: "3px",
                right: "-2px",
                background: "#E8DFCA",
                clipPath: FIELD_NOTE_CLIP,
                filter: "blur(1px)",
                opacity: 0.5,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 -z-10"
            style={{
              background: "rgba(44,44,44,0.04)",
              backdropFilter: "blur(0.5px)",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
