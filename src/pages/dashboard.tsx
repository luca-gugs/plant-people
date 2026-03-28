import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useHousehold } from "../contexts/household-context";
import { motion } from "framer-motion";
import { Plus, Leaf } from "lucide-react";
import AddPlantBoxForm from "../components/add-plant-box-form";
import PlantBoxCard from "../components/plant-box-card";
import BotanicalFlower from "../components/botanical-flower";
import DailyQuote from "../components/daily-quote";

export default function Dashboard() {
  const household = useHousehold();
  const plantBoxes = useQuery(api.plantBoxes.list);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isLoading = plantBoxes === undefined;
  const isEmpty = plantBoxes !== undefined && plantBoxes.length === 0;

  return (
    <main className="min-h-screen bg-parchment font-body text-ink selection:bg-selection">
      {/* Ornamental border inset */}
      <div className="fixed inset-4 pointer-events-none border border-border opacity-40 z-0" />

      {/* ─── Header ─── */}
      <motion.header
        className="relative z-10 text-center pt-16 pb-10 px-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span className="label-wide block mb-4">The Conservatory at</span>
        <h1 className="text-4xl heading-botanical leading-snug">
          {household.name}
        </h1>
        <p className="mt-3 text-sm text-muted-italic opacity-70">
          Share code{" "}
          <span className="font-mono tracking-widest text-botanical">
            {household.joinCode}
          </span>{" "}
          to invite others
        </p>
        <div className="divider-botanical mx-auto mt-6" />
      </motion.header>

      {/* ─── Content ─── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
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

            {/* Daily quote */}
            <div className="mt-16 opacity-60">
              <DailyQuote />
            </div>
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
              <div className="flex items-center gap-3">
                <Leaf className="w-4 h-4 text-botanical" />
                <h2 className="text-xl heading-botanical">Planting Stations</h2>
              </div>
              <button
                onClick={() => setDrawerOpen(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Plus className="w-3 h-3" />
                <span>Add Station</span>
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plantBoxes.map((box) => (
                <PlantBoxCard key={box._id} box={box} />
              ))}
            </div>

            {/* Footer quote */}
            <div className="mt-20 text-center opacity-50">
              <DailyQuote />
            </div>
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
