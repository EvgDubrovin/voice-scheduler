import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Services for interacting with Firestore to save and retrieve user data
export async function getUserData(userId) {
  if (!userId) throw new Error("userId is required");

  const userDocRef = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDocRef);

  return userSnapshot.exists() ? userSnapshot.data() : null;
}

// Save user data to Firestore under the "users" collection with the document ID as the userId
export async function saveUserData(userId, data) {
  if (!userId) throw new Error("userId is required");
  if (!data || typeof data !== "object") throw new Error("data object is required");

  const userDocRef = doc(db, "users", userId);
  await setDoc(userDocRef, data, { merge: true });
}
