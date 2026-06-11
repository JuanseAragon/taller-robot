// ─────────────────────────────────────────────────────────────────────────────
// components/ActionGrid.jsx
//
// Grilla de botones con las acciones disponibles del robot.
// La lista de acciones se obtiene dinámicamente desde GET /actions y se pasa
// como prop desde RobotController.
//
// Cada botón muestra la etiqueta amigable (ACTION_LABELS[nombre] o el nombre
// directo si no tiene mapeo) y al presionarlo llama onAction(nombre).
//
// Props esperadas:
//   actions  {string[]} - array de nombres de acción del backend, ej: ["hello","dance1"]
//   onAction {function} - (actionName) → llama a robotApi.executeAction()
//   loading  {boolean}  - muestra un spinner mientras se cargan las acciones
// ─────────────────────────────────────────────────────────────────────────────

import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { ACTION_LABELS } from '../constants/actions';

export default function ActionGrid({ actions, onAction, loading }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>ACCIONES</Text>
      {loading ? (
        <ActivityIndicator color="#FFA500" style={{ marginTop: 8 }} />
      ) : (
        <View style={styles.actionsGrid}>
          {actions.map((action) => (
            <Pressable
              key={action}
              style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
              onPress={() => onAction(action)}
            >
              <Text style={styles.actionTxt}>{ACTION_LABELS[action] || action}</Text>
            </Pressable>
          ))}
        </View>
      )}
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionBtn: {
    backgroundColor: '#1a1a3e',
    borderWidth: 1,
    borderColor: '#2e2e5a',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  actionBtnPressed: {
    backgroundColor: '#2e2e7a',
    borderColor: '#5050cc',
  },
  actionTxt: {
    color: '#ccc',
    fontSize: 14,
  },
});
