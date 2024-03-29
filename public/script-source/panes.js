// Generated by CoffeeScript 1.6.3
var getPaneID, paneCounter;

paneCounter = 0;

getPaneID = function() {
  paneCounter += 1;
  return paneCounter;
};

exports.titlePaneCreate = function(svgAnchor, initialColor, rotated) {
  var paneObject, textWrapperId;
  paneObject = {};
  paneObject.element = svgAnchor.append('g');
  paneObject.pane = paneObject.element.append('rect').style('fill', initialColor);
  if (rotated) {
    textWrapperId = "panetextWrapper" + getPaneID();
    paneObject.element.append('foreignObject').append('xhtml:body').style({
      "margin": "5px"
    }).html("<svg id=" + textWrapperId + " style='-webkit-transform: perspective(40px) rotate3d(1, 0, 0, 2deg)'></svg>").style('pointer-events', 'none');
    paneObject.textWrapper = d3.select('#' + textWrapperId);
    paneObject.text = paneObject.textWrapper.append('text').attr("dominant-baseline", "central").style("text-anchor", "middle").style('fill', "#EEEEEE");
  } else {
    paneObject.text = paneObject.element.append('text').attr("dominant-baseline", "central").style("text-anchor", "middle").style('fill', "#EEEEEE").style('pointer-events', 'none');
  }
  return paneObject;
};
