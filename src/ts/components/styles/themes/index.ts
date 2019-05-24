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
  stopColorOne: string,
  stopColorTwo: string,
  headerShadow: string,
  backgroundColor: string,
  shadowColor: string
}

export const blueColorScheme: ColorScheme = {
  stopColorOne: '#44C5EE',
  stopColorTwo: '#4AABE0',
  headerShadow: '0 0 0 0 0.223431156 0 0 0 0 0.734036715 0 0 0 0 0.974888393 0 0 0 0.601704031 0',
  backgroundColor: '#24b6e8',
  shadowColor: 'rgba(72, 178, 228, 0.21)'
}

export const greenColorScheme: ColorScheme = {
  stopColorOne: '#51DFB0',
  stopColorTwo: '#52C48D',
  headerShadow: '0 0 0 0 0.317647059 0 0 0 0 0.847058824 0 0 0 0 0.654901961 0 0 0 0.597599638 0',
  backgroundColor: '#51d8a7',
  shadowColor: 'rgba(81, 216, 167, 0.1)'
}

export const orangeColorScheme: ColorScheme = {
  stopColorOne: '#FFC10B',
  stopColorTwo: '#FFB200',
  headerShadow: '0 0 0 0 1 0 0 0 0 0.698039216 0 0 0 0 0 0 0 0 0.6 0',
  backgroundColor: '#ffb200',
  shadowColor: 'rgba(243, 83, 109, 0.1)'
}

export const purpleColorScheme: ColorScheme = {
  stopColorOne: '#D396FF',
  stopColorTwo: '#B279F9',
  headerShadow: '0 0 0 0 0.698039216 0 0 0 0 0.474509804 0 0 0 0 0.976470588 0 0 0 0.6 0',
  backgroundColor: '#b279f9',
  shadowColor: 'rgba(178, 121, 249, 0.1)'
}

export const redColorScheme: ColorScheme = {
  stopColorOne: '#FF7396', // stopColorOne part
  stopColorTwo: '#F3536D', // stopColorTwo part
  headerShadow: '0 0 0 0 0.952941176 0 0 0 0 0.325490196 0 0 0 0 0.42745098 0 0 0 0.5 0',
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
