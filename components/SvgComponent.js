import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';

export default function SvgComponent({ color, pattern, viewBox, component }) {
  return (
    <View style={{ position: 'relative', width: 50, height: 50 }}>
      {/* Conteneur SVG */}
      <Svg
        height="100%"
        width="100%"
        viewBox={viewBox}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <Path fill={color} d={pattern} />
      </Svg>

      {/* Contenu superposé */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1, // Assure que le composant est au-dessus
        }}
      >
        {component}
      </View>
    </View>
  );
}
