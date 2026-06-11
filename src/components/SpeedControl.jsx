// ─────────────────────────────────────────────────────────────────────────────
// components/SpeedControl.jsx
//
// Control de velocidad para el D-Pad. Permite al usuario elegir qué tan rápido
// se mueve el robot antes de presionar una dirección.
//
// El valor `speed` se pasa al DPad como multiplicador: vx_final = vx * speed
//
// Props esperadas:
//   speed    {number}   - valor actual entre 0.1 y 1.0
//   onChange {function} - (nuevoValor) → actualiza el estado en RobotController
//
// Uso en RobotController:
//   <SpeedControl speed={speed} onChange={setSpeed} />
// ─────────────────────────────────────────────────────────────────────────────

import { View, Text, Pressable, StyleSheet } from 'react-native';

// Presets de velocidad que se muestran como botones (30 %, 50 %, 70 %, 100 %)
const PRESETS = [0.3, 0.5, 0.7, 1.0];

// Mantiene el valor dentro del rango válido [0.1, 1.0] y redondea a 1 decimal,
// para evitar errores de coma flotante (ej: 0.30000000000004).
const clamp = (value) =>
  Math.min(1.0, Math.max(0.1, parseFloat(value.toFixed(1))));

export default function SpeedControl({ speed, onChange }) {
  // Suma/resta delta al valor actual y lo notifica al padre vía onChange.
  const step = (delta) => onChange(clamp(speed + delta));

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>VELOCIDAD — {Math.round(speed * 100)}%</Text>

      <View style={styles.speedRow}>
        {/* Botón − : baja la velocidad 10 % */}
        <Pressable style={styles.speedStepBtn} onPress={() => step(-0.1)}>
          <Text style={styles.speedStepText}>−</Text>
        </Pressable>

        {/* Presets: cada uno fija la velocidad a un valor fijo */}
        {PRESETS.map((v) => {
          const active = speed === v;
          return (
            <Pressable
              key={v}
              style={[styles.speedPreset, active && styles.speedPresetOn]}
              onPress={() => onChange(v)}
            >
              <Text style={[styles.speedPresetTxt, active && styles.speedPresetTxtOn]}>
                {Math.round(v * 100)}%
              </Text>
            </Pressable>
          );
        })}

        {/* Botón + : sube la velocidad 10 % */}
        <Pressable style={styles.speedStepBtn} onPress={() => step(0.1)}>
          <Text style={styles.speedStepText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#13132b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e1e3a',
  },
  cardTitle: {
    color: '#555',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  speedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  speedStepBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#1e1e3a',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2e2e5a',
  },
  speedStepText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 26,
  },
  speedPreset: {
    flex: 1,
    height: 44,
    backgroundColor: '#1e1e3a',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2e2e5a',
  },
  speedPresetOn: {
    backgroundColor: '#FFA500',
    borderColor: '#FFA500',
  },
  speedPresetTxt: {
    color: '#888',
    fontSize: 13,
    fontWeight: '700',
  },
  speedPresetTxtOn: {
    color: '#000',
  },
});
