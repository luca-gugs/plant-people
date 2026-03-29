import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useHousehold } from "../contexts/household-context";
import { motion } from "framer-motion";
import { Plus, Search, Link2, Leaf, AlertCircle } from "lucide-react";
import AddPlantBoxForm from "../components/add-plant-box-form";
import PlantBoxCard from "../components/plant-box-card";
import BotanicalFlower from "../components/botanical-flower";

export default function Dashboard() {
  const household = useHousehold();
  const plantBoxes = useQuery(api.plantBoxes.list);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isLoading = plantBoxes === undefined;
  const isEmpty = plantBoxes !== undefined && plantBoxes.length === 0;

  // Derived stats
  const stats = useMemo(() => {
    if (!plantBoxes) return { stations: 0, specimens: 0, attention: 0 };
    const stations = plantBoxes.length;
    const specimens = plantBoxes.reduce((sum, b) => sum + b.plantCount, 0);
    const attention = plantBoxes.filter(
      (b) => b.latestMoisturePct !== null && b.latestMoisturePct < 50
    ).length;
    return { stations, specimens, attention };
  }, [plantBoxes]);

  // Filtered boxes
  const filteredBoxes = useMemo(() => {
    if (!plantBoxes) return [];
    if (!searchQuery.trim()) return plantBoxes;
    const q = searchQuery.toLowerCase();
    return plantBoxes.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.location && b.location.toLowerCase().includes(q)) ||
        (b.description && b.description.toLowerCase().includes(q))
    );
  }, [plantBoxes, searchQuery]);

  return (
    <main className="min-h-screen bg-parchment font-body text-ink selection:bg-selection">
      {/* Ornamental border inset */}
      <div className="fixed inset-4 pointer-events-none border border-border opacity-40 z-0" />

      {/* ─── Header ─── */}
      <motion.header
        className="relative z-10 pt-16 pb-8 px-6 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          {/* Left: Title area */}
          <div>
            <span className="label-wide block mb-4">
              Herbarium Personal Archive
            </span>
            <h1
              className="leading-snug mb-4"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "#3A2C10",
              }}
            >
              The Botanical Ledger
            </h1>
            <p className="text-sm text-muted-italic opacity-70 max-w-md">
              A personal register of all planting stations, boxes &amp;
              arrangements under care.
            </p>
          </div>

          {/* Right: Search + Register button */}
          <div className="flex flex-col items-end gap-4 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collections..."
                className="input-search w-64"
              />
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="btn-primary flex items-center gap-2 px-6"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Box</span>
            </button>
          </div>
        </div>

        {/* Stats bar */}
        {!isLoading && !isEmpty && (
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <span className="flex items-center gap-2 label-sm">
              <Link2 className="w-3.5 h-3.5" />
              <strong className="text-ink text-base font-normal">
                {stats.stations}
              </strong>{" "}
              Planting Stations
            </span>
            <span className="flex items-center gap-2 label-sm">
              <Leaf className="w-3.5 h-3.5" />
              <strong className="text-ink text-base font-normal">
                {stats.specimens}
              </strong>{" "}
              Specimens Total
            </span>
            {stats.attention > 0 && (
              <span className="flex items-center gap-2 label-sm text-alert">
                <AlertCircle className="w-3.5 h-3.5" />
                <strong className="text-base font-normal">
                  {stats.attention}
                </strong>{" "}
                Require Attention
              </span>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="mt-6 h-px w-full bg-border/60" />
      </motion.header>

      {/* ─── Content ─── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-20">
            <p className="text-sm text-muted-italic">
              Loading your stations...
            </p>
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <motion.div
            className="flex flex-col items-center text-center py-12"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-32 h-32 mb-8 opacity-60">
              <BotanicalFlower />
            </div>
            <h2 className="text-2xl heading-botanical mb-3">
              Your garden awaits
            </h2>
            <p className="text-sm text-muted-italic max-w-xs mb-8">
              Register your first planting station to begin cataloguing your
              collection.
            </p>
            <button
              onClick={() => setDrawerOpen(true)}
              className="btn-primary px-8"
            >
              Add Your First Station
            </button>
          </motion.div>
        )}

        {/* Plant box grid */}
        {!isLoading && !isEmpty && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Section header */}
            <div className="flex items-center justify-between mb-8">
              <h2
                className="text-xl heading-botanical"
                style={{ fontFamily: "Georgia, serif" }}
              >
                All Planting Stations
              </h2>
              <span className="label-sm">
                {filteredBoxes.length} of {plantBoxes!.length} shown
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBoxes.map((box) => (
                <PlantBoxCard key={box._id} box={box} />
              ))}
            </div>

            {/* No search results */}
            {filteredBoxes.length === 0 && searchQuery.trim() && (
              <p className="text-center text-sm text-muted-italic py-12">
                No stations match your search.
              </p>
            )}
          </motion.section>
        )}
      </div>

      {/* ─── Add Station Drawer ─── */}
      <AddPlantBoxForm
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </main>
  );
}
