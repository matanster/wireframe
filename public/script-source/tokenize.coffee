# tokenization from dummy data

module.exports = (text) ->
  #input = JSON.parse(textStream)
  
  textArray = text.split(' ') # array of words

  #if input.marks?
  #  markeringCodes = input.marks      # markering codes

  tokens = []
  for t in [0..textArray.length-1]
    ###
    if input.marks?
      tokens.push 
        'text': textArray[t],
        'mark': markeringCodes[t]
    else
    ###
    tokens.push 
      'text': textArray[t],
      'mark': 0
    
  console.dir tokens
  return tokens
