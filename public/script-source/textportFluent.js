// Generated by CoffeeScript 1.6.3
var fontFamily, fontSize, globalDims, layout, sceneHook, sceneObject, textDraw;

globalDims = require('./globalDims');

sceneObject = globalDims.sceneObject;

sceneHook = globalDims.sceneHook;

layout = globalDims.layout;

textDraw = require('./textDraw');

fontSize = '36px';

fontFamily = 'Helvetica';

module.exports = function(tokens, fontSizeChange, scroll, mode) {
  var lHeight, paddingX, paddingY, redraw, spaceWidth;
  console.log('fluent textPorting started ' + '(mode ' + mode + ')');
  if (fontSizeChange != null) {
    fontSize = parseFloat(fontSize) + fontSizeChange + 'px';
  }
  if (sceneObject.textPortInnerSVG != null) {
    sceneObject.textPortInnerSVG.element.remove();
  }
  sceneObject.textPortInnerSVG = {};
  sceneObject.textPortInnerSVG.element = sceneHook.svg.append('svg');
  sceneObject.textPortInnerSVG.subElement = sceneObject.textPortInnerSVG.element.append('g').style('text-anchor', 'start').style('fill', 'rgb(255,255,220)').style('font-family', fontFamily).style('font-size', fontSize);
  spaceWidth = textDraw.tokenToViewable('a a', sceneObject.textPortInnerSVG.subElement).width - textDraw.tokenToViewable('aa', sceneObject.textPortInnerSVG.subElement).width;
  spaceWidth *= 1.4;
  lHeight = textDraw.tokenToViewable('l', sceneObject.textPortInnerSVG.subElement).height;
  paddingX = 20;
  paddingY = 18;
  sceneObject.textPortInnerSVG.element.attr('x', parseFloat(sceneObject.textPort.element.attr('x')) + paddingX + 3).attr('width', parseFloat(sceneObject.textPort.element.attr('width') - (paddingX * 2) - 3)).attr('y', parseFloat(sceneObject.textPort.element.attr('y')) + paddingY).attr('height', parseFloat(sceneObject.textPort.element.attr('height') - (paddingY * 2) - 50));
  redraw = function() {
    var token, tokenViewable, viewPortFull, x, y, _i, _len, _results;
    viewPortFull = false;
    x = 0;
    y = 0;
    _results = [];
    for (_i = 0, _len = tokens.length; _i < _len; _i++) {
      token = tokens[_i];
      tokenViewable = textDraw.tokenToViewable(token.text, sceneObject.textPortInnerSVG.subElement);
      switch (token.mark) {
        case 1:
          tokenViewable.svg.style('fill', 'rgb(120,240,240)');
          break;
        case 2:
          tokenViewable.svg.style('fill', 'rgb(100,200,200)');
          break;
      }
      if (x + tokenViewable.width < sceneObject.textPortInnerSVG.element.attr('width')) {
        tokenViewable.svg.attr('x', x);
        tokenViewable.svg.attr('y', y);
        x += tokenViewable.width;
      } else {
        if (y + tokenViewable.height + lHeight < sceneObject.textPortInnerSVG.element.attr('height')) {
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
      if (x + spaceWidth < sceneObject.textPortInnerSVG.element.attr('width')) {
        _results.push(x += spaceWidth);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  return redraw();
};
