# import global geometry
globalDims   = require './globalDims'
sceneObject  = globalDims.sceneObject
sceneHook = globalDims.sceneHook
layout = globalDims.layout
session = require './session'

textDraw = require './textDraw'

# module static variables
fontSize  = '36px' # temporarily
fontFamily = 'Helvetica' # for now

module.exports = (sentences, fontSizeChange, scroll, mode) ->

  console.log 'fluent textPorting started ' + '(mode ' + mode + ')'

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

  #console.dir sceneObject
  #console.dir sceneHook.svg

  sceneObject.textPortInnerSVG.element = sceneHook.svg.append('svg')

  sceneObject.textPortInnerSVG.subElement = sceneObject.textPortInnerSVG.element.append('g')
                                 .style('text-anchor', 'start')
                                 .style('fill', 'rgb(255,255,220)')                                                                                                                                            
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
    x = 0
    y = 0
    for sentence in sentences
      for token in sentence.text

        tokenViewable = textDraw.tokenToViewable(token.text, sceneObject.textPortInnerSVG.subElement)
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

        if x + tokenViewable.width < sceneObject.textPortInnerSVG.element.attr('width')
          #console.log 'adding to line'
          tokenViewable.svg.attr('x', x)
          tokenViewable.svg.attr('y', y)
          x += tokenViewable.width
        else  
          if y + tokenViewable.height + lHeight < sceneObject.textPortInnerSVG.element.attr('height')
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
        if x + spaceWidth < sceneObject.textPortInnerSVG.element.attr('width')
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
  #  sceneObject.textPortInnerSVG.subElement.transition().duration(...)
 