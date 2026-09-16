import React, { useState } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface CardProps {
  text: string;
}

export const Card = ({ text }: CardProps) => {
  const [selected, setSelected] = useState<boolean>(false);

  return (
    <Pressable
      style={[styles.card, selected ? styles.cardSelected : styles.cardDefault]}
      onPress={() => setSelected(!selected)}
    >
      <Text style={[styles.cardText, selected ? styles.textSelected : styles.textDefault]}>
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 75,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    justifyContent: 'center', // Centrado vertical
    alignItems: 'center',     // Centrado horizontal
  },
  cardDefault: {
    backgroundColor: '#ffffff',
  },
  cardSelected: {
    backgroundColor: '#0f172a',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
  },
  textDefault: {
    color: '#0f172a',
  },
  textSelected: {
    color: '#ffffff',
  },
});