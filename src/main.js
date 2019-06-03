// import "@babel/polyfill";
// import clickHandler from './clickHandler'
// import { fn_a } from './fns'

// fn_a()

// window.document.body.addEventListener('click', () => {
//   clickHandler()
// })

// https://webpack.js.org/api/module-methods/#magic-comments
// https://webpack.js.org/guides/code-splitting/#prefetching-preloading-modules


// window.document.body.addEventListener('click', () => {
//   import(/* webpackPrefetch: true */'./clickHandler.js')
//     .then(({ default: func }) => func())
//     .catch(err => console.warn('err', err))
// })

// code with async
window.document.body.addEventListener('click', async () => {
  const res = await import(/* webpackPrefetch: true */'./clickHandler.js')
  if (res) {
    res.default()
  }
})
