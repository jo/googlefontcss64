var css = require('css')
var request = require('request')
var async = require('async')


function inlineFont(resource, done) {
  if (resource.match(/^local/)) return done(null, resource)

  var url = resource.match(/url\(([^\)]+)\)/)
  url = url && url[1]
  
  var type = resource.match(/format\('([^\)]+)'\)/)
  type = type && type[1]
  type = type || 'eot'

  request({
    url: url,
    encoding: null
  }, function(err, response) {
    if (err) return done(err)

    var res = 'url("data:' + type + ';base64,' + response.body.toString('base64') + '")'
    
    if (type !== 'eot') {
      res += " format('" + type + "')"
    }

    done(null, res)
  })
}


module.exports = function(style, done) {
  async.each(style.stylesheet.rules, function(rule, next) {
    var declaration = rule
      .declarations
      .filter(function(declaration) { return declaration.property === 'src' })[0]

    var values = declaration.value.split(/,\s*/)
            
    async.map(values, inlineFont, function(error, values) {
      if (error) return next(error)

      declaration.value = values.join(', ')
      next()
    })
  }, function(error) {
    if (error) return done(error)

    done(null, style)
  })
}
