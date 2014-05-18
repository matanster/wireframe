// Generated by CoffeeScript 1.6.3
module.exports = function(textStream) {
  var input, markeringCodes, t, textArray, tokens, _i, _ref;
  input = JSON.parse(textStream);
  textArray = input.text.split(' ');
  markeringCodes = input.marks;
  tokens = [];
  for (t = _i = 0, _ref = textArray.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; t = 0 <= _ref ? ++_i : --_i) {
    tokens.push({
      'text': textArray[t],
      'mark': markeringCodes[t]
    });
  }
  console.dir(tokens);
  return tokens;
};
