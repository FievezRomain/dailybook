import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';

interface SvgComponentProps {
  color: string;
  pattern: string;
  viewBox: string;
  component?: React.ReactNode;
}

const SvgComponent: React.FC<SvgComponentProps> = ({ color, pattern, viewBox, component }) => {
  return (
    <View style={{ position: 'relative', width: 50, height: 50 }}>
      <Svg
        height="100%"
        width="100%"
        viewBox={viewBox}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Path fill={color} d={pattern} />
      </Svg>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
        {component}
      </View>
    </View>
  );
};

export default SvgComponent;
