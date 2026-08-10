import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import { resolveMaterial, type Material } from './materials';

export function useResolvedMaterial(requested: Material): Material {
  const [reduceTransparencyEnabled, setReduceTransparencyEnabled] = useState(false);
  const glassSupported = Platform.OS === 'ios' || Platform.OS === 'android';

  useEffect(() => {
    void AccessibilityInfo.isReduceTransparencyEnabled().then(setReduceTransparencyEnabled);
    const subscription = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduceTransparencyEnabled);
    return () => subscription.remove();
  }, []);

  return resolveMaterial(requested, reduceTransparencyEnabled, glassSupported);
}
