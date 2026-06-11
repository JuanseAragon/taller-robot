// ─────────────────────────────────────────────────────────────────────────────
// services/robotApi.js
//
// Capa de acceso a la API REST del robot Unitree Go2.
// Cada función encapsula un endpoint y devuelve los datos que necesita la UI.
//
// Todas las funciones son async y lanzan un Error si el servidor responde
// con un status HTTP >= 400, para que el llamador pueda usar try/catch.
//
// Uso típico desde un componente o screen:
//   import * as robotApi from '../services/robotApi';
//   const actions = await robotApi.fetchActions();
// ─────────────────────────────────────────────────────────────────────────────

import { BASE_URL } from '../constants/actions';

// Helper interno: POST con o sin body JSON
const post = async (path, body = null) => {
  const options = { method: 'POST' };
  if (body) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) throw new Error(`HTTP ${res.status} en ${path}`);
  return res;
};

// ── POST /connect ─────────────────────────────────────────────────────────────
// Inicia la sesión con el robot. Debe llamarse al montar la app.
export const connectRobot = async () => {
  await post('/connect', { robot_type: 'go2' });
};

// ── GET /actions ──────────────────────────────────────────────────────────────
// Devuelve el array de nombres de acciones disponibles, ej: ["hello", "dance1"]
export const fetchActions = async () => {
  const res = await fetch(`${BASE_URL}/actions`);
  if (!res.ok) throw new Error(`HTTP ${res.status} en /actions`);
  const data = await res.json();
  return data.actions ?? [];
};

// ── POST /action/{nombre} ─────────────────────────────────────────────────────
// Ejecuta una de las acciones listadas por fetchActions().
export const executeAction = async (actionName) => {
  await post(`/action/${actionName}`);
};

// ── POST /move ────────────────────────────────────────────────────────────────
// Pone al robot en movimiento continuo. Seguirá moviéndose hasta llamar stopMovement().
//   vx:   adelante (+) / atrás (-)        rango: -1.0 a 1.0
//   vy:   izquierda (+) / derecha (-)     rango: -1.0 a 1.0
//   vyaw: girar izq (+) / girar der (-)   rango: -3.14 a 3.14
export const sendMove = async (vx, vy, vyaw) => {
  await post('/move', { vx, vy, vyaw });
};

// ── POST /stop ────────────────────────────────────────────────────────────────
// Detiene el movimiento. Crítico: debe llamarse en onPressOut del D-Pad.
export const stopMovement = async () => {
  await post('/stop');
};

// ── POST /standup ─────────────────────────────────────────────────────────────
// Le indica al robot que se ponga de pie.
export const standup = async () => {
  await post('/standup');
};

// ── POST /sitdown ─────────────────────────────────────────────────────────────
// Le indica al robot que se siente.
export const sitdown = async () => {
  await post('/sitdown');
};
