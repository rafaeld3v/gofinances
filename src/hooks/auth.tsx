import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";

import "firebase/auth";
import firebase from "firebase/compat/app";
import * as AuthSession from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";

import AsyncStorage from "@react-native-async-storage/async-storage";

const authConfig = {
  webClientId:
    "49891934433-6gtmtac8tr7rivuupa935q7mo86so0hl.apps.googleusercontent.com",
  scopes: ["profile", "email"],
};

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
  userStorageLoading: boolean;
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  const userStorageKey = "@gofinances:user";

  async function signInWithGoogle() {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({ useProxy: true });
      const result = await AuthSession.startAsync({
        authUrl: `https://accounts.google.com/o/oauth2/auth?client_id=${
          authConfig.webClientId
        }&redirect_uri=${encodeURIComponent(
          redirectUrl
        )}&response_type=token&scope=${authConfig.scopes.join("%20")}`,
      });

      if (result.type === "success" && result.params) {
        const { access_token } = result.params;

        const credential = firebase.auth.GoogleAuthProvider.credential(
          null,
          access_token
        );

        await firebase.auth().signInWithCredential(credential);

        const currentUser = firebase.auth().currentUser;

        if (currentUser) {
          const userLogged = {
            id: currentUser.uid,
            email: currentUser.email || "",
            name: currentUser.displayName || "",
            photo: currentUser.photoURL || "",
          };

          await AsyncStorage.setItem(
            "userStorageKey",
            JSON.stringify(userLogged)
          );
        }
      }
    } catch (error: any) {
      throw new Error(error.message || "Erro ao fazer login com o Google");
    }
  }

  async function signInWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential) {
        const name = credential.fullName!.givenName!;
        const photo = `https://ui-avatars.com/api/?name=${name}&length=1`;

        const userLogged = {
          id: String(credential.user),
          email: credential.email!,
          name,
          photo,
        };

        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async function signOut() {
    setUser({} as User);
    await AsyncStorage.removeItem(userStorageKey);
  }

  useEffect(() => {
    async function loadUserStorageDate() {
      const userStoraged = await AsyncStorage.getItem(userStorageKey);

      if (userStoraged) {
        const userLogged = JSON.parse(userStoraged) as User;
        setUser(userLogged);
      }

      setUserStorageLoading(false);
    }

    loadUserStorageDate();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signInWithApple,
        signOut,
        userStorageLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
