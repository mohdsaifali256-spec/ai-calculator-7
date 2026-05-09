import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs, Timestamp } from "firebase/firestore";
import { db, auth } from "./firebase";
import { CalculationEntry, CashRecordEntry } from "../types";

export function useHistory() {
  const saveCalculation = async (entry: Omit<CalculationEntry, 'id' | 'timestamp' | 'userId'>) => {
    const timestamp = new Date();
    const localEntry = { ...entry, timestamp, id: Date.now().toString() };
    
    // Always save to local storage for offline access
    const localData = JSON.parse(localStorage.getItem('local_history') || '[]');
    localStorage.setItem('local_history', JSON.stringify([localEntry, ...localData].slice(0, 50)));

    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, 'calculations'), {
        ...entry,
        userId: auth.currentUser.uid,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving remote history:", error);
    }
  };

  const saveCashRecord = async (entry: Omit<CashRecordEntry, 'id' | 'date' | 'userId'>) => {
    const date = new Date();
    const localEntry = { ...entry, date, id: `cash-${Date.now()}` };

    const localData = JSON.parse(localStorage.getItem('local_cash_history') || '[]');
    localStorage.setItem('local_cash_history', JSON.stringify([localEntry, ...localData].slice(0, 50)));

    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, 'cash_records'), {
        ...entry,
        userId: auth.currentUser.uid,
        date: serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving remote cash record:", error);
    }
  };

  const getHistory = async (sortOrder: 'asc' | 'desc' = 'desc') => {
    let results: CalculationEntry[] = [];

    // Always get local first
    const localData = JSON.parse(localStorage.getItem('local_history') || '[]');
    results = localData.map((d: any) => ({ ...d, timestamp: new Date(d.timestamp) }));

    if (auth.currentUser) {
      try {
        const q = query(
          collection(db, 'calculations'),
          where('userId', '==', auth.currentUser.uid),
          orderBy('timestamp', sortOrder),
          limit(50)
        );
        const snapshot = await getDocs(q);
        const remoteData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp: (data.timestamp as Timestamp)?.toDate() || new Date()
          };
        }) as CalculationEntry[];

        // Merge and de-duplicate (prefer remote)
        const merged = [...remoteData];
        return merged;
      } catch (error) {
        console.error("Error fetching remote history:", error);
      }
    }

    // Return sorted local if remote fails or not logged in
    return results.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  };

  const getCashHistory = async (sortOrder: 'asc' | 'desc' = 'desc') => {
    let results: CashRecordEntry[] = [];

    const localData = JSON.parse(localStorage.getItem('local_cash_history') || '[]');
    results = localData.map((d: any) => ({ ...d, date: new Date(d.date) }));

    if (auth.currentUser) {
      try {
        const q = query(
          collection(db, 'cash_records'),
          where('userId', '==', auth.currentUser.uid),
          orderBy('date', sortOrder),
          limit(50)
        );
        const snapshot = await getDocs(q);
        const remoteData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: (data.date as Timestamp)?.toDate() || new Date()
          };
        }) as CashRecordEntry[];
        return remoteData;
      } catch (error) {
        console.error("Error fetching remote cash history:", error);
      }
    }

    return results.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  };

  return { saveCalculation, saveCashRecord, getHistory, getCashHistory };
}
