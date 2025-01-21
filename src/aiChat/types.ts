// src/features/aiChat/types.ts

export interface ChatMessage {
  text: string;
  timestamp: Date; // or string if you store it as a string in Firestore
  sender: "You" | "AI" | string;
}

export interface ChatSession {
  id: string;
  name: string;        // needed because your code references session.name
  messages: ChatMessage[];
}

export type UserType = {
  dadId: string;
  isChild: boolean;
  childId: string | null;
};

