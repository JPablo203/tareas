import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function PerfilScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ nuevoNombre?: string }>();
  const [nombre, setNombre] = useState<string>('Nombre y Apellido');

  useEffect(() => {
    if (params.nuevoNombre) {
      setNombre(params.nuevoNombre);
    }
  }, [params.nuevoNombre]);

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Usuario registrado:</Text>
      <Text style={styles.profileName}>{nombre}</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push({ pathname: '/modal', params: { actual: nombre } })}
      >
        <Text style={styles.buttonText}>Cambiar nombre</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  profileName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0f172a',
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});