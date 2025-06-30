'use client'

import React from 'react'
import { StytchLogin } from '@stytch/nextjs'
import { OAuthProviders, Products } from '@stytch/vanilla-js'
import { getDomainFromWindow } from '@/utils/urlUtils'
import { AuthState, serializeAuthState } from '@/utils/authState'

/*
 * Login configures and renders the StytchLogin component which is a prebuilt UI component for auth powered by Stytch.
 *
 * This component accepts style, config, and callbacks props. To learn more about possible options review the documentation at
 * https://stytch.com/docs/sdks/javascript-sdk#ui-configs.
 */
const Login = ({ queryParams }: { queryParams: AuthState }) => {
  const styles = {
    container: {
      width: '100%',
    },
    buttons: {
      primary: {
        backgroundColor: '#4A37BE',
        borderColor: '#4A37BE',
      },
    },
  }

  const buildRedirectUrl = (baseUrl: string) => {
    return `${baseUrl}?state=${serializeAuthState(queryParams)}`
  }

  const config = {
    products: [Products.oauth],
    oauthOptions: {
      providers: [{ type: OAuthProviders.Google }],
      loginRedirectURL: buildRedirectUrl(`${getDomainFromWindow()}/authenticate`),
      pkceEnabled: true,
    },
  } as Parameters<typeof StytchLogin>[0]['config']

  return <StytchLogin config={config} styles={styles} />
}

export default Login
