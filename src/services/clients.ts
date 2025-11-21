
'use server';

import { initializeFirebase } from '@/firebase';
import type { Client, ClientNote, ClientRequest } from '@/lib/types';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, serverTimestamp, updateDoc, orderBy } from 'firebase/firestore';

export async function getClients(): Promise<Client[]> {
  const { db } = initializeFirebase();
  const clientsCol = collection(db, 'clients');
  const clientSnapshot = await getDocs(clientsCol);
  const clientList = clientSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
  return clientList;
}

type ClientData = Omit<Client, 'id' | 'createdAt'>;

export async function addClient(clientData: ClientData): Promise<Client> {
  const { db } = initializeFirebase();
  const q = query(collection(db, 'clients'), where('email', '==', clientData.email));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    throw new Error('A client with this email address already exists.');
  }

  const clientsCol = collection(db, 'clients');
  const docRef = await addDoc(clientsCol, {
    ...clientData,
    createdAt: serverTimestamp(),
  });

  return { 
    id: docRef.id, 
    ...clientData,
    createdAt: new Date(), // Return a date object for immediate use
  };
}

export async function updateClient(id: string, clientData: ClientData): Promise<void> {
    const { db } = initializeFirebase();
    const clientDoc = doc(db, 'clients', id);
    // Check for email conflicts, excluding the current client
    const q = query(collection(db, 'clients'), where('email', '==', clientData.email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty && snapshot.docs.some(doc => doc.id !== id)) {
        throw new Error('Another client with this email address already exists.');
    }
    
    await updateDoc(clientDoc, {
        ...clientData,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteClient(id: string): Promise<void> {
  const { db } = initializeFirebase();
  const clientDoc = doc(db, 'clients', id);
  await deleteDoc(clientDoc);
}

// Functions for Client Notes
export async function getNotesForClient(clientId: string): Promise<ClientNote[]> {
    const { db } = initializeFirebase();
    const notesQuery = query(collection(db, `clients/${clientId}/notes`), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(notesQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as ClientNote));
}

export async function addNoteForClient(clientId: string, noteData: Omit<ClientNote, 'id' | 'createdAt'>) {
    const { db } = initializeFirebase();
    const notesCol = collection(db, `clients/${clientId}/notes`);
    await addDoc(notesCol, {
        ...noteData,
        createdAt: serverTimestamp(),
    });
}

// Functions for Client Requests
export async function getRequestsForClient(clientId: string): Promise<ClientRequest[]> {
    const { db } = initializeFirebase();
    const requestsQuery = query(collection(db, `clients/${clientId}/requests`), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(requestsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as ClientRequest));
}

export async function addRequestForClient(clientId: string, requestData: Omit<ClientRequest, 'id' | 'createdAt'>) {
    const { db } = initializeFirebase();
    const requestsCol = collection(db, `clients/${clientId}/requests`);
    await addDoc(requestsCol, {
        ...requestData,
        createdAt: serverTimestamp(),
    });
}
