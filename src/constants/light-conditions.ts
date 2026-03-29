// ─── Light Condition Shared Constants ───
// Used across plant box cards, forms, and detail headers

export type LightCondition = "full_sun" | "partial_shade" | "deep_shade";

export const LIGHT_OPTIONS: {
  value: LightCondition;
  label: string;
  description: string;
  tagBg: string;
  tagText: string;
}[] = [
  {
    value: "full_sun",
    label: "Full Sun",
    description: "Direct sunlight, 6+ hrs daily",
    tagBg: "bg-[#4A6741]/90",
    tagText: "text-white",
  },
  {
    value: "partial_shade",
    label: "Partial Shade",
    description: "Filtered or morning light",
    tagBg: "bg-[#8B6340]/90",
    tagText: "text-white",
  },
  {
    value: "deep_shade",
    label: "Deep Shade",
    description: "Low light, north-facing",
    tagBg: "bg-[#507DBC]/90",
    tagText: "text-white",
  },
];

// Quick lookup by value
export const LIGHT_BY_VALUE = Object.fromEntries(
  LIGHT_OPTIONS.map((o) => [o.value, o]),
) as Record<LightCondition, (typeof LIGHT_OPTIONS)[number]>;
