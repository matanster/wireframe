// Generated by CoffeeScript 1.6.3
var fontFamily, fontSize, globalDims, layout, sceneHook, sceneObject, session, svgUtil, textDraw;

globalDims = require('./globalDims');

sceneObject = globalDims.sceneObject;

sceneHook = globalDims.sceneHook;

layout = globalDims.layout;

svgUtil = require('./svgUtil');

session = require('./session');

textDraw = require('./textDraw');

fontSize = '18px';

fontFamily = 'Helvetica';

module.exports = function(segments, fontSizeChange, scroll, mode) {
  var enclosing, lHeight, paddingX, paddingY, redraw, spaceWidth;
  console.log('segmented textPorting started ' + '(mode ' + mode + ')');
  if (fontSizeChange != null) {
    fontSize = parseFloat(fontSize) + fontSizeChange + 'px';
  }
  if (sceneObject.textPortInnerSVG != null) {
    sceneObject.textPortInnerSVG.element.remove();
  }
  sceneObject.textPortInnerSVG = {};
  sceneObject.textPortInnerSVG.element = sceneHook.svg.append('svg');
  sceneObject.textPortInnerSVG.subElement = sceneObject.textPortInnerSVG.element.append('g').style('text-anchor', 'start').style('font-family', fontFamily).style('font-size', fontSize);
  spaceWidth = textDraw.tokenToViewable('a a', sceneObject.textPortInnerSVG.subElement).width - textDraw.tokenToViewable('aa', sceneObject.textPortInnerSVG.subElement).width;
  spaceWidth *= 1.4;
  lHeight = textDraw.tokenToViewable('l', sceneObject.textPortInnerSVG.subElement).height;
  paddingX = 20;
  paddingY = 18;
  enclosing = {
    paddingX: 15,
    paddingY: 15
  };
  segments.spacingY = 20;
  sceneObject.textPortInnerSVG.element.attr('x', parseFloat(sceneObject.textPort.element.attr('x')) + paddingX + 3).attr('width', parseFloat(sceneObject.textPort.element.attr('width') - (paddingX * 2) - 3)).attr('y', parseFloat(sceneObject.textPort.element.attr('y')) + paddingY).attr('height', parseFloat(sceneObject.textPort.element.attr('height') - (paddingY * 2) - 50));
  redraw = function() {
    var segment, segmentTokens, textToken, tokenViewable, viewPortFull, x, y, _i, _j, _len, _len1, _ref, _results;
    viewPortFull = false;
    y = enclosing.paddingY;
    _results = [];
    for (_i = 0, _len = segments.length; _i < _len; _i++) {
      segment = segments[_i];
      segment.element = sceneObject.textPortInnerSVG.subElement.append('g').style('text-anchor', 'start').style('fill', '#EEEEEE').style('font-family', fontFamily).style('font-size', fontSize);
      segment.enclosure = {};
      segment.enclosure.element = segment.element.append('rect').style('opacity', 0.9).style('fill', '#87CEFA');
      segmentTokens = [];
      x = enclosing.paddingX;
      segment.enclosure.geometry = {
        'rx': 7,
        'ry': 5,
        'y': y - enclosing.paddingY,
        'x': x - enclosing.paddingX,
        'width': sceneObject.textPortInnerSVG.element.attr('width')
      };
      _ref = segment.tokens;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        textToken = _ref[_j];
        tokenViewable = textDraw.tokenToViewable(textToken.text, segment.element);
        switch (textToken.mark) {
          case 1:
            tokenViewable.svg.style('fill', '#2F4FFF');
            break;
          case 2:
            tokenViewable.svg.style('fill', 'rgb(100,200,200)');
        }
        if (x + tokenViewable.width < sceneObject.textPortInnerSVG.element.attr('width') - enclosing.paddingX) {
          tokenViewable.svg.attr('x', x);
          tokenViewable.svg.attr('y', y);
          x += tokenViewable.width;
        } else {
          if (y + tokenViewable.height + lHeight < sceneObject.textPortInnerSVG.element.attr('height')) {
            x = enclosing.paddingX;
            y += tokenViewable.height;
            tokenViewable.svg.attr('x', x);
            tokenViewable.svg.attr('y', y);
            x += tokenViewable.width;
          } else {
            viewPortFull = true;
            break;
          }
        }
        if (x + spaceWidth < sceneObject.textPortInnerSVG.element.attr('width')) {
          x += spaceWidth;
        }
      }
      y += lHeight + enclosing.paddingY;
      segment.enclosure.geometry.height = y - segment.enclosure.geometry.y;
      svgUtil.sync(segment.enclosure);
      _results.push(y += segments.spacingY);
    }
    return _results;
  };
  return redraw();
};
