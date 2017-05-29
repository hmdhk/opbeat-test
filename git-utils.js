var shell = require('shelljs')

function isWorkingDirectoryClean () {
  return shell.exec('git diff-index --quiet HEAD').code === 0
}


module.exports = {
  isWorkingDirectoryClean: isWorkingDirectoryClean
}
