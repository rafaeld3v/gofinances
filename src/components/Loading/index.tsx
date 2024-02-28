import React from "react";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";

import { LoadContainer } from "./styles";

export function Loading() {
  const theme = useTheme();
  return (
    <LoadContainer>
      <ActivityIndicator color={theme.colors.primary} size={34} />
    </LoadContainer>
  );
}
