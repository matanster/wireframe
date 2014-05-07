util = require('./util')
data = require('./data')
console.log 'hive.js started'

# Globals
svg = {}
viewport = null

calcStart = () -> 90
calcEnd   = () -> 90

#####################################################################
#
# Define the objects making the scene, plus any of their properties 
# that won't change with subsequent window resizing
#
#####################################################################
sceneDefine = (callback) ->

  main = () ->
    svg.main = d3.select('body').append('svg').style('background-color', '#222288')   

  images = () ->

    #group = svg.main.append("svg")
    
    #svg.group = group

    svg.upload = svg.main.append("svg:image")
      .attr("xlink:href","images/upload.svg")
    
    svg.link = svg.main.append("svg:image")
      .attr("xlink:href","images/link.svg")

    svg.dropbox = svg.main.append("svg:image")
      .attr("xlink:href","images/dropbox.svg")

    for element in [svg.upload, svg.link, svg.dropbox]
      element.on('mouseover', () -> 
                  console.log('hover')
                  this.style.cursor = "pointer")

             .on('mouseout', () -> 
                  console.log('end hover')
                  this.style.cursor = "default")

             .on('mousedown', () -> 
                  console.log('click')
                  this.style.cursor = "progress"
                  setTimeout((() -> window.location.href = '/read.html'), 50)) # need this wait because of https://code.google.com/p/chromium/issues/detail?id=3a69986&thanks=369986&ts=1399291013
  
  text = () ->
    svg.text = svg.main.append('text').text("let us know where's the article")
                              .style("text-anchor", "middle")
                              .attr("dominant-baseline", "central")
                              .style("font-family", "Helvetica")
                              .style("font-weight", "bold")
                              .attr("font-size", "35px")

  main()
  text()
  images()

  callback()



######################################################
#
# Keep everything harmonized with the viewport size
#
######################################################
sceneSync = () ->

  viewport = util.getViewport()
  console.dir viewport

  console.log 'starting scene sync'

  start = calcStart()
  end   = 0 # calcEnd()

  # draw main svg
  svg.main.attr('width', viewport.width)
          .attr('height', viewport.height)
  
  widthQuantum = viewport.width / 10    # split horizontally to 10 units
  diameter = widthQuantum * 2           # width quantum sets the diameter
  heightQuantum = viewport.height / 6   # split vertically

  # draw images
  svg.upload.attr('width', diameter)
            .attr('height', diameter)
            .attr('x', widthQuantum * 1)
            .attr('y', heightQuantum * 2)
            .style('opacity', 0.01)            

  svg.link.attr('width', diameter)
            .attr('height', diameter)
            .attr('x', widthQuantum * 4)
            .attr('y', heightQuantum * 3)
            .style('opacity', 0.01)

  svg.dropbox.attr('width', diameter)
            .attr('height', diameter)
            .attr('x', widthQuantum * 7)
            .attr('y', heightQuantum * 2)
            .style('opacity', 0.01)

  svg.text.attr('x', viewport.width / 2)
          .attr('y', heightQuantum * 1.5)
          .style('fill', '#EEEEEE') 
          .style('opacity', 1)  
   
  #svg.text.transition().style('opacity', 1)
  svg.upload.transition().style('opacity', 1).duration(1000).delay(600)
  svg.link.transition().style('opacity', 1).duration(1000).delay(1400)  
  svg.dropbox.transition().style('opacity', 1).duration(1000).delay(2000)  

  return  

syncInit = () ->
  sceneSync()                          # initial sync
  window.onresize = () -> sceneSync()  # keep sync forever

##################
#                #
#  Start it all  #
#                #
##################
sceneDefine(syncInit)
#syncInit()
