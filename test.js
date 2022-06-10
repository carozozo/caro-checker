global.assert = require('assert')
global._ = require('lodash')
global.cc = require('./main')

const fs = require('fs')
const path = require('path')

// 讀取資料夾中的檔案
const readDir = (fileOrDir, cb, {maxLevel = 0, _levelCount = 0} = {}) => {
  fileOrDir = path.relative(`./`, fileOrDir)
  if (!fs.existsSync(fileOrDir)) return

  const stat = fs.statSync(fileOrDir)
  if (stat.isFile() && fileOrDir.endsWith(`.js`)) {
    cb(fileOrDir)
  }
  if (stat.isDirectory()) {
    if (maxLevel > 0 && ++_levelCount > maxLevel) return
    const fileArr = fs.readdirSync(fileOrDir)
    for (const file of fileArr) {
      const filePath = path.join(fileOrDir, file)
      readDir(filePath, cb, {maxLevel, _levelCount})
    }
  }
}

readDir('./test', (file) => {
  require(`./${file}`)
})
