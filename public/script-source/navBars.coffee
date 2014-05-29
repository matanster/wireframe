util        = require './util'
#data        = require './data'
#tokenize    = require './tokenize'
#textporting = require './textporting'
#textportingAbstract = require './textportingAbstract'
#textDraw    = require './textDraw'
svgUtil     = require './svgUtil'

# Global geometry 
globalDims  = require './globalDims'
sceneObject = globalDims.sceneObject
layout      = globalDims.layout

# create a text filled rectangle
textRectFactory = (svgHookPoint, rectText) -> # sceneObject.main
  group = svgHookPoint.append('g')
                        .style('-webkit-user-select', 'none')      # avoid standard text handling of the category texts (selection, touch callouts)
                        .style('-webkit-touch-callout', 'none')    # avoid standard text handling of the category texts (selection, touch callouts) 
                        .style('user-select', 'none') # future compatibility

  rectangle = group.append('rect')
                       .style('fill', colorScale(box))   
                       .style('stroke-width', '0px')
                       .style('fill-opacity', '1')

  text = group.append('text').text(rectText)
                                   .style("text-anchor", "middle")
                                   .attr("dominant-baseline", "central")
                                   .style("font-family", "verdana")
                                   .style("font-weight", "bold")
                                   .style('fill', '#EEEEEE')                                                                                                               

  
  sceneObject = { group, rectangle, text}
  return sceneObject

barInit = (bar, svgHookPoint, barName) -> 
  bar.element = textRectFactory(barName)

exports.init = (navBarsData, svgHookPoint) ->

  console.log 'navBars init started'
  
  for bar in navBarsData
    console.log bar
    

something = () ->
  numberOfBoxes = categories.length
  colorScale = d3.scale.linear().domain([0, numberOfBoxes-1]).range(['#87CEFA', '#00BFFF'])
  #colorScale = d3.scale.linear().domain([0, numberOfBoxes-1]).range(['#CCCCE0','#AAAABE']) # ['#CCCCE0','#AAAABE']
  colorTransition = (i) -> (() -> d3.select(this).transition().duration(25).ease('circle').style('fill', colorScale(i)))

#
# Draw elements to fit vertical segment, equal height to each
# this will probably go away
#
panes = (groupY, groupH, borderX, elements) ->

  #boxH = (totalH / 2) / (sceneObject.categories.length - 1)
  boxH = (groupH) / (elements.length)

  for i in [0..elements.length-1]

    elements[i].x1 = 0
    elements[i].x2 = borderX
    ###
    if i is 0
      elements[i].y1 = layout.separator.top.y - 0.5
      elements[i].y2 = layout.separator.top.y + (groupH/2) + 0.5
    else ###
    elements[i].y1 = groupY + Math.floor(boxH * (i)) - 0.5
    elements[i].y2 = groupY + Math.floor((boxH * (i+1))) + 0.5    

    #if i is elements.length-1 # occupy last pixel
    #  elements[i].y2 = layout.separator.top.y + groupH + 0.5    
    #else # leave last pixel to next box
    #  elements[i].y2 = layout.separator.top.y + Math.floor((boxH * (i+1))) - 0.5

    width =  util.calcLength(elements[i].x1, elements[i].x2)
    height = util.calcLength(elements[i].y1, elements[i].y2)    

    elements[i].element
       .attr('x', elements[i].x1)
       .attr('width', width)
       .attr('y', elements[i].y1) 
       .attr('height', height)

    elements[i].text.attr('x', elements[i].x1 + width / 2)  
                    .attr('y', elements[i].y1 + height / 2)


show = () ->
  #
  # Show left panes and make them change on clicks (hackish style)
  #

  groupY = layout.separator.top.y - 0.5
  panes(groupY, totalH, layout.separator.left.x.current, sceneObject.categories.level1)

  groupY = totalH/2 + layout.separator.top.y - 0.5
  panes(groupY, totalH/2, layout.separator.left.x.current, sceneObject.categories.level2)









