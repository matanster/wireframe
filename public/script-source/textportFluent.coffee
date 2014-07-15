# import global geometry
util         = require './util'
globalDims   = require './globalDims'
sceneObject  = globalDims.sceneObject
sceneHook    = globalDims.sceneHook
layout       = globalDims.layout
session      = require './session'
tokenize     = require './tokenize'
textDraw     = require './textDraw'

# module static variables
fontSize  = '22px' # temporarily
fontFamily = 'Helvetica' # for now

module.exports = (categorizedTextTree, fontSizeChange, scroll, mode) ->

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

  sceneObject.textPortInnerSVG = {}

  #
  # Create top SVG for all this, for easy relative positioning,
  # and a 'g' element to afford treating the whole bunch as one group
  #

  paddingX = 20
  paddingY = 18
    
  sceneObject.textPortInnerSVG.element = d3.select('#' + 'textPortInnerSVG')
  console.log "textportInnerSVG"
  console.dir sceneObject.textPortInnerSVG.element 
  
  # separate svg element to contain the actual text
  #sceneObject.textPortInnerSVG.element = sceneHook.svg.append('svg')
  #                                                    .style('overflow-y', 'auto')

  # inside it, an svg group for the actual words
  sceneObject.textPortInnerSVG.subElement = sceneObject.textPortInnerSVG.element.append('g')
                                 .style('text-anchor', 'start')
                                 .style('fill', 'rgb(220,220,220)')                                                                                                                                            
                                 .style('font-family',fontFamily)
                                 .style('font-size',fontSize)

  width = parseFloat(sceneObject.textPort.element.attr('width')) - (paddingX * 2) - 3 + 20

  sceneHook.textPortDiv.style('top', '100px')
               .style('left', '315px')
               .style('height', 250)
               .style('width', width + 16)
               .style('webkit-overflow-scrolling', 'touch')

  util.makeSvgTopLayer(sceneHook.textPortDiv.node())

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
    .attr('height', 2000) #parseFloat sceneObject.textPort.element.attr('height') - (paddingY * 2) - 50 # must be large enough to contain all text content! otherwise no scroll of the text!

  redraw = () ->
    #
    # redraw text
    #
    viewPortFull = false
    x = 0
    y = 0

    for categoryNode in categorizedTextTree
      if categoryNode.name is session.selected.name
        console.log """categroy #{session.selected.name} found"""
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
                           .attr("font-size", "30px")
                           .style('fill', '#aaaaaa')

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
    
    return viewPortFull        

  return redraw()  

  #
  # Scroll the text - to do:
  # 
  # Take care drawing beyond the visible
  # Tween the text on scroll
  # Remove Down Button when reached bottom
  # Add Up button after initial scroll
  #
 