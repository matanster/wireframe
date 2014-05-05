// Generated by CoffeeScript 1.6.3
var calcEnd, calcStart, data, sceneDefine, sceneSync, svg, syncInit, util, viewport;

util = require('./util');

data = require('./data');

console.log('connect.js started');

svg = {};

viewport = null;

calcStart = function() {
  return 90;
};

calcEnd = function() {
  return 90;
};

sceneDefine = function(callback) {
  var images, main, text;
  main = function() {
    return svg.main = d3.select('body').append('svg').style('background-color', '#222288');
  };
  images = function() {
    var element, _i, _len, _ref, _results;
    svg.upload = svg.main.append("svg:image").attr("xlink:href", "images/upload.svg");
    svg.link = svg.main.append("svg:image").attr("xlink:href", "images/link.svg");
    svg.dropbox = svg.main.append("svg:image").attr("xlink:href", "images/dropbox.svg");
    _ref = [svg.upload, svg.link, svg.dropbox];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      element = _ref[_i];
      _results.push(element.on('mouseover', function() {
        console.log('hover');
        return this.style.cursor = "pointer";
      }).on('mouseout', function() {
        console.log('end hover');
        return this.style.cursor = "default";
      }).on('mousedown', function() {
        console.log('click');
        this.style.cursor = "progress";
        return setTimeout((function() {
          return window.location.href = '/read.html';
        }), 50);
      }));
    }
    return _results;
  };
  text = function() {
    return svg.text = svg.main.append('text').text("let us know where's the article").style("text-anchor", "middle").attr("dominant-baseline", "central").style("font-family", "Helvetica").style("font-weight", "bold").attr("font-size", "35px");
  };
  main();
  text();
  images();
  return callback();
};

sceneSync = function() {
  var diameter, end, heightQuantum, start, widthQuantum;
  viewport = util.getViewport();
  console.dir(viewport);
  console.log('starting scene sync');
  start = calcStart();
  end = 0;
  svg.main.attr('width', viewport.width).attr('height', viewport.height);
  widthQuantum = viewport.width / 10;
  diameter = widthQuantum * 2;
  heightQuantum = viewport.height / 6;
  svg.upload.attr('width', diameter).attr('height', diameter).attr('x', widthQuantum * 1).attr('y', heightQuantum * 2).style('opacity', 0.01);
  svg.link.attr('width', diameter).attr('height', diameter).attr('x', widthQuantum * 4).attr('y', heightQuantum * 3).style('opacity', 0.01);
  svg.dropbox.attr('width', diameter).attr('height', diameter).attr('x', widthQuantum * 7).attr('y', heightQuantum * 2).style('opacity', 0.01);
  svg.text.attr('x', viewport.width / 2).attr('y', heightQuantum * 1.5).style('fill', '#EEEEEE').style('opacity', 1);
  svg.upload.transition().style('opacity', 1).duration(1000).delay(600);
  svg.link.transition().style('opacity', 1).duration(1000).delay(1400);
  svg.dropbox.transition().style('opacity', 1).duration(1000).delay(2000);
};

syncInit = function() {
  sceneSync();
  return window.onresize = function() {
    return sceneSync();
  };
};

sceneDefine(syncInit);
