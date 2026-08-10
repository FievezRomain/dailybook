import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
  type BottomSheetBackgroundProps,
} from '@gorhom/bottom-sheet';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { componentTokens } from '../../../../theme/componentTokens';
import type { Material } from '../../../../theme/materials';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { getBottomSheetHeight, type BottomSheetSize } from './bottomSheetUtils';
import { FormSheetSurface } from './FormSheetSurface';

export interface VascoBottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: BottomSheetSize;
  material?: Material;
  dismissible?: boolean;
  testID?: string;
  height?: number;
  header?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  formHandle?: boolean;
}

export function VascoBottomSheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'medium',
  material = 'solid',
  dismissible = true,
  testID,
  height,
  header,
  contentContainerStyle,
  formHandle = false,
}: VascoBottomSheetProps) {
  const modalRef = useRef<React.ElementRef<typeof BottomSheetModal>>(null);
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const resolvedHeight = height ?? getBottomSheetHeight(size);
  const snapPoints = useMemo(() => [resolvedHeight], [resolvedHeight]);
  const handleAreaHeight = formHandle ? componentTokens.formSheet.handleAreaHeight : componentTokens.bottomSheet.paddingTop + componentTokens.bottomSheet.handle.height;

  useEffect(() => {
    if (open) modalRef.current?.present();
    else modalRef.current?.dismiss();
    return () => modalRef.current?.dismiss();
  }, [open]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={1}
        pressBehavior={dismissible ? 'close' : 'none'}
        style={[props.style, { backgroundColor: colors.overlay }]}
      />
    ),
    [colors.overlay, dismissible],
  );

  const renderBackground = useCallback(
    (props: BottomSheetBackgroundProps) => <FormSheetSurface {...props} material={material} />,
    [material],
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      stackBehavior="replace"
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose={dismissible}
      enableDismissOnClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      backgroundComponent={renderBackground}
      handleComponent={() => <SheetHandle prominent={formHandle} />}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      <BottomSheetView
        accessible
        accessibilityRole="summary"
        accessibilityLabel={title}
        testID={testID}
        style={[
          {
            height: Math.max(0, resolvedHeight - handleAreaHeight),
            gap: spacing.md,
            paddingHorizontal: componentTokens.bottomSheet.paddingX,
            paddingTop: spacing.md,
            paddingBottom: Math.max(spacing.lg, insets.bottom),
          },
          contentContainerStyle,
        ]}
      >
        {header ?? <View style={{ gap: spacing.xs }}>
          <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xl, lineHeight: typography.lineHeights.relaxed }}>
            {title}
          </Text>
          {description ? (
            <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>
              {description}
            </Text>
          ) : null}
        </View>}
        <View style={{ flex: 1 }}>{children}</View>
        {footer}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

function SheetHandle({ prominent = false }: { prominent?: boolean }) {
  const { colors } = useAppTheme();
  return (
    <View
      accessibilityElementsHidden
      style={{
        height: prominent ? componentTokens.formSheet.handleAreaHeight : componentTokens.bottomSheet.paddingTop + componentTokens.bottomSheet.handle.height,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      }}
    >
      <View style={{ width: prominent ? componentTokens.formSheet.handleWidth : componentTokens.bottomSheet.handle.width, height: componentTokens.bottomSheet.handle.height, borderRadius: radii.xs, backgroundColor: prominent ? colors.textSecondary : colors.border, opacity: prominent ? 0.45 : 1 }} />
    </View>
  );
}
