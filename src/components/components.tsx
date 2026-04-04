import {
  Droplets,
  Sun,
  Thermometer,
  Wind,
  Plus,
  Search,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";

export default function Components() {
  return (
    <div className="min-h-screen bg-parchment text-ink font-body p-4 md:p-8 lg:p-12 selection:bg-selection">
      {/* Ornamental border */}
      <div className="fixed inset-4 pointer-events-none border border-border opacity-40 z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ─── Header ─── */}
        <header className="mb-12 border-b-2 border-border pb-8">
          <span className="label-wide block mb-2">
            Theme Component Reference
          </span>
          <h1 className="text-5xl heading-botanical">Tend</h1>
          <p className="mt-4 text-muted-italic max-w-md">
            A catalogue of every token, utility, and component class available
            in this design system.
          </p>
        </header>

        {/* ─── Colors ─── */}
        <section className="mb-16">
          <h2 className="text-2xl heading-botanical mb-6">Colour Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { name: "parchment", cls: "bg-parchment border border-border" },
              {
                name: "parchment-dark",
                cls: "bg-parchment-dark border border-border",
              },
              { name: "selection", cls: "bg-selection border border-border" },
              { name: "border", cls: "bg-border" },
              { name: "ink", cls: "bg-ink text-parchment" },
              { name: "ink-muted", cls: "bg-ink-muted text-parchment" },
              { name: "ink-faint", cls: "bg-ink-faint text-parchment" },
              { name: "botanical", cls: "bg-botanical text-parchment" },
              {
                name: "botanical-light",
                cls: "bg-botanical-light text-parchment",
              },
              { name: "alert", cls: "bg-alert text-parchment" },
              { name: "water", cls: "bg-water text-parchment" },
            ].map((c) => (
              <div
                key={c.name}
                className={`${c.cls} p-4 rounded-sm text-center`}
              >
                <span className="text-xs font-medium">{c.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Typography ─── */}
        <section className="mb-16">
          <h2 className="text-2xl heading-botanical mb-6">Typography</h2>
          <div className="space-y-8 bg-white/40 border border-border/40 p-8 rounded-sm">
            <div>
              <span className="label-sm mb-2 block">heading-botanical</span>
              <h3 className="text-4xl heading-botanical">
                Monstera deliciosa — Swiss Cheese Plant
              </h3>
            </div>
            <div>
              <span className="label-sm mb-2 block">text-muted-italic</span>
              <p className="text-muted-italic max-w-lg">
                The Swiss Cheese Plant requires a diligent caretaker. Ensure the
                soil is allowed to dry slightly between waterings to prevent the
                decay of delicate root structures. Keep away from draughts.
              </p>
            </div>
            <div className="space-y-3">
              <span className="label-sm mb-2 block">Label Variants</span>
              <p className="label-wide">
                label-wide — Herbarium Personal Archive
              </p>
              <p className="label-sm">label-sm — Hydration Level</p>
              <p className="label-xs">label-xs — Recent Activity Summary</p>
            </div>
            <div>
              <span className="label-sm mb-2 block">divider-botanical</span>
              <div className="divider-botanical" />
            </div>
          </div>
        </section>

        {/* ─── Shadows ─── */}
        <section className="mb-16">
          <h2 className="text-2xl heading-botanical mb-6">Shadows</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="shadow-card bg-white/40 border border-border/40 p-8 rounded-sm">
              <span className="label-sm">shadow-card</span>
              <p className="mt-2 italic">Subtle card elevation</p>
            </div>
            <div className="shadow-botanical bg-botanical text-parchment p-8 rounded-sm">
              <span className="text-[10px] uppercase tracking-widest opacity-80">
                shadow-botanical
              </span>
              <p className="mt-2 italic">Primary action shadow</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ─── Left Column: Cards, Buttons, Inputs ─── */}
          <div className="lg:col-span-8 space-y-16">
            {/* Cards */}
            <section>
              <h2 className="text-2xl heading-botanical mb-6">
                Specimen Cards
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Card with full anatomy */}
                <div className="card-specimen group">
                  <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-parchment-dark">
                    <div className="w-full h-full flex items-center justify-center text-ink-faint italic">
                      [Plant Illustration]
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="tag-specimen">No. 001</span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="badge-alert">
                        <AlertCircle className="w-3 h-3" />
                        Attention Required
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="label-sm">Monstera deliciosa</p>
                    <h3 className="text-xl italic font-medium">
                      Swiss Cheese Plant
                    </h3>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/40 flex justify-between items-center text-xs italic text-ink-muted">
                    <div className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-water" />
                      <span>45% Hydration</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-ink-faint" />
                      <span>Next: 31 Oct 2023</span>
                    </div>
                  </div>
                </div>

                {/* Healthy card */}
                <div className="card-specimen group">
                  <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-parchment-dark">
                    <div className="w-full h-full flex items-center justify-center text-ink-faint italic">
                      [Plant Illustration]
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="tag-specimen">No. 004</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="label-sm">Calathea orbifolia</p>
                    <h3 className="text-xl italic font-medium">
                      Round-Leaf Calathea
                    </h3>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/40 flex justify-between items-center text-xs italic text-ink-muted">
                    <div className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-water" />
                      <span>80% Hydration</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-ink-faint" />
                      <span>Next: 29 Oct 2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Buttons */}
            <section>
              <h2 className="text-2xl heading-botanical mb-6">Buttons</h2>
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary px-6">
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Log New Specimen
                  </span>
                </button>
                <button className="btn-primary flex-1 max-w-xs">
                  Record Watering
                </button>
                <button className="btn-secondary">Dismiss</button>
              </div>
            </section>

            {/* Inputs */}
            <section>
              <h2 className="text-2xl heading-botanical mb-6">Inputs</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                <input
                  type="text"
                  placeholder="Search flora specimens..."
                  className="input-search w-full"
                />
              </div>
            </section>

            {/* Badges & Tags */}
            <section>
              <h2 className="text-2xl heading-botanical mb-6">Badges & Tags</h2>
              <div className="flex flex-wrap gap-4 items-center">
                <span className="badge-alert">
                  <AlertCircle className="w-3 h-3" />
                  Attention Required
                </span>
                <span className="tag-specimen">No. 001</span>
                <span className="tag-specimen">No. 042</span>
              </div>
            </section>

            {/* Modal Preview */}
            <section>
              <h2 className="text-2xl heading-botanical mb-6">Modal Content</h2>
              <div className="modal-content w-full max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="min-h-[300px] bg-parchment-dark flex items-center justify-center">
                    <span className="text-ink-faint italic">
                      [Botanical Illustration]
                    </span>
                  </div>
                  <div className="p-8 md:p-12 space-y-6">
                    <header>
                      <p className="label-sm mb-1">Ficus lyrata</p>
                      <h2 className="text-3xl italic font-medium text-botanical mb-4">
                        Fiddle Leaf Fig
                      </h2>
                      <div className="divider-botanical" />
                    </header>
                    <div className="grid grid-cols-2 gap-8 py-6 border-y border-border/40">
                      <div className="space-y-1">
                        <span className="label-sm flex items-center gap-2">
                          <Droplets className="w-3 h-3" />
                          Hydration
                        </span>
                        <p className="text-lg italic">65% Sufficient</p>
                      </div>
                      <div className="space-y-1">
                        <span className="label-sm flex items-center gap-2">
                          <Sun className="w-3 h-3" />
                          Illumination
                        </span>
                        <p className="text-lg italic">High Sunlight</p>
                      </div>
                    </div>
                    <p className="text-muted-italic text-sm">
                      The Fiddle Leaf Fig requires a diligent caretaker. Ensure
                      the soil is allowed to dry slightly between waterings.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                      <button className="btn-primary flex-1">
                        Record Watering
                      </button>
                      <button className="btn-secondary">Dismiss</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ─── Right Column: Panels ─── */}
          <aside className="lg:col-span-4 space-y-12">
            {/* Sidebar Panel */}
            <div className="panel-sidebar">
              <div className="flex items-center gap-2 mb-6">
                <CalendarDays className="w-5 h-5 text-botanical" />
                <h2 className="text-lg uppercase tracking-widest text-botanical">
                  Maintenance Log
                </h2>
              </div>
              <div className="space-y-6">
                <p className="label-xs mb-3">Recent Activity Summary</p>
                <div className="h-32 bg-parchment rounded-sm border border-border/40 flex items-center justify-center text-ink-faint italic text-sm">
                  [Chart Area]
                </div>
                <ul className="space-y-4 text-sm italic border-t border-border pt-6">
                  <li className="flex justify-between items-start">
                    <div>
                      <span className="label-xs block not-italic mb-1">
                        Oct 27, 2023
                      </span>
                      <span>Hydrated the African Mask specimen.</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-botanical shrink-0" />
                  </li>
                  <li className="flex justify-between items-start">
                    <div>
                      <span className="label-xs block not-italic mb-1">
                        Oct 24, 2023
                      </span>
                      <span>Relocated Fiddle Leaf Fig for more light.</span>
                    </div>
                    <Info className="w-4 h-4 text-ink-faint shrink-0" />
                  </li>
                </ul>
              </div>
            </div>

            {/* Ornate Panel */}
            <div className="panel-ornate">
              <h2 className="text-sm uppercase tracking-widest text-botanical mb-6 text-center">
                Conservatory Conditions
              </h2>
              <div className="grid grid-cols-2 gap-8 text-center">
                <div>
                  <Thermometer className="w-6 h-6 text-alert mx-auto mb-2 opacity-80" />
                  <p className="text-2xl font-serif">22°C</p>
                  <span className="label-xs tracking-tighter">
                    Ambient Temp
                  </span>
                </div>
                <div>
                  <Wind className="w-6 h-6 text-water mx-auto mb-2 opacity-80" />
                  <p className="text-2xl font-serif">64%</p>
                  <span className="label-xs tracking-tighter">
                    Air Humidity
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
