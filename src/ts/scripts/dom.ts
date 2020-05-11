import { browser } from 'webextension-polyfill-ts'

export const createPageScript = () => {
  // inject our data injector
  const script = document.createElement('script')

  script.src = browser.extension.getURL('speckle.js')
  script.onload = (): void => {
    // remove the injecting tag when loaded
    if (script.parentNode) {
      script.parentNode.removeChild(script)
    }
  }

  (document.head || document.documentElement).appendChild(script)
}
