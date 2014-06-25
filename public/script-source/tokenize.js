// Generated by CoffeeScript 1.6.3
var old;

module.exports = function(text) {
  var t, textArray, token, tokens, _i, _len;
  textArray = text.split(' ');
  tokens = [];
  for (t = _i = 0, _len = textArray.length; _i < _len; t = ++_i) {
    token = textArray[t];
    if (token.charAt(0) === '<' && (token.charAt(1) != null) && token.charAt(1) === '<') {
      tokens.push({
        'text': token.substr(2, token.length - 4),
        'mark': 2
      });
      continue;
    }
    if (token.charAt(0) === '<' && token.charAt(token.length - 1) === '>') {
      tokens.push({
        'text': token.substr(1, token.length - 2),
        'mark': 1
      });
      continue;
    }
    tokens.push({
      'text': token,
      'mark': 0
    });
  }
  return tokens;
};

old = function(text) {
  var t, textArray, tokens, _i, _ref;
  textArray = text.split(' ');
  tokens = [];
  for (t = _i = 0, _ref = textArray.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; t = 0 <= _ref ? ++_i : --_i) {
    /*
    if input.marks?
      tokens.push 
        'text': textArray[t],
        'mark': markeringCodes[t]
    else
    */

    tokens.push({
      'text': textArray[t],
      'mark': 0
    });
  }
  return tokens;
};
