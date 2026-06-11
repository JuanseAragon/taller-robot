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

  const adjustSpeed = (delta) =>
    setSpeed((s) => Math.min(1.0, Math.max(0.1, parseFloat((s + delta).toFixed(1)))));

  // ── UI inline (reemplazar por componentes cuando estén listos) ─────────────

  // Botón reutilizable del D-Pad
  const DPadBtn = ({ label, vx = 0, vy = 0, vyaw = 0 }) => (
    <Pressable
      style={({ pressed }) => [styles.dpadBtn, pressed && styles.dpadBtnPressed]}
      onPressIn={() => handleMove(vx, vy, vyaw)}
      onPressOut={handleStop}
    >
      <Text style={styles.dpadBtnText}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── Header — reemplazar por <ConnectionHeader /> ── */}
      <View style={styles.header}>
        <Text style={styles.title}>🤖 Unitree Go2</Text>
        <View style={styles.connRow}>
          <View style={[styles.dot, { backgroundColor: connected ? '#4CAF50' : '#F44336' }]} />
          <Text style={styles.connText}>{connected ? 'Conectado' : 'Desconectado'}</Text>
          {!connected && (
            <Pressable style={styles.reconnBtn} onPress={connectRobot} disabled={connecting}>
              <Text style={styles.reconnText}>{connecting ? 'Conectando...' : 'Reconectar'}</Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── D-Pad — reemplazar por <DPad speed={speed} onMove={handleMove} onStop={handleStop} /> ── */}
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

        {/* ── Velocidad — reemplazar por <SpeedControl speed={speed} onChange={setSpeed} /> ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>VELOCIDAD — {Math.round(speed * 100)}%</Text>
          <View style={styles.speedRow}>
            <Pressable style={styles.speedStepBtn} onPress={() => adjustSpeed(-0.1)}>
              <Text style={styles.speedStepText}>−</Text>
            </Pressable>
            {[0.3, 0.5, 0.7, 1.0].map((v) => (
              <Pressable
                key={v}
                style={[styles.speedPreset, speed === v && styles.speedPresetOn]}
                onPress={() => setSpeed(v)}
              >
                <Text style={[styles.speedPresetTxt, speed === v && styles.speedPresetTxtOn]}>
                  {Math.round(v * 100)}%
                </Text>
              </Pressable>
            ))}
            <Pressable style={styles.speedStepBtn} onPress={() => adjustSpeed(0.1)}>
              <Text style={styles.speedStepText}>+</Text>
            </Pressable>
          </View>
        </View>

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

  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 32 },

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

  speedRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  speedStepBtn: {
    width: 44, height: 44, backgroundColor: '#1e1e3a', borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#2e2e5a',
  },
  speedStepText: { color: '#fff', fontSize: 22, fontWeight: '600', lineHeight: 26 },
  speedPreset: {
    flex: 1, height: 44, backgroundColor: '#1e1e3a', borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#2e2e5a',
  },
  speedPresetOn: { backgroundColor: '#FFA500', borderColor: '#FFA500' },
  speedPresetTxt: { color: '#888', fontSize: 13, fontWeight: '700' },
  speedPresetTxtOn: { color: '#000' },

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
