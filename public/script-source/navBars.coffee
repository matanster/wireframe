#
# module for showing and interacting the special navigation bars.
#
# this module started with a pure recursive approach to bars,
# then deteriorated to being somewhat specific to just two levels.
# more levels may anyhow require special handling to support user cognition.
#

# import global geometry
tokenize     = require './tokenize'
textDraw     = require './textDraw'

util              = require './util'
svgUtil           = require './svgUtil'
textportSegmented = require './textportSegmented'
session           = require './session'
tokenize          = require './tokenize'

# Global geometry 
globalDims  = require './globalDims'
sceneObject = globalDims.sceneObject
sceneHook   = globalDims.sceneHook
layout      = globalDims.layout

# module static variables
fontSize  = '22px' # temporarily
fontFamily = 'Helvetica' # for now

# Global
categories = []
currentCategory = 0

bars = []
root = {}
lookup = {}
colors =
  scaleStart : '#999999' #'#87cefa'
  scaleEnd   : '#999999'  #'#2dc4fd'
  selection  : '#60cafb' 

categorizedTextTree = undefined

# move the selection status to now selected item, 
# after removing that status from whatever had it before.
barSelect = (bar, updateScrollPosition) ->

  if bar.parent?
   for sibling in bar.parent.children
     if sibling.viewStatus is 'selected'
       barUnselect(sibling)             

  bar.viewStatus = 'selected'
  bar.select(updateScrollPosition) 

  # make children, if any, visible
  if bar.children?
    for child in bar.children
      child.viewStatus = 'visible'
  redraw(bars)


