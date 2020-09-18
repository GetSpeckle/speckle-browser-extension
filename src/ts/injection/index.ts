import { extension } from 'extensionizer'
import '../../assets/injection.css'

let obAttmpts = 0
const CLASS_TWEET = 'css-1dbjc4n r-16y2uox r-1wbh5a2 r-1ny4l3l r-1udh08x r-1yt7n81 r-ry3cjt'
const CLASS_BTNCONTAINER = 'css-1dbjc4n r-18u37iz r-1wtj0ep r-156q2ks r-1mdbhws'
const CLASS_STREAMLIST = 'css-1dbjc4n.r-1jgb5lz.r-1ye8kvj.r-6337vo.r-13qz1uu'
const maxAttmpt = 100

function modifyTweets () {
  let tweets = document.getElementsByClassName(CLASS_TWEET)
  console.log(tweets)
  for (let i = 0; i < tweets.length; i++) {
    let tweet: any = tweets[i]
    let matches = tweet.innerText.match(/#(\S+)proposal(\d+)/g)
    if (matches !== null) {
      console.log(matches)
      let proposalId: number = parseInt(matches[matches.length - 1].match(/\d+/g)[0], 10)
      let network: string = matches[matches.length - 1].match(/(\w*)proposal/g)[0].replace('proposal', '')
      let userActionButtons = tweet.getElementsByClassName(CLASS_BTNCONTAINER)[0]
      if (userActionButtons !== undefined && !userActionButtons.classList.contains('speckle-button-added')) {
        userActionButtons.classList.add('speckle-button-added')
        const classButtton = 'speckle-button-vote'

        let buttonDiv = document.createElement('div')
        buttonDiv.className = 'css-1dbjc4n r-1niwhzg r-sdzlij r-1p0dtai r-xoduu5 r-1d2f490 r-xf4iuw r-u8s1d r-zchlnj r-ipm5af r-o7ynqc r-6416eg'
        let button = document.createElement('button')
        button.className = classButtton

        button.addEventListener('click', () => {
          extension.sendMessage({
            action: 'createWindow',
            url: extension.getURL('popup.html') + `#/vote/${network}/${proposalId}`
          }, function (createdWindow) {
            console.log(createdWindow)
          })
        })

        buttonDiv.appendChild(button)
        userActionButtons.appendChild(buttonDiv)
      }
    }
  }
}

function addObserver () {
  if (obAttmpts >= maxAttmpt) {
    return
  }

  obAttmpts++

  let observer = new MutationObserver(mutations => {
    mutations.forEach(() => {
      modifyTweets()
    })
  })

  let target: (Node & ParentNode) | null = document.getElementsByClassName(CLASS_STREAMLIST)[0]
  let possibleTweet = document.getElementsByClassName(CLASS_TWEET)[0]

  if (!possibleTweet) {
    window.setTimeout(addObserver, 500)
    return
  }

  let tweetParent1 = possibleTweet.parentNode
  target = tweetParent1!.parentNode

  if (!target) {
    window.setTimeout(addObserver, 500)
    return
  }

  let config = { childList: true }

  observer.observe(target, config)

  window.setTimeout(modifyTweets, 500)
}

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') {
    console.log('twitter getting react tweet')
  } else if (document.readyState === 'complete') {
    console.log('dom content loaded')
    if (document.getElementById('react-root')) {
      addObserver()
      modifyTweets()
    }
  }
}

// Add listener for url change
extension.onMessage.addListener((msg, _sender) => {
  if (msg === 'url-update') {
    setTimeout(modifyTweets, 1000)
    addObserver()
  } else if (msg === 'softreload') {
    console.log('Doing soft reload...')

    obAttmpts = 0

    addObserver()
  }
})
