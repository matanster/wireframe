# tokenization from dummy data

module.exports = (textStream) ->
  return JSON.parse(textStream).text.split(' ') # naive parsing for now