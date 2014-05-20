// Generated by CoffeeScript 1.6.3
var fontFamily, fontSize, globalDims, layout, svg, textDraw;

globalDims = require('./globalDims');

svg = globalDims.svg;

layout = globalDims.layout;

textDraw = require('./textDraw');

fontSize = '36px';

fontFamily = 'Helvetica';

module.exports = function(tokens, fontSizeChange, scroll, mode) {
  var lHeight, paddingX, paddingY, redraw, spaceWidth;
  console.log('textPorting started ' + '(mode ' + mode + ')');
  if (fontSizeChange != null) {
    fontSize = parseFloat(fontSize) + fontSizeChange + 'px';
  }
  if (svg.textPortInnerSVG != null) {
    svg.textPortInnerSVG.element.remove();
  }
  svg.textPortInnerSVG = {};
  svg.textPortInnerSVG.element = svg.main.append('svg');
  svg.textPortInnerSVG.subElement = svg.textPortInnerSVG.element.append('g').style('text-anchor', 'start').style('fill', 'rgb(255,255,220)').style('font-family', fontFamily).style('font-size', fontSize);
  spaceWidth = textDraw.tokenToViewable('a a', svg.textPortInnerSVG.subElement).width - textDraw.tokenToViewable('aa', svg.textPortInnerSVG.subElement).width;
  lHeight = textDraw.tokenToViewable('l', svg.textPortInnerSVG.subElement).height;
  paddingX = 10;
  paddingY = 10;
  console.log(svg.textPort.element.attr('width') - (paddingX * 2));
  svg.textPortInnerSVG.element.attr('x', parseFloat(svg.textPort.element.attr('x')) + paddingX).attr('width', parseFloat(svg.textPort.element.attr('width') - (paddingX * 2))).attr('y', parseFloat(svg.textPort.element.attr('y')) + paddingY).attr('height', parseFloat(svg.textPort.element.attr('height') - (paddingY * 2) - 50));
  redraw = function() {
    var token, tokenViewable, viewPortFull, x, y, _i, _len, _results;
    viewPortFull = false;
    x = 0;
    y = 0;
    _results = [];
    for (_i = 0, _len = tokens.length; _i < _len; _i++) {
      token = tokens[_i];
      tokenViewable = textDraw.tokenToViewable(token.text, svg.textPortInnerSVG.subElement);
      switch (token.mark) {
        case 1:
          tokenViewable.svg.style('fill', 'rgb(120,240,240)');
          break;
        case 2:
          tokenViewable.svg.style('fill', 'rgb(100,200,200)');
          break;
      }
      if (x + tokenViewable.width < svg.textPortInnerSVG.element.attr('width')) {
        tokenViewable.svg.attr('x', x);
        tokenViewable.svg.attr('y', y);
        x += tokenViewable.width;
      } else {
        if (y + tokenViewable.height + lHeight < svg.textPortInnerSVG.element.attr('height')) {
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
      if (x + spaceWidth < svg.textPortInnerSVG.element.attr('width')) {
        _results.push(x += spaceWidth);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  return redraw();
};
