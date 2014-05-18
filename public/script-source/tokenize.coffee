# tokenization from dummy data

module.exports = (textStream) ->
  input = JSON.parse(textStream)
  
  textArray = input.text.split(' ') # array of words

  markeringCodes = input.marks      # markering codes

  tokens = []
  for t in [0..textArray.length-1]
    tokens.push 
      'text': textArray[t],
      'mark': markeringCodes[t]
  
  console.dir tokens
  return tokens
