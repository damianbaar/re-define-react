var transform = require('react-tools').transform
  , through = require('through2')
  , format = require('util').format

module.exports = function(config) {
  return function(globalConfig, writer) {
    return through.obj(function(file, enc, next){
      if(file.isNull() || file.stopProcessing || file.isAST()) {
        this.push(file)
        next()
        return
      }

      var extensions = config.extensions || ['.js', '.jsx']

      try {
        if(extensions.indexOf(file.ext) > -1)
          file.contents = new Buffer(transform(file.contents.toString(), {}))
      } catch (e) { 
        var err = format( 'Unable to parse, path: %s, requiredAs: %s, error: %o'
                        , file.path, file.requiredAs, e)

        throw new Error(err)
      }

      this.push(file)
      next()
    })
  }
}
