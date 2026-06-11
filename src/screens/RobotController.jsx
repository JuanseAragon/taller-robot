// ─────────────────────────────────────────────────────────────────────────────
// screens/RobotController.jsx
//
// Pantalla principal (y única) de la app. Orquesta toda la lógica:
//   - Estado global: conexión, lista de acciones, velocidad, status del último cmd
//   - Llama a robotApi en cada interacción del usuario
//   - Pasa los datos y callbacks a cada componente hijo
//
// Cuando los componentes de /components estén implementados, reemplazar los
// bloques "inline" de cada sección por el componente correspondiente:
//   <ConnectionHeader ... />  →  reemplaza el bloque header
//   <DPad ... />              →  reemplaza el bloque D-Pad
//   <SpeedControl ... />      →  reemplaza el bloque velocidad
//   <ActionGrid ... />        →  reemplaza el bloque acciones
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  Pressable, ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import * as robotApi from '../services/robotApi';
import { ACTION_LABELS } from '../constants/actions';
import ActionGrid from '../components/ActionGrid';
import ConnectionHeader from '../components/ConnectionHeader';
import DPad from '../components/DPad';
import SpeedControl from '../components/SpeedControl';

// Colores del indicador de estado según el tipo de resultado
const STATUS_COLORS = {
  idle:    '#666',
  loading: '#FFA500',
  success: '#4CAF50',
  error:   '#F44336',
};

export default function RobotController() {
  const [connected,  setConnected]  = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [actions,    setActions]    = useState([]);
  const [status,     setStatus]     = useState({ type: 'idle', message: 'Iniciando...' });
  const [speed,      setSpeed]      = useState(0.5);

  // Conecta al robot en cuanto se monta la pantalla
  useEffect(() => { connectRobot(); }, []);

  const setStatusMsg = (type, message) => setStatus({ type, message });

  // ── Handlers (se pasan como props a los componentes) ──────────────────────

  const connectRobot = async () => {
    setConnecting(true);
    setStatusMsg('loading', 'Conectando al robot...');
    try {
      await robotApi.connectRobot();
      setConnected(true);
      setStatusMsg('success', 'Robot conectado');
      await loadActions();
    } catch (err) {
      setConnected(false);
      setStatusMsg('error', `Conexión fallida: ${err.message}`);
    } finally {
      setConnecting(false);
    }
  };

  const loadActions = async () => {
    try {
      const list = await robotApi.fetchActions();
      setActions(list);
      setStatusMsg('success', `${list.length} acciones disponibles`);
    } catch (err) {
      setStatusMsg('error', `Error al cargar acciones: ${err.message}`);
    }
  };

  // Llamado desde DPad en onPressIn — multiplica por speed antes de enviar
  const handleMove = async (vx, vy, vyaw) => {
    try {
      await robotApi.sendMove(vx * speed, vy * speed, vyaw);
    } catch (err) {
      setStatusMsg('error', `Error de movimiento: ${err.message}`);
    }
  };

  // Llamado desde DPad en onPressOut — siempre debe ejecutarse
  const handleStop = async () => {
    try {
      await robotApi.stopMovement();
    } catch (err) {
      setStatusMsg('error', `Error al detener: ${err.message}`);
    }
  };

  const handleAction = async (actionName) => {
    const label = ACTION_LABELS[actionName] || actionName;
    setStatusMsg('loading', `Ejecutando: ${label}...`);
    try {
      await robotApi.executeAction(actionName);
      setStatusMsg('success', `✓ ${label}`);
    } catch (err) {
      setStatusMsg('error', `Error: ${err.message}`);
    }
  };

  const handleStandup = async () => {
    setStatusMsg('loading', 'Parándose...');
    try {
      await robotApi.standup();
      setStatusMsg('success', '✓ Parado');
    } catch (err) {
      setStatusMsg('error', `Error: ${err.message}`);
    }
  };

  const handleSitdown = async () => {
    setStatusMsg('loading', 'Sentándose...');
    try {
      await robotApi.sitdown();
      setStatusMsg('success', '✓ Sentado');
    } catch (err) {
      setStatusMsg('error', `Error: ${err.message}`);
    }
  };

  // Los componentes externos ConnectionHeader, DPad y SpeedControl encapsulan sus propios botones y lógica auxiliar.

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── Header — reemplazar por <ConnectionHeader /> ── */}
      <ConnectionHeader connected={connected} connecting={connecting} onReconnect={connectRobot} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── D-Pad — reemplazar por <DPad speed={speed} onMove={handleMove} onStop={handleStop} /> ── */}
        <DPad speed={speed} onMove={handleMove} onStop={handleStop} />

        {/* ── Velocidad — reemplazar por <SpeedControl speed={speed} onChange={setSpeed} /> ── */}
        <SpeedControl speed={speed} onChange={setSpeed} />

        {/* ── Postura ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>POSTURA</Text>
          <View style={styles.postureRow}>
            <Pressable style={[styles.postureBtn, styles.standBtn]} onPress={handleStandup}>
              <Text style={styles.postureTxt}>🦿 Pararse</Text>
            </Pressable>
            <Pressable style={[styles.postureBtn, styles.sitBtn]} onPress={handleSitdown}>
              <Text style={styles.postureTxt}>🐾 Sentarse</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Acciones — reemplazar por <ActionGrid actions={actions} onAction={handleAction} loading={actions.length === 0} /> ── */}
        <ActionGrid actions={actions} onAction={handleAction} loading={actions.length === 0} />

        {/* ── Indicador de estado ── */}
        <View style={[styles.statusBar, { borderColor: STATUS_COLORS[status.type] }]}>
          {status.type === 'loading' && (
            <ActivityIndicator color={STATUS_COLORS.loading} size="small" style={{ marginRight: 8 }} />
          )}
          <Text style={[styles.statusTxt, { color: STATUS_COLORS[status.type] }]}>
            {status.message}
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d0d1a' },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 32 },

  card: {
    backgroundColor: '#13132b', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#1e1e3a',
  },
  cardTitle: { color: '#555', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 14 },

  postureRow: { flexDirection: 'row', gap: 12 },
  postureBtn: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1 },
  standBtn: { backgroundColor: '#0f2d0f', borderColor: '#4CAF50' },
  sitBtn: { backgroundColor: '#2d0f0f', borderColor: '#F44336' },
  postureTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },

  statusBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#13132b', borderRadius: 12, padding: 14, borderWidth: 1,
  },
  statusTxt: { fontSize: 14, fontWeight: '500', flex: 1 },
});
