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

import { View, Text } from 'react-native';

// TODO: implementar UI del header
export default function ConnectionHeader({ connected, connecting, onReconnect }) {
  return (
    <View>
      <Text>ConnectionHeader — pendiente de implementar</Text>
    </View>
  );
}
