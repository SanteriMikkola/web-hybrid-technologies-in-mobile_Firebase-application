import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';

type Props = {
  newText: string;
  setNewText: (text: string) => void;
  handleAdd: () => void;
};

export default function Search({ newText, setNewText, handleAdd }: Props) {
  return (
    <View style={styles.topRow}>
        <View style={styles.searchBox}>
        <TextInput
            placeholder="Type product…"
            value={newText}
            onChangeText={setNewText}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={handleAdd}
            placeholderTextColor="#9A9A9A"
        />
        </View>

        <Pressable
        onPress={handleAdd}
        style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.85 }]}
        >
        <Text style={styles.addText}>Add</Text>
        </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  searchBox: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    color: '#111',
    paddingVertical: 0,
  },
  addBtn: {
    height: 52,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#21F06A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  addText: { fontSize: 18, fontWeight: '800', color: '#111' },
});