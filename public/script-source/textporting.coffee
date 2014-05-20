# import global geometry
globalDims = require './globalDims'
svg    = globalDims.svg
layout = globalDims.layout

textDraw = require './textDraw'

# module static variables
fontSize  = '36px' # temporarily
fontFamily = 'Helvetica' # for now

module.exports = (tokens, fontSizeChange, scroll, mode) ->
  
  console.log 'textPorting started ' + '(mode ' + mode + ')'

  if fontSizeChange?
    fontSize = parseFloat(fontSize) + fontSizeChange + 'px'

  #
  # Create or reset an SVG element to host the text inside the text port,
  # passing it on as a closures
  #

  if svg.textPortInnerSVG? # discard existing text if already drawn
    svg.textPortInnerSVG.element.remove()

  svg.textPortInnerSVG = {}
  svg.textPortInnerSVG.element = svg.main.append('svg')

  svg.textPortInnerSVG.subElement = svg.textPortInnerSVG.element.append('g')
                                 .style('text-anchor', 'start')
                                 .style('fill', 'rgb(255,255,220)')                                                                                                                                            
                                 .style('font-family',fontFamily)
                                 .style('font-size',fontSize)

  # get the width of a space character
  spaceWidth = textDraw.tokenToViewable('a a', svg.textPortInnerSVG.subElement).width - textDraw.tokenToViewable('aa', svg.textPortInnerSVG.subElement).width
  # get the maximum character height in the font
  lHeight    = textDraw.tokenToViewable('l', svg.textPortInnerSVG.subElement).height

  paddingX = 10
  paddingY = 10

  console.log svg.textPort.element.attr('width')  - (paddingX * 2)
  svg.textPortInnerSVG.element
    .attr('x',      parseFloat(svg.textPort.element.attr('x')) + paddingX)
    .attr('width',  parseFloat svg.textPort.element.attr('width')  - (paddingX * 2))
    .attr('y',      parseFloat(svg.textPort.element.attr('y')) + paddingY)
    .attr('height', parseFloat svg.textPort.element.attr('height') - (paddingY * 2) - 50)

  redraw = () ->
    #
    # redraw text
    #
    viewPortFull = false
    x = 0
    y = 0
    for token in tokens

      tokenViewable = textDraw.tokenToViewable(token.text, svg.textPortInnerSVG.subElement)
      #console.log token.mark
      
      #
      # Apply word semantic styling
      #
      switch token.mark
        when 1
          tokenViewable.svg.style('fill', 'rgb(120,240,240)')
          break
        when 2
          #tokenViewable.svg.style('fill', 'rgb(70,140,140)')
          tokenViewable.svg.style('fill', 'rgb(100,200,200)')
          break

      if x + tokenViewable.width < svg.textPortInnerSVG.element.attr('width')
        #console.log 'adding to line'
        tokenViewable.svg.attr('x', x)
        tokenViewable.svg.attr('y', y)
        x += tokenViewable.width
      else  
        if y + tokenViewable.height + lHeight < svg.textPortInnerSVG.element.attr('height')
          #console.log 'adding to new line'
          x = 0
          y += tokenViewable.height
          tokenViewable.svg.attr('x', x)
          tokenViewable.svg.attr('y', y)
          x += tokenViewable.width  
          #console.log y  
          #console.dir textPort  
        else
          console.log 'text port full'
          viewPortFull = true
          break
      
      # add word space unless end of line
      if x + spaceWidth < svg.textPortInnerSVG.element.attr('width')
        x += spaceWidth
        #console.log "x after space adding = " + x
    
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
 