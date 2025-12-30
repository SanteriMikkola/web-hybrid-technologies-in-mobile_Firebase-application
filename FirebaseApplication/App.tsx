import React, { useEffect, useState } from 'react';
import {
  FlatList, KeyboardAvoidingView, Platform,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from './components/Header';
import Search from './components/Search';
import Card from './components/Card';
import { useProducts } from './hooks/useProducts';
import { ProductRow } from './types/productTypes';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppInner />
    </SafeAreaProvider>
  );
}

function AppInner() {
  const { newText, setNewText, products, handleAdd, handleDelete, handlePurchase } = useProducts();

  const renderItem = ({ item }: { item: ProductRow }) => {
    const purchased = item.isPurchased;

    return (
      Card({
        item,
        purchased,
        handlePurchase,
        handleDelete,
      })
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Search newText={newText} setNewText={setNewText} handleAdd={handleAdd}></Search>

        <Header></Header>

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
  listContent: { paddingBottom: 30 },
});
