import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Plus } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";

interface PlantBoxHeaderProps {
  box: Doc<"plantBoxes"> & {
    plantCount: number;
    latestMoisturePct: number | null;
    deviceName: string | null;
    deviceStatus: string | null;
  };
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLogSpecimen: () => void;
}

export default function PlantBoxHeader({
  box,
  searchQuery,
  onSearchChange,
  onLogSpecimen,
}: PlantBoxHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto px-6 pt-8 mb-12 border-b-2 border-border pb-8"
    >
      {/* Back link */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-italic hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Ledger</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Left: title & description */}
        <div>
          <span className="label-wide block mb-2">Station:</span>
          <h1
            className="text-5xl md:text-6xl font-light italic text-botanical"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {box.name}
          </h1>
          {box.description && <ExpandableDescription text={box.description} />}
        </div>

        {/* Right: search + button */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
            <input
              type="text"
              placeholder="Search flora specimens..."
              className="input-search w-64"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <button
            onClick={onLogSpecimen}
            className="btn-primary flex items-center gap-2 px-4 self-end"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Specimen</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}

function ExpandableDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-4 max-w-md">
      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          expanded ? "max-h-96" : "max-h-[3.25em]"
        }`}
      >
        <p className="text-muted-italic leading-relaxed italic opacity-80">
          {text}
        </p>
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-ink-faint hover:text-botanical transition-colors mt-1 italic"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
