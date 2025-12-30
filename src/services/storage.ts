import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@clevrcash:token';
const USER_KEY = '@clevrcash:user';
const THEME_KEY = '@clevrcash:theme';
const PENDING_DEEP_LINK_KEY = '@clevrcash:pending_deep_link';
const BRAND_KEY = '@clevrcash:brand';

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    return null;
  }
};

export const setToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export const getUser = async (): Promise<any | null> => {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    return null;
  }
};

export const setUser = async (user: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

export const getTheme = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(THEME_KEY);
  } catch (error) {
    return null;
  }
};

export const setTheme = async (theme: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

export const getPendingDeepLink = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(PENDING_DEEP_LINK_KEY);
  } catch (error) {
    return null;
  }
};

export const setPendingDeepLink = async (url: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(PENDING_DEEP_LINK_KEY, url);
  } catch (error) {
    console.error('Error saving pending deep link:', error);
  }
};

export const clearPendingDeepLink = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PENDING_DEEP_LINK_KEY);
  } catch (error) {
    console.error('Error clearing pending deep link:', error);
  }
};

export const getBrand = async (): Promise<any | null> => {
  try {
    const brandJson = await AsyncStorage.getItem(BRAND_KEY);
    return brandJson ? JSON.parse(brandJson) : null;
  } catch (error) {
    return null;
  }
};

export const setBrand = async (brand: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(BRAND_KEY, JSON.stringify(brand));
  } catch (error) {
    console.error('Error saving brand:', error);
  }
};

export const removeBrand = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(BRAND_KEY);
  } catch (error) {
    console.error('Error removing brand:', error);
  }
};

