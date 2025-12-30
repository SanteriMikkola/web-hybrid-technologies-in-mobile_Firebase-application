import {
  firestore, collection, addDoc, PRODUCTS, doc, query, orderBy,
  onSnapshot, deleteDoc, serverTimestamp, Timestamp, updateDoc,
} from '../firebase/config';

export type ProductDoc = {
  text?: string;
  createdAt?: Timestamp;
  isPurchased?: boolean;
};

export type ProductRow = {
  id: string;
  text: string;
  isPurchased: boolean;
  createdAt: Date | null;
};