# gets browser viewport dimensions
exports.getViewport = () -> { width: window.innerWidth, height: window.innerHeight }

# calculates the interval between two numbers
exports.calcLength = (i1, i2) -> i2 - i1 + 1

exports.makeSvgTopLayer = (element) ->
  element.parentNode.appendChild(element) # move to svg top "layer"

getPaneID = () ->
  if paneCounter?
    paneCounter +=1
  else
    paneCounter = 0
  console.log("paneCounter" + paneCounter)
  return paneCounter

exports.titlePaneCreate = (svgAnchor) ->

  paneObject = Object

  paneObject.element = svgAnchor.append('g')

  paneObject.pane = paneObject.element.append('rect')
                                   .style('fill', '#60CAFB')   

  # nest an html element containing an svg, inside the topmost svg hook, so we can use a non-svg transform on it
  paneId = "pane" + getPaneID() # unique DOM id for being able to retreive the html embedded svg for modifying it
  console.log "pangeId: " + paneId
  paneObject.textwrapper = paneObject.element.append('foreignObject')
                         .append('xhtml:body')
                         .html("""<svg id=#{paneId} style='-webkit-transform: perspective(40px) rotateX(2deg)'></svg>""")

  paneObject.textwrapper.style('pointer-events', 'none') # disable mouse events and let them drip through
  
  # modify the svg nested inside the html just created
  paneObject.text = d3.select('#' + paneId).append('text')
                                    #.attr("id", "title")
                                    .attr("dominant-baseline", "central")
                                    .style("text-anchor", "middle")
                                    .style('fill', "#EEEEEE")

  paneObject.paneId = paneId
  return paneObject
