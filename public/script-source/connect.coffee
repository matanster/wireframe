util = require('./util')
data = require('./data')
console.log 'connect.js started'

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
                  setTimeout((() -> window.location.href = '/wait.html'), 50)) # need this wait because of https://code.google.com/p/chromium/issues/detail?id=3a69986&thanks=369986&ts=1399291013

    svg.upload.on('dragover', () -> 
        console.log('dragover')
        this.style.cursor = "progress"
        setTimeout((() -> window.location.href = '/wait.html'), 1700)) # need this wait because of https://code.google.com/p/chromium/issues/detail?id=3a69986&thanks=369986&ts=1399291013
  

  text = () ->
    svg.text = svg.main.append('text').text("let us know where's the article")
                              .style("text-anchor", "middle")
                              .attr("dominant-baseline", "central")
                              .style("font-family", "Helvetica")
                              .style("font-weight", "bold")
                              .attr("font-size", "25px")

    svg.text1 = svg.main.append('text').text("Upload or Connect an Article")
                              .style("text-anchor", "middle")
                              .attr("dominant-baseline", "central")
                              .style("font-family", "Helvetica")
                              .style("font-weight", "bold")
                              .attr("font-size", "45px")



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
          .attr('y', heightQuantum * 1.3)
          .style('fill', '#40bff1') 
          .style('opacity', 1)  

  svg.text1.attr('x', viewport.width / 2)
          .attr('y', heightQuantum * 0.9)
          .style('fill', '#EEEEEE') 
          .style('opacity', 1)  
          .style('font-style', 'italic')
   
  #svg.text.transition().style('opacity', 1)
  svg.upload.transition().style('opacity', 1).duration(600).delay(500)
  svg.link.transition().style('opacity', 1).duration(600).delay(1000)  
  svg.dropbox.transition().style('opacity', 1).duration(650).delay(1200)  

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
