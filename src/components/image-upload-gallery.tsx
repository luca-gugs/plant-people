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
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img) => (
            <div
              key={img._id}
              className="relative group overflow-hidden"
              style={{ aspectRatio: "4/3", borderRadius: "2px" }}
            >
              <img
                src={img.url}
                alt="Station photograph"
                className="w-full h-full object-cover"
                style={{ filter: "sepia(15%) grayscale(10%)" }}
              />
              <button
                type="button"
                onClick={() => onRemove(img._id)}
                aria-label="Remove photograph"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                style={{
                  width: "20px",
                  height: "20px",
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

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center gap-2 font-sans uppercase tracking-widest transition-all duration-200 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        style={{
          padding: "8px 14px",
          fontSize: "9px",
          letterSpacing: "0.2em",
          color: "#6B5230",
          border: "1.5px dashed rgba(160,120,60,0.5)",
          background: "transparent",
          borderRadius: "2px",
        }}
      >
        {isUploading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Camera className="w-3 h-3" />
        )}
        <span>{isUploading ? "Uploading..." : "Add Photograph"}</span>
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
