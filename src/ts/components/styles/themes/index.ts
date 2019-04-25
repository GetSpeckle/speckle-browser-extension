import { DefaultTheme } from 'styled-components'

export type ThemeTypes = 'light' | 'dark'

export const lightTheme: DefaultTheme = {
  backgroundColor: '#ffffff',
  shadowColor: 'rgba(0, 0, 0, 0.08)'
}

export const darkTheme: DefaultTheme = {
  backgroundColor: '#181818',
  shadowColor: 'rgba(0, 0, 0, 0.7)'
}

export const themes = {
  light: lightTheme,
  dark: darkTheme
}

export type Color = 'blue' | 'green' | 'orange' | 'purple' | 'red'

export type ColorScheme = {
  backgroundColor: string,
  shadowColor: string
}

export const blueColorScheme: ColorScheme = {
  backgroundColor: '#24b6e8',
  shadowColor: 'rgba(72, 178, 228, 0.21)'
}

export const greenColorScheme: ColorScheme = {
  backgroundColor: '#51d8a7',
  shadowColor: 'rgba(81, 216, 167, 0.1)'
}

export const orangeColorScheme: ColorScheme = {
  backgroundColor: '#ffb200',
  shadowColor: 'rgba(243, 83, 109, 0.1)'
}

export const purpleColorScheme: ColorScheme = {
  backgroundColor: '#b279f9',
  shadowColor: 'rgba(178, 121, 249, 0.1)'
}

export const redColorScheme: ColorScheme = {
  backgroundColor: '#f3536d',
  shadowColor: 'rgba(243, 83, 109, 0.1)'
}

export const colorSchemes = {
  blue: blueColorScheme,
  green: greenColorScheme,
  orange: orangeColorScheme,
  purple: purpleColorScheme,
  red: redColorScheme
}
