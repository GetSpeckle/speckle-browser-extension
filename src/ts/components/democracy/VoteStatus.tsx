import * as React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart } from 'chart.js'
import { bnToBn } from '@polkadot/util'
import BN = require('bn.js')
import styled from 'styled-components'

interface IVoteStatusProps {
  values: Value[],
  votes: number
  legendColor: string
}

interface Value {
  colors: string[]
  label: string
  value: number | BN
}

interface Options {
  colorNormal: string[]
  colorHover: string[]
  data: number[]
  labels: string[]
}

class VoteStatus extends React.Component<IVoteStatusProps> {

  shouldComponentUpdate (nextProps: Readonly<IVoteStatusProps>, _nextState: Readonly<{}>, _nextContext: any): boolean {
    return nextProps.values !== this.props.values
  }

  componentWillMount (): void {
    Chart.pluginService.register({
      beforeDraw: function (chart) {
        if (chart.config.options.elements.center) {
          // Get ctx from string
          let ctx = chart.chart.ctx

          // Get options from the center object in options
          let centerConfig = chart.config.options.elements.center
          let fontStyle = centerConfig.fontStyle || 'Arial'
          let txt = centerConfig.text
          let votes = centerConfig.votes
          let color = centerConfig.color || '#000'
          let sidePadding = centerConfig.sidePadding || 20
          let sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
          // Start with a base font of 30px
          ctx.font = '40px ' + fontStyle

          // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
          let stringWidth = ctx.measureText(txt).width
          let elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated

          // Find out how much the font can grow in width.
          let widthRatio = elementWidth / stringWidth
          let newFontSize = Math.floor(30 * widthRatio)
          let elementHeight = (chart.innerRadius)

          // Pick a new font size so it will not be larger than the height of label.
          let fontSizeToUse = Math.min(newFontSize, elementHeight)

          // Set font settings to draw it correctly.
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          let centerX = ((chart.chartArea.left + chart.chartArea.right) / 2)
          let centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2.1)
          let voteCenterX = ((chart.chartArea.left + chart.chartArea.right) / 2)
          let voteCenterY = ((chart.chartArea.top + chart.chartArea.bottom) / 1.8)
          ctx.font = fontSizeToUse + 'px ' + fontStyle
          ctx.fillStyle = color

          // Draw text in center
          ctx.fillText(txt, centerX, centerY)
          ctx.fillText(votes, voteCenterX, voteCenterY)
        }
      }
    })
  }

  render () {
    const { values, votes, legendColor } = this.props
    const options: Options = { colorNormal: [], colorHover: [], data: [], labels: [] }
    values.forEach(({ colors: [normalColor = '#00f', hoverColor], label, value }): void => {
      options.colorNormal.push(normalColor)
      options.colorHover.push(hoverColor || normalColor)
      options.data.push(bnToBn(value).toNumber())
      options.labels.push(label)
    })
    return (
      <Wrapper>
        <Doughnut
          data={{
            labels: options.labels,
            datasets: [{
              data: options.data,
              backgroundColor: options.colorNormal,
              hoverBackgroundColor: options.colorHover
            }]
          }}
          width={300}
          height={200}
          legend={{
            display: false
          }}
          options={{
            maintainAspectRatio: false,
            elements: {
              center: {
                text: 'Total votes',
                votes: votes,
                color: `${legendColor}`,
                fontStyle: 'Nunito',
                sidePadding: 0
              }
            }
          }}
        />
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
margin-top: -13px;
position: relative;
display: inline-block;
padding 1em 1em 0;
height: 200px;
width: 300px;
`

export default VoteStatus
