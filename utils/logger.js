// info用于打印正常的日志信息，error用于所有的错误信息。
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}


module.exports = {
  info, error
}