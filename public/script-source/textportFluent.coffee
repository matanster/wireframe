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
                                   .style('position', 'absolute')
                                   .style('-overflow-scrolling', 'touch') # check out http://iscrolljs.com/ for finer experience
                                   .attr('class', 'scroll')
                                   .html("""<svg id='textPortInnerSVG' style='overflow-y: scroll;'></svg>""")
  sceneObject.textPortInnerSVG.element = d3.select('#' + 'textPortInnerSVG')

  sceneHook.textPortDiv.on('scroll', () -> 
    console.log("""scroll #{sceneHook.textPortDiv.node().scrollTop}""")

  )

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
    
    # adjust container svg to length of text (to enable smooth scrolability)
    sceneObject.textPortInnerSVG.element.attr('height', y + 30)

    sceneHook.textPortDiv.node().scrollTop = 300

    return viewPortFull        

  return redraw()  

 