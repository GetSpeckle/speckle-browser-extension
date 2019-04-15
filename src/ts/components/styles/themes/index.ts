import { DefaultTheme } from 'styled-components'

export type ThemeTypes = 'light' | 'dark'

export const lightTheme: DefaultTheme = {
  backgroundColor: '#ffffff',
  shadowColor: 'rgba(0, 0, 0, 0.08)',
  borderColor: '#e7e7e7'
}

export const darkTheme: DefaultTheme = {
  backgroundColor: '#181818',
  shadowColor: 'rgba(0, 0, 0, 0.7)',
  borderColor: '#121212'
}

export const themes = {
  light: lightTheme,
  dark: darkTheme
}
