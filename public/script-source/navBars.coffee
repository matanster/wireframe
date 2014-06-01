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
  scaleStart : '#87CEFA'  # '#A3B1BA'
  scaleEnd   : '#00BFFF'  # '#87CEFA'
  selection  : '#999999'  # '#333333'

categorizedTextTree = undefined

searchCategories = (categoryNodes, catName) ->
  for categoryNode in categoryNodes
    if categoryNode.name is catName
      return categoryNode.text
    else   
      if categoryNode.subs?
        if searchCategories(categoryNode.subs, catName)
          return searchCategories(categoryNode.subs, catName) # harmless duplication with our small tree size..

  return false  # will only get here if not found
      
getCategoryText = (catName) ->
  text = searchCategories(categorizedTextTree, catName)
#  console.log 'text for category ' + catName + ':'
#  console.dir text

display = (bar) ->
  console.log 'display invoked for ' + bar.name
  textArray = getCategoryText(bar.name)
  if textArray
    console.log 'text for category ' + bar.name + ':'
    console.dir textArray
  else
    console.log 'no text found for category...'


#
# create a hidden text filled rectangle, under a new svg group element,
# ready to be later made visible.
#
textRectFactory = (svgHookPoint, rectText) -> # sceneObject.main
  group = svgHookPoint.append('g')
                        .style('-webkit-user-select', 'none')      # avoid standard text handling of the category texts (selection, touch callouts)
                        .style('-webkit-touch-callout', 'none')    # avoid standard text handling of the category texts (selection, touch callouts) 
                        .style('user-select', 'none') # future compatibility
                        .attr('id', rectText)
                        .attr('visibility', 'hidden')

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
                                     .style('fill', '#EEEEEE')
                                     .style("font-weight", "bold")
    textDims = 
      width  : text.node().getBBox().width
      height : text.node().getBBox().height

  else 
    text = null

  sceneObject = { group, rectangle, text, textDims }
  return sceneObject


#
# revoke 'selected' status off bar, reflecting the change
# also to it's children. 
#
barUnselect = (bar) ->
  hideChildren = (bar) ->
    if bar.children?
      for child in bar.children
        #
        # set the hidden status, and execute its hiding
        #
        child.viewStatus = 'hidden' 
        child.element.group.attr('visibility', 'hidden')
        hideChildren(child) # recurse over children

  bar.viewStatus = 'visible'
  hideChildren(bar)
   
