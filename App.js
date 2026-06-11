import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';

const BASE_URL = 'http://192.168.137.39:8000';

const ACTION_LABELS = {
  hello: '👋 Hello',
  heart: '❤️ Heart',
  stretch: '🤸 Stretch',
  dance1: '💃 Dance 1',
  dance2: '🕺 Dance 2',
  left_flip: '🔄 Left Flip',
  back_flip: '⬆️ Back Flip',
  front_flip: '⬇️ Front Flip',
  balance_stand: '⚖️ Balance',
  recovery_stand: '🦾 Recovery',
  free_walk: '🚶 Free Walk',
};

const STATUS_COLORS = {
  idle: '#666',
  loading: '#FFA500',
  success: '#4CAF50',
  error: '#F44336',
};

export default function App() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [actions, setActions] = useState([]);
  const [status, setStatus] = useState({ type: 'idle', message: 'Iniciando...' });
  const [speed, setSpeed] = useState(0.5);

  useEffect(() => {
    connectRobot();
  }, []);

  const setStatusMsg = (type, message) => setStatus({ type, message });

  const connectRobot = async () => {
    setConnecting(true);
    setStatusMsg('loading', 'Conectando al robot...');
    try {
      const res = await fetch(`${BASE_URL}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ robot_type: 'go2' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setConnected(true);
      setStatusMsg('success', 'Robot conectado');
      await fetchActions();
    } catch (err) {
      setConnected(false);
      setStatusMsg('error', `Conexión fallida: ${err.message}`);
    } finally {
      setConnecting(false);
    }
  };

  const fetchActions = async () => {
    try {
      const res = await fetch(`${BASE_URL}/actions`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setActions(data.actions || []);
      setStatusMsg('success', `${data.actions?.length || 0} acciones disponibles`);
    } catch (err) {
      setStatusMsg('error', `Error al cargar acciones: ${err.message}`);
    }
  };

  const sendMove = async (vx, vy, vyaw) => {
    try {
      await fetch(`${BASE_URL}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vx, vy, vyaw }),
      });
    } catch (err) {
      setStatusMsg('error', `Error de movimiento: ${err.message}`);
    }
  };

  const handleStop = async () => {
    try {
      await fetch(`${BASE_URL}/stop`, { method: 'POST' });
    } catch (err) {
      setStatusMsg('error', `Error al detener: ${err.message}`);
    }
  };

  const executeAction = async (actionName) => {
    const label = ACTION_LABELS[actionName] || actionName;
    setStatusMsg('loading', `Ejecutando: ${label}...`);
    try {
      const res = await fetch(`${BASE_URL}/action/${actionName}`, { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatusMsg('success', `✓ ${label}`);
    } catch (err) {
      setStatusMsg('error', `Error: ${err.message}`);
    }
  };

  const standup = async () => {
    setStatusMsg('loading', 'Parándose...');
    try {
      const res = await fetch(`${BASE_URL}/standup`, { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatusMsg('success', '✓ Parado');
    } catch (err) {
      setStatusMsg('error', `Error: ${err.message}`);
    }
  };

  const sitdown = async () => {
    setStatusMsg('loading', 'Sentándose...');
    try {
      const res = await fetch(`${BASE_URL}/sitdown`, { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatusMsg('success', '✓ Sentado');
    } catch (err) {
      setStatusMsg('error', `Error: ${err.message}`);
    }
  };

  const adjustSpeed = (delta) =>
    setSpeed((s) => Math.min(1.0, Math.max(0.1, parseFloat((s + delta).toFixed(1)))));

  // ─── D-Pad Button ──────────────────────────────────────────────────────────
  const DPadBtn = ({ label, vx = 0, vy = 0, vyaw = 0, style }) => (
    <Pressable
      style={({ pressed }) => [styles.dpadBtn, style, pressed && styles.dpadBtnPressed]}
      onPressIn={() => sendMove(vx * speed, vy * speed, vyaw)}
      onPressOut={handleStop}
    >
      <Text style={styles.dpadBtnText}>{label}</Text>
    </Pressable>
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>🤖 Unitree Go2</Text>
        <View style={styles.connRow}>
          <View style={[styles.dot, { backgroundColor: connected ? '#4CAF50' : '#F44336' }]} />
          <Text style={styles.connText}>{connected ? 'Conectado' : 'Desconectado'}</Text>
          {!connected && (
            <Pressable style={styles.reconnBtn} onPress={connectRobot} disabled={connecting}>
              <Text style={styles.reconnText}>
                {connecting ? 'Conectando...' : 'Reconectar'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── D-Pad ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>MOVIMIENTO</Text>
          <View style={styles.dpad}>
            {/* Row 1: rotate-left | forward | rotate-right */}
            <View style={styles.dpadRow}>
              <DPadBtn label="↺" vyaw={1.5} />
              <DPadBtn label="▲" vx={1} />
              <DPadBtn label="↻" vyaw={-1.5} />
            </View>
            {/* Row 2: left | center | right */}
            <View style={styles.dpadRow}>
              <DPadBtn label="◀" vy={1} />
              <View style={styles.dpadCenter}><Text style={styles.dpadCenterDot}>●</Text></View>
              <DPadBtn label="▶" vy={-1} />
            </View>
            {/* Row 3: — | backward | — */}
            <View style={styles.dpadRow}>
              <View style={styles.dpadEmpty} />
              <DPadBtn label="▼" vx={-1} />
              <View style={styles.dpadEmpty} />
            </View>
          </View>
        </View>

        {/* ── Speed ── */}
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

        {/* ── Posture ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>POSTURA</Text>
          <View style={styles.postureRow}>
            <Pressable style={[styles.postureBtn, styles.standBtn]} onPress={standup}>
              <Text style={styles.postureTxt}>🦿 Pararse</Text>
            </Pressable>
            <Pressable style={[styles.postureBtn, styles.sitBtn]} onPress={sitdown}>
              <Text style={styles.postureTxt}>🐾 Sentarse</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Actions ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ACCIONES</Text>
          {actions.length === 0 ? (
            <ActivityIndicator color="#FFA500" style={{ marginTop: 8 }} />
          ) : (
            <View style={styles.actionsGrid}>
              {actions.map((action) => (
                <Pressable
                  key={action}
                  style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
                  onPress={() => executeAction(action)}
                >
                  <Text style={styles.actionTxt}>
                    {ACTION_LABELS[action] || action}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* ── Status ── */}
        <View style={[styles.statusBar, { borderColor: STATUS_COLORS[status.type] }]}>
          {status.type === 'loading' && (
            <ActivityIndicator
              color={STATUS_COLORS.loading}
              size="small"
              style={{ marginRight: 8 }}
            />
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
  root: {
    flex: 1,
    backgroundColor: '#0d0d1a',
  },

  // ── Header ──
  header: {
    paddingTop: 52,
    paddingBottom: 14,
    paddingHorizontal: 20,
    backgroundColor: '#13132b',
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e3a',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  connRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  connText: {
    color: '#aaa',
    fontSize: 14,
  },
  reconnBtn: {
    backgroundColor: '#1e1e3a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  reconnText: {
    color: '#FFA500',
    fontSize: 13,
  },

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },

  // ── Card ──
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

  // ── D-Pad ──
  dpad: {
    alignItems: 'center',
    gap: 6,
  },
  dpadRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dpadBtn: {
    width: 68,
    height: 68,
    backgroundColor: '#1e1e3a',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2e2e5a',
  },
  dpadBtnPressed: {
    backgroundColor: '#2e2e7a',
    borderColor: '#5050cc',
  },
  dpadBtnText: {
    color: '#ffffff',
    fontSize: 26,
  },
  dpadCenter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#0d0d1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpadCenterDot: {
    color: '#222',
    fontSize: 22,
  },
  dpadEmpty: {
    width: 68,
    height: 68,
  },

  // ── Speed ──
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

  // ── Posture ──
  postureRow: {
    flexDirection: 'row',
    gap: 12,
  },
  postureBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  standBtn: {
    backgroundColor: '#0f2d0f',
    borderColor: '#4CAF50',
  },
  sitBtn: {
    backgroundColor: '#2d0f0f',
    borderColor: '#F44336',
  },
  postureTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // ── Actions ──
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

  // ── Status ──
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13132b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  statusTxt: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});
