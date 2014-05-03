exports.go = (url, postData, callback) ->  
  ajaxRequest = new XMLHttpRequest()
  console.log 'Making ajax call to ' + url

  ajaxRequest.onreadystatechange = () ->
    if ajaxRequest.readyState is 4
      if ajaxRequest.status is 200
        console.log 'Ajax call to ' + url + ' succeeded.'
        callback(ajaxRequest.responseText)
      else
        console.error 'Ajax call to ' + url + ' failed'

  if postData?  # http post request
    console.log('ajax request includes post data')
    ajaxRequest.open('POST', url, false) # synchronous as we'd rather block the user while saving is in progress
    ajaxRequest.setRequestHeader("Content-type","application/json");
    ajaxRequest.send(postData)
  else          # http get request
    ajaxRequest.open('GET', url, true)
    ajaxRequest.send(null)
