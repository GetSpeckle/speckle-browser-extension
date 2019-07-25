import { extension } from 'extensionizer'

export const modifyTweets = () => {
  // Add listener for url change
  extension.onMessage.addListener((msg, _sender, _sendResponse) => {
    if (msg === 'url-update') {
      modifyTweets()
    }
  })
  const tweets = document.querySelectorAll(`[data-testid='tweet']`);
  let header = document.createElement('h1')
  header.innerText = 'fuck'
  tweets[0].appendChild(header)
  for (let tweet of tweets!) {
    console.log(tweet!)
    let buttonDiv = document.createElement('div')
    buttonDiv.className = 'ProfileTweet-action ProfileTweet-action--speckle SpeckleButton'
    let button = document.createElement('button')

    buttonDiv.appendChild(button)
    //containerButtons.appendChild(buttonDiv)
  }
  // Add Speckle button

}

