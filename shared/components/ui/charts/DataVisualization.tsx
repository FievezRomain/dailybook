import { Pressable, ScrollView, Text, View } from "react-native";
import Svg, { Path, Polyline } from "react-native-svg";
import { componentTokens } from "../../../../theme/componentTokens";
import { radii, spacing, typography } from "../../../../theme/scales";
import { useAppTheme } from "../../../../theme/useAppTheme";
import { Card } from "../content";
import { Skeleton } from "../feedback";
import { Icon } from "../icons";
import { ChartTooltip, type ChartTooltipProps } from "./ChartTooltip";
import {
  clampIntensity,
  getChartSummary,
  normalizeChartValues,
  type ChartDatum,
} from "./chartUtils";
import { generateDistinctChartColors } from "./colorUtils";

export type DataVisualizationType = "line" | "bar" | "pie" | "heatmap";
export type DataVisualizationState =
  "ready" | "selected" | "loading" | "empty" | "error";
export interface HeatmapDatum {
  row: string;
  column: string;
  value: number;
  periodKey?: string;
}
export interface DataVisualizationProps {
  title: string;
  type: DataVisualizationType;
  state?: DataVisualizationState;
  data?: readonly ChartDatum[];
  heatmapData?: readonly HeatmapDatum[];
  selected?: ChartTooltipProps;
  valueFormatter?: (value: number) => string;
  onDataPress?: (item: ChartDatum) => void;
  onHeatmapPress?: (item: HeatmapDatum) => void;
  accessibilitySummary?: string;
  testID?: string;
}

export function DataVisualization({
  title,
  type,
  state = "ready",
  data = [],
  heatmapData = [],
  selected,
  valueFormatter = String,
  onDataPress,
  onHeatmapPress,
  accessibilitySummary,
  testID,
}: DataVisualizationProps) {
  const { colors } = useAppTheme();
  const summary = accessibilitySummary ?? getChartSummary(data);
  return (
    <Card
      accessibilityLabel={`${title}. ${state === "error" ? "Impossible de charger les données" : state === "empty" ? "Pas encore assez de données" : summary}`}
      testID={testID}
      style={{
        width: "100%",
        maxWidth: componentTokens.content.dataVisualization.width,
        minHeight: componentTokens.content.dataVisualization.height,
        height:
          type === "heatmap"
            ? undefined
            : componentTokens.content.dataVisualization.height,
        gap: 10,
      }}
    >
      <Text
        style={{
          color: colors.textPrimary,
          fontFamily: typography.fonts.semiBold,
          fontSize: typography.sizes.lg,
          lineHeight: 24,
        }}
      >
        {title}
      </Text>
      <View
        accessibilityElementsHidden={!onHeatmapPress && !onDataPress}
        style={{ width: "100%", flex: 1 }}
      >
        {state === "loading" ? (
          <ChartLoading />
        ) : state === "empty" || state === "error" ? (
          <ChartMessage error={state === "error"} />
        ) : (
          <>
            <View style={{ flex: 1, justifyContent: "center" }}>
              {type === "line" ? (
                <LinePlot data={data} />
              ) : type === "bar" ? (
                <BarPlot data={data} />
              ) : type === "pie" ? (
                <PiePlot data={data} valueFormatter={valueFormatter} onPress={onDataPress} />
              ) : (
                <HeatmapPlot data={heatmapData} onPress={onHeatmapPress} />
              )}
            </View>
            {state === "selected" && selected ? (
              <ChartTooltip {...selected} />
            ) : null}
          </>
        )}
      </View>
    </Card>
  );
}

function ChartLoading() {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Skeleton type="list" density="compact" />
    </View>
  );
}
function ChartMessage({ error }: { error: boolean }) {
  const { colors } = useAppTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.md,
      }}
    >
      <Icon
        name={error ? "error" : "chartColumn"}
        size="xl"
        color={error ? colors.error : colors.primary}
      />
      <Text
        style={{
          color: error ? colors.error : colors.textSecondary,
          fontFamily: typography.fonts.regular,
          fontSize: typography.sizes.control,
        }}
      >
        {error
          ? "Impossible de charger les données"
          : "Pas encore assez de données"}
      </Text>
    </View>
  );
}

