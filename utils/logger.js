// info用于打印正常的日志信息，error用于所有的错误信息。
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}


module.exports = {
  info, error
}