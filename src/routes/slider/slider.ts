import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "$lib/firebase/firebase";
import type { SliderPhoto } from "../../shared/types";

const SLIDER_COLLECTION = "slider";

export async function getSliderPhotos(): Promise<SliderPhoto[]> {
    const q = query(
        collection(db, SLIDER_COLLECTION),
        orderBy("order", "asc")
    );
    const querySnapshot = await getDocs(q);
    const photos: SliderPhoto[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        photos.push({
            id: doc.id,
            name: data.name,
            url: data.url,
            order: data.order,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        });
    });
    return photos;
}

export async function addSliderPhoto(
    name: string,
    url: string,
    order: number
): Promise<string> {
    const docRef = await addDoc(collection(db, SLIDER_COLLECTION), {
        name,
        url,
        order,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function updateSliderPhoto(
    id: string,
    data: Partial<Omit<SliderPhoto, "id" | "createdAt">>
): Promise<void> {
    const docRef = doc(db, SLIDER_COLLECTION, id);
    await updateDoc(docRef, data);
}

export async function deleteSliderPhoto(id: string): Promise<void> {
    const docRef = doc(db, SLIDER_COLLECTION, id);
    await deleteDoc(docRef);
}

export async function reorderSliderPhotos(
    photos: { id: string; order: number }[]
): Promise<void> {
    const promises = photos.map(({ id, order }) => {
        const docRef = doc(db, SLIDER_COLLECTION, id);
        return updateDoc(docRef, { order });
    });
    await Promise.all(promises);
}
