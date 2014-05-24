// Generated by CoffeeScript 1.6.3
var fontFamily, fontSize, globalDims, layout, svg, svgUtil, textDraw;

globalDims = require('./globalDims');

svg = globalDims.svg;

layout = globalDims.layout;

svgUtil = require('./svgUtil');

textDraw = require('./textDraw');

fontSize = '18px';

fontFamily = 'Helvetica';

module.exports = function(segments, fontSizeChange, scroll, mode) {
  var enclosing, lHeight, paddingX, paddingY, redraw, spaceWidth;
  console.log('textPorting abstract started ' + '(mode ' + mode + ')');
  if (fontSizeChange != null) {
    fontSize = parseFloat(fontSize) + fontSizeChange + 'px';
  }
  if (svg.textPortInnerSVG != null) {
    svg.textPortInnerSVG.element.remove();
  }
  svg.textPortInnerSVG = {};
  svg.textPortInnerSVG.element = svg.main.append('svg');
  svg.textPortInnerSVG.subElement = svg.textPortInnerSVG.element.append('g').style('text-anchor', 'start').style('font-family', fontFamily).style('font-size', fontSize);
  spaceWidth = textDraw.tokenToViewable('a a', svg.textPortInnerSVG.subElement).width - textDraw.tokenToViewable('aa', svg.textPortInnerSVG.subElement).width;
  spaceWidth *= 1.4;
  lHeight = textDraw.tokenToViewable('l', svg.textPortInnerSVG.subElement).height;
  paddingX = 20;
  paddingY = 18;
  enclosing = {
    paddingX: 15,
    paddingY: 15
  };
  segments.spacingY = 20;
  svg.textPortInnerSVG.element.attr('x', parseFloat(svg.textPort.element.attr('x')) + paddingX + 3).attr('width', parseFloat(svg.textPort.element.attr('width') - (paddingX * 2) - 3)).attr('y', parseFloat(svg.textPort.element.attr('y')) + paddingY).attr('height', parseFloat(svg.textPort.element.attr('height') - (paddingY * 2) - 50));
  redraw = function() {
    var segment, segmentTokens, textToken, tokenViewable, viewPortFull, x, y, _i, _j, _len, _len1, _ref, _results;
    viewPortFull = false;
    y = enclosing.paddingY;
    _results = [];
    for (_i = 0, _len = segments.length; _i < _len; _i++) {
      segment = segments[_i];
      segment.element = svg.textPortInnerSVG.subElement.append('g').style('text-anchor', 'start').style('fill', '#DDDDDD').style('font-family', fontFamily).style('font-size', fontSize);
      segment.enclosure = {};
      segment.enclosure.element = segment.element.append('rect').style('opacity', 1).style('fill', '#888888');
      segmentTokens = [];
      x = enclosing.paddingX;
      segment.enclosure.geometry = {
        'rx': 7,
        'ry': 5,
        'y': y - enclosing.paddingY,
        'x': x - enclosing.paddingX,
        'width': svg.textPortInnerSVG.element.attr('width')
      };
      _ref = segment.tokens;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        textToken = _ref[_j];
        console.log(textToken);
        tokenViewable = textDraw.tokenToViewable(textToken, segment.element);
        if (x + tokenViewable.width < svg.textPortInnerSVG.element.attr('width') - enclosing.paddingX) {
          console.log('adding to line');
          tokenViewable.svg.attr('x', x);
          tokenViewable.svg.attr('y', y);
          x += tokenViewable.width;
          console.log(svg.textPortInnerSVG.element.attr('width') + ' ' + x);
        } else {
          if (y + tokenViewable.height + lHeight < svg.textPortInnerSVG.element.attr('height')) {
            console.log('adding to new line');
            x = enclosing.paddingX;
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
          x += spaceWidth;
        }
      }
      console.log(y);
      y += lHeight + enclosing.paddingY;
      segment.enclosure.geometry.height = y - segment.enclosure.geometry.y;
      svgUtil.sync(segment.enclosure);
      _results.push(y += segments.spacingY);
    }
    return _results;
  };
  return redraw();
};
