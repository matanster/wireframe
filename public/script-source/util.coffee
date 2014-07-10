# gets browser viewport dimensions
exports.getViewport = () -> { width: window.innerWidth, height: window.innerHeight }

# calculates the interval between two numbers
exports.calcLength = (i1, i2) -> i2 - i1 + 1

exports.makeSvgTopLayer = (element) ->
  element.parentNode.appendChild(element) # move to svg top "layer"

# dispense a unique number for giving unique id's to svg DOM elements
# we could use a random ID instead..
paneCounter = 0
getPaneID = () ->
  paneCounter +=1
  return paneCounter

exports.titlePaneCreate = (svgAnchor, initialColor, rotated) ->

  paneObject = Object

  paneObject.element = svgAnchor.append('g')

  paneObject.pane = paneObject.element.append('rect')
                                   .style('fill', initialColor)   

  if rotated
    # nest an html element containing an svg, inside the topmost svg hook, so we can use a non-svg transform on it
    paneId = "pane" + getPaneID() # unique DOM id for being able to retreive the html embedded svg for modifying it
    paneObject.element.append('foreignObject')
                      .append('xhtml:body')
                      .html("""<svg id=#{paneId} style='-webkit-transform: perspective(40px) rotateX(2deg)'></svg>""")
                      .style('pointer-events', 'none') # disable mouse events and let them drip through
    paneObject.textwrapper = d3.select('#' + paneId)

    # modify the svg nested inside the html just created
    paneObject.text = paneObject.textwrapper.append('text')
                                      #.attr("id", "title")
                                      .attr("dominant-baseline", "central")
                                      .style("text-anchor", "middle")
                                      .style('fill', "#EEEEEE")
 
  else
    paneObject.text = paneObject.element.append('text')
                                      #.attr("id", "title")
                                      .attr("dominant-baseline", "central")
                                      .style("text-anchor", "middle")
                                      .style('fill', "#EEEEEE")

  paneObject.paneId = paneId
  return paneObject
