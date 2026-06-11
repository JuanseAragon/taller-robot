// ─────────────────────────────────────────────────────────────────────────────
// components/DPad.jsx
//
// Control de movimiento direccional del robot. Incluye:
//   - Botones ▲ ▼ ◀ ▶ para moverse en las cuatro direcciones (vx / vy)
//   - Botones ↺ ↻ para girar sobre el eje vertical (vyaw)
//
// Comportamiento clave:
//   onPressIn  → llama onMove(vx, vy, vyaw) con los valores según la dirección
//   onPressOut → llama onStop() para frenar el robot
//   La velocidad final = dirección × speed (viene del SpeedControl)
//
// Props esperadas:
//   speed   {number}   - multiplicador de velocidad entre 0.1 y 1.0
//   onMove  {function} - (vx, vy, vyaw) → llama a robotApi.sendMove()
//   onStop  {function} - () → llama a robotApi.stopMovement()
// ─────────────────────────────────────────────────────────────────────────────

import { View, Text } from 'react-native';

// TODO: implementar D-Pad con Pressable (onPressIn / onPressOut)
export default function DPad({ speed, onMove, onStop }) {
  return (
    <View>
      <Text>DPad — pendiente de implementar</Text>
    </View>
  );
}