function LinePlot({ data }: { data: readonly ChartDatum[] }) {
  const { colors } = useAppTheme();
  const normalized = normalizeChartValues(data);
  const width = 296;
  const height = 128;
  const points = normalized
    .map(
      (item, index) =>
        `${normalized.length === 1 ? width / 2 : (index * width) / (normalized.length - 1)},${height - item.normalized * 100 - 14}`,
    )
    .join(" ");
  return (
    <View style={{ alignItems: "center", gap: 4 }}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Polyline
          points={points}
          fill="none"
          stroke={colors.primary}
          strokeWidth={2}
        />
      </Svg>
      <AxisLabels data={data} />
    </View>
  );
}
function BarPlot({ data }: { data: readonly ChartDatum[] }) {
  const { colors } = useAppTheme();
  const normalized = normalizeChartValues(data);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 12,
        paddingHorizontal: 2,
      }}
    >
      {normalized.map((item, index) => (
        <View
          key={`${item.label}-${index}`}
          style={{ flex: 1, alignItems: "center", gap: 6 }}
        >
          <View
            style={{
              width: "70%",
              minHeight: 8,
              height: 24 + item.normalized * 88,
              borderRadius: 6,
              backgroundColor:
                item.color ??
                (index === 3 ? colors.primary : colors.primaryLight),
            }}
          />
          <Text
            style={{
              color: colors.textSecondary,
              fontFamily: typography.fonts.medium,
              fontSize: typography.sizes.xs,
            }}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
function PiePlot({
  data,
  valueFormatter,
  onPress,
}: {
  data: readonly ChartDatum[];
  valueFormatter: (value: number) => string;
  onPress?: (item: ChartDatum) => void;
}) {
  const { colors } = useAppTheme();
  const generatedColors = generateDistinctChartColors(data.length);
  const total =
    data.reduce((sum, item) => sum + Math.max(0, item.value), 0) || 1;
  let startAngle = -90;
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xl,
      }}
    >
      <Svg width={128} height={128} viewBox="0 0 128 128">
        {data.map((item, index) => {
          const sweep = (Math.max(0, item.value) / total) * 360;
          const endAngle = startAngle + Math.min(sweep, 359.999);
          const slice = (
            <Path
              key={`${item.label}-${index}`}
              d={pieSlicePath(64, 64, 54, startAngle, endAngle)}
              fill={item.color ?? generatedColors[index]}
              onPress={() => onPress?.(item)}
            />
          );
          startAngle += sweep;
          return slice;
        })}
      </Svg>
      <View style={{ flex: 1, gap: spacing.sm }}>
        {data.map((item, index) => (
          <Pressable
            key={`${item.label}-${index}`}
            accessibilityRole={onPress ? "button" : undefined}
            accessibilityLabel={`${item.label}, ${valueFormatter(item.value)}`}
            accessibilityHint={onPress ? "Déplie le groupe correspondant dans l’historique" : undefined}
            onPress={() => onPress?.(item)}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: radii.full,
                backgroundColor: item.color ?? generatedColors[index],
              }}
            />
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                color: colors.textSecondary,
                fontFamily: typography.fonts.medium,
                fontSize: typography.sizes.xs,
              }}
            >
              {item.label} · {valueFormatter(item.value)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
function pieSlicePath(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) {
  const point = (angle: number) => {
    const radians = angle * Math.PI / 180;
    return { x: centerX + radius * Math.cos(radians), y: centerY + radius * Math.sin(radians) };
  };
  const start = point(startAngle);
  const end = point(endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${centerX} ${centerY} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}
function HeatmapPlot({ data, onPress }: { data: readonly HeatmapDatum[]; onPress?: (item: HeatmapDatum) => void }) {
  const { colors } = useAppTheme();
  const rows = [...new Set(data.map((item) => item.row))];
  const columns = [...new Set(data.map((item) => item.column))];
  const max = Math.max(1, ...data.map((item) => item.value));
  return (
    <ScrollView
      horizontal
      directionalLockEnabled
      alwaysBounceVertical={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ minWidth: "100%", paddingBottom: spacing.sm }}
    >
      <View style={{ flex: 1, gap: 5 }}>
        <View style={{ flexDirection: "row", gap: 4, paddingLeft: 72 }}>
          {columns.map((column) => (
            <Text
              key={column}
              numberOfLines={1}
              style={{
                width: 30,
                textAlign: "center",
                color: colors.textSecondary,
                fontFamily: typography.fonts.medium,
                fontSize: typography.sizes.xs,
              }}
            >
              {column}
            </Text>
          ))}
        </View>
        {rows.map((row) => (
          <View
            key={row}
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            <Text
              numberOfLines={1}
              style={{
                width: 68,
                color: colors.textSecondary,
                fontFamily: typography.fonts.medium,
                fontSize: typography.sizes.xs,
              }}
            >
              {row}
            </Text>
            {columns.map((column) => {
              const item = data.find((candidate) => candidate.row === row && candidate.column === column) ?? { row, column, value: 0 };
              const intensity =
                item.value > 0 ? 0.3 + clampIntensity(item.value / max) * 0.7 : 0.1;
              return (
                <Pressable
                  key={column}
                  disabled={!item.value || !onPress}
                  accessibilityRole={item.value && onPress ? "button" : undefined}
                  accessibilityLabel={`${row} ${column}, ${item.value} occurrence${item.value > 1 ? "s" : ""}`}
                  accessibilityHint={item.value && onPress ? "Déplie les événements correspondants dans l’historique" : undefined}
                  onPress={() => onPress?.(item)}
                  style={({ pressed }) => ({
                    width: 30,
                    height: 22,
                    borderRadius: 5,
                    backgroundColor: colors.primary,
                    opacity: pressed ? Math.max(0.2, intensity - 0.15) : intensity,
                  })}
                />
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
function AxisLabels({ data }: { data: readonly ChartDatum[] }) {
  const { colors } = useAppTheme();
  const shown =
    data.length <= 3
      ? data
      : [
          data[0],
          data[Math.floor((data.length - 1) / 2)],
          data[data.length - 1],
        ];
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {shown.map((item, index) => (
        <Text
          key={`${item.label}-${index}`}
          style={{
            color: colors.textSecondary,
            fontFamily: typography.fonts.medium,
            fontSize: typography.sizes.xs,
            lineHeight: 16,
          }}
        >
          {item.label}
        </Text>
      ))}
    </View>
  );
}
