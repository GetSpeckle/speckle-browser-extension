# Speckle browser extension

[![license](https://img.shields.io/github/license/GetSpeckle/speckle-browser-extension)](https://github.com/GetSpeckle/speckle-browser-extension/blob/master/LICENSE)
[![issues](https://img.shields.io/github/issues/GetSpeckle/speckle-browser-extension)](https://github.com/GetSpeckle/speckle-browser-extension/issues)
[![LoC](https://tokei.rs/b1/github/GetSpeckle/speckle-browser-extension)](https://github.com/GetSpeckle/speckle-browser-extension)

[中文](README.zh-CN.md)
### Introduction
Universal browser extension for Web 3 and the Polkadot ecosystem. 
Development is still work in progress. Stay Tuned!


## Good to know before developing:
* [Typescript](https://www.typescriptlang.org/)
* [React](https://reactjs.org/)
* [redux](https://redux.js.org/)
* [styled-components](https://www.styled-components.com/)



## Requirements:
* [NodeJS](https://nodejs.org/en/) - Javascript runtime
* [VSCode](https://code.visualstudio.com/) - Recommended editor
* [Brave](https://brave.com/) or [Chrome](https://www.google.com/chrome/) or [Firefox](https://www.mozilla.org/en-US/firefox/) - Web browser

## How to run:
### In terminal or command prompt
```
yarn install
yarn run prod 
yarn run watch (to watch code changes)
```
### If you're using Ubuntu
```
sudo apt install curl
sudo apt install git
git clone https://github.com/SpeckleOS/speckle-browser-extension.git
curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt-get install nodejs
sudo npm install -g yarn
cd speckle-browser-extension/
yarn install
yarn run prod
```

### In Brave web browser
1. Go to: [**brave://extensions**](brave://extensions)
2. Toggle: "**developer mode**" on.
3. Click on: "**Load unpacked**"
4. Select the newly created folder "**dist**" from the project folder.
5. That's it.

### In Chrome web browser
1. Go to: [**chrome://extensions**](chrome://extensions)
2. Toggle: "**developer mode**" on.
3. Click on: "**Load unpacked**"
4. Select the newly created folder "**dist**" from the project folder.
5. That's it.

### In Firefox web browser
1. Go to: [**about:debugging**](about:debugging)
2. Select: "**Enable add-on debugging**"
3. Click on: "**Load Temporary Add-on…**"
4. Open the newly created folder "**dist**" from the project folder, and choose the "**manifest.json**" file.
5. That's it.

## License
Apache License 2.0
