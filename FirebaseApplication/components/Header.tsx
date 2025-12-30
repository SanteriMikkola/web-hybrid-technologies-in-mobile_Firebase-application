import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Shopping list</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  sectionHeader: {
    alignSelf: 'stretch',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111',
  },
});