import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sun, FileText, Image, Leaf, Loader2, BookOpen, X } from "lucide-react";

// ─── Types & Constants ───

import { LIGHT_OPTIONS, type LightCondition } from "../../../constants/light-conditions";

interface FormValues {
  name: string;
  location: string;
  description: string;
  lightCondition: LightCondition;
  selectedCover: string;
  customCoverUrl: string;
}

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

// ─── Inline styles for parchment panel ───

const panelStyle: React.CSSProperties = {
  background: `
    radial-gradient(ellipse at 20% 10%, rgba(210,190,150,0.12) 0%, transparent 55%),
    radial-gradient(ellipse at 85% 80%, rgba(180,160,120,0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 45%, rgba(230,215,185,0.07) 0%, transparent 60%),
    linear-gradient(162deg, #FEFAF0 0%, #F7F0E0 30%, #F1E9D5 65%, #EBE1C8 100%)
  `,
};

const deckleStyle: React.CSSProperties = {
  width: "18px",
  flexShrink: 0,
  background: `
    radial-gradient(circle at 0% 4%, #E8D9B3 4px, transparent 4px),
    radial-gradient(circle at 0% 10%, #DED0A4 3.5px, transparent 3.5px),
    radial-gradient(circle at 0% 16%, #E8D9B3 4.5px, transparent 4.5px),
    radial-gradient(circle at 0% 22%, #DED0A4 3px, transparent 3px),
    radial-gradient(circle at 0% 28%, #E8D9B3 4px, transparent 4px),
    radial-gradient(circle at 0% 34%, #DED0A4 3.5px, transparent 3.5px),
    radial-gradient(circle at 0% 40%, #E8D9B3 4.5px, transparent 4.5px),
    radial-gradient(circle at 0% 46%, #DED0A4 3px, transparent 3px),
    radial-gradient(circle at 0% 52%, #E8D9B3 4px, transparent 4px),
    radial-gradient(circle at 0% 58%, #DED0A4 3.5px, transparent 3.5px),
    radial-gradient(circle at 0% 64%, #E8D9B3 4.5px, transparent 4.5px),
    radial-gradient(circle at 0% 70%, #DED0A4 3px, transparent 3px),
    radial-gradient(circle at 0% 76%, #E8D9B3 4px, transparent 4px),
    radial-gradient(circle at 0% 82%, #DED0A4 3.5px, transparent 3.5px),
    radial-gradient(circle at 0% 88%, #E8D9B3 4.5px, transparent 4.5px),
    radial-gradient(circle at 0% 94%, #DED0A4 3px, transparent 3px),
    linear-gradient(to right, #C9B98A, #DED0A4)
  `,
};

const leatherTabStyle: React.CSSProperties = {
  background: `
    linear-gradient(135deg,
      #5C3D1E 0%,
      #7A5230 25%,
      #6B4422 50%,
      #8B6340 65%,
      #5C3D1E 100%
    )
  `,
  boxShadow:
    "-3px 0 8px rgba(60,30,10,0.35), inset 1px 0 2px rgba(255,220,160,0.15)",
  borderRadius: "0 0 0 8px",
  writingMode: "vertical-rl",
  textOrientation: "mixed",
};

