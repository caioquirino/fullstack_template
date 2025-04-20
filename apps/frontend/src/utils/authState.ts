import { DEFAULT_LOGIN_RETURN_URL } from '@/constants/app'

export interface AuthState {
  returnUrl: string
  queryString?: string
}

const DEFAULT_AUTH_STATE: AuthState = {
  returnUrl: DEFAULT_LOGIN_RETURN_URL,
}

export const serializeAuthState = (state: AuthState | undefined): string => {
  const fullState = { ...DEFAULT_AUTH_STATE, ...state }
  return encodeURIComponent(JSON.stringify(fullState))
}

export const deserializeAuthState = (state: string | null | undefined): AuthState => {
  if (!state) return DEFAULT_AUTH_STATE
  try {
    const parsed = JSON.parse(decodeURIComponent(state))
    return { ...DEFAULT_AUTH_STATE, ...parsed }
  } catch (e) {
    console.error('Failed to parse state parameter:', e)
    return DEFAULT_AUTH_STATE
  }
}

export const buildRedirectUrl = (authState: AuthState): string => {
  return authState.queryString ? `${authState.returnUrl}${authState.queryString}` : authState.returnUrl
}
