import { View, Text } from "react-native";

interface MoistureBarProps {
  pct: number | null;
}

export default function MoistureBar({ pct }: MoistureBarProps) {
  if (pct === null) {
    return (
      <View className="mt-2">
        <View className="h-1 bg-border rounded-full w-full" />
        <Text
          className="text-ink-faint mt-1"
          style={{ fontSize: 10, fontStyle: "italic" }}
        >
          No reading
        </Text>
      </View>
    );
  }

  const barColor =
    pct >= 70 ? "#507DBC" : pct >= 40 ? "#3A4D39" : "#A63D40";
  const label =
    pct >= 70 ? "Well watered" : pct >= 40 ? "Moderate" : "Needs water";

  return (
    <View className="mt-2">
      <View className="h-1.5 bg-border rounded-full w-full overflow-hidden">
        <View
          style={{
            width: `${Math.min(pct, 100)}%`,
            height: "100%",
            backgroundColor: barColor,
            borderRadius: 999,
          }}
        />
      </View>
      <View className="flex-row justify-between mt-1">
        <Text style={{ fontSize: 10, color: barColor, fontStyle: "italic" }}>
          {label}
        </Text>
        <Text
          className="text-ink-faint"
          style={{ fontSize: 10 }}
        >
          {pct}%
        </Text>
      </View>
    </View>
  );
}
