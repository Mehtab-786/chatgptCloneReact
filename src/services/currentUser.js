import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import auth from "./auth.services"; // your firebase.js
import { useDispatch} from "react-redux";
import { loadChats } from "../store/chatSlice";

export function useAuthUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        let chats = [];
        try {
          const raw = localStorage.getItem(`chats_${currentUser?.uid}`);
          chats = raw ? JSON.parse(raw) : [];
        } catch (err) {
          console.error('Failed to parse chats from localStorage', err);
          chats = [];
        }
        console.log(currentUser);
        console.log(chats);
        dispatch(loadChats(chats));
      } else {
        dispatch(loadChats([]));
      }
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [dispatch]);

  return { user, loading };
}
