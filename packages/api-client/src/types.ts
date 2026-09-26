export interface TokenStorage {
  getAccessToken(): string | null | Promise<string | null>;
  getRefreshToken(): string | null | Promise<string | null>;
  setTokens(accessToken: string, refreshToken: string): void | Promise<void>;
  clearTokens(): void | Promise<void>;
}

export interface UserStorage {
  getUser(): string | null | Promise<string | null>;
  setUser(json: string): void | Promise<void>;
  clearUser(): void | Promise<void>;
}

export interface ApiClientConfig {
  baseUrl: string;
  /** Prefix for relative image paths like /images/properties/foo.jpg */
  assetBaseUrl?: string;
  tokenStorage: TokenStorage;
  userStorage?: UserStorage;
}

export interface UploadFile {
  uri: string;
  name: string;
  type: string;
}
