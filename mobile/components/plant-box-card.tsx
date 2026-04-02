import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import MoistureBar from "./moisture-bar";
import type { Doc } from "~convex/_generated/dataModel";

// Matches the enriched type returned by api.plantBoxes.list
type PlantBoxListItem = Doc<"plantBoxes"> & {
  plantCount: number;
  latestMoisturePct: number | null;
};

interface PlantBoxCardProps {
  box: PlantBoxListItem;
}

const LIGHT_LABELS: Record<string, string> = {
  full_sun: "Full Sun",
  partial_shade: "Partial Shade",
  deep_shade: "Deep Shade",
};

export default function PlantBoxCard({ box }: PlantBoxCardProps) {
  const needsAttention =
    box.latestMoisturePct !== null && box.latestMoisturePct < 40;

  return (
    <TouchableOpacity
      className="border border-border bg-white/60 p-4 mb-3"
      onPress={() => router.push(`/(app)/plant-box/${box._id}`)}
      activeOpacity={0.75}
    >
      {/* Top row: name + attention badge */}
      <View className="flex-row items-start justify-between mb-1">
        <Text
          className="text-ink flex-1 mr-2"
          style={{
            fontFamily: "Georgia",
            fontStyle: "italic",
            fontSize: 17,
            fontWeight: "300",
            lineHeight: 22,
          }}
          numberOfLines={2}
        >
          {box.name}
        </Text>
        {needsAttention && (
          <View className="border border-alert/40 px-2 py-0.5 mt-0.5">
            <Text
              className="text-alert"
              style={{ fontSize: 9, letterSpacing: 1, textTransform: "uppercase" }}
            >
              Attention
            </Text>
          </View>
        )}
      </View>

      {/* Location */}
      {box.location ? (
        <Text
          className="text-ink-faint mb-3"
          style={{ fontSize: 11, fontStyle: "italic" }}
        >
          {box.location}
        </Text>
      ) : null}

      {/* Moisture bar */}
      <MoistureBar pct={box.latestMoisturePct} />

      {/* Footer: plant count + light */}
      <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-border">
        <Text
          className="text-ink-faint"
          style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}
        >
          {box.plantCount} {box.plantCount === 1 ? "specimen" : "specimens"}
        </Text>
        {box.lightCondition ? (
          <Text
            className="text-ink-faint"
            style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}
          >
            {LIGHT_LABELS[box.lightCondition] ?? box.lightCondition}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
