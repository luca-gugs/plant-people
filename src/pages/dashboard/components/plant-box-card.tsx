import { Link } from "react-router";
import { motion } from "framer-motion";
import { Leaf, MapPin, AlertCircle } from "lucide-react";
import { LIGHT_BY_VALUE } from "../../../constants/light-conditions";

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
  const lightConfig = box.lightCondition
    ? LIGHT_BY_VALUE[box.lightCondition as keyof typeof LIGHT_BY_VALUE]
    : null;

  const needsWater =
    box.latestMoisturePct !== null && box.latestMoisturePct < 50;

  return (
    <Link to={`/plant-box/${box._id}`}>
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
        {lightConfig && (
          <span
            className={`absolute top-3 left-3 ${lightConfig.tagBg} ${lightConfig.tagText} backdrop-blur-sm px-2.5 py-1 text-[10px] uppercase tracking-wider font-sans`}
          >
            {lightConfig.label}
          </span>
        )}

        {/* Needs water badge */}
        {needsWater && (
          <span className="absolute bottom-3 right-3 bg-alert/90 text-white backdrop-blur-sm px-2.5 py-1 text-[10px] uppercase tracking-wider font-sans flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3" />
            Need Water
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-5 space-y-3">
        {/* Name */}
        <h3
          className="text-lg leading-snug"
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 300,
            fontStyle: "italic",
            color: "#3A2C10",
          }}
        >
          {box.name}
        </h3>

        {/* Location */}
        {box.location && (
          <p className="flex items-center gap-1.5 label-sm">
            <MapPin className="w-3 h-3" />
            {box.location}
          </p>
        )}

        {/* Description */}
        {box.description && (
          <p
            className="text-sm leading-relaxed"
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              color: "#6B5E4C",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {box.description}
          </p>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-6 pt-3 border-t border-border/40">
          {/* Specimens */}
          <div className="text-center">
            <span className="block text-lg font-light text-ink">
              {box.plantCount}
            </span>
            <span className="label-sm" style={{ fontSize: "8px" }}>
              Specimens
            </span>
          </div>

          {/* Avg Moisture */}
          {box.latestMoisturePct !== null && (
            <div className="text-center">
              <span className="block text-lg font-light text-ink">
                {Math.round(box.latestMoisturePct)}%
              </span>
              <span className="label-sm" style={{ fontSize: "8px" }}>
                Avg. Moisture
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
    </Link>
  );
}
