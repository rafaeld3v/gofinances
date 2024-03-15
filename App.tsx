import "intl";
import "intl/locale-data/jsonp/pt-BR";
import "@/services/firebaseConfig";

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "styled-components";

import theme from "./src/global/styles/theme";
import { AuthProvider, useAuth } from "./src/hooks/auth";
import { Routes } from "./src/routes";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const { userStorageLoading } = useAuth();

  if (!fontsLoaded || userStorageLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <StatusBar style="light" />
        {fontsLoaded && (
          <AuthProvider>
            <Routes />
          </AuthProvider>
        )}
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
