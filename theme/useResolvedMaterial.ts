import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import { resolveMaterial, type Material } from './materials';
import { useAppearanceStore } from '../stores/useAppearanceStore';

export function useResolvedMaterial(requested: Material): Material {
  const [reduceTransparencyEnabled, setReduceTransparencyEnabled] = useState(false);
  const glassEnabled = useAppearanceStore((state) => state.glassEnabled);
  const glassSupported = Platform.OS === 'ios' || Platform.OS === 'android';

  useEffect(() => {
    void AccessibilityInfo.isReduceTransparencyEnabled().then(setReduceTransparencyEnabled);
    const subscription = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduceTransparencyEnabled);
    return () => subscription.remove();
  }, []);

  return resolveMaterial(glassEnabled ? 'glass' : requested, reduceTransparencyEnabled, glassSupported);
}
