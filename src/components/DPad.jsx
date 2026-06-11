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

import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function DPad({ speed, onMove, onStop }) {
  const DPadBtn = ({ label, vx = 0, vy = 0, vyaw = 0 }) => (
    <Pressable
      style={({ pressed }) => [styles.dpadBtn, pressed && styles.dpadBtnPressed]}
      onPressIn={() => onMove(vx, vy, vyaw)}
      onPressOut={onStop}
    >
      <Text style={styles.dpadBtnText}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>MOVIMIENTO</Text>
      <View style={styles.dpad}>
        <View style={styles.dpadRow}>
          <DPadBtn label="↺" vyaw={1.5} />
          <DPadBtn label="▲" vx={1} />
          <DPadBtn label="↻" vyaw={-1.5} />
        </View>
        <View style={styles.dpadRow}>
          <DPadBtn label="◀" vy={1} />
          <View style={styles.dpadCenter}><Text style={styles.dpadCenterDot}>●</Text></View>
          <DPadBtn label="▶" vy={-1} />
        </View>
        <View style={styles.dpadRow}>
          <View style={styles.dpadEmpty} />
          <DPadBtn label="▼" vx={-1} />
          <View style={styles.dpadEmpty} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#13132b', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#1e1e3a',
  },
  cardTitle: { color: '#555', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 14 },
  dpad: { alignItems: 'center', gap: 6 },
  dpadRow: { flexDirection: 'row', gap: 6 },
  dpadBtn: {
    width: 68, height: 68, backgroundColor: '#1e1e3a', borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#2e2e5a',
  },
  dpadBtnPressed: { backgroundColor: '#2e2e7a', borderColor: '#5050cc' },
  dpadBtnText: { color: '#fff', fontSize: 26 },
  dpadCenter: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#0d0d1a', alignItems: 'center', justifyContent: 'center',
  },
  dpadCenterDot: { color: '#222', fontSize: 22 },
  dpadEmpty: { width: 68, height: 68 },
});
