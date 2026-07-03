import React, { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import { useAppTheme } from '../../../theme/useAppTheme';

interface AppSheetProps extends Omit<BottomSheetModalProps, 'children'> {
  children: React.ReactNode;
  /** Use bottom-sheet scroll view instead of fixed view (for long content). Default: true */
  scrollable?: boolean;
  /** Provide fixed snap points or default to dynamic height. Default: ['50%', '90%'] */
  snapPoints?: (string | number)[];
}

/**
 * AppSheet — styled @gorhom/bottom-sheet v5 modal wrapper.
 *
 * Usage:
 *   const ref = useRef<BottomSheetModal>(null);
 *   <AppSheet ref={ref}><Content /></AppSheet>
 *   ref.current?.present();
 */
const AppSheet = forwardRef<BottomSheetModal, AppSheetProps>(
  ({ children, scrollable = true, snapPoints = ['50%', '90%'], ...rest }, ref) => {
    const { colors, tokens } = useAppTheme();
    const stableSnapPoints = useMemo(() => snapPoints, [snapPoints.join('|')]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.4}
        />
      ),
      [],
    );

    const backgroundStyle = {
      backgroundColor: colors.surface,
      borderTopLeftRadius: tokens.radii.xl,
      borderTopRightRadius: tokens.radii.xl,
    };

    const handleIndicatorStyle = {
      backgroundColor: colors.border,
      width: 36,
      height: 4,
      borderRadius: tokens.radii.full,
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={stableSnapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={backgroundStyle}
        handleIndicatorStyle={handleIndicatorStyle}
        enablePanDownToClose
        enableContentPanningGesture={false}
        {...rest}
      >
        {scrollable ? (
          <BottomSheetScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </BottomSheetScrollView>
        ) : (
          <BottomSheetView style={styles.viewContent}>
            {children}
          </BottomSheetView>
        )}
      </BottomSheetModal>
    );
  },
);

AppSheet.displayName = 'AppSheet';
export default AppSheet;

const styles = StyleSheet.create({
  viewContent: { flex: 1, paddingHorizontal: 16, paddingBottom: 32 },
  scrollContent: { flex: 1 },
  scrollContainer: { paddingHorizontal: 16, paddingBottom: 32 },
});
