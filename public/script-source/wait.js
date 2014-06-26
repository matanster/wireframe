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
    svg.text0 = svg.main.append('text').text("Well done!").style("text-anchor", "middle").attr("dominant-baseline", "central").style("font-family", "Helvetica").style("font-weight", "bold").attr("font-size", "55px").style('font-style', 'italic');
    svg.text1 = svg.main.append('text').text("please wait while we're").style("text-anchor", "middle").attr("dominant-baseline", "central").style("font-family", "Helvetica").style("font-weight", "bold").attr("font-size", "35px");
    svg.text2 = svg.main.append('text').text("re-packing and preparing your article for you").style("text-anchor", "middle").attr("dominant-baseline", "central").style("font-family", "Helvetica").style("font-weight", "bold").attr("font-size", "35px");
    return svg.text3 = svg.main.append('text').text("so that you can efficiently dig through").style("text-anchor", "middle").attr("dominant-baseline", "central").style("font-family", "Helvetica").style("font-weight", "bold").attr("font-size", "25px");
  };
  main();
  text();
  images();
  return callback();
};

sceneSync = function() {
  var diameter, element, end, heightQuantum, start, widthQuantum, _i, _len, _ref;
  viewport = util.getViewport();
  console.dir(viewport);
  console.log('starting scene sync');
  start = calcStart();
  end = 0;
  svg.main.attr('width', viewport.width).attr('height', viewport.height);
  widthQuantum = viewport.width / 10;
  diameter = widthQuantum * 2;
  heightQuantum = viewport.height / 6;
  svg.text0.attr('x', viewport.width / 2).attr('y', heightQuantum * 2).style('fill', '#40bff1').style('opacity', 1);
  svg.text1.attr('x', viewport.width / 2).attr('y', heightQuantum * 3).style('fill', '#40bff1').style('opacity', 1);
  svg.text2.attr('x', viewport.width / 2).attr('y', heightQuantum * 3.4).style('fill', '#40bff1').style('opacity', 1);
  svg.text3.attr('x', viewport.width / 2).attr('y', heightQuantum * 4).style('fill', '#EEEEEE').style('opacity', 1);
  _ref = [svg.text0, svg.text1, svg.text2, svg.text3];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    element = _ref[_i];
    element.on('mousedown', function() {
      console.log('click');
      this.style.cursor = "progress";
      return setTimeout((function() {
        return window.location.href = '/read.html';
      }), 50);
    });
  }
};

syncInit = function() {
  sceneSync();
  return window.onresize = function() {
    return sceneSync();
  };
};

sceneDefine(syncInit);
