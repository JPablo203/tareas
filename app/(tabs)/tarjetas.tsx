import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card } from '../../components/Card';

const ITEMS = [
  'Tarjeta 1: Tocame para cambiar color',
  'Tarjeta 2: Texto centrado en ambos ejes',
  'Tarjeta 3: Usando props y useState',
  'Tarjeta 4: React Native con TypeScript',
  'Tarjeta 5: Quinta tarjeta de prueba',
];

export default function TarjetasScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {ITEMS.map((item, index) => (
        <Card key={index} text={item} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    padding: 16,
  },
});