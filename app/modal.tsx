import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ModalScreen() {
  const router = useRouter();
  const { actual } = useLocalSearchParams<{ actual?: string }>();
  const [inputVal, setInputVal] = useState<string>(actual ?? '');

  const guardar = () => {
    router.replace({
      pathname: '/(tabs)/perfil',
      params: { nuevoNombre: inputVal },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Editar Nombre:</Text>
      <TextInput
        style={styles.input}
        value={inputVal}
        onChangeText={setInputVal}
        placeholder="Ingresá tu nombre"
        autoFocus
      />
      <Pressable style={styles.saveBtn} onPress={guardar}>
        <Text style={styles.saveBtnText}>Guardar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  label: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  saveBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});