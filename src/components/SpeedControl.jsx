// ─────────────────────────────────────────────────────────────────────────────
// components/SpeedControl.jsx
//
// Control de velocidad para el D-Pad. Permite al usuario elegir qué tan rápido
// se mueve el robot antes de presionar una dirección.
//
// Puede implementarse como:
//   - Presets (30% / 50% / 70% / 100%) + botones − y +
//   - Slider (requiere @react-native-community/slider)
//
// El valor `speed` se pasa al DPad como multiplicador: vx_final = vx * speed
//
// Props esperadas:
//   speed    {number}   - valor actual entre 0.1 y 1.0
//   onChange {function} - (nuevoValor) → actualiza el estado en RobotController
// ─────────────────────────────────────────────────────────────────────────────

import { View, Text } from 'react-native';

// TODO: implementar control de velocidad
export default function SpeedControl({ speed, onChange }) {
  return (
    <View>
      <Text>SpeedControl — pendiente de implementar</Text>
    </View>
  );
}
