// ─────────────────────────────────────────────────────────────────────────────
// components/ConnectionHeader.jsx
//
// Header superior de la app. Muestra el nombre del robot, un indicador visual
// de si está conectado (punto verde/rojo) y, cuando está desconectado,
// un botón para intentar reconectar manualmente.
//
// Props esperadas:
//   connected   {boolean}  - true si la conexión con el robot está activa
//   connecting  {boolean}  - true mientras se está intentando conectar
//   onReconnect {function} - callback que dispara connectRobot() desde el screen
// ─────────────────────────────────────────────────────────────────────────────

import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function ConnectionHeader({ connected, connecting, onReconnect }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>🤖 Unitree Go2</Text>
      <View style={styles.connRow}>
        <View style={[styles.dot, { backgroundColor: connected ? '#4CAF50' : '#F44336' }]} />
        <Text style={styles.connText}>{connected ? 'Conectado' : 'Desconectado'}</Text>
        {!connected && (
          <Pressable style={styles.reconnBtn} onPress={onReconnect} disabled={connecting}>
            <Text style={styles.reconnText}>{connecting ? 'Conectando...' : 'Reconectar'}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 52, paddingBottom: 14, paddingHorizontal: 20,
    backgroundColor: '#13132b',
    borderBottomWidth: 1, borderBottomColor: '#1e1e3a',
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  connRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  connText: { color: '#aaa', fontSize: 14 },
  reconnBtn: {
    backgroundColor: '#1e1e3a', paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 12, borderWidth: 1, borderColor: '#FFA500',
  },
  reconnText: { color: '#FFA500', fontSize: 13 },
});
