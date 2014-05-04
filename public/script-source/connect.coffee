util = require('./util')
data = require('./data')
console.log 'connect.jsZ started'

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
sceneDefine = () ->

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
                  document.body.style.cursor = "pointer")

             .on('mouseout', () -> 
                  console.log('end hover')
                  document.body.style.cursor = "initial")


             .on('mousedown', () -> 
                  console.log('click')
                  window.location.href = '/read.html')
    
  main()
  images()

######################################################
#
# Keep everything harmonized with the viewport size
#
######################################################
sceneSync = () ->

  viewport = util.getViewport()
  console.dir viewport

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
            .style('opacity', 0)            

  svg.link.attr('width', diameter)
            .attr('height', diameter)
            .attr('x', widthQuantum * 4)
            .attr('y', heightQuantum * 3)
            .style('opacity', 0)

  svg.dropbox.attr('width', diameter)
            .attr('height', diameter)
            .attr('x', widthQuantum * 7)
            .attr('y', heightQuantum * 2)
            .style('opacity', 0)

  svg.upload.transition().duration(3000).style('opacity', 1)
  svg.link.transition().duration(3000).style('opacity', 1)  
  svg.dropbox.transition().duration(3000).style('opacity', 1)  

syncInit = () ->
  sceneSync()                          # initial sync
  window.onresize = () -> sceneSync()  # keep sync forever

##################
#                #
#  Start it all  #
#                #
##################
sceneDefine()
syncInit()
