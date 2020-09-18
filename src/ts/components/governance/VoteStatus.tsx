import * as React from 'react'
import { Chart } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { bnToBn } from '@polkadot/util'
import BN = require('bn.js')
import styled from 'styled-components'

interface IVoteStatusProps {
  values: Value[],
  votes: number
  legendColor: string
  width: number,
  height: number
}

interface IVoteStatusState {
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

class VoteStatus extends React.Component<IVoteStatusProps, IVoteStatusState> {

  state = {
    votes: 0,
    legendColor: '#000'
  }

  // tslint:disable-next-line:max-line-length
  shouldComponentUpdate (nextProps: Readonly<IVoteStatusProps>, nextState: Readonly<IVoteStatusState>, _nextContext: any): boolean {
    return nextProps.values !== this.props.values && nextState.votes !== this.props.votes
  }

  componentDidMount (): void {
    let votes = this.props.votes
    let doughnutDraw = Chart.controllers.doughnut.prototype.draw
    Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
      draw: function () {
        doughnutDraw.apply(this, arguments)
          // Get ctx from string
        let chart = this.chart.chart
        let ctx = chart.ctx

          // Get options from the center object in options
        let fontStyle = 'Nunito'
        let txt = 'Total votes'
        let color: string = '#000'
        let sidePadding = 20
        let sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
          // Start with a base font of 40px
        ctx.font = '40px ' + fontStyle

          // tslint:disable-next-line:max-line-length
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
        ctx.restore()
        ctx.fillText(txt, centerX, centerY)
        ctx.fillText(String(votes), voteCenterX, voteCenterY)
      }
    })
  }

  render () {
    const { values } = this.props
    const options: Options = { colorNormal: [], colorHover: [], data: [], labels: [] }
    values.forEach(({ colors: [normalColor = '#00f', hoverColor], label, value }): void => {
      options.colorNormal.push(normalColor)
      options.colorHover.push(hoverColor || normalColor)
      options.data.push(bnToBn(value).toNumber())
      options.labels.push(label)
    })
    const data = {
      labels: options.labels,
      datasets: [{
        data: options.data,
        backgroundColor: options.colorNormal,
        hoverBackgroundColor: options.colorHover
      }]
    }
    return (
        <Wrapper>
          <Doughnut
            data={data}
            width={this.props.width}
            height={this.props.height}
            legend={{ display: false }}
            options={{ maintainAspectRatio: false }}
          />
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
display: inline-block;
padding 1em 1em 0;
`

export default VoteStatus
