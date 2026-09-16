import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function ContadorScreen() {
  const [count, setCount] = useState<number>(0);

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Valor del contador:</Text>
      <Text style={styles.counterValue}>{count}</Text>
      <Pressable style={styles.button} onPress={() => setCount(count + 1)}>
        <Text style={styles.buttonText}>Incrementar</Text>
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
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  counterValue: {
    fontSize: 56,
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