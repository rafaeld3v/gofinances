import { IOS_CLIENT_ID, WEB_CLIENT_ID } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";

import firebase from "@/services/firebaseConfig";

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
  signInWithFirebase(data: { email: string; password: string }): Promise<void>;
  signOut(): Promise<void>;
  userStorageLoading: boolean;
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  const userStorageKey = "@gofinances:user";

  GoogleSignin.configure({
    scopes: ["email", "profile"],
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
  });

  async function signInWithGoogle() {
    try {
      const { idToken, user } = await GoogleSignin.signIn();

      if (idToken) {
        const userLogged = {
          id: user.id,
          email: user.email || "",
          name: user.name || "",
          photo: user.photo || "",
        };

        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      } else {
        Alert.alert("Não foi possível conectar-se a sua conta google.");
      }
    } catch (error) {
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
        const name = credential.fullName?.givenName || "";
        const photo = `https://ui-avatars.com/api/?name=${name}&length=1`;

        const userLogged = {
          id: credential.user,
          email: credential.email || "",
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

  async function signInWithFirebase(data: { email: string; password: string }) {
    try {
      const database = firebase.app();

      const auth = await database
        .auth()
        .signInWithEmailAndPassword(data.email, data.password);

      const userLogged = {
        id: auth.user.uid,
        name: "Jack Sparrow",
        email: auth.user.email,
        photo:
          "https://images.unsplash.com/photo-1633332755192-727a05c4013d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0Mzc0NDd8MHwxfHNlYXJjaHw4fHxhdmF0YXJ8ZW58MHx8fHwxNzEwNDQzMjE0fDA&ixlib=rb-4.0.3&q=85&q=85&fmt=jpg&crop=entropy&cs=tinysrgb&w=450",
      };

      setUser(userLogged);
      await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async function signOut() {
    try {
      setUser({} as User);
      await AsyncStorage.removeItem(userStorageKey);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
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
        signInWithFirebase,
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
