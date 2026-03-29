import { motion, AnimatePresence } from "framer-motion";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Leaf, Droplets, Calendar } from "lucide-react";

interface PlantDetailModalProps {
  plant: Doc<"plants"> | null;
  moisturePct: number | null;
  onClose: () => void;
  onUpdateStatus: (status: "harvested" | "removed") => void;
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PlantDetailModal({
  plant,
  moisturePct,
  onClose,
  onUpdateStatus,
}: PlantDetailModalProps) {
  return (
    <AnimatePresence>
      {plant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop"
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative modal-content w-full max-w-4xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: botanical illustration placeholder */}
              <div className="h-full min-h-[300px] bg-parchment-dark relative flex items-center justify-center">
                <Leaf className="w-20 h-20 text-border" />
                {plant.species && (
                  <div className="absolute top-6 left-6 p-4 border border-botanical/30 italic text-sm text-botanical">
                    "{plant.species}"
                  </div>
                )}
              </div>

              {/* Right: details */}
              <div className="p-8 md:p-12 space-y-8 flex flex-col justify-center">
                <header>
                  {plant.species && (
                    <p className="label-sm mb-1">{plant.species}</p>
                  )}
                  <h2
                    className="text-4xl italic font-medium text-botanical mb-4"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {plant.name}
                  </h2>
                  <div className="divider-botanical" />
                </header>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-8 py-6 border-y border-border/40">
                  <div className="space-y-1">
                    <span className="flex items-center gap-2 label-xs">
                      <Droplets className="w-3 h-3" />
                      Hydration
                    </span>
                    <p className="text-lg italic">
                      {moisturePct !== null
                        ? `${moisturePct}% Sufficient`
                        : "No data"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="flex items-center gap-2 label-xs">
                      <Calendar className="w-3 h-3" />
                      Planted
                    </span>
                    <p className="text-lg italic">
                      {plant.plantedDate
                        ? formatDate(plant.plantedDate)
                        : "Unknown"}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {plant.notes && (
                  <p className="text-sm leading-relaxed text-muted-italic">
                    {plant.notes}
                  </p>
                )}

                {/* Status */}
                <p className="label-xs">
                  Status:{" "}
                  <span className="italic text-ink text-sm normal-case tracking-normal">
                    {plant.status}
                  </span>
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-4 pt-4">
                  {plant.status === "growing" && (
                    <>
                      <button
                        className="btn-primary flex-1"
                        onClick={() => onUpdateStatus("harvested")}
                      >
                        Harvest
                      </button>
                      <button
                        className="btn-secondary flex-1"
                        onClick={() => onUpdateStatus("removed")}
                      >
                        Remove
                      </button>
                    </>
                  )}
                  <button className="btn-secondary px-6" onClick={onClose}>
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
