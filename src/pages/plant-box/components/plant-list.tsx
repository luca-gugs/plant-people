import { useMutation } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  Clock,
  Droplets,
  FileText,
  FlaskConical,
  Leaf,
  Loader2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

// ─── Journal Panel Styles (shared with add-plant-box-form) ───

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
  writingMode: "vertical-rl" as const,
  textOrientation: "mixed" as const,
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

const inputStyle: React.CSSProperties = {
  fontFamily: "Georgia, serif",
  fontSize: "15px",
  color: "#2C1A08",
  fontStyle: "italic",
  borderBottom: "1.5px solid rgba(160,120,60,0.35)",
  paddingBottom: "4px",
  lineHeight: "32px",
};

// ─── Add Plant Form (Journal Panel) ───

interface AddPlantFormValues {
  name: string;
  species: string;
  notes: string;
}

function AddPlantForm({
  isOpen,
  plantBoxId,
  onClose,
}: {
  isOpen: boolean;
  plantBoxId: Id<"plantBoxes">;
  onClose: () => void;
}) {
  const createPlant = useMutation(api.plants.create);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddPlantFormValues>({
    defaultValues: { name: "", species: "", notes: "" },
  });

  function handleClose() {
    reset();
    setSubmitError("");
    onClose();
  }

  async function onSubmit(data: AddPlantFormValues) {
    setSubmitError("");
    try {
      await createPlant({
        plantBoxId,
        name: data.name.trim(),
        species: data.species.trim() || undefined,
        plantedDate: Date.now(),
        notes: data.notes.trim() || undefined,
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
            className="relative flex items-stretch h-full w-full md:max-w-[520px]"
          >
            {/* Leather close tab (desktop) */}
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

            {/* Deckle edge strip (desktop) */}
            <div
              className="hidden md:block flex-shrink-0 h-full"
              style={deckleStyle}
            />

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
                      Log a New Specimen
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
                  Record each plant with care. Note its common name, species
                  classification, and any observations for future reference.
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
                {/* I. Plant Name */}
                <div className="space-y-1">
                  <label
                    className="flex items-center gap-2 font-sans uppercase tracking-[0.3em]"
                    style={{ fontSize: "9px", color: "#5C3D1E" }}
                  >
                    <Leaf className="w-3 h-3" />
                    <span>I. Common Name</span>
                  </label>
                  <div style={ruledLineStyle} className="pb-1">
                    <input
                      type="text"
                      {...register("name", {
                        required: "Please name this specimen.",
                      })}
                      placeholder="e.g. Swiss Cheese Plant"
                      disabled={isSubmitting}
                      className="w-full bg-transparent focus:outline-none"
                      style={inputStyle}
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

                {/* II. Species */}
                <div className="space-y-1">
                  <label
                    className="flex items-center gap-2 font-sans uppercase tracking-[0.3em]"
                    style={{ fontSize: "9px", color: "#5C3D1E" }}
                  >
                    <FlaskConical className="w-3 h-3" />
                    <span>II. Species Classification</span>
                  </label>
                  <div style={ruledLineStyle} className="pb-1">
                    <input
                      type="text"
                      {...register("species")}
                      placeholder="e.g. Monstera deliciosa"
                      disabled={isSubmitting}
                      className="w-full bg-transparent focus:outline-none"
                      style={inputStyle}
                    />
                  </div>
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

                {/* III. Notes */}
                <div className="space-y-1">
                  <label
                    className="flex items-center gap-2 font-sans uppercase tracking-[0.3em]"
                    style={{ fontSize: "9px", color: "#5C3D1E" }}
                  >
                    <FileText className="w-3 h-3" />
                    <span>III. Field Notes &amp; Observations</span>
                  </label>
                  <textarea
                    {...register("notes")}
                    rows={4}
                    disabled={isSubmitting}
                    placeholder="Care requirements, provenance, peculiarities..."
                    className="w-full bg-transparent resize-none focus:outline-none"
                    style={{
                      ...ruledLineStyle,
                      ...inputStyle,
                      fontSize: "14px",
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

// ─── Plant Card ───

function PlantCard({
  plant,
  index,
  moisturePct,
  onClick,
}: {
  plant: Doc<"plants">;
  index: number;
  moisturePct: number | null;
  onClick: () => void;
}) {
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

// ─── Sort options ───

type SortKey = "date" | "genus" | "vitality";

function sortPlants(plants: Doc<"plants">[], key: SortKey) {
  const sorted = [...plants];
  switch (key) {
    case "date":
      return sorted.sort((a, b) => (b.plantedDate ?? 0) - (a.plantedDate ?? 0));
    case "genus":
      return sorted.sort((a, b) =>
        (a.species ?? a.name).localeCompare(b.species ?? b.name),
      );
    case "vitality":
      return sorted.sort((a, b) => a.status.localeCompare(b.status));
  }
}

// ─── Plant List ───

interface PlantListProps {
  plantBoxId: Id<"plantBoxes">;
  plants: Doc<"plants">[];
  moisturePct: number | null;
  searchQuery: string;
  showForm: boolean;
  onCloseForm: () => void;
  onSelectPlant: (id: Id<"plants">) => void;
}

export default function PlantList({
  plantBoxId,
  plants,
  moisturePct,
  searchQuery,
  showForm,
  onCloseForm,
  onSelectPlant,
}: PlantListProps) {
  const [sortKey, setSortKey] = useState<SortKey>("date");

  const growing = plants.filter((p) => p.status === "growing");
  const archived = plants.filter((p) => p.status !== "growing");

  // Search filter
  const filtered = searchQuery
    ? growing.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.species?.toLowerCase().includes(searchQuery.toLowerCase()) ??
            false),
      )
    : growing;

  // Sort
  const sorted = sortPlants(filtered, sortKey);

  return (
    <div>
      {/* Section header with sort toggles */}
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-2xl font-normal text-botanical italic"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Active Collection
        </h2>
        <div className="flex gap-4 text-xs uppercase tracking-widest text-ink-faint">
          {(
            [
              ["genus", "By Genus"],
              ["vitality", "By Vitality"],
              ["date", "By Date"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              className={`hover:text-botanical transition-colors cursor-pointer ${
                sortKey === key
                  ? "underline decoration-border text-botanical"
                  : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Add plant journal panel */}
      <AddPlantForm
        isOpen={showForm}
        plantBoxId={plantBoxId}
        onClose={onCloseForm}
      />

      {/* Plant card grid */}
      {sorted.length === 0 && (
        <p className="text-sm text-muted-italic py-12 text-center">
          {searchQuery
            ? "No specimens match your search."
            : "No specimens recorded yet."}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {sorted.map((plant, index) => (
            <PlantCard
              key={plant._id}
              plant={plant}
              index={index}
              moisturePct={moisturePct}
              onClick={() => onSelectPlant(plant._id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Archived specimens */}
      {archived.length > 0 && (
        <details className="mt-10">
          <summary className="label-xs cursor-pointer hover:text-ink transition-colors">
            {archived.length} archived specimen
            {archived.length !== 1 ? "s" : ""}
          </summary>
          <ul className="mt-4 space-y-2 opacity-60">
            {archived.map((plant) => (
              <li
                key={plant._id}
                className="flex items-center gap-2 py-1 text-sm cursor-pointer hover:opacity-100 transition-opacity"
                onClick={() => onSelectPlant(plant._id)}
              >
                <Leaf className="w-3 h-3 text-ink-faint" />
                <span>{plant.name}</span>
                <span className="text-xs italic text-ink-faint">
                  ({plant.status})
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
