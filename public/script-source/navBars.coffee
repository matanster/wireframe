util        = require './util'
svgUtil     = require './svgUtil'

# Global geometry 
globalDims  = require './globalDims'
sceneObject = globalDims.sceneObject
layout      = globalDims.layout

# Global
bars = []
root = {}
lookup = {}
colors =
  scaleStart : '#A3B1BA'  # '#87CEFA' 
  scaleEnd   : '#87CEFA'  # '#00BFFF'
  selection  : '#999999'

#
# convenience function for applying computed geometry to a bar
#
syncBar = (item, callback) ->

  # apply geometry and fill to rectangle
  item.element.rectangle.transition().ease('linear').duration(400).attr(item.geometry)
                                                   .style('fill', item.color)
  
  # apply rectangle center to text, so it can be centered around the center
  textGeometry = 
    'x': item.geometry.x + (item.geometry.width / 2)
    'y': item.geometry.y + (item.geometry.height / 2)

  item.element.text.transition().ease('linear').duration(400).attr(textGeometry)

#
# create a text filled rectangle, under a new svg group element
#
textRectFactory = (svgHookPoint, rectText) -> # sceneObject.main
  group = svgHookPoint.append('g')
                        .style('-webkit-user-select', 'none')      # avoid standard text handling of the category texts (selection, touch callouts)
                        .style('-webkit-touch-callout', 'none')    # avoid standard text handling of the category texts (selection, touch callouts) 
                        .style('user-select', 'none') # future compatibility
                        .attr('id', rectText)

  rectangle = group.append('rect')
                       #.style('fill', colorScale(box))   
                       .style('stroke-width', '0px')
                       .style('fill-opacity', '1')

  # skip text node if no text is provided
  if rectText?
    text = group.append('text').text(rectText)
                                     .style("text-anchor", "middle")
                                     .attr("dominant-baseline", "central")
                                     .style("font-family", "verdana")
                                     .style("font-weight", "bold")
                                     .style('fill', '#EEEEEE')
  else 
    text = null

  sceneObject = { group, rectangle, text}
  return sceneObject


#
# construct json tree of bars, 
# topmost node being a special case node
#
exports.init = (navBarsData, svgHookPoint) ->

  console.log 'navBars init started'
  console.log 'navBarsData object:'
  console.dir navBarsData

  #colorScale = d3.scale.linear().domain([0, navBarsData.length]).range(['#87CEFA', '#00BFFF'])
  colorScale = d3.scale.linear().domain([0, navBarsData.length]).range([colors.scaleStart, colors.scaleEnd])

  root =
    'name'       : null # topmost element
    'element'    : textRectFactory(svgHookPoint)
    'parent'     : null
    'nestLevel'  : -1
    'viewStatus' : 'visible' # unnecessary?

  #
  # set initial status of a bar
  #
  initialViewStatus = (bar) ->
    # mark the active bar

    if bar.parentBar is null
      bar.viewStatus = 'visible'

    if bar.name is "Introduction"
      bar.viewStatus = 'selected'

  #
  # recursive derivation of a bar and its children bars,
  # per the input bars data. 
  #
  # This does not merely deep clones or restructures the input, 
  # but rather adds properties for working the bars 
  #
  barCreate = (svgHookPoint, barData, parentBar, color) ->

    if parentBar is null
      nestLevel = 0
    else 
      nestLevel = parentBar.nestLevel + 1

    bar =
      'name'       : barData.name
      'element'    : textRectFactory(svgHookPoint, barData.name)
      'baseColor'  : colorScale(i)
      'parent'     : parentBar
      'nestLevel'  : nestLevel
      'viewStatus' : 'hidden' # everything hidden till marked otherwise

    initialViewStatus(bar)

    # associate svg element to the bar object, so that mouse/touch events
    # can access the control data they need to
    lookup[bar.element.group.attr('id')] = bar

    console.dir lookup

    # proceed to recursion over bar subs, if any
    if barData.subs?
      bar.children = []
      for barDataSub in barData.subs
        subBar = barCreate(svgHookPoint, barDataSub, bar, color)
        bar.children.push(subBar)
    
    #
    # attach mouse events to bar
    #
    bar.element.group
      .on('mouseover', () -> 
        console.log('hover'))
        #sceneObject.downButton.element.transition().ease('sin').duration(200).attr('height', sceneObject.downButton.geometry.height + (sceneObject.downButton.geometry.paddingY *2/3)))
      .on('mouseout', () -> 
        console.log('hover end'))
        #sceneObject.downButton.element.transition().duration(400).attr('height', sceneObject.downButton.geometry.height))
      .on('mousedown', () -> 
        # retreive bar object associated to the svg that was clicked
        bar = lookup[this.getAttribute('id')]
        # change selection amongst siblings of the clicked bar
        if bar.parent?
         for sibling in bar.parent.children
           sibling.viewStatus = 'visible'
        bar.viewStatus = 'selected'
        # make children, if any, visible
        if bar.children?
          for child in bar.children
            child.viewStatus = 'visible'
        redraw(bars)
    )             

    return bar   


  for barData, i in navBarsData
    bar = barCreate(svgHookPoint, barData, null, colorScale(i))
    bars.push(bar)

  # voila, now associate the top level nodes to the special root node,
  # to complete the tree creation
  root.children = bars
  for bar in bars
    bar.parent = root

  console.dir root
  
