// ─────────────────────────────────────────────────────────────────────────────
// constants/actions.js
//
// Centraliza toda la configuración estática de la app:
//   - URL base de la API del robot
//   - Mapeo de nombres de acción (tal como los devuelve el backend)
//     a etiquetas amigables con emoji para mostrar en los botones
//
// Si cambia la IP del robot, solo hay que tocar BASE_URL acá.
// Si el backend agrega una acción nueva, agregar una entrada en ACTION_LABELS.
// ─────────────────────────────────────────────────────────────────────────────

export const BASE_URL = 'http://192.168.137.39:8000';

// Nombre del backend → texto que se muestra en el botón de la UI
export const ACTION_LABELS = {
  hello:          '👋 Hello',
  heart:          '❤️  Heart',
  stretch:        '🤸 Stretch',
  dance1:         '💃 Dance 1',
  dance2:         '🕺 Dance 2',
  left_flip:      '🔄 Left Flip',
  back_flip:      '⬆️  Back Flip',
  front_flip:     '⬇️  Front Flip',
  balance_stand:  '⚖️  Balance',
  recovery_stand: '🦾 Recovery',
  free_walk:      '🚶 Free Walk',
};
