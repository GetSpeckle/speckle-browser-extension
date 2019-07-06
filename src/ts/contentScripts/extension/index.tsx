import * as React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Store } from 'react-chrome-redux'
import SpeckleApp from './containers/SpeckleApp'
import '../../../assets/app.css'

const store = new Store({
  // Communication port between the background component and views such as browser tabs.
  portName: 'ExPort'
})

store.ready().then(() => {
  // Modify twitter timeline and add anchor
  modifyTweets()
}).then(() => {
  console.log(document.getElementById('speckle-root'))
  ReactDOM.render(
    <Provider store={store}>
      <SpeckleApp />
    </Provider>,
    document.getElementById('speckle-root'))
})

function modifyTweets () {

  // Add buttons in the twiwtter actions
  const tweets: HTMLCollection | undefined = document.getElementsByClassName('tweet')
  if (tweets) {
    for (let tweet of tweets) {
      let username = tweet.getAttribute('data-screen-name')!
      let userIdTwitter = tweet.getAttribute('data-user-id')!
      let tweetId = tweet.getAttribute('data-tweet-id')!
      if (typeof username !== 'undefined') {
        let containerButtons = tweet.getElementsByClassName('js-actions')[0]
        if (!containerButtons.classList.contains('speckle-button-added')) {
          // Add Speckle
          containerButtons.classList.add('speckle-button-added')
          const classButton = 'speckle-button-vote ProfileTweet-actionButton'

          // Add custom class to reply button, so we can trigger it afterwards
          containerButtons
            .getElementsByClassName('js-actionReply')[0]
            .classList.add(`speckle-reply-button-${username}-${tweetId}`)

          // Add Speckle button
          let buttonDiv = document.createElement('div')
          buttonDiv.className = 'ProfileTweet-action ProfileTweet-action--speckle SpeckleButton'
          let dataUsername = document.createAttribute('data-username')
          dataUsername.value = `${encodeURI(username)}`
          let dataUserIdTwitter = document.createAttribute('data-user-id-twitter')
          dataUserIdTwitter.value = `${userIdTwitter}`
          let dataTweet = document.createAttribute('data-tweet')
          dataTweet.value = `${encodeURI(tweetId)}`
          let button = document.createElement('button')
          button.className = classButton
          button.setAttributeNode(dataUsername)
          button.setAttributeNode(dataUserIdTwitter)
          button.setAttributeNode(dataTweet)

          // Make Anchor for react
          let anchor = document.createElement('div')
          anchor.id = 'speckle-root'

          buttonDiv.appendChild(button)
          buttonDiv.append(anchor)
          containerButtons.appendChild(buttonDiv)
        }
      }
    }
  }
}
