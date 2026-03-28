import { motion } from "framer-motion";
import { Leaf, Droplets } from "lucide-react";

// ─── Light condition display labels ───

const LIGHT_LABELS: Record<string, string> = {
  full_sun: "Full Sun",
  partial_shade: "Partial Shade",
  deep_shade: "Deep Shade",
};

// ─── Component ───

interface PlantBoxCardProps {
  box: {
    _id: string;
    name: string;
    location?: string;
    description?: string;
    coverImageUrl?: string;
    lightCondition?: string;
    plantCount: number;
    latestMoisturePct: number | null;
  };
}

export default function PlantBoxCard({ box }: PlantBoxCardProps) {
  return (
    <motion.div
      className="card-specimen overflow-hidden p-0"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cover image */}
      <div className="relative aspect-[4/3] bg-parchment-dark overflow-hidden">
        {box.coverImageUrl ? (
          <img
            src={box.coverImageUrl}
            alt={box.name}
            className="w-full h-full object-cover img-botanical"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Leaf className="w-10 h-10 text-border" />
          </div>
        )}

        {/* Light condition tag */}
        {box.lightCondition && (
          <span className="tag-specimen absolute top-3 left-3">
            {LIGHT_LABELS[box.lightCondition] ?? box.lightCondition}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-5 space-y-3">
        {/* Name & location */}
        <div>
          <h3 className="text-lg italic font-light text-botanical leading-snug">
            {box.name}
          </h3>
          {box.location && (
            <p className="label-sm mt-1">{box.location}</p>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 pt-1 border-t border-border/40">
          {/* Plant count */}
          <span className="flex items-center gap-1.5 label-sm">
            <Leaf className="w-3 h-3" />
            <span>
              {box.plantCount} {box.plantCount === 1 ? "plant" : "plants"}
            </span>
          </span>

          {/* Moisture */}
          {box.latestMoisturePct !== null && (
            <span className="flex items-center gap-1.5 label-sm">
              <Droplets className="w-3 h-3" />
              <span>{Math.round(box.latestMoisturePct)}%</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
