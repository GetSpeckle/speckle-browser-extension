import { extension } from 'extensionizer'

export const modifyTweets = () => {
  // Add listener for url change
  extension.onMessage.addListener((msg, _sender, _sendResponse) => {
    if (msg === 'url-update') {
      modifyTweets()
    }
  })
  const tweets: HTMLCollection | undefined = document.getElementsByClassName('tweet')
  if (tweets) {
    for (let tweet of tweets) {
      let tweetText: HTMLElement | null = tweet.getElementsByClassName('tweet-text')[0].querySelector('.twitter-hashtag')
      if (tweetText && tweetText.innerText.search('#speckleproposal') !== -1) {
        // Find proposal Id
        // let proposalId: number = parseInt(tweetText.innerText.replace('#speckleproposal', ''), 10)
        // Inject UI
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

            button.addEventListener('click', () => {
              console.log(extension.getURL('popup.html') + '#/democracy')
              extension.sendMessage({
                action: 'createWindow',
                url: extension.getURL('popup.html')
              }, function (createdWindow) {
                console.log(createdWindow)
              })
            })

            buttonDiv.appendChild(button)
            containerButtons.appendChild(buttonDiv)
          }
        }
      }
    }
  }
}
