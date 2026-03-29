import { useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { motion } from "framer-motion";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Droplets, Sun, Wifi, WifiOff } from "lucide-react";
import PlantBoxHeader from "./components/plant-box-header";
import PlantList from "./components/plant-list";
import MoistureChart from "./components/moisture-chart";
import WateringHistory from "./components/watering-history";
import WateringControls from "./components/watering-controls";
import PlantDetailModal from "./components/plant-detail-modal";
import { LIGHT_BY_VALUE } from "../../constants/light-conditions";

export default function PlantBoxPage() {
  const { id } = useParams<{ id: string }>();
  const plantBoxId = id as Id<"plantBoxes">;

  const box = useQuery(api.plantBoxes.get, { plantBoxId });
  const plants = useQuery(api.plants.list, { plantBoxId });
  const readings = useQuery(api.readings.list, { plantBoxId });
  const pumpEvents = useQuery(api.pumpEvents.list, { plantBoxId });

  const [selectedPlantId, setSelectedPlantId] =
    useState<Id<"plants"> | null>(null);
  const selectedPlant =
    (plants ?? []).find((p) => p._id === selectedPlantId) ?? null;

  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const updatePlant = useMutation(api.plants.update);

  // Loading state
  if (box === undefined) {
    return (
      <main className="min-h-screen bg-parchment flex items-center justify-center">
        <p className="text-muted-italic text-sm">Loading station...</p>
      </main>
    );
  }

  // Not found
  if (box === null) {
    return (
      <main className="min-h-screen bg-parchment flex items-center justify-center">
        <p className="text-muted-italic text-sm">Station not found.</p>
      </main>
    );
  }

  const hasDevice = box.deviceId !== undefined;

  function handleUpdatePlantStatus(status: "harvested" | "removed") {
    if (!selectedPlantId) return;
    void updatePlant({ plantId: selectedPlantId, status });
    setSelectedPlantId(null);
  }

  return (
    <div className="min-h-screen bg-parchment text-ink font-body selection:bg-selection">
      {/* Ornamental border */}
      <div className="fixed inset-4 pointer-events-none border border-border opacity-40 z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with search + Log New Specimen button */}
        <PlantBoxHeader
          box={box}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onLogSpecimen={() => setShowForm(true)}
        />

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 px-6">
          {/* ─── Left: Main content (8 cols) ─── */}
          <main className="lg:col-span-8 space-y-12">
            {/* Plant card grid */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <PlantList
                plantBoxId={plantBoxId}
                plants={plants ?? []}
                moisturePct={box.latestMoisturePct}
                searchQuery={searchQuery}
                showForm={showForm}
                onCloseForm={() => setShowForm(false)}
                onSelectPlant={setSelectedPlantId}
              />
            </motion.section>

            {/* Watering controls */}
            {hasDevice && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <WateringControls box={box} />
              </motion.section>
            )}
          </main>

          {/* ─── Right: Sidebar (4 cols) ─── */}
          <aside className="lg:col-span-4 space-y-12">
            {/* Moisture chart */}
            {hasDevice && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <MoistureChart readings={readings ?? []} />
              </motion.div>
            )}

            {/* Watering history */}
            {hasDevice && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <WateringHistory events={pumpEvents ?? []} />
              </motion.div>
            )}

            {/* Station Conditions */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="panel-ornate"
            >
              <h2 className="text-sm uppercase tracking-widest text-botanical mb-6 text-center">
                Conservatory Conditions
              </h2>
              <div className="grid grid-cols-2 gap-8 text-center">
                {/* Moisture */}
                <div>
                  <Droplets className="w-6 h-6 text-water mx-auto mb-2 opacity-80" />
                  <p
                    className="text-2xl"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {box.latestMoisturePct !== null
                      ? `${box.latestMoisturePct}%`
                      : "—"}
                  </p>
                  <span className="label-xs">Soil Moisture</span>
                </div>

                {/* Light / Device */}
                <div>
                  {box.lightCondition ? (
                    <>
                      <Sun className="w-6 h-6 text-ink-faint mx-auto mb-2 opacity-80" />
                      <p
                        className="text-xl"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {LIGHT_BY_VALUE[box.lightCondition]?.label ??
                          box.lightCondition}
                      </p>
                      <span className="label-xs">Light</span>
                    </>
                  ) : hasDevice ? (
                    <>
                      {box.deviceStatus === "online" ? (
                        <Wifi className="w-6 h-6 text-botanical mx-auto mb-2 opacity-80" />
                      ) : (
                        <WifiOff className="w-6 h-6 text-ink-faint mx-auto mb-2 opacity-80" />
                      )}
                      <p
                        className="text-2xl capitalize"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {box.deviceStatus ?? "Unknown"}
                      </p>
                      <span className="label-xs">Device</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-6 h-6 text-ink-faint mx-auto mb-2 opacity-80" />
                      <p
                        className="text-2xl"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        None
                      </p>
                      <span className="label-xs">Device</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Decorative element */}
            <div className="opacity-30 flex flex-col items-center justify-center p-4">
              <div className="w-12 h-px bg-botanical mb-4" />
              <p className="text-[10px] uppercase tracking-[0.5em] text-center">
                In Omnibus Glorificetur Deus
              </p>
              <div className="w-12 h-px bg-botanical mt-4" />
            </div>
          </aside>
        </div>
      </div>

      {/* Plant detail modal */}
      <PlantDetailModal
        plant={selectedPlant}
        moisturePct={box.latestMoisturePct}
        onClose={() => setSelectedPlantId(null)}
        onUpdateStatus={handleUpdatePlantStatus}
      />

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-border/60 text-center">
        <p className="label-xs mb-2">Meticulously cataloged and curated</p>
        <p className="text-xs italic text-ink-muted">
          Est. MMXXIII — A Private Botanical Collection
        </p>
      </footer>
    </div>
  );
}
