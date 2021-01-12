import React, { createContext, useState } from 'react';
import { auth, generateUserDocument } from '../firebase';

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider
          value={{
              user,
              setUser,
              login: async (email, password) => {
                  try {
                      await auth.signInWithEmailAndPassword(email, password);
                  } catch (err) {
                      console.log(err);
                  }
              },
              register: async (email, password, name) => {
                  try {
                      const user = await auth.createUserWithEmailAndPassword(email, password);
                      
                      await user.updateProfile({
                          displayName: name
                      });

                      const displayName = user.displayName;

                      await generateUserDocument(user, displayName);
                  } catch (err) {
                      console.log(err);
                  }
              },
              logout: async () => {
                  try {
                      await auth.signOut();
                  } catch (err) {
                      console.log(err)
                  }
              }
          }}
        >
            {children}
        </AuthContext.Provider>
    );
};