import { View, Text, Pressable, Image } from 'react-native';
import React, { useEffect } from 'react';
import { BlurView } from 'expo-blur';
import { fontSizes, windowHeight, windowWidth } from '@/themes/app.constant';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import JWT from 'expo-jwt';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

// Hoàn tất phiên trình duyệt
WebBrowser.maybeCompleteAuthSession();

export default function AuthModal({
  setModalVisible,
}: {
  setModalVisible: (modal: boolean) => void;
}) {
  // Google Sign-In với expo-auth-session
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID, // Sửa expoClientId thành clientId
    scopes: ['profile', 'email'],
    redirectUri: makeRedirectUri({
      scheme: 'levelup',
    }),
  });

  // GitHub Auth
  const githubAuthEndpoints = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}`,
  };

  const [githubRequest, githubResponse, githubPromptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
      clientSecret: process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET!,
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'levelup',
      }),
    },
    githubAuthEndpoints
  );

  // Xử lý Google Sign-In response
  useEffect(() => {
    if (googleResponse?.type === 'success' && googleResponse.authentication) {
      fetchGoogleUserInfo(googleResponse.authentication.accessToken);
    }
  }, [googleResponse]);

  // Xử lý GitHub Auth response
  useEffect(() => {
    if (githubResponse?.type === 'success') {
      const { code } = githubResponse.params;
      fetchAccessToken(code);
    }
  }, [githubResponse]);

  // Lấy thông tin người dùng từ Google
  const fetchGoogleUserInfo = async (token: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await response.json();
      if (userData.error) {
        throw new Error(userData.error.message);
      }
      await authHandler({
        name: userData.name,
        email: userData.email,
        avatar: userData.picture,
      });
    } catch (error) {
      console.error('Error fetching Google user info:', error);
    }
  };

  // Lấy access token cho GitHub
  const fetchAccessToken = async (code: string) => {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `client_id=${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}&client_secret=${process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET}&code=${code}`,
    });
    const tokenData = await tokenResponse.json();
    const access_token = tokenData.access_token;
    if (access_token) {
      fetchUserInfo(access_token);
    } else {
      console.error('Error fetching access token:', tokenData);
    }
  };

  // Lấy thông tin người dùng từ GitHub
  const fetchUserInfo = async (token: string) => {
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = await userResponse.json();
    await authHandler({
      name: userData.name || userData.login,
      email: userData.email || '',
      avatar: userData.avatar_url,
    });
  };

  // Xử lý đăng nhập
  const authHandler = async ({
    name,
    email,
    avatar,
  }: {
    name: string;
    email: string;
    avatar: string;
  }) => {
    const user = { name, email, avatar };
    const token = JWT.encode(
      { ...user },
      process.env.EXPO_PUBLIC_JWT_SECRET_KEY!
    );
    const res = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/login`, {
      signedToken: token,
    });
    await SecureStore.setItemAsync('accessToken', res.data.accessToken);
    await SecureStore.setItemAsync('name', name);
    await SecureStore.setItemAsync('email', email);
    await SecureStore.setItemAsync('avatar', avatar);

    setModalVisible(false);
    router.push('/(tabs)');
  };

  // Hàm xử lý Google Sign-In
  const googleSignIn = async () => {
    try {
      await googlePromptAsync();
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
    }
  };

  // Hàm xử lý GitHub Sign-In
  const handleGithubLogin = async () => {
    try {
      await githubPromptAsync();
    } catch (error) {
      console.error('Error during GitHub Sign-In:', error);
    }
  };

  return (
    <BlurView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Pressable
        style={{
          width: windowWidth(420),
          height: windowHeight(250),
          marginHorizontal: windowWidth(50),
          backgroundColor: '#fff',
          borderRadius: 30,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: fontSizes.FONT35,
            fontFamily: 'Poppins_700Bold',
          }}
        >
          Join to Becodemy
        </Text>
        <Text
          style={{
            fontSize: fontSizes.FONT17,
            paddingTop: windowHeight(5),
            fontFamily: 'Poppins_300Light',
          }}
        >
          It's easier than your imagination!
        </Text>
        <View
          style={{
            paddingVertical: windowHeight(10),
            flexDirection: 'row',
            gap: windowWidth(20),
          }}
        >
          <Pressable onPress={googleSignIn}>
            <Image
              source={require('@/assets/images/onboarding/google.png')}
              style={{
                width: windowWidth(40),
                height: windowHeight(40),
                resizeMode: 'contain',
              }}
            />
          </Pressable>
          <Pressable onPress={handleGithubLogin}>
            <Image
              source={require('@/assets/images/onboarding/github.png')}
              style={{
                width: windowWidth(40),
                height: windowHeight(40),
                resizeMode: 'contain',
              }}
            />
          </Pressable>
          <Pressable>
            <Image
              source={require('@/assets/images/onboarding/apple.png')}
              style={{
                width: windowWidth(40),
                height: windowHeight(40),
                resizeMode: 'contain',
              }}
            />
          </Pressable>
        </View>
      </Pressable>
    </BlurView>
  );
}