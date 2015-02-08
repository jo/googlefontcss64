#!/usr/bin/node

var googlefontcssmerge = require('googlefontcssmerge')
var googlefontcss64 = require('./')
var css = require('css')
var assert = require('assert')

var url = process.argv[2]
assert(url, 'Usage: googlefontcss64 URL')

googlefontcssmerge(url, function(error, style) {
  if (error) throw(error)

  googlefontcss64(style, function(error, style) {
    if (error) throw(error)

    console.log(css.stringify(style))
  })
})
