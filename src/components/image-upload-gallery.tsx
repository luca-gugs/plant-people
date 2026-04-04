import { useRef } from "react";
import { Camera, X, Loader2 } from "lucide-react";

interface ImageItem {
  _id: string;
  url: string;
}

interface ImageUploadGalleryProps {
  images: ImageItem[];
  onFileSelected: (file: File) => Promise<void>;
  onRemove: (id: string) => void;
  isUploading: boolean;
}

// Roman numeral helper (up to 20 plates is plenty)
const ROMAN = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX"];

const plateTagStyle: React.CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  fontSize: "7px",
  color: "#3A2C10",
  background: "rgba(240,228,200,0.88)",
  padding: "2px 4px",
  fontFamily: "sans-serif",
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  textAlign: "center",
};

export default function ImageUploadGallery({
  images,
  onFileSelected,
  onRemove,
  isUploading,
}: ImageUploadGalleryProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      void onFileSelected(file);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-3">
      {/* Image grid with plate numbering */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, i) => (
            <div
              key={img._id}
              className="relative group overflow-hidden"
              style={{ aspectRatio: "4/3", borderRadius: "2px" }}
            >
              <img
                src={img.url}
                alt={`Plate ${ROMAN[i] ?? i + 1}`}
                className="w-full h-full object-cover"
                style={{ filter: "sepia(15%) grayscale(10%)" }}
              />
              {/* Plate number caption */}
              <div style={plateTagStyle}>Pl. {ROMAN[i] ?? i + 1}</div>
              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemove(img._id)}
                aria-label="Remove photograph"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                style={{
                  width: "24px",
                  height: "24px",
                  background: "rgba(60,30,10,0.75)",
                  borderRadius: "2px",
                }}
              >
                <X className="w-3 h-3" style={{ color: "#F5EDD8" }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Full-width tappable upload zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="w-full flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:opacity-80 active:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        style={{
          padding: "20px 16px",
          border: "1.5px dashed rgba(160,120,60,0.5)",
          background: "transparent",
          borderRadius: "2px",
          minHeight: "64px",
        }}
      >
        {isUploading ? (
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#8B6340" }} />
        ) : (
          <Camera className="w-6 h-6" style={{ color: "#8B6340" }} />
        )}
        <span
          className="font-sans uppercase"
          style={{
            fontSize: "9px",
            letterSpacing: "0.3em",
            color: "#6B5230",
          }}
        >
          {isUploading ? "Recording..." : "Log Photograph"}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
