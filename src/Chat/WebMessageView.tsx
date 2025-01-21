import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { useParams } from "react-router-dom";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

interface Message {
  id: string;
  message: string;
}

const WebMessageView: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const chatUUID = "chatUUID_placeholder"; // Replace with actual logic

  useEffect(() => {
    if (!childId || !chatUUID) return;

    const messagesRef = collection(
      db,
      `users/${childId}/Chats/${chatUUID}/Messages`
    );
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        message: doc.data().message || "(No message provided)", // Default message
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [childId, chatUUID]);

  return (
    <div>
      <h1>Messages</h1>
      <div>
        {messages.map((msg) => (
          <p key={msg.id}>{msg.message}</p>
        ))}
      </div>
    </div>
  );
};

export default WebMessageView;



