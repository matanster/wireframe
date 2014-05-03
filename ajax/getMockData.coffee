fs = require 'fs'

exports.get = (req, res) ->
  
  if req.query.data?
    path = './mock-data'
    jsonFile = req.query.data

    try
      text = fs.readFileSync(path + '/' + jsonFile + '.json').toString()
    catch err
      if err.code is 'ENOENT'
        res.send(404)
        throw 'could not fetch data for ' + req.query.data
      else
        throw e;

    json      = JSON.parse(text)
    finalText = json.text
    
    res.end(finalText)

  else 
    console.log 'unidentified query'
    res.send(400)