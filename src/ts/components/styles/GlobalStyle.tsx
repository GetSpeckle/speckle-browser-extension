import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
	body {
		box-sizing: border-box;
		display: block;
		margin: 0;
		font-family: Nunito;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
	}
	input, textarea {
	  width: 100%;
	  padding: 10px;
	}
`

export default GlobalStyle
