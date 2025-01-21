import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { db, storage } from "../firebase/firebaseConfig";
import { ChatMessage, ChatSession } from "./types";

/**
 * Utility: Centralized error logging.
 */
function logError(location: string, error: unknown) {
  console.error(`[${location}]`, error);
}

/**
 * Utility: Construct category path based on user hierarchy.
 */
function getCategoryPath(dadId: string, category: string, childId?: string): string {
  return childId
    ? `users/${dadId}/children/${childId}/AiAssistance/${category}/chats`
    : `users/${dadId}/AiAssistance/${category}/chats`;
}

/**
 * Upload a file to Firebase Storage and return its download URL.
 */
export async function uploadFileToStorage(file: File, filePath: string): Promise<string> {
  try {
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  } catch (error) {
    logError("uploadFileToStorage", error);
    throw error;
  }
}

/**
 * Fetch all chats for a category.
 */
export async function getCategoryChats(categoryPath: string): Promise<ChatSession[]> {
  try {
    const sessions: ChatSession[] = [];
    const snapshot = await getDocs(collection(db, categoryPath));
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() || {};
      const messages: ChatMessage[] = (data.messages || []).map((m: any) => ({
        text: m.text,
        timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
        sender: m.sender,
      }));
      sessions.push({
        id: docSnap.id,
        name: data.name || "Untitled",
        messages,
      });
    });
    return sessions;
  } catch (error) {
    logError("getCategoryChats", error);
    throw error;
  }
}

/**
 * Create a new chat in a category.
 */
export async function createNewChatInCategory(
  categoryPath: string,
  chatName: string
): Promise<string> {
  try {
    const chatRef = doc(collection(db, categoryPath));
    await setDoc(chatRef, {
      name: chatName,
      messages: [],
      createdAt: Timestamp.now(),
    });
    return chatRef.id;
  } catch (error) {
    logError("createNewChatInCategory", error);
    throw error;
  }
}

/**
 * Delete a chat document.
 */
export async function deleteChatDoc(categoryPath: string, chatId: string): Promise<void> {
  try {
    const chatRef = doc(db, categoryPath, chatId);
    await deleteDoc(chatRef);
  } catch (error) {
    logError("deleteChatDoc", error);
    throw error;
  }
}

/**
 * Update messages in a chat document.
 */
export async function updateChatMessagesInDoc(
  categoryPath: string,
  chatId: string,
  newMessages: ChatMessage[],
  rename = false
): Promise<void> {
  try {
    const chatRef = doc(db, categoryPath, chatId);
    if (rename) {
      const existingSnap = await getDoc(chatRef);
      if (!existingSnap.exists()) throw new Error("Chat doc not found.");
      const data = existingSnap.data();
      const oldMessages = data.messages || [];
      const updatedMessages = oldMessages.map((msg: any) =>
        newMessages.find((newMsg) => new Date(newMsg.timestamp).toString() === new Date(msg.timestamp).toString()) || msg
      );
      await updateDoc(chatRef, { messages: updatedMessages });
    } else {
      await updateDoc(chatRef, { messages: arrayUnion(...newMessages) });
    }
  } catch (error) {
    logError("updateChatMessagesInDoc", error);
    throw error;
  }
}

/**
 * Rename a chat document.
 */
export async function renameChatDoc(
  categoryPath: string,
  chatId: string,
  newName: string
): Promise<void> {
  try {
    const chatRef = doc(db, categoryPath, chatId);
    await updateDoc(chatRef, { name: newName });
  } catch (error) {
    logError("renameChatDoc", error);
    throw error;
  }
}

