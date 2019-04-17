import styled from 'styled-components'

export const LayoutContainer = styled('div')`
    width: 375px;
    height: 667px;
    border-radius: 4px;
    box-shadow: 0 6px 30px 0 ${props => props.theme.shadowColor};
    border: solid 1px ${props => props.theme.borderColor};
    background-color: ${props => props.theme.backgroundColor};
`

export const Button = styled.button`
  width: 311px;
  height: 45px;
  border-radius: 4px;
  box-shadow: 0 3px 10px 0 rgba(72, 178, 228, 0.21);
  background-color: #24b6e8;
  font-family: Nunito;
  font-size: 16px;
  font-weight: 800;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.31;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
`

export const Section = styled.div`
    width: 327px;
    margin:18px auto;
    opacity: 0.6;
    font-family: Nunito;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #3e5860;
`

export const Title = styled(Section)`
    width: 311px;
    height: 26px;
    font-size: 19px;
    font-weight: bold;
    color: #30383B;
`

export const MnemonicPad = styled.textarea`
  width: 311px;
  height: 125px;
  font-family: Nunito;
  padding: 10px;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.57;
  letter-spacing: normal;
  color: #30383b;
`

export const StyledPassword = styled.input`
  width: 311px;
  height: 42px;
`
