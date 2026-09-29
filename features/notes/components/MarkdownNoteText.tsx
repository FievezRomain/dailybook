import { Text, type TextStyle } from "react-native";

import { typography } from "../../../theme/scales";
import { useAppTheme } from "../../../theme/useAppTheme";

export function MarkdownNoteText({ value }: { value: string }) {
  const { colors } = useAppTheme();
  const base: TextStyle = {
    color: colors.textPrimary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    lineHeight: 22,
  };
  const lines = value.split("\n");
  return (
    <Text style={base}>
      {lines.map((line, index) => (
        <Text key={`${index}-${line.slice(0, 12)}`}>
          {renderLine(line, base)}
          {index < lines.length - 1 ? "\n" : ""}
        </Text>
      ))}
    </Text>
  );
}

function renderLine(line: string, base: TextStyle) {
  const heading = /^(#{1,6})\s+(.*)$/.exec(line);
  const bullet = /^\s*[-*]\s+(.*)$/.exec(line);
  const numbered = /^\s*\d+\.\s+(.*)$/.exec(line);
  const content = heading?.[2] ?? bullet?.[1] ?? numbered?.[1] ?? line;
  const prefix = bullet
    ? "• "
    : numbered
      ? `${line.trimStart().split(".")[0]}. `
      : "";
  const style = heading
    ? {
        ...base,
        fontFamily: typography.fonts.bold,
        fontSize:
          heading[1].length <= 2 ? typography.sizes.xl : typography.sizes.lg,
        lineHeight: 28,
      }
    : base;
  return (
    <Text style={style}>
      {prefix}
      {renderInline(content)}
    </Text>
  );
}

function renderInline(value: string) {
  const parts = value.split(
    /(\*\*[^*]+\*\*|_[^_]+_|\[[^\]]+\]\((?:https?:\/\/|mailto:|tel:)[^)]+\))/gi,
  );
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return (
        <Text key={index} style={{ fontFamily: typography.fonts.bold }}>
          {part.slice(2, -2)}
        </Text>
      );
    if (part.startsWith("_") && part.endsWith("_"))
      return (
        <Text
          key={index}
          style={{ fontFamily: typography.fonts.medium, fontStyle: "italic" }}
        >
          {part.slice(1, -1)}
        </Text>
      );
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    return <Text key={index}>{link ? link[1] : part}</Text>;
  });
}
