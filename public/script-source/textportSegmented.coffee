# import global geometry
globalDims = require './globalDims'
sceneObject = globalDims.sceneObject
sceneHook  = globalDims.sceneHook
layout     = globalDims.layout
svgUtil    = require './svgUtil'
session = require './session'

textDraw = require './textDraw'

# module static variables
fontSize  = '18px' # temporarily
fontFamily = 'Helvetica' # for now

module.exports = (segments, fontSizeChange, scroll, mode) ->
  
  console.log 'segmented textPorting started ' + '(mode ' + mode + ')'

  if fontSizeChange?
    fontSize = parseFloat(fontSize) + fontSizeChange + 'px'

  #
  # Create or reset an SVG element to host the text inside the text port,
  # passing it on as a closures
  #

  if sceneObject.textPortInnerSVG? # discard existing text if already drawn
    sceneObject.textPortInnerSVG.element.remove()

  sceneObject.textPortInnerSVG = {}

  #
  # Create top SVG for all this, for easy relative positioning,
  # and a 'g' element to afford treating the whole bunch as one group
  #

  console.dir sceneHook.svg

  sceneObject.textPortInnerSVG.element = sceneHook.svg.append('svg')

  sceneObject.textPortInnerSVG.subElement = sceneObject.textPortInnerSVG.element.append('g')
                                 .style('text-anchor', 'start')
                                 .style('font-family',fontFamily)
                                 .style('font-size',fontSize)

  # get the width of a space character
  spaceWidth = textDraw.tokenToViewable('a a', sceneObject.textPortInnerSVG.subElement).width - 
               textDraw.tokenToViewable('aa', sceneObject.textPortInnerSVG.subElement).width
  spaceWidth *= 1.4  # to make it more spacious akin to line justified text spacing 
  # get the maximum character height in the font
  lHeight    = textDraw.tokenToViewable('l', sceneObject.textPortInnerSVG.subElement).height

  paddingX = 20
  paddingY = 18

  enclosing = 
    paddingX: 15
    paddingY: 15

  segments.spacingY = 20

  #console.log sceneObject.textPort.element.attr('width')  - (paddingX * 2)
  console.dir parseFloat(sceneObject.textPort.element.attr('x')) + paddingX + 3

  sceneObject.textPortInnerSVG.element
    .attr('x',      parseFloat(sceneObject.textPort.element.attr('x')) + paddingX + 3)
    .attr('width',  parseFloat sceneObject.textPort.element.attr('width')  - (paddingX * 2) - 3)
    .attr('y',      parseFloat(sceneObject.textPort.element.attr('y')) + paddingY)
    .attr('height', parseFloat sceneObject.textPort.element.attr('height') - (paddingY * 2) - 50)

  redraw = () ->
    #
    # redraw text
    #
    viewPortFull = false
    
    y = enclosing.paddingY

    for segment in segments

      # add an svg group element for the segment
      segment.element = sceneObject.textPortInnerSVG.subElement.append('g')
                                 .style('text-anchor', 'start')
                                 .style('fill', '#EEEEEE')
                                 .style('font-family',fontFamily)
                                 .style('font-size',fontSize)

      # add curvy rectangle for the group
      segment.enclosure = {}
      segment.enclosure.element = segment.element.append('rect').style('opacity', 0.9).style('fill', '#87CEFA')  # 888888

      segmentTokens = []
      x = enclosing.paddingX

      segment.enclosure.geometry =
        'rx'   : 7
        'ry'   : 5
        'y'    : y - enclosing.paddingY
        'x'    : x - enclosing.paddingX
        'width': sceneObject.textPortInnerSVG.element.attr('width')

      # Calculate as if building the segment withing the text port
      for textToken in segment.tokens

        #console.log textToken

        tokenViewable = textDraw.tokenToViewable(textToken.text, segment.element)

        #
        # Apply word semantic styling
        #
        switch textToken.mark
          when 1
            tokenViewable.svg.style('fill', '#2F4FFF')
          when 2
            #tokenViewable.svg.style('fill', 'rgb(70,140,140)')
            tokenViewable.svg.style('fill', 'rgb(100,200,200)')

        if x + tokenViewable.width < sceneObject.textPortInnerSVG.element.attr('width') - enclosing.paddingX
          #console.log 'adding to line'
          tokenViewable.svg.attr('x', x)
          tokenViewable.svg.attr('y', y)
          x += tokenViewable.width
          #console.log sceneObject.textPortInnerSVG.element.attr('width') + ' ' + x
        else  
          if y + tokenViewable.height + lHeight < sceneObject.textPortInnerSVG.element.attr('height') 
            #console.log 'adding to new line'
            x = enclosing.paddingX
            y += tokenViewable.height
            tokenViewable.svg.attr('x', x)
            tokenViewable.svg.attr('y', y)
            x += tokenViewable.width  
          else
            #console.log 'text port full'
            viewPortFull = true
            break
        
        # add word space unless end of line
        if x + spaceWidth < sceneObject.textPortInnerSVG.element.attr('width')
          x += spaceWidth
        #console.log "x after space adding = " + x

      #console.log y
      y += lHeight + enclosing.paddingY

      # size segment's svg rectangle proportionally to the text dimensions detected
      segment.enclosure.geometry.height = y - segment.enclosure.geometry.y
      svgUtil.sync(segment.enclosure)

      y += segments.spacingY 

  redraw()  

  #
  # Scroll the text - to do:
  # 
  # Take care drawing beyond the visible
  # Tween the text on scroll
  # Remove Down Button when reached bottom
  # Add Up button after initial scroll
  #
  #if scroll?
  #  sceneObject.textPortInnerSVG.subElement.transition().duration(...)
 