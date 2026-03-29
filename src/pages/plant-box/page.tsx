import { useParams } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import PlantBoxHeader from "./components/plant-box-header";
import PlantList from "./components/plant-list";
import MoistureChart from "./components/moisture-chart";
import WateringHistory from "./components/watering-history";
import WateringControls from "./components/watering-controls";
import DeviceSetupWizard from "./components/device-setup-wizard";

export default function PlantBoxPage() {
  const { id } = useParams<{ id: string }>();
  const plantBoxId = id as Id<"plantBoxes">;

  const box = useQuery(api.plantBoxes.get, { plantBoxId });
  const plants = useQuery(api.plants.list, { plantBoxId });
  const readings = useQuery(api.readings.list, { plantBoxId });
  const pumpEvents = useQuery(api.pumpEvents.list, { plantBoxId });

  // Loading state
  if (box === undefined) {
    return (
      <main className="min-h-screen bg-parchment flex items-center justify-center">
        <p className="text-muted-italic text-sm">Loading station...</p>
      </main>
    );
  }

  // Not found
  if (box === null) {
    return (
      <main className="min-h-screen bg-parchment flex items-center justify-center">
        <p className="text-muted-italic text-sm">Station not found.</p>
      </main>
    );
  }

  const hasDevice = box.deviceId !== undefined;

  return (
    <main className="min-h-screen bg-parchment font-body text-ink">
      {/* ─── Header: cover image, name, location, light ─── */}
      <PlantBoxHeader box={box} />

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* ─── Plants in this box ─── */}
        <section>
          <PlantList plantBoxId={plantBoxId} plants={plants ?? []} />
        </section>

        {/* ─── Device & Watering Section ─── */}
        {hasDevice ? (
          <>
            {/* ─── Moisture readings over time ─── */}
            <section>
              <MoistureChart readings={readings ?? []} />
            </section>

            {/* ─── Watering controls: mode, thresholds, manual trigger ─── */}
            <section>
              <WateringControls box={box} />
            </section>

            {/* ─── Watering history / pump event log ─── */}
            <section>
              <WateringHistory events={pumpEvents ?? []} />
            </section>
          </>
        ) : (
          /* ─── No device paired — show setup wizard ─── */
          <section>
            <DeviceSetupWizard plantBoxId={plantBoxId} />
          </section>
        )}
      </div>
    </main>
  );
}
