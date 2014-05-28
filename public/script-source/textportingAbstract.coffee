# import global geometry
globalDims = require './globalDims'
svg        = globalDims.svg
layout     = globalDims.layout
svgUtil    = require './svgUtil'

textDraw = require './textDraw'

# module static variables
fontSize  = '18px' # temporarily
fontFamily = 'Helvetica' # for now

module.exports = (segments, fontSizeChange, scroll, mode) ->
  
  console.log 'textPorting abstract started ' + '(mode ' + mode + ')'

  if fontSizeChange?
    fontSize = parseFloat(fontSize) + fontSizeChange + 'px'

  #
  # Create or reset an SVG element to host the text inside the text port,
  # passing it on as a closures
  #

  if svg.textPortInnerSVG? # discard existing text if already drawn
    svg.textPortInnerSVG.element.remove()

  svg.textPortInnerSVG = {}

  #
  # Create top SVG for all this, for easy relative positioning,
  # and a 'g' element to afford treating the whole bunch as one group
  #
  svg.textPortInnerSVG.element = svg.main.append('svg')

  svg.textPortInnerSVG.subElement = svg.textPortInnerSVG.element.append('g')
                                 .style('text-anchor', 'start')
                                 .style('font-family',fontFamily)
                                 .style('font-size',fontSize)

  # get the width of a space character
  spaceWidth = textDraw.tokenToViewable('a a', svg.textPortInnerSVG.subElement).width - 
               textDraw.tokenToViewable('aa', svg.textPortInnerSVG.subElement).width
  spaceWidth *= 1.4  # to make it more spacious akin to line justified text spacing 
  # get the maximum character height in the font
  lHeight    = textDraw.tokenToViewable('l', svg.textPortInnerSVG.subElement).height

  paddingX = 20
  paddingY = 18

  enclosing = 
    paddingX: 15
    paddingY: 15

  segments.spacingY = 20

  #console.log svg.textPort.element.attr('width')  - (paddingX * 2)
  svg.textPortInnerSVG.element
    .attr('x',      parseFloat(svg.textPort.element.attr('x')) + paddingX + 3)
    .attr('width',  parseFloat svg.textPort.element.attr('width')  - (paddingX * 2) - 3)
    .attr('y',      parseFloat(svg.textPort.element.attr('y')) + paddingY)
    .attr('height', parseFloat svg.textPort.element.attr('height') - (paddingY * 2) - 50)

  redraw = () ->
    #
    # redraw text
    #
    viewPortFull = false
    
    y = enclosing.paddingY

    for segment in segments

      # add an svg group element for the segment
      segment.element = svg.textPortInnerSVG.subElement.append('g')
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
        'width': svg.textPortInnerSVG.element.attr('width')

      # Calculate as if building the segment withing the text port
      for textToken in segment.tokens

        #console.log textToken

        tokenViewable = textDraw.tokenToViewable(textToken, segment.element)

        if x + tokenViewable.width < svg.textPortInnerSVG.element.attr('width') - enclosing.paddingX
          #console.log 'adding to line'
          tokenViewable.svg.attr('x', x)
          tokenViewable.svg.attr('y', y)
          x += tokenViewable.width
          #console.log svg.textPortInnerSVG.element.attr('width') + ' ' + x
        else  
          if y + tokenViewable.height + lHeight < svg.textPortInnerSVG.element.attr('height') 
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
        if x + spaceWidth < svg.textPortInnerSVG.element.attr('width')
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
  #  svg.textPortInnerSVG.subElement.transition().duration(...)
 