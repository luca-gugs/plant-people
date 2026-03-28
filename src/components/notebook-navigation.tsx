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
} from "lucide-react";

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

export default function NotebookNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("ledger");
  const [query, setQuery] = useState("");

  const filteredTabs = TABS.filter((t) =>
    t.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col items-end">
      {/* ── Toggle button ── */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        whileTap={{ scale: 0.93 }}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        className={`relative z-50 w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 ${isOpen ? "bg-[#FBF8F3] text-[#3A4D39]" : "bg-[#3A4D39] text-[#E8DFC8]"}`}
        style={{
          boxShadow: isOpen
            ? "inset 0 2px 4px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.08), 0 0 0 2px #D4CBB7"
            : "0 2px 0 #253528, 0 4px 12px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        <span
          className="absolute inset-[3px] rounded-full pointer-events-none"
          style={{
            background: isOpen
              ? "linear-gradient(160deg, rgba(255,255,255,0.55) 0%, transparent 55%)"
              : "linear-gradient(160deg, rgba(255,255,255,0.18) 0%, transparent 55%)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative text-[#3A4D39] select-none"
              style={{ fontFamily: "Georgia, serif", fontSize: 18, lineHeight: 1 }}
            >
              ✕
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative select-none"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 18,
                lineHeight: 1,
                letterSpacing: 1,
              }}
            >
              ☰
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

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
                  <path
                    d="M36 0 L36 36 L0 0 Z"
                    fill="#E2D8C0"
                    opacity="0.7"
                  />
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
                  <path
                    d="M0 28 L0 0 L28 28 Z"
                    fill="#E4D9C2"
                    opacity="0.6"
                  />
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
