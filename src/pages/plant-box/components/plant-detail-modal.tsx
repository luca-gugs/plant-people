import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { Leaf, Droplets, Calendar, Camera, Loader2, X } from "lucide-react";

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
  const plantImages =
    useQuery(
      api.plantImages.list,
      plant !== null ? { plantId: plant._id } : "skip",
    ) ?? [];
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const addImage = useMutation(api.plantImages.add);
  const removeImage = useMutation(api.plantImages.remove);
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  async function handleImageFileSelected(file: File) {
    if (!plant) return;
    setIsUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = (await result.json()) as {
        storageId: Id<"_storage">;
      };
      await addImage({ plantId: plant._id, storageId });
    } finally {
      setIsUploading(false);
    }
  }

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
              {/* Left: photograph section */}
              <div className="h-full min-h-[300px] bg-parchment-dark relative flex flex-col">
                {/* Main image or placeholder */}
                <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                  {plantImages.length > 0 ? (
                    <img
                      src={plantImages[0].url}
                      alt="Plant photograph"
                      className="w-full h-full object-cover"
                      style={{ filter: "sepia(15%) grayscale(10%)" }}
                    />
                  ) : (
                    <Leaf className="w-20 h-20 text-border" />
                  )}
                  {plant.species && (
                    <div className="absolute top-6 left-6 p-4 border border-botanical/30 italic text-sm text-botanical">
                      "{plant.species}"
                    </div>
                  )}
                  {/* Remove button for the featured image */}
                  {plantImages.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        void removeImage({
                          imageId: plantImages[0]._id,
                        })
                      }
                      aria-label="Remove photograph"
                      className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer group-hover:opacity-100"
                      style={{
                        width: "24px",
                        height: "24px",
                        background: "rgba(60,30,10,0.7)",
                        borderRadius: "2px",
                      }}
                    >
                      <X className="w-3 h-3" style={{ color: "#F5EDD8" }} />
                    </button>
                  )}
                </div>

                {/* Thumbnail strip for additional images */}
                {plantImages.length > 1 && (
                  <div
                    className="flex gap-1 p-2 overflow-x-auto"
                    style={{ background: "rgba(220,205,175,0.8)" }}
                  >
                    {plantImages.slice(1).map((img) => (
                      <div
                        key={img._id}
                        className="relative group flex-shrink-0"
                        style={{ width: "48px", height: "48px" }}
                      >
                        <img
                          src={img.url}
                          alt="Plant photograph"
                          className="w-full h-full object-cover"
                          style={{ filter: "sepia(15%)", borderRadius: "2px" }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            void removeImage({ imageId: img._id })
                          }
                          aria-label="Remove photograph"
                          className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                          style={{
                            width: "16px",
                            height: "16px",
                            background: "rgba(60,30,10,0.75)",
                            borderRadius: "2px",
                          }}
                        >
                          <X
                            className="w-2 h-2"
                            style={{ color: "#F5EDD8" }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload bar */}
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    background: "rgba(235,220,195,0.6)",
                    borderTop: "1px solid rgba(160,130,80,0.2)",
                  }}
                >
                  <span
                    className="font-sans uppercase tracking-widest"
                    style={{ fontSize: "8px", color: "#8B6340" }}
                  >
                    {plantImages.length} Photograph
                    {plantImages.length !== 1 ? "s" : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-1.5 font-sans uppercase tracking-widest transition-all duration-200 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    style={{ fontSize: "8px", color: "#5C3D1E" }}
                  >
                    {isUploading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Camera className="w-3 h-3" />
                    )}
                    <span>{isUploading ? "Uploading..." : "Add Photo"}</span>
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        void handleImageFileSelected(file);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
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
