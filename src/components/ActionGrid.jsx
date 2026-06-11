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

import { View, Text } from 'react-native';

// TODO: implementar grilla de acciones con Pressable
export default function ActionGrid({ actions, onAction, loading }) {
  return (
    <View>
      <Text>ActionGrid — pendiente de implementar</Text>
    </View>
  );
}