# Render text content to textport, and ready rendered textport for action
textportFluent = (categorizedTextTree, fontSizeChange, scroll, mode) ->

  # old button-based scroll, maybe will be reverted to
  if scroll?
    console.log scroll
    sceneObject.textPortInnerSVG.element.transition().ease('sin').duration(2000).attr('y', 0)
    #sceneObject.textPortInnerSVG.subElement.transition().ease('sin').duration(2000).attr('transform', 'translate(0,-300)')
    return

  console.log 'fluent textPorting started ' + '(mode ' + mode + ')'

  if fontSizeChange?
    fontSize = parseFloat(fontSize) + fontSizeChange + 'px'

  #
  # Create or reset an SVG element to host the text inside the text port,
  # passing it on as a closures
  #

  if sceneObject.textPortInnerSVG? # discard existing text if already drawn
    sceneObject.textPortInnerSVG.element.remove()
    sceneHook.textPortDiv.remove()  

  sceneObject.textPortInnerSVG = {}

  #
  # Create top SVG for all this, for easy relative positioning,
  # and a 'g' element to afford treating the whole bunch as one group
  #

  paddingX = 20
  paddingY = 18
    
  sceneHook.textPortDiv = d3.select('body').append('xhtml:div')
                                   .style('overflow-y', 'auto')
                                   .style('z-index',2)
                                   .style('position', 'absolute')
                                   .style('-overflow-scrolling', 'touch') # check out http://iscrolljs.com/ for finer experience
                                   .attr('class', 'scroll')
                                   .html("""<svg id='textPortInnerSVG' style='overflow-y: scroll;'></svg>""")
  sceneObject.textPortInnerSVG.element = d3.select('#' + 'textPortInnerSVG')

  #util.makeSvgTopLayer(sceneHook.svg.node()) # doesn't work in this case

  # separate svg element to contain the actual text
  #sceneObject.textPortInnerSVG.element = sceneHook.svg.append('svg')
  #                                                    .style('overflow-y', 'auto')

  # inside it, an svg group for the actual words
  sceneObject.textPortInnerSVG.subElement = sceneObject.textPortInnerSVG.element.append('g')
                                 .style('text-anchor', 'start')
                                 .style('fill', 'rgb(220,220,220)')                                                                                                                                            
                                 .style('font-family',fontFamily)
                                 .style('font-size',fontSize)

  width  = parseFloat(sceneObject.textPort.element.attr('width')) - (paddingX * 2) - 3 + 20
  height = parseFloat(sceneObject.textPort.element.attr('height')) - (paddingY * 2) 

  sceneHook.textPortDiv
               .style('left', parseFloat(sceneObject.textPort.element.attr('x')) + paddingX + 3)
               .style('top', parseFloat(sceneObject.textPort.element.attr('y')) + paddingY)
               .style('height', height)
               .style('width', width + 18)
               .style('webkit-overflow-scrolling', 'touch')

  #util.makeSvgTopLayer(sceneHook.textPortDiv.node()) # this really necessary?

  # get the width of a space character
  spaceWidth = textDraw.tokenToViewable('a a', sceneObject.textPortInnerSVG.subElement).width - 
               textDraw.tokenToViewable('aa', sceneObject.textPortInnerSVG.subElement).width
  spaceWidth *= 1.4  # to make it more spacious akin to line justified text spacing 
  # get the maximum character height in the font
  lHeight    = textDraw.tokenToViewable('l', sceneObject.textPortInnerSVG.subElement).height

  sceneObject.textPortInnerSVG.element
    #.attr('x',      parseFloat(sceneObject.textPort.element.attr('x')) + paddingX + 3)
    .attr('width',  parseFloat sceneObject.textPort.element.attr('width')  - (paddingX * 2) - 3)
    #.attr('y',      parseFloat(sceneObject.textPort.element.attr('y')) + paddingY)
    #.attr('height', 2000) # temporary maximum, until actual size is set after all text was drawn to svg
    
  categories = []

  redraw = () ->
    #
    # redraw text
    #
    viewPortFull = false
    x = 0
    y = 0

    for categoryNode, c in categorizedTextTree
      #if categoryNode.name is session.selected.name

      # mark y location of renderred category beginning
      categories.push( { name: categoryNode.name, beginning: y })

      for subCategory in categoryNode.subs

        # textport category title
        unless y is 0
          y += 30

        tokenViewable = textDraw.tokenToViewable(subCategory.name, sceneObject.textPortInnerSVG.subElement)
        tokenViewable.svg.attr('x', sceneObject.textPortInnerSVG.element.attr('width') / 2)
                         .attr('y', y)
                         .style("text-anchor", "middle")
                         .attr("dominant-baseline", "central")
                         .style("font-family", "Helvetica")
                         .style("font-weight", "bold")
                         .style("font-style", "italic")
                         .attr("font-size", "30px")
                         .style('fill', '#2dc4fd') #aaaaaa

        y += 40
        
        # tokenize all subcategory sentences 
        sentences = []
        for rawSentence in subCategory.text
          sentence = 
            text: tokenize(rawSentence)        
          sentences.push(sentence)

        console.log """subcategory #{subCategory.name} being handled"""

        # textport all sentences
        for sentence in sentences

          for token in sentence.text

            tokenViewable = textDraw.tokenToViewable(token.text, sceneObject.textPortInnerSVG.subElement)
            
            #
            # Apply word semantic styling
            #
            switch token.mark
              when 1
                tokenViewable.svg.style('fill', '#4488FE')  # #4488FE 'rgb(120,240,240)'
              when 2
                #tokenViewable.svg.style('fill', 'rgb(70,140,140)')
                tokenViewable.svg.style('fill', '#4488FE') # rgb(100,200,200)
                                 .style('font-style', 'italic')

            if x + tokenViewable.width < sceneObject.textPortInnerSVG.element.attr('width')
              #console.log 'adding to line'
              tokenViewable.svg.attr('x', x)
                               .attr('y', y)
              x += tokenViewable.width
            else  
              #if y + tokenViewable.height + lHeight < sceneObject.textPortInnerSVG.element.attr('height')
                #console.log 'adding to new line'
              x = 0
              y += tokenViewable.height
              tokenViewable.svg.attr('x', x)
                               .attr('y', y)
              x += tokenViewable.width  
              #else
              #  console.log 'text port full'
              #  viewPortFull = true
              #  break
            
            # add word space unless end of line
            if x + spaceWidth < sceneObject.textPortInnerSVG.element.attr('width')
              x += spaceWidth
              #console.log "x after space adding = " + x
          y += (tokenViewable.height)*2
          x = 0

      categories[c].ending = y - 1 # mark end location of category. the -1 is rather arbitrary
  
    # adjust container svg to length of text (to enable smooth scrolability)
    sceneObject.textPortInnerSVG.element.attr('height', y + 30)

    return viewPortFull        

  redraw()  

  sceneHook.textPortDiv.on('scroll', () -> 
    #console.log("""scroll #{sceneHook.textPortDiv.node().scrollTop}""")
    if sceneHook.textPortDiv.node().scrollTop < categories[currentCategory].beginning or
       sceneHook.textPortDiv.node().scrollTop > categories[currentCategory].ending

      for category, c in categories 
        if sceneHook.textPortDiv.node().scrollTop > category.beginning and
           sceneHook.textPortDiv.node().scrollTop < category.ending

          currentCategory = c

          barSelect(bars[c])

          console.log """switched to category #{c}"""

          break
  )


 


