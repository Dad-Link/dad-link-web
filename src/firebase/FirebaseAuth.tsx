import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import app from "./firebaseConfig";

const auth = getAuth(app);
const db = getFirestore(app);

// Login Function
export const login = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Registration Function
export const register = async (
  email: string,
  password: string,
  userDetails: {
    firstName: string;
    phoneNumber: string;
    isChild?: boolean;
    lastName?: string;
    username?: string;
  }
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = {
      firstName: userDetails.firstName,
      phoneNumber: userDetails.phoneNumber,
      isChild: userDetails.isChild || false,
      lastName: userDetails.lastName || "",
      username: userDetails.username || "",
    };

    await setDoc(doc(db, `users/${user.uid}`), userDoc);

    return user;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};
