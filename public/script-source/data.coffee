ajax = require('./myAjax')

exports.get = (data, callback) ->

  # TODO:
  # 1. Report time breakdown back to server, or queue for next reporting tick
  # 2. Use same time logging utility function as server side

  ajaxTarget = location.protocol + '//' + location.hostname
  ajaxVerb   = 'getData'
  ajaxRequest = ajaxTarget + '/' + ajaxVerb + '?' + 'data=' + data

  ajax.go(ajaxRequest, null, (response) ->  
    callback(response))
