# tokenization from dummy data

module.exports = (text) ->
  #input = JSON.parse(textStream)
  
  textArray = text.split(' ') # array of words

  #if input.marks?
  #  markeringCodes = input.marks      # markering codes

  tokens = []
  for token, t in textArray
    if token.charAt(0) is '<' and token.charAt(token.length-1) is '>'
      tokens.push 
        'text': token.substr(1, token.length-2)
        'mark': 1
      console.log 'highlighting word/s: ' + token.text        
    else  
      tokens.push 
        'text': token,
        'mark': 0
    
  console.dir tokens
  return tokens




old = (text) ->
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
