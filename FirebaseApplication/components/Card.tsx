import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  item: {
    id: string;
    text: string;
    isPurchased: boolean;
    createdAt: Date | null;
    };
    purchased: boolean;
    handlePurchase: (id: string, currentStatus: boolean) => void;
    handleDelete: (id: string) => void;
};

export default function Card({ item, purchased, handlePurchase, handleDelete }: Props) {
  const created = item.createdAt ? item.createdAt.toLocaleString() : '…';
  return (
    <View style={[styles.card, purchased && styles.cardPurchased]}>
        <Pressable
            onPress={() => handlePurchase(item.id, item.isPurchased)}
            style={{ flex: 1 }}
        >
            <Text style={[styles.cardTitle, purchased && styles.titlePurchased]} numberOfLines={2}>
            {item.text}
            </Text>
            <Text style={[styles.cardMeta, purchased && styles.metaPurchased]}>
            {created}
            </Text>
        </Pressable>
        <Pressable
            disabled={purchased}
            onPress={() => handleDelete(item.id)}
            style={({ pressed }) => [
            styles.deleteBtn,
            purchased && styles.deleteBtnDisabled,
            pressed && !purchased && { opacity: 0.75 },
            ]}
            hitSlop={10}
        >
            <Ionicons
            name="trash-outline"
            size={20}
            color={purchased ? '#9C9C9C' : '#FFFFFF'}
            />
        </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: 16,
    marginBottom: 14,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },

  cardPurchased: {
    backgroundColor: '#E6E6E6',
    borderColor: '#DDDDDD',
    shadowOpacity: 0.02,
    elevation: 0,
  },
  titlePurchased: {
    color: '#B0B0B0',
    fontWeight: '700',
  },
  metaPurchased: {
    color: '#BDBDBD',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    marginBottom: 6,
  },
  cardMeta: {
    fontSize: 14,
    color: '#666',
  },

  deleteBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F73232',
  },
  deleteBtnDisabled: {
    backgroundColor: '#CFCFCF',
  },
});