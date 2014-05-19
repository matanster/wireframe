// Generated by CoffeeScript 1.6.3
var fontFamily, fontSize, globalDims, layout, svg, textPortInnerSVG;

globalDims = require('./globalDims');

svg = globalDims.svg;

layout = globalDims.layout;

fontSize = '36px';

fontFamily = 'Helvetica';

textPortInnerSVG = void 0;

module.exports = function(tokens, fontSizeChange, scroll) {
  var lHeight, paddingX, paddingY, spaceWidth, token, tokenToViewable, tokenViewable, viewPortFull, visibleGroup, x, y, _i, _len, _results;
  console.log('textPorting started');
  if (fontSizeChange != null) {
    fontSize = parseFloat(fontSize) + fontSizeChange + 'px';
  }
  if (textPortInnerSVG != null) {
    textPortInnerSVG.remove();
  }
  textPortInnerSVG = svg.main.append('svg').style('text-anchor', 'start').style('fill', 'rgb(255,255,220)').style('font-family', fontFamily).style('font-size', fontSize);
  visibleGroup = textPortInnerSVG.append('g');
  tokenToViewable = function(token) {
    var height, svgText, visualToken, width;
    visualToken = {};
    svgText = visibleGroup.append('text').attr('y', -500).attr('x', -500).style("dominant-baseline", "hanging");
    svgText.text(token);
    width = svgText.node().getBBox().width;
    height = svgText.node().getBBox().height;
    visualToken.svg = svgText;
    visualToken.height = height;
    visualToken.width = width;
    return visualToken;
  };
  spaceWidth = tokenToViewable('a a').width - tokenToViewable('aa').width;
  lHeight = tokenToViewable('l').height;
  paddingX = 10;
  paddingY = 10;
  textPortInnerSVG.attr('x', parseFloat(svg.textPort.attr('x')) + paddingX).attr('width', parseFloat(svg.textPort.attr('width') - (paddingX * 2))).attr('y', parseFloat(svg.textPort.attr('y')) + paddingY).attr('height', parseFloat(svg.textPort.attr('height') - (paddingY * 2) - 50));
  viewPortFull = false;
  x = 0;
  y = 0;
  _results = [];
  for (_i = 0, _len = tokens.length; _i < _len; _i++) {
    token = tokens[_i];
    tokenViewable = tokenToViewable(token.text);
    console.log(token.mark);
    switch (token.mark) {
      case 1:
        tokenViewable.svg.style('fill', 'rgb(120,240,240)');
        break;
      case 2:
        tokenViewable.svg.style('fill', 'rgb(100,200,200)');
        break;
    }
    if (x + tokenViewable.width < textPortInnerSVG.attr('width')) {
      tokenViewable.svg.attr('x', x);
      tokenViewable.svg.attr('y', y);
      x += tokenViewable.width;
    } else {
      if (y + tokenViewable.height + lHeight < textPortInnerSVG.attr('height')) {
        x = 0;
        y += tokenViewable.height;
        tokenViewable.svg.attr('x', x);
        tokenViewable.svg.attr('y', y);
        x += tokenViewable.width;
      } else {
        console.log('text port full');
        viewPortFull = true;
        break;
      }
    }
    if (x + spaceWidth < textPortInnerSVG.attr('width')) {
      _results.push(x += spaceWidth);
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};