const ruledLineStyle: React.CSSProperties = {
  backgroundImage: `
    repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 31px,
      rgba(160, 130, 80, 0.18) 31px,
      rgba(160, 130, 80, 0.18) 32px
    )
  `,
  lineHeight: "32px",
};

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
            className="absolute inset-0 bg-[#1A1208]/40 backdrop-blur-[3px]"
            onClick={handleClose}
          />

          {/* Journal panel wrapper */}
          <motion.div
            initial={{ x: "105%" }}
            animate={{ x: 0 }}
            exit={{ x: "105%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="relative flex items-stretch h-full w-full md:max-w-[580px]"
          >
            {/* Leather close tab (desktop only) */}
            <button
              onClick={handleClose}
              aria-label="Close field journal"
              className="hidden md:flex flex-shrink-0 flex-col items-center justify-center gap-3 cursor-pointer hover:brightness-110 transition-all duration-200 focus:outline-none group"
              style={{
                ...leatherTabStyle,
                width: "34px",
                minHeight: "120px",
                alignSelf: "flex-start",
                marginTop: "80px",
                paddingTop: "14px",
                paddingBottom: "14px",
              }}
            >
              <span
                className="block w-1 h-1 rounded-full opacity-40 group-hover:opacity-70 transition-opacity"
                style={{ background: "#F5DEB3" }}
              />
              <span
                className="text-[8px] uppercase tracking-[0.3em] font-sans opacity-70 group-hover:opacity-100 transition-opacity"
                style={{
                  color: "#F5DEB3",
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  letterSpacing: "0.25em",
                }}
              >
                Close
              </span>
              <span
                className="block w-1 h-1 rounded-full opacity-40 group-hover:opacity-70 transition-opacity"
                style={{ background: "#F5DEB3" }}
              />
            </button>

            {/* Deckle edge strip (desktop only) */}
            <div className="hidden md:block flex-shrink-0 h-full" style={deckleStyle} />

            {/* Main journal panel */}
            <aside
              className="relative flex-1 h-full overflow-y-auto flex flex-col shadow-2xl"
              style={panelStyle}
            >
              {/* Paper grain texture overlay */}
              <div
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat",
                }}
              />

              {/* Inner shadow on left */}
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-8 z-10"
                style={{
                  background:
                    "linear-gradient(to right, rgba(90,60,20,0.09) 0%, transparent 100%)",
                }}
              />

              {/* Journal Header */}
              <header className="relative z-10 px-8 pt-10 pb-7 border-b-2 border-dashed border-[#C4A96A]/40">
                {/* Mobile close button */}
                <button
                  onClick={handleClose}
                  aria-label="Close"
                  className="md:hidden absolute top-4 right-4 p-2 cursor-pointer hover:opacity-70 transition-opacity"
                  style={{ color: "#5C3D1E" }}
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Decorative ruled header lines */}
                <div className="mb-5">
                  <div
                    className="h-px w-full mb-1"
                    style={{ background: "rgba(160,120,60,0.25)" }}
                  />
                  <div
                    className="h-px w-3/4"
                    style={{ background: "rgba(160,120,60,0.15)" }}
                  />
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <BookOpen className="w-5 h-5 text-[#5C3D1E] opacity-70 mt-0.5 flex-shrink-0" />
                  <div>
                    <span
                      className="block font-sans uppercase tracking-[0.4em] mb-1"
                      style={{ fontSize: "9px", color: "#8B6340" }}
                    >
                      Field Journal — New Entry
                    </span>
                    <h2
                      className="italic font-light leading-tight"
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "28px",
                        color: "#3A2C10",
                      }}
                    >
                      Register a Planting Station
                    </h2>
                  </div>
                </div>

                <p
                  className="italic leading-relaxed ml-8"
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "12px",
                    color: "#6B5230",
                    opacity: 0.8,
                  }}
                >
                  Each station is a distinct location or vessel in your care.
                  Record its character faithfully below.
                </p>

                {/* Entry date stamp */}
                <div
                  className="mt-4 ml-8 inline-flex items-center gap-2 px-3 py-1 border border-dashed border-[#C4A96A]/50 opacity-60"
                  style={{ borderRadius: "2px" }}
                >
                  <span
                    className="font-sans uppercase tracking-widest"
                    style={{ fontSize: "9px", color: "#7A5A2A" }}
                  >
                    Date of Entry:
                  </span>
                  <span
                    className="italic"
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "10px",
                      color: "#5C3D1E",
                    }}
                  >
                    {new Date().toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </header>

              {/* Form body */}
              <form
                onSubmit={(e) => void handleSubmit(onSubmit)(e)}
                className="relative z-10 flex-1 px-8 py-8 space-y-10"
              >
                {/* Station Name */}
                <div className="space-y-1">
                  <label
                    className="flex items-center gap-2 font-sans uppercase tracking-[0.3em]"
                    style={{ fontSize: "9px", color: "#5C3D1E" }}
                  >
                    <Leaf className="w-3 h-3" />
                    <span>I. Station Name</span>
                  </label>
                  <div style={ruledLineStyle} className="pb-1">
                    <input
                      type="text"
                      {...register("name", {
                        required: "Please give this station a name.",
                      })}
                      placeholder="e.g. The Kitchen Windowsill"
                      disabled={isSubmitting}
                      className="w-full bg-transparent focus:outline-none"
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "15px",
                        color: "#2C1A08",
                        fontStyle: "italic",
                        borderBottom: "1.5px solid rgba(160,120,60,0.35)",
                        paddingBottom: "4px",
                        lineHeight: "32px",
                      }}
                    />
                  </div>
                  {errors.name && (
                    <p
                      className="italic"
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "10px",
                        color: "#A63D40",
                      }}
                    >
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <label
                    className="flex items-center gap-2 font-sans uppercase tracking-[0.3em]"
                    style={{ fontSize: "9px", color: "#5C3D1E" }}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>II. Location in the Home</span>
                  </label>
                  <div style={ruledLineStyle} className="pb-1">
                    <input
                      type="text"
                      {...register("location", {
                        required: "Please note its location.",
                      })}
                      placeholder="e.g. Study, North-facing window"
                      disabled={isSubmitting}
                      className="w-full bg-transparent focus:outline-none"
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "15px",
                        color: "#2C1A08",
                        fontStyle: "italic",
                        borderBottom: "1.5px solid rgba(160,120,60,0.35)",
                        paddingBottom: "4px",
                        lineHeight: "32px",
                      }}
                    />
                  </div>
                  {errors.location && (
                    <p
                      className="italic"
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "10px",
                        color: "#A63D40",
                      }}
                    >
                      {errors.location.message}
                    </p>
                  )}
                </div>

                {/* Notes & Description */}
                <div className="space-y-1">
                  <label
                    className="flex items-center gap-2 font-sans uppercase tracking-[0.3em]"
                    style={{ fontSize: "9px", color: "#5C3D1E" }}
                  >
                    <FileText className="w-3 h-3" />
                    <span>III. Field Notes &amp; Observations</span>
                  </label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    disabled={isSubmitting}
                    placeholder="Describe the character of this collection..."
                    className="w-full bg-transparent resize-none focus:outline-none"
                    style={{
                      ...ruledLineStyle,
                      fontFamily: "Georgia, serif",
                      fontSize: "14px",
                      color: "#2C1A08",
                      fontStyle: "italic",
                      borderBottom: "1.5px solid rgba(160,120,60,0.35)",
                      paddingBottom: "4px",
                      lineHeight: "32px",
                    }}
                  />
                </div>

                {/* Pencil-sketch divider */}
                <div className="flex items-center gap-3 opacity-40">
                  <div
                    className="flex-1 h-px"
                    style={{
                      background:
                        "repeating-linear-gradient(to right, #8B6340 0px, #8B6340 4px, transparent 4px, transparent 8px)",
                    }}
                  />
                  <span
                    className="font-sans uppercase tracking-[0.4em]"
                    style={{ fontSize: "8px", color: "#8B6340" }}
                  >
                    &sect;
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{
                      background:
                        "repeating-linear-gradient(to right, #8B6340 0px, #8B6340 4px, transparent 4px, transparent 8px)",
                    }}
                  />
                </div>

                {/* Light Conditions */}
                <div className="space-y-3">
                  <label
                    className="flex items-center gap-2 font-sans uppercase tracking-[0.3em]"
                    style={{ fontSize: "9px", color: "#5C3D1E" }}
                  >
                    <Sun className="w-3 h-3" />
                    <span>IV. Light Conditions</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {LIGHT_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => setValue("lightCondition", opt.value)}
                        disabled={isSubmitting}
                        className="text-left transition-all duration-200 cursor-pointer"
                        style={{
                          padding: "10px 12px",
                          border: `1.5px solid ${
                            lightCondition === opt.value
                              ? "#5C3D1E"
                              : "rgba(160,130,80,0.35)"
                          }`,
                          background:
                            lightCondition === opt.value
                              ? "rgba(92,61,30,0.07)"
                              : "rgba(255,248,230,0.35)",
                          borderRadius: "2px",
                        }}
                      >
                        <span
                          className="block italic mb-0.5"
                          style={{
                            fontFamily: "Georgia, serif",
                            fontSize: "12px",
                            color:
                              lightCondition === opt.value
                                ? "#3A2C10"
                                : "#5C3D1E",
                          }}
                        >
                          {opt.label}
                        </span>
                        <span
                          className="block font-sans uppercase tracking-wider leading-tight"
                          style={{ fontSize: "8px", color: "#8B6340" }}
                        >
                          {opt.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cover Illustration */}
                <div className="space-y-3">
                  <label
                    className="flex items-center gap-2 font-sans uppercase tracking-[0.3em]"
                    style={{ fontSize: "9px", color: "#5C3D1E" }}
                  >
                    <Image className="w-3 h-3" />
                    <span>V. Cover Illustration</span>
                  </label>
                  <p
                    className="italic"
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "11px",
                      color: "#8B6340",
                      opacity: 0.85,
                    }}
                  >
                    Select from the archive engravings below, or paste a URL.
                  </p>
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
                        className="relative overflow-hidden transition-all duration-200 cursor-pointer"
                        style={{
                          aspectRatio: "4/3",
                          border: `2px solid ${
                            selectedCover === img.url &&
                            !customCoverUrl.trim()
                              ? "#5C3D1E"
                              : "rgba(160,130,80,0.25)"
                          }`,
                          borderRadius: "2px",
                        }}
                      >
                        <img
                          src={img.url}
                          alt={img.label}
                          className="w-full h-full object-cover"
                          style={{
                            opacity: 0.75,
                            filter: "sepia(40%) grayscale(20%)",
                          }}
                        />
                        <span
                          className="block font-sans uppercase tracking-wider text-center truncate px-1 py-0.5"
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            fontSize: "7px",
                            color: "#3A2C10",
                            background: "rgba(240,228,200,0.88)",
                          }}
                        >
                          {img.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    {...register("customCoverUrl")}
                    placeholder="Or paste an image URL..."
                    disabled={isSubmitting}
                    className="w-full bg-transparent focus:outline-none"
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "13px",
                      fontStyle: "italic",
                      color: "#2C1A08",
                      borderBottom: "1.5px solid rgba(160,120,60,0.35)",
                      paddingBottom: "4px",
                      lineHeight: "28px",
                    }}
                  />
                </div>

                {/* Final ornamental divider */}
                <div className="flex items-center justify-center gap-4 opacity-35">
                  <div
                    className="w-12 h-px"
                    style={{ background: "#8B6340" }}
                  />
                  <span
                    className="font-sans tracking-[0.5em]"
                    style={{ fontSize: "9px", color: "#8B6340" }}
                  >
                    &#10022;
                  </span>
                  <div
                    className="w-12 h-px"
                    style={{ background: "#8B6340" }}
                  />
                </div>

                {/* Submit error */}
                {submitError && (
                  <p
                    className="italic text-center"
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "10px",
                      color: "#A63D40",
                    }}
                  >
                    {submitError}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-4 pb-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 font-sans uppercase tracking-widest transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    style={{
                      background:
                        "linear-gradient(140deg, #3A2C10 0%, #5C3D1E 50%, #4A3218 100%)",
                      color: "#F5EDD8",
                      padding: "13px 20px",
                      fontSize: "9px",
                      letterSpacing: "0.25em",
                      borderRadius: "2px",
                      boxShadow: "0 2px 8px rgba(60,30,10,0.3)",
                    }}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Commit to Record</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="font-sans uppercase tracking-widest transition-all duration-200 hover:opacity-80 cursor-pointer"
                    style={{
                      padding: "13px 20px",
                      fontSize: "9px",
                      letterSpacing: "0.2em",
                      color: "#6B5230",
                      border: "1.5px dashed rgba(160,120,60,0.5)",
                      background: "transparent",
                      borderRadius: "2px",
                    }}
                  >
                    Discard
                  </button>
                </div>
              </form>
            </aside>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
