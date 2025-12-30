import React, { useEffect, useState } from 'react';
import {
  FlatList, KeyboardAvoidingView, Platform, Pressable,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import {
  firestore, collection, addDoc, PRODUCTS, doc, query, orderBy,
  onSnapshot, deleteDoc, serverTimestamp, Timestamp, updateDoc,
} from './firebase/config';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type ProductDoc = {
  text?: string;
  createdAt?: Timestamp;
  isPurchased?: boolean;
};

type ProductRow = {
  id: string;
  text: string;
  isPurchased: boolean;
  createdAt: Date | null;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppInner />
    </SafeAreaProvider>
  );
}

function AppInner() {
  const [newText, setNewText] = useState('');
  const [products, setProducts] = useState<ProductRow[]>([]);

  async function handleAdd(): Promise<void> {
    const text = newText.trim();
    if (!text) return;

    try {
      const colRef = collection(firestore, PRODUCTS);
      await addDoc(colRef, {
        text,
        isPurchased: false,
        createdAt: serverTimestamp(),
      });
      setNewText('');
    } catch (err) {
      console.error('Failed to save product', err);
    }
  }

  async function handleDelete(docId: string): Promise<void> {
    try {
      await deleteDoc(doc(firestore, PRODUCTS, docId));
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  }

  async function handlePurchase(docId: string, isPurchased: boolean): Promise<void> {
    try {
      const docRef = doc(firestore, PRODUCTS, docId);
      await updateDoc(docRef, { isPurchased: !isPurchased });
    } catch (err) {
      console.error('Failed to update product', err);
    }
  }

  useEffect(() => {
    const colRef = collection(firestore, PRODUCTS);
    const q = query(colRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const rows: ProductRow[] = snap.docs.map((d) => {
          const data = d.data() as ProductDoc;
          return {
            id: d.id,
            text: data.text ?? '',
            isPurchased: data.isPurchased ?? false,
            createdAt: data.createdAt?.toDate?.() ?? null,
          };
        });
        setProducts(rows);
      },
      (err) => console.error('onSnapshot error', err)
    );

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }: { item: ProductRow }) => {
    const created = item.createdAt ? item.createdAt.toLocaleString() : '…';
    const purchased = item.isPurchased;

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
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shopping list</Text>
        </View>

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />

        <StatusBar style="auto" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 8,
  },

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

  listContent: { paddingBottom: 30 },

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