#
# draw all bars according to:
# screen geometry
# selection status
#
redraw = (bars) ->

  parentGeometry = bars[0].parent.geometry 
  
  console.log 'navBars redraw started'
  console.dir parentGeometry
  
  # figure if any of current layer are selected
  anySelected = false
  for bar in bars
    if bar.viewStatus is 'selected'
      anySelected = true
 
  #
  # determine coloring
  #
  for bar in bars
    switch bar.viewStatus 
      when 'selected'
        bar.color = colors.selection
      else      
        bar.color = bar.baseColor
  
  #
  # determine height calculation type
  #
  if anySelected
    for bar in bars
      switch bar.viewStatus 
        when 'selected'
          bar.heightRatio = 'main'
        else      
          bar.heightRatio = 'subordinate'
  else
    for bar in bars
      bar.heightRatio = 'even'

  #
  # Attach geometry based on height type
  #
  y = parentGeometry.y # initialize starting position for next bar

  for bar, i in bars

    # derive height for the bar
    switch bar.heightRatio
      when 'main'
        height = Math.floor(parentGeometry.height * (2 / 3))   # take up 2/3's the total height                  
      when 'subordinate' 
        height = Math.floor(parentGeometry.height * (1 / 3) / (bars.length - 1))   # take up even share of remaining 1/3
      when 'even' 
        height = Math.floor(parentGeometry.height / (bars.length))   # take up even share

    # set geometry for the bar
    bar.geometry =
      x      : parentGeometry.x           # same for all bars 
      width  : parentGeometry.width       # same for all bars 
      y      : y - 0.5                    # start after previous bar
      height : height                     # the alloted height for this specific bar

    # sync the established geometry and style to the scene object
    syncBar(bar)

    console.dir bar

    #
    # last pass - invoke for all children
    #
    for bar in bars
      if bar.children?  # if there are visible children
        if bar.children[0].viewStatus in ['visible', 'selected']
          console.log 'visible children'
          bar.geometry =  # set own geometry as container for them
            'x':      parentGeometry.x     +  15
            'width':  parentGeometry.width - (15 * 2)
            'y':      y                    +  15 
            'height': height               - (15 * 2)           
          redraw(bar.children) # recurse for children 

    #
    # advance starting point for next bar if any
    #
    y += height 

  return null

exports.redraw = (geometry) ->
  root.geometry = geometry
  redraw(bars)
  



    
    


  
  









oldsomething = () ->
  numberOfBoxes = categories.length
  colorScale = d3.scale.linear().domain([0, numberOfBoxes-1]).range(['#87CEFA', '#00BFFF'])
  #colorScale = d3.scale.linear().domain([0, numberOfBoxes-1]).range(['#CCCCE0','#AAAABE']) # ['#CCCCE0','#AAAABE']
  colorTransition = (i) -> (() -> d3.select(this).transition().duration(25).ease('circle').style('fill', colorScale(i)))

#
# Draw elements to fit vertical segment, equal height to each
# this will probably go away
#
oldpanes = (groupY, groupH, borderX, elements) ->

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


oldshow = () ->
  #
  # Show left panes and make them change on clicks (hackish style)
  #

  groupY = layout.separator.top.y - 0.5
  panes(groupY, totalH, layout.separator.left.x.current, sceneObject.categories.level1)

  groupY = totalH/2 + layout.separator.top.y - 0.5
  panes(groupY, totalH/2, layout.separator.left.x.current, sceneObject.categories.level2)









