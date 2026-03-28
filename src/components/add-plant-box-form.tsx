import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Sun, FileText, Image, Leaf, Loader2 } from "lucide-react";

// ─── Types & Constants ───

type LightCondition = "full_sun" | "partial_shade" | "deep_shade";

interface FormValues {
  name: string;
  location: string;
  description: string;
  lightCondition: LightCondition;
  selectedCover: string;
  customCoverUrl: string;
}

const LIGHT_OPTIONS: {
  value: LightCondition;
  label: string;
  description: string;
}[] = [
  {
    value: "full_sun",
    label: "Full Sun",
    description: "Direct sunlight, 6+ hrs daily",
  },
  {
    value: "partial_shade",
    label: "Partial Shade",
    description: "Filtered or morning light",
  },
  {
    value: "deep_shade",
    label: "Deep Shade",
    description: "Low light, north-facing",
  },
];

const COVER_SUGGESTIONS: { url: string; label: string }[] = [
  {
    url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=900&auto=format&fit=crop",
    label: "Herbs & Greens",
  },
  {
    url: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=900&auto=format&fit=crop",
    label: "Tropical Shelf",
  },
  {
    url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=900&auto=format&fit=crop",
    label: "Garden Blooms",
  },
  {
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=900&auto=format&fit=crop",
    label: "Low-Light Corner",
  },
  {
    url: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=900&auto=format&fit=crop",
    label: "Ferns & Moss",
  },
  {
    url: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=900&auto=format&fit=crop",
    label: "Swiss Cheese",
  },
];

// ─── Component ───

interface AddPlantBoxFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPlantBoxForm({
  isOpen,
  onClose,
}: AddPlantBoxFormProps) {
  const createPlantBox = useMutation(api.plantBoxes.create);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      location: "",
      description: "",
      lightCondition: "partial_shade",
      selectedCover: COVER_SUGGESTIONS[0].url,
      customCoverUrl: "",
    },
  });

  const lightCondition = watch("lightCondition");
  const selectedCover = watch("selectedCover");
  const customCoverUrl = watch("customCoverUrl");

  function handleClose() {
    reset();
    setSubmitError("");
    onClose();
  }

  async function onSubmit(data: FormValues) {
    setSubmitError("");
    try {
      const coverUrl = data.customCoverUrl.trim() || data.selectedCover;
      await createPlantBox({
        name: data.name.trim(),
        location: data.location.trim(),
        description: data.description.trim() || undefined,
        lightCondition: data.lightCondition,
        coverImageUrl: coverUrl,
      });
      handleClose();
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
            onClick={handleClose}
          />

          {/* Drawer panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 250 }}
            className="relative w-full max-w-lg bg-parchment border-l-2 border-border h-full overflow-y-auto flex flex-col"
          >
            {/* ─── Header ─── */}
            <div className="px-8 pt-10 pb-6 border-b border-border/70 flex items-start justify-between gap-4">
              <div>
                <span className="label-xs block mb-1">New Entry</span>
                <h2 className="text-3xl heading-botanical leading-snug">
                  Register a Planting Station
                </h2>
                <p className="text-xs text-muted-italic mt-2 opacity-80">
                  Each station is a distinct location or vessel in your care.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="mt-1 text-ink-faint hover:text-botanical transition-colors shrink-0 cursor-pointer"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ─── Form ─── */}
            <form
              onSubmit={(e) => void handleSubmit(onSubmit)(e)}
              className="flex-1 px-8 py-8 space-y-9"
            >
              {/* Station Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 label-xs">
                  <Leaf className="w-3 h-3" />
                  <span>Station Name</span>
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Please give this station a name.",
                  })}
                  placeholder="e.g. The Kitchen Windowsill"
                  disabled={isSubmitting}
                  className="w-full bg-transparent border-b border-border py-2 text-sm italic text-ink placeholder:text-ink-faint/50 focus:outline-none focus:border-botanical transition-colors"
                />
                {errors.name && (
                  <p className="text-[10px] italic text-alert">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 label-xs">
                  <MapPin className="w-3 h-3" />
                  <span>Location in the Home</span>
                </label>
                <input
                  type="text"
                  {...register("location", {
                    required: "Please note its location.",
                  })}
                  placeholder="e.g. Study, North-facing window"
                  disabled={isSubmitting}
                  className="w-full bg-transparent border-b border-border py-2 text-sm italic text-ink placeholder:text-ink-faint/50 focus:outline-none focus:border-botanical transition-colors"
                />
                {errors.location && (
                  <p className="text-[10px] italic text-alert">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 label-xs">
                  <FileText className="w-3 h-3" />
                  <span>Notes &amp; Description</span>
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  disabled={isSubmitting}
                  placeholder="Describe the character of this collection..."
                  className="w-full bg-transparent border-b border-border py-2 text-sm italic text-ink placeholder:text-ink-faint/50 focus:outline-none focus:border-botanical transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Light Conditions */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 label-xs">
                  <Sun className="w-3 h-3" />
                  <span>Light Conditions</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {LIGHT_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setValue("lightCondition", opt.value)}
                      disabled={isSubmitting}
                      className={`p-3 border text-left transition-all duration-200 cursor-pointer ${
                        lightCondition === opt.value
                          ? "border-botanical bg-botanical/5"
                          : "border-border hover:border-ink-faint"
                      }`}
                    >
                      <span
                        className={`block text-xs italic mb-1 ${
                          lightCondition === opt.value
                            ? "text-botanical"
                            : "text-ink"
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span className="block text-[9px] uppercase tracking-wider text-ink-faint font-sans leading-tight">
                        {opt.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 label-xs">
                  <Image className="w-3 h-3" />
                  <span>Cover Illustration</span>
                </label>
                <p className="text-[10px] text-muted-italic">
                  Choose from the archive, or paste a URL below.
                </p>

                {/* Image grid */}
                <div className="grid grid-cols-3 gap-2">
                  {COVER_SUGGESTIONS.map((img) => (
                    <button
                      type="button"
                      key={img.url}
                      onClick={() => {
                        setValue("selectedCover", img.url);
                        setValue("customCoverUrl", "");
                      }}
                      disabled={isSubmitting}
                      className={`relative aspect-[4/3] overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                        selectedCover === img.url && !customCoverUrl.trim()
                          ? "border-botanical"
                          : "border-transparent hover:border-border"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.label}
                        className="w-full h-full object-cover img-botanical"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-parchment/80 text-[8px] uppercase tracking-wider text-botanical font-sans text-center py-0.5 px-1 truncate">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Custom URL input */}
                <input
                  type="text"
                  {...register("customCoverUrl")}
                  placeholder="Or paste an image URL..."
                  disabled={isSubmitting}
                  className="w-full bg-transparent border-b border-border py-2 text-sm italic text-ink placeholder:text-ink-faint/50 focus:outline-none focus:border-botanical transition-colors"
                />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 opacity-30">
                <div className="flex-1 h-px bg-botanical" />
                <span className="text-[9px] uppercase tracking-[0.4em] font-sans">
                  Record
                </span>
                <div className="flex-1 h-px bg-botanical" />
              </div>

              {/* Submit error */}
              {submitError && (
                <p className="text-[10px] italic text-alert text-center">
                  {submitError}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-4 pb-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    "Register Station"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="btn-secondary"
                >
                  Discard
                </button>
              </div>
            </form>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
