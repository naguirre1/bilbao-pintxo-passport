import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

// Firebase web config is public by design; security is enforced by Firestore rules.
const firebaseConfig = {
  apiKey: "AIzaSyApYYclGr_-XGBdGEC08YrSMNkCk69eC9Y",
  authDomain: "prueba-e0682.firebaseapp.com",
  projectId: "prueba-e0682",
  storageBucket: "prueba-e0682.firebasestorage.app",
  messagingSenderId: "184523666133",
  appId: "1:184523666133:web:837d56dd30fb76ab78285c",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export type Photo = {
  id: string;
  stopId: number;
  name: string;
  file: string;
  createdAt: string;
};

export async function listPhotos(): Promise<Photo[]> {
  const q = query(collection(db, "photos"), orderBy("createdAt", "desc"), limit(300));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as { stopId?: number; name?: string; image?: string; createdAt?: string };
    return {
      id: d.id,
      stopId: Number(data.stopId) || 0,
      name: data.name || "Anónimo/a",
      file: data.image || "",
      createdAt: data.createdAt || "",
    };
  });
}

export async function uploadPhoto(image: string, stopId: number, name: string): Promise<Photo> {
  const createdAt = new Date().toISOString();
  const clean = (name.trim() || "Anónimo/a").slice(0, 40);
  const ref = await addDoc(collection(db, "photos"), { stopId, name: clean, image, createdAt });
  return { id: ref.id, stopId, name: clean, file: image, createdAt };
}
