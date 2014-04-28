util = require('./util')
console.log 'javascript main started'

# Globals
svg = {}
viewport = null

boxBlock = (numberOfBoxes) ->
  svg.boxes = []
  for box in [0..numberOfBoxes-1]
    svg.boxes[box]=svg.main.append("rect")
            .style("fill", "#97c7e4")            
            .on("mouseover", () -> d3.select(this).style("fill", "#a7d7f4"))
            .on("mouseout", () -> d3.select(this).style("fill", "#97c7e4"));
    

syncContent = (viewport) ->
  svg.main.attr("width", viewport.width)
          .attr("height", viewport.height)

  totalH = viewport.height
  boxH = totalH / svg.boxes.length

  for i in [0..svg.boxes.length-1]
    svg.boxes[i].attr("x", -20)
       .attr("y", boxH * i)
       .attr("width", 200)
       .attr("height", boxH)
       .attr("rx", 20)            
       .attr("ry", 10)                        
 
#
# Keep everything harmonized with the viewport size
#

sceneDefine = () ->
  svg.main = d3.select("body").append("svg")
  boxBlock(6)

sync = () ->
  viewport = util.getViewport()
  console.dir viewport
  syncContent(viewport)

syncInit = () ->
  sync()                          # initial sync
  window.onresize = () -> sync()  # keep sync forever

sceneDefine()
syncInit()

###
svg.main.append("circle")
    .style("stroke", "gray")
    .style("fill", "white")
    .attr("r", 40)
    .attr("cx", 50)
    .attr("cy", 50)
    .on("mouseover", () -> d3.select(this).style("fill", "aliceblue"))
    .on("mouseout", () -> d3.select(this).style("fill", "white"));
###