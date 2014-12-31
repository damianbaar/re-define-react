var transform = require('react-tools').transform
  , jstransform = require('jstransform')
  , visitors = require('react-tools/vendor/fbtransform/visitors')
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
        var d = file.contents.toString()

        if(extensions.indexOf(file.ext) > -1) {
          var fromJSX = transform(d, {})
          d = fromJSX
        }

        if(globalConfig.es6 || config.es6) {
          var fromES6 = jstransform.transform(visitors.getAllVisitors(), d)
          d = fromES6.code
        }

        file.contents = new Buffer(d)
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
