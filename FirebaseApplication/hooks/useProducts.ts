import React, { useEffect, useState } from 'react';
import {
  firestore, collection, addDoc, PRODUCTS, doc, query, orderBy,
  onSnapshot, deleteDoc, serverTimestamp, Timestamp, updateDoc,
} from '../firebase/config';
import { ProductRow, ProductDoc } from '../types/productTypes';


export function useProducts() {
  const [newText, setNewText] = useState("");
  const [products, setProducts] = useState<ProductRow[]>([]);

  useEffect(() => {
    const colRef = collection(firestore, PRODUCTS);
    const q = query(colRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const rows: ProductRow[] = snap.docs.map((d) => {
          const data = d.data() as ProductDoc;
          return {
            id: d.id,
            text: data.text ?? "",
            isPurchased: data.isPurchased ?? false,
            createdAt: data.createdAt?.toDate?.() ?? null,
          };
        });
        setProducts(rows);
      },
      (err) => console.error("onSnapshot error", err)
    );

    return () => unsubscribe();
  }, []);

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

  return { newText, setNewText, products, handleAdd, handleDelete, handlePurchase };
}