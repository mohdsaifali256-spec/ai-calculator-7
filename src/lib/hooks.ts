import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase";
import { CalculationEntry } from "../types";

export function useHistory() {
  const saveCalculation = async (entry: Omit<CalculationEntry, 'id' | 'timestamp' | 'userId'>) => {
    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, 'calculations'), {
        ...entry,
        userId: auth.currentUser.uid,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving history:", error);
    }
  };

  const getHistory = async (type?: string) => {
    if (!auth.currentUser) return [];

    let q = query(
      collection(db, 'calculations'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    if (type) {
      q = query(q, where('type', '==', type));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CalculationEntry[];
  };

  return { saveCalculation, getHistory };
}