#
# construct json tree of bars, 
# topmost node being a special case node
#
exports.init = (navBarsData, svgHookPoint, categorizedTextTreeInput) ->

  categorizedTextTree = categorizedTextTreeInput  # simply attach to module convenience global
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

    if bar.name is "Abstract"
      bar.viewStatus = 'selected'
      display(bar)

  #
  # recursive derivation of a bar and its children bars,
  # per the input bars data. 
  #
  # This does not merely deep clones or restructures the input, 
  # but rather adds properties for working the bars 
  #
  barCreate = (svgHookPoint, barData, parentBar, baseColor) ->

    if parentBar is null
      nestLevel = 0
    else 
      nestLevel = parentBar.nestLevel + 1

    bar =
      'name'       : barData.name
      'element'    : textRectFactory(svgHookPoint, barData.name)
      'baseColor'  : baseColor
      'parent'     : parentBar
      'nestLevel'  : nestLevel
      'viewStatus' : 'hidden' # everything hidden till marked otherwise
      'emphasis'   : barData.emphasis
      'select'     : () -> display(this)

    console.dir bar

    initialViewStatus(bar)

    # associate svg element to the bar object, so that mouse/touch events
    # can access the control data they need to
    lookup[bar.element.group.attr('id')] = bar

    # proceed to recursion over bar subs, if any
    if barData.subs?
      bar.children = []
      for barDataSub in barData.subs
        subBar = barCreate(svgHookPoint, barDataSub, bar, '#BBBBBB')
        bar.children.push(subBar)
    
    #
    # attach mouse events to bar
    #
    bar.element.group
      .on('mouseover', () -> null)
        #sceneObject.downButton.element.transition().ease('sin').duration(200).attr('height', sceneObject.downButton.geometry.height + (sceneObject.downButton.geometry.paddingY *2/3)))
      .on('mouseout', () -> null)
        #sceneObject.downButton.element.transition().duration(400).attr('height', sceneObject.downButton.geometry.height))
      .on('mousedown', () -> 
        # retreive bar object associated to the svg that was clicked
        bar = lookup[this.getAttribute('id')]
        # move the selection status to now selected item, 
        # after removing that status from whatever had it before.
        if bar.parent?
         for sibling in bar.parent.children
           if sibling.viewStatus is 'selected'
             barUnselect(sibling)             

        bar.viewStatus = 'selected'
        bar.select()

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

#
# draw all bars according to:
# screen geometry
# selection status
#
redraw = (bars, borderColor) ->

  console.log 'navBars redraw started'

  #
  # get the space to be used within the parent geometry.
  #
  allowedGeometry = bars[0].parent.childrenGeometry 
  
  # figure if any of current layer are selected
  anySelected = false
  for bar in bars
    if bar.viewStatus is 'selected'
      anySelected = true

  #
  # determine coloring 
  #

  for bar in bars
  
    # check if any visible children - as this should affect coloring and geometry
    visibleChildren = false
    if bar.children?  # if there are visible children
      if bar.children[0].viewStatus in ['visible', 'selected']
        visibleChildren = true

    switch bar.viewStatus 
      when 'selected'
        if visibleChildren
          bar.color = bar.baseColor
        else  
          bar.color = colors.selection
        #bar.element.text.style("font-weight", "bold")
      else      
        bar.color = bar.baseColor
        #bar.element.text.style("font-weight", "normal")        
  
    console.log bar.emphasis
    if bar.emphasis?
      bar.element.text.style("font-weight", "normal")        

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
  y = allowedGeometry.y # initialize starting position for next bar

  for bar, i in bars

  
    # check if any visible children - as this should affect coloring and geometry
    visibleChildren = false
    if bar.children?  # if there are visible children
      if bar.children[0].viewStatus in ['visible', 'selected']
        visibleChildren = true

    # derive height for the bar
    switch bar.heightRatio
      when 'main'
        height = Math.floor(allowedGeometry.height * (2 / 3))   # take up 2/3's the total height                  
      when 'subordinate' 
        height = Math.floor(allowedGeometry.height * (1 / 3) / (bars.length - 1))   # take up even share of remaining 1/3
      when 'even' 
        height = Math.floor(allowedGeometry.height / (bars.length))   # take up even share

    #textHeight = 15 # to be replaced with real measurement - we already have such function 

    #
    # take care of geometry for the bar's rectangle
    #
    bar.geometry =
      x      : allowedGeometry.x      # same for all bars 
      width  : allowedGeometry.width  # same for all bars 
      y      : y + 0.5                # start after previous bar
      height : height                 # the alloted height for this specific bar

    # compute padded space for text of rect for when it will have children open -
    # basing (hackishly in that) on the height of the bar when initially collapsed
    unless bar.textPaddedSpace?
      bar.textPaddedSpace = bar.geometry.height  # height of hypthetical bar encasing the text of the current bar.
                                                 # being used to preserve the padding around the text on expansion
                                                 # hackishly rely on initial collapsed height of bar
      bar.innerExtraPadding = 
        top    : bar.textPaddedSpace * 1.5
        bottom : bar.textPaddedSpace * 0.2

    # apply geometry and fill to bar's rectangle
    bar.element.rectangle.transition().ease('linear').duration(400).attr(bar.geometry)
                                                                   .style('fill', bar.color)
    if visibleChildren
      #
      # take care of allowed geometry for child bars, if any
      #
      childGeometryPadding =
        x: 12
        y: 5 # todo: make ratio of x and y same as de-facto screen aspect ratio, for uniform physical length

      bar.childrenGeometry = 
        x      : bar.geometry.x      +  childGeometryPadding.x
        width  : bar.geometry.width  - (childGeometryPadding.x * 1) 
        y      : bar.geometry.y      +  childGeometryPadding.y       +   bar.innerExtraPadding.top
        height : bar.geometry.height - (childGeometryPadding.y * 2)  -   (bar.innerExtraPadding.top + bar.innerExtraPadding.bottom)

      #
      # invoke for children if any
      #
      window.setTimeout(redraw, 400, bar.children) # recurse for children - after own transition ended

      #
      # calculate geometry for the bar's text
      # to do: the following makes the text invisible, this is a hackish way to make
      # it invisible, to be replaced in case this code segment persists. 

      textGeometry = 
        'x': bar.geometry.x + (bar.geometry.width / 2)
        'y': bar.geometry.y + (bar.innerExtraPadding.top / 2)  # preserves y distance from top of the bar

    else
      textGeometry = 
        'x': bar.geometry.x + (bar.geometry.width / 2)
        'y': bar.geometry.y + (bar.geometry.height / 2)


    # apply geometry and fill to bar's text
    bar.element.text.transition().ease('linear').duration(200).attr(textGeometry)
    # make it visible
    bar.element.group.attr('visibility', 'visible')

    #
    # advance starting point for next bar if any
    #
    y += height 

  return null

exports.redraw = (geometry) ->
  root.geometry = geometry
  root.childrenGeometry = 
    x      : root.geometry.x      
    width  : root.geometry.width  
    y      : root.geometry.y      
    height : root.geometry.height 

  redraw(bars)
  



    
###

oldshow = () ->
  #
  # Show left panes and make them change on clicks (hackish style)
  #

  groupY = layout.separator.top.y - 0.5
  panes(groupY, totalH, layout.separator.left.x.current, sceneObject.categories.level1)

  groupY = totalH/2 + layout.separator.top.y - 0.5
  panes(groupY, totalH/2, layout.separator.left.x.current, sceneObject.categories.level2)


# console.log JSON.stringify(bar.childrenGeometry, null, '  ')

###