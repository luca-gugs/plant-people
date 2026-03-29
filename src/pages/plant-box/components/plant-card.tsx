import { motion } from "framer-motion";
import { AlertCircle, Clock, Droplets, Leaf } from "lucide-react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

interface PlantCardProps {
  plant: Doc<"plants">;
  index: number;
  moisturePct: number | null;
  onClick: () => void;
}

export default function PlantCard({
  plant,
  index,
  moisturePct,
  onClick,
}: PlantCardProps) {
  const needsWater = moisturePct !== null && moisturePct < 30;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="card-specimen"
      onClick={onClick}
    >
      {/* Botanical illustration placeholder */}
      <div className="relative aspect-3/4 overflow-hidden mb-6 bg-parchment-dark flex items-center justify-center">
        <Leaf className="w-16 h-16 text-border transition-transform duration-700 group-hover:scale-105" />

        {/* Specimen number tag */}
        <div className="absolute top-4 right-4 tag-specimen">
          No. {String(index + 1).padStart(3, "0")}
        </div>

        {/* Alert badge for low moisture */}
        {needsWater && (
          <div className="absolute bottom-4 left-4 badge-alert">
            <AlertCircle className="w-3 h-3" />
            <span>Attention Required</span>
          </div>
        )}
      </div>

      {/* Plant info */}
      <div className="space-y-1">
        {plant.species && <p className="label-xs">{plant.species}</p>}
        <h3
          className="text-xl italic font-medium"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {plant.name}
        </h3>
      </div>

      {/* Footer stats */}
      <div className="mt-6 pt-4 border-t border-border/40 flex justify-between items-center text-xs italic text-ink-muted">
        {moisturePct !== null && (
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3 text-water" />
            <span>{moisturePct}% Hydration</span>
          </div>
        )}
        {plant.plantedDate && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-ink-faint" />
            <span>
              {new Date(plant.plantedDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