#
# create a hidden text filled rectangle, under a new svg group element,
# ready to be later made visible.
#
textRectFactory = (svgHookPoint, rectText) ->
  styles = 
    text:
      'font-family' : 'verdana'
      'fill'        : '#EEEEEE'
      'font-weight' : 'bold'
    rectangle:
      'stroke-width': '0px'
      'fill-opacity': '1'

  svgUtil.textRectFactory(svgHookPoint, rectText, styles, 'hidden')

searchCategories = (categoryNodes, catName) ->
  for categoryNode in categoryNodes
    if categoryNode.name is catName
      return categoryNode.text
    else   
      if categoryNode.subs?
        if searchCategories(categoryNode.subs, catName)
          return searchCategories(categoryNode.subs, catName) # harmless duplication with our small tree size..

  return false  # will only get here if not found

#
# get the text tokens for a given category
#      
getCategoryText = (catName) ->
  text = searchCategories(categorizedTextTree, catName)

#
# activate text porting update, per the current display type
#
textportRefresh = (fontSizeChange, scroll, mode) ->

  switch session.display


    #
    # Assumes segmented view is only used for non-subcategorized content
    #
    when 'segmented'

      # get content to display
      for categoryNode in categorizedTextTree
        if categoryNode.name is session.selected.name
          rawTextArray = categoryNode.text

      # restructure into segments  
      segments = []
      for rawSegment in rawTextArray
        segment = 
          category : null
          tokens   : tokenize(rawSegment)
        segments.push segment

      textportSegmented(segments, fontSizeChange, scroll, mode)

    when 'fluent'

      downArrowNeeded = textportFluent(categorizedTextTree, fontSizeChange, scroll, mode)
      #if downArrowNeeded

exports.textportRefresh = textportRefresh

#
# copy display type into session
#
sessionSetDisplayType = (bar) ->
  if bar.display is 'segmented'
    session.display = 'segmented'
  else
    session.display = 'fluent'      

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
  #console.log 'navBarsData object:'
  #console.dir navBarsData

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

    # set initial bar selection 
    if bar.name is "Goals"
      bar.viewStatus = 'selected'
      bar.select()

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
      'display'    : barData.display
      'element'    : textRectFactory(svgHookPoint, barData.name)
      'baseColor'  : baseColor
      'parent'     : parentBar
      'nestLevel'  : nestLevel
      'viewStatus' : 'hidden' # everything hidden till marked otherwise
      'emphasis'   : barData.emphasis
      'select'     : ((updateScrollPosition) -> 
                       #console.dir this
                       session.selected = this
                       sessionSetDisplayType(this)
                      
                       console.dir updateScrollPosition

                       if updateScrollPosition
                       # get category this bar corresponds to
                         for category, c in categories
                           console.log category.name
                           console.log barData.name
                           if category.name is barData.name
                             currentCategory = c
                             break

                         console.log currentCategory
                         console.dir categories

                         sceneHook.textPortDiv.node().scrollTop = categories[currentCategory].beginning
                         #window.setTimeout(textportRefresh, 300)
                     )

    initialViewStatus(bar)

    # associate svg element to the bar object, so that mouse/touch events
    # can access the control data they need to
    lookup[bar.element.group.attr('id')] = bar

    ###
    # proceed to recursion over bar subs, if any
    if barData.subs?
      bar.children = []
      for barDataSub in barData.subs
        subBar = barCreate(svgHookPoint, barDataSub, bar, '#BBBBBB')
        bar.children.push(subBar)
    ###
    
    #
    # attach mouse events to bar
    #
    bar.element.group
      .on('mouseover', () -> null)
        #sceneObject.downButton.element.transition().ease('sin').duration(200).attr('height', sceneObject.downButton.geometry.height + (sceneObject.downButton.geometry.paddingY *2/3)))
      .on('mouseout', () -> null)
        #sceneObject.downButton.element.transition().duration(400).attr('height', sceneObject.downButton.geometry.height))
      .on('mousedown', () -> 
        # retreive bar objecft associated to the svg that was clicked
        bar = lookup[this.getAttribute('id')]
        barSelect(bar, true)
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
          bar.element.text.style('fill', 'EEEEEE').attr("font-size", "20px").style("font-weight", "bold")        

      else      
        bar.color = bar.baseColor
        bar.element.text.style('fill', 'EEEEEE').attr("font-size", "16px").style("font-weight", "bold")
        #bar.element.text.style("font-weight", "normal")        
  
    #if bar.emphasis?
    #  bar.element.text.style("font-weight", "normal")        

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