
import { db, isConfigured } from './firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User } from './types';
import { getAuth } from 'firebase/auth';

// Helper for local storage mock
const getLocalUser = (uid: string): User | null => {
    try {
        const data = localStorage.getItem(`nexus_user_${uid}`);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        return null;
    }
};

const saveLocalUser = (uid: string, user: User) => {
    try {
        localStorage.setItem(`nexus_user_${uid}`, JSON.stringify(user));
    } catch (e) {
        console.error("Local save failed", e);
    }
};

export const UserManager = {
  // --- Database Operations ---

  // Initialize a user document in Firestore 'users' collection or LocalStorage
  initializeUser: async (user: User, uid: string): Promise<void> => {
    if (isConfigured && db) {
        try {
            const userRef = doc(db, 'users', uid);
            // setDoc with merge:true works like upsert
            await setDoc(userRef, {
                email: user.email,
                name: user.name,
                surname: user.surname,
                dob: user.dob,
                avatar: user.avatar || '',
                ownedGameIds: user.ownedGameIds || [],
                transactions: user.transactions || [],
                stats: user.stats || { hoursPlayed: 0, achievementsUnlocked: 0, gamesOwned: 0, credits: 0 }
            }, { merge: true });

        } catch (e) {
            console.error("Error initializing user in Firestore:", e);
            throw e;
        }
    } else {
        // Mock DB
        const existing = getLocalUser(uid);
        if (!existing) {
            saveLocalUser(uid, user);
        }
    }
  },

  // Fetch user data
  getUserProfile: async (uid: string): Promise<User | null> => {
    if (isConfigured && db) {
        try {
            const userRef = doc(db, 'users', uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                return docSnap.data() as User;
            } else {
                return null;
            }
        } catch (e) {
            console.error("Error fetching user profile:", e);
            return null;
        }
    } else {
        return getLocalUser(uid);
    }
  },

  // Update specific fields
  updateUser: async (uid: string, data: Partial<User>): Promise<void> => {
    if (isConfigured && db) {
        try {
             const userRef = doc(db, 'users', uid);
             await updateDoc(userRef, data);
        } catch (e) {
            console.error("Error updating user:", e);
            throw e;
        }
    } else {
        const current = getLocalUser(uid);
        if (current) {
            saveLocalUser(uid, { ...current, ...data });
        }
    }
  },

  logout: async (): Promise<void> => {
      if (isConfigured) {
          const auth = getAuth();
          await auth.signOut();
      }
  }
};
