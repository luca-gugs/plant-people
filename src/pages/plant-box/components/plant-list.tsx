import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { Plus, Leaf } from "lucide-react";

// ─── Add Plant Form ───

interface AddPlantFormValues {
  name: string;
  species: string;
  notes: string;
}

function AddPlantForm({
  plantBoxId,
  onClose,
}: {
  plantBoxId: Id<"plantBoxes">;
  onClose: () => void;
}) {
  const createPlant = useMutation(api.plants.create);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AddPlantFormValues>({
    defaultValues: { name: "", species: "", notes: "" },
  });

  async function onSubmit(data: AddPlantFormValues) {
    await createPlant({
      plantBoxId,
      name: data.name.trim(),
      species: data.species.trim() || undefined,
      plantedDate: Date.now(),
      notes: data.notes.trim() || undefined,
    });
    onClose();
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      className="border border-border p-4 space-y-3"
    >
      <input
        type="text"
        placeholder="Plant name"
        {...register("name", { required: true })}
        className="input-field"
      />
      <input
        type="text"
        placeholder="Species (optional)"
        {...register("species")}
        className="input-field"
      />
      <textarea
        placeholder="Notes (optional)"
        {...register("notes")}
        rows={2}
        className="input-field resize-none"
      />
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-sm px-4 py-1.5 bg-ink text-parchment disabled:opacity-50"
        >
          Add
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-sm px-4 py-1.5 text-muted-italic"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Plant List ───

interface PlantListProps {
  plantBoxId: Id<"plantBoxes">;
  plants: Doc<"plants">[];
}

export default function PlantList({ plantBoxId, plants }: PlantListProps) {
  const [showForm, setShowForm] = useState(false);
  const updatePlant = useMutation(api.plants.update);

  const growing = plants.filter((p) => p.status === "growing");
  const archived = plants.filter((p) => p.status !== "growing");

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-light italic text-ink">Specimens</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-sm text-muted-italic hover:text-ink transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Plant</span>
        </button>
      </div>

      {/* Add plant form */}
      {showForm && (
        <div className="mb-4">
          <AddPlantForm
            plantBoxId={plantBoxId}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Growing plants */}
      {growing.length === 0 && !showForm && (
        <p className="text-sm text-muted-italic py-6 text-center">
          No specimens recorded yet.
        </p>
      )}

      <ul className="space-y-2">
        {growing.map((plant) => (
          <li
            key={plant._id}
            className="flex items-center justify-between border-b border-border/40 py-3"
          >
            <div className="flex items-center gap-3">
              <Leaf className="w-4 h-4 text-muted-italic" />
              <div>
                <span className="text-sm text-ink">{plant.name}</span>
                {plant.species && (
                  <span className="text-xs text-muted-italic ml-2 italic">
                    {plant.species}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  void updatePlant({
                    plantId: plant._id,
                    status: "harvested",
                  })
                }
                className="text-xs text-muted-italic hover:text-ink transition-colors"
              >
                Harvest
              </button>
              <button
                onClick={() =>
                  void updatePlant({
                    plantId: plant._id,
                    status: "removed",
                  })
                }
                className="text-xs text-muted-italic hover:text-ink transition-colors"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Archived plants */}
      {archived.length > 0 && (
        <details className="mt-6">
          <summary className="text-xs text-muted-italic cursor-pointer">
            {archived.length} archived specimen{archived.length !== 1 ? "s" : ""}
          </summary>
          <ul className="mt-2 space-y-1 opacity-60">
            {archived.map((plant) => (
              <li key={plant._id} className="flex items-center gap-2 py-1 text-sm">
                <span>{plant.name}</span>
                <span className="text-xs italic">({plant.status})</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
