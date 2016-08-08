# e2e tests

I'm using [NigthWatch](http://nightwatchjs.org/)

If you want to go deep and read tutorial about setting up nightwatch - read this article: [End to End testing of React apps with Nightwatch](https://www.syncano.io/blog/testing-syncano/)

Nightwatch is using java, therefore you need to check that JDK is installed on your machine.

In short what I'm doing is this:

1. install `nightwatch`

  ```
  npm i --save-dev nightwatch
  ```

2. Get last selenium driver

  ```
  npm i --save-dev selenium-standalone
  ```

3. Get last chromedrive

  ```
  node_modules/selenium-standalone/bin/selenium-standalone install
  ```

4. Add basic configuration `nightwatch.js`

5. Add `nightwatch.conf.js` so we'll be able to use ES6
