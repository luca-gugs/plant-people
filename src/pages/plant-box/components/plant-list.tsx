import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import AddPlantForm from "./add-plant-form";
import PlantCard from "./plant-card";

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

  const filtered = searchQuery
    ? growing.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.species?.toLowerCase().includes(searchQuery.toLowerCase()) ??
            false),
      )
    : growing;

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

      <AddPlantForm
        isOpen={showForm}
        plantBoxId={plantBoxId}
        onClose={onCloseForm}
      />

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
