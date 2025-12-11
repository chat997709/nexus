import { supabase, isConfigured } from './supabaseClient';
import { User } from './types';

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

  // Initialize a user document in Supabase 'profiles' table or LocalStorage
  initializeUser: async (user: User, uid: string): Promise<void> => {
    if (isConfigured) {
        // Supabase DB
        try {
            // Note: Schema must match. 
            // We assume a 'profiles' table exists with columns matching the User object keys
            // or we use JSONB columns for complex objects (ownedGameIds, transactions, stats)
            
            const { error } = await supabase
                .from('profiles')
                .upsert({ 
                    id: uid,
                    email: user.email,
                    name: user.name,
                    surname: user.surname,
                    dob: user.dob,
                    avatar: user.avatar,
                    // Storing complex objects as JSON if columns are JSONB
                    ownedGameIds: user.ownedGameIds,
                    transactions: user.transactions,
                    stats: user.stats
                });

            if (error) throw error;

        } catch (e) {
            console.error("Error initializing user in Supabase:", e);
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
    if (isConfigured) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', uid)
                .single();

            if (error) {
                // If row doesn't exist yet, return null
                if (error.code === 'PGRST116') return null; 
                throw error;
            }

            return data as User;
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
    if (isConfigured) {
        try {
             const { error } = await supabase
                .from('profiles')
                .update(data)
                .eq('id', uid);

             if (error) throw error;
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
          await supabase.auth.signOut();
      }
  }
};
