// Generated by CoffeeScript 1.6.3
var fontFamily, fontSize, globalDims, layout, sceneHook, sceneObject, session, textDraw, tokenize;

globalDims = require('./globalDims');

sceneObject = globalDims.sceneObject;

sceneHook = globalDims.sceneHook;

layout = globalDims.layout;

session = require('./session');

tokenize = require('./tokenize');

textDraw = require('./textDraw');

fontSize = '22px';

fontFamily = 'Helvetica';

module.exports = function(categorizedTextTree, fontSizeChange, scroll, mode) {
  var lHeight, paddingX, paddingY, redraw, spaceWidth;
  if (scroll != null) {
    console.log(scroll);
    sceneObject.textPortInnerSVG.element.transition().ease('sin').duration(2000).attr('y', 0);
    return;
  }
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
    var categoryNode, rawSentence, sentence, sentences, subCategory, token, tokenViewable, viewPortFull, x, y, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2;
    viewPortFull = false;
    x = 0;
    y = 0;
    for (_i = 0, _len = categorizedTextTree.length; _i < _len; _i++) {
      categoryNode = categorizedTextTree[_i];
      if (categoryNode.name === session.selected.name) {
        console.log("categroy " + session.selected.name + " found");
        _ref = categoryNode.subs;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          subCategory = _ref[_j];
          if (y !== 0) {
            y += 30;
          }
          tokenViewable = textDraw.tokenToViewable(subCategory.name, sceneObject.textPortInnerSVG.subElement);
          tokenViewable.svg.attr('x', sceneObject.textPortInnerSVG.element.attr('width') / 2).attr('y', y).style("text-anchor", "middle").attr("dominant-baseline", "central").style("font-family", "Helvetica").style("font-weight", "bold").attr("font-size", "30px").style('fill', '#aaaaaa');
          y += 40;
          sentences = [];
          _ref1 = subCategory.text;
          for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
            rawSentence = _ref1[_k];
            sentence = {
              text: tokenize(rawSentence)
            };
            sentences.push(sentence);
          }
          console.log("subcategory " + subCategory.name + " being handled");
          for (_l = 0, _len3 = sentences.length; _l < _len3; _l++) {
            sentence = sentences[_l];
            _ref2 = sentence.text;
            for (_m = 0, _len4 = _ref2.length; _m < _len4; _m++) {
              token = _ref2[_m];
              console.log(token.text);
              tokenViewable = textDraw.tokenToViewable(token.text, sceneObject.textPortInnerSVG.subElement);
              switch (token.mark) {
                case 1:
                  tokenViewable.svg.style('fill', '#4488FE');
                  break;
                case 2:
                  tokenViewable.svg.style('fill', '#4488FE').style('font-style', 'italic');
              }
              if (x + tokenViewable.width < sceneObject.textPortInnerSVG.element.attr('width')) {
                tokenViewable.svg.attr('x', x).attr('y', y);
                x += tokenViewable.width;
              } else {
                if (y + tokenViewable.height + lHeight < sceneObject.textPortInnerSVG.element.attr('height')) {
                  x = 0;
                  y += tokenViewable.height;
                  tokenViewable.svg.attr('x', x).attr('y', y);
                  x += tokenViewable.width;
                } else {
                  console.log('text port full');
                  viewPortFull = true;
                  break;
                }
              }
              if (x + spaceWidth < sceneObject.textPortInnerSVG.element.attr('width')) {
                x += spaceWidth;
              }
            }
            y += tokenViewable.height * 2;
            x = 0;
          }
        }
      }
    }
    return viewPortFull;
  };
  return redraw();
};
