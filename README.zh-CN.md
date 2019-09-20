# Speckle 浏览器插件

[![license](https://img.shields.io/github/license/GetSpeckle/speckle-browser-extension)](https://github.com/GetSpeckle/speckle-browser-extension/blob/master/LICENSE)
[![issues](https://img.shields.io/github/issues/GetSpeckle/speckle-browser-extension)](https://github.com/GetSpeckle/speckle-browser-extension/issues)
[![LoC](https://tokei.rs/b1/github/GetSpeckle/speckle-browser-extension)](https://github.com/GetSpeckle/speckle-browser-extension)

[English](README.md)
### 介绍
Web 3和波卡生态的统一浏览器插件 
开发仍在进行中... 请留意我们的更新！


## 开发者需要了解的语言和框架
* [Typescript](https://www.typescriptlang.org/)
* [React](https://reactjs.org/)
* [redux](https://redux.js.org/)
* [styled-components](https://www.styled-components.com/)



## 开发环境和工具要求：
* [NodeJS](https://nodejs.org/en/) - Javascript运行环境
* [VSCode](https://code.visualstudio.com/) - 推荐的集成开发环境
* [Brave](https://brave.com/) or [Chrome](https://www.google.com/chrome/) or [Firefox](https://www.mozilla.org/en-US/firefox/) - 网络浏览器

## 如何运行:
### 在终端或命令行执行如下命令
```
yarn install
yarn run prod 
yarn run watch (以支持代码更新后自动部署)
```
### 假如你在使用Ubuntu操作系统，完整的安装运行过程如下：
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

### 在Brave浏览器中
1. 地址栏输入：[**brave://extensions**](brave://extensions)
2. 启用: "**开发者模式**"
3. 点击: "**载入未打包的插件**"
4. 选中项目目录下的"**dist**"文件夹
5. 一切就绪

### 在Chrome浏览器中
1. 地址栏输入：[**chrome://extensions**](chrome://extensions)
2. 启用: "**开发者模式**"
3. 点击: "**载入未打包的插件**"
4. 选中项目目录下的"**dist**"文件夹
5. 一切就绪

### 在火狐浏览器中
1. 地址栏输入: [**about:debugging**](about:debugging)
2. 勾选: "**启用插件调试**"
3. 点击: "**载入临时插件…**"
4. 从项目目录下打开"**dist**"文件夹, 然后选中"**manifest.json**"文件
5. 一切就绪

## License
Apache License 2.0
