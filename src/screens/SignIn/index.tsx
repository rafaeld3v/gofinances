import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Alert, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import * as Yup from "yup";

import AppleSvg from "@/assets/apple.svg";
import GoogleSvg from "@/assets/google.svg";
import LogoSvg from "@/assets/logo.svg";
import { Button } from "@/components/Form/Button";
import { InputForm } from "@/components/Form/InputForm";
import { SignInSocialButton } from "@/components/SignInSocialButton";
import { useAuth } from "@/hooks/auth";

import {
  Container,
  Fields,
  Footer,
  FooterWrapper,
  Form,
  Header,
  SignInTitle,
  Title,
  TitleWrapper,
} from "./styles";

interface FormData {
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  email: Yup.string().required("O email é obrigatorio!"),
  password: Yup.string().required("A senha é obrigatorio!"),
});

export function SignIn() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [isLoading, setIsLoading] = useState(false);
  const [signInWithEmailPassword, setSignInWithEmailPassword] = useState(false);
  const { signInWithGoogle, signInWithApple, signInWithFirebase } = useAuth();
  const theme = useTheme();

  function handleSignInWithEmailPassword() {
    setSignInWithEmailPassword(true);
  }

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true);
      return await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível conectar a conta Google");
      setIsLoading(false);
    }
  }

  async function handleSignInWithApple() {
    try {
      setIsLoading(true);
      return await signInWithApple();
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível conectar a conta Apple");
      setIsLoading(false);
    }
  }

  async function handleSignIn(formData: FormData) {
    try {
      signInWithFirebase(formData);
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível efetuar o login!");
    } finally {
      reset();
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />

          <Title>
            Controle suas{"\n"} finanças de forma{"\n"} muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com{"\n"} uma das contas abaixo
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          {signInWithEmailPassword ? (
            <>
              <Form>
                <Fields>
                  <InputForm
                    name="email"
                    control={control}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="sentences"
                    autoCorrect={false}
                    error={errors.email && errors.email?.message}
                  />

                  <InputForm
                    name="password"
                    control={control}
                    placeholder="Senha"
                    keyboardType="visible-password"
                    error={errors.password && errors.password?.message}
                  />
                </Fields>

                <Button
                  title="Enviar"
                  onPress={handleSubmit(handleSignIn)}
                  style={{
                    backgroundColor: theme.colors.primary,
                  }}
                />
              </Form>
            </>
          ) : (
            <>
              {Platform.OS === "android" && (
                <SignInSocialButton
                  title="Entrar com Google"
                  svg={GoogleSvg}
                  onPress={handleSignInWithGoogle}
                />
              )}

              {Platform.OS === "ios" && (
                <SignInSocialButton
                  title="Entrar com Apple"
                  svg={AppleSvg}
                  onPress={handleSignInWithApple}
                />
              )}

              {!signInWithEmailPassword && (
                <Button
                  title="Entrar com email e senha"
                  onPress={handleSignInWithEmailPassword}
                  style={{
                    backgroundColor: theme.colors.primary,
                  }}
                />
              )}
            </>
          )}
        </FooterWrapper>

        {isLoading && (
          <ActivityIndicator
            color={theme.colors.shape}
            style={{ marginTop: 18 }}
          />
        )}
      </Footer>
    </Container>
  );
}
