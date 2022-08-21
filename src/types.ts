import { RemoteUser } from '@verdaccio/types';
import {TokenSet} from 'openid-client';

export interface ISessionStorage {
  close(): Promise<void>;
  set(key: string, value: TokenSet, expires_sec: number): Promise<void>;
  get(key: string): Promise<TokenSet | null>;
}

export interface ITokenStorage {
  close(): Promise<void>;
  set(key: string, value: string, expires_sec: number): Promise<void>;
  get(key: string, timeout: number): Promise<string | null>;
}

export type OidcPluginConfig = {
  publicUrl: string;
  issuer: string;
  clientId: string;
  clientSecret: string;
  scope: string;
  usernameClaim?: string;
  rolesClaim?: string;

  redisUri?: string;
  fsSessionStorePath?: string;
  fsTokenStorePath?: string;

  accessTokenAuth?: boolean;
};


export type Tokens = {
  npmToken: string;
  webToken: string;
};

export type RemoteUserEx = RemoteUser & {sid: string};

export enum PluginMode {
  LEGACY,
  JWT,
}
