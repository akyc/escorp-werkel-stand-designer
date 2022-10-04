

figma.showUI(__html__, {"title": 'Конструктор стендов Werkel', 'width': 600, 'height': 700});
figma.ui.onmessage = msg => {
  if(msg.type === 'copy'){
    let result = {}
    if (figma.currentPage.selection.length) {
      for (const node of figma.currentPage.selection) {
        let code = node.name.replace(/^.*\(|\)$/gm, '')
        if(code in result){
          result[code]++
        } else {
          result[code] = 1
        }
      }
    } else {
      result = null
    }
    
    figma.ui.postMessage({
      type: 'ok',
      value: result,
    })
  }
  if(msg.type === 'createImage'){
    const image = figma.createImage(msg.image)
    const rect = figma.createRectangle();
      rect.resize(msg.size[0], msg.size[1])
      rect.x = figma.viewport.center.x - msg.size[0] / 2
      rect.y = figma.viewport.center.y - msg.size[1] / 2
      rect.name = msg.code;
      rect.fills = [{
        type: 'IMAGE',
        scaleMode: 'FILL',
        imageHash: image.hash,
      }];
      figma.currentPage.appendChild(rect);
      figma.currentPage.selection = [rect]
  }
  if(msg.type === 'draw-schema'){
    
    if (figma.currentPage.selection.length) {
      let nodeIds = []
      let gap = 500,
      maxX = Math.max(...figma.currentPage.selection.map(el => el.x + el.width));

      for (const node of figma.currentPage.selection) {
        const fill = {
          type: 'SOLID',
          opacity: 0,
          color: {r:0,g:0,b:0},
        }
        const stroke = {
          type: "SOLID",
          color: {r: 0, g: 0, b: 0}

        }
        const rect = figma.createRectangle()
        rect.resize(node.width, node.height)
        rect.x = node.x + gap + maxX
        rect.y = node.y
        rect.fills = [fill]
        rect.strokes = [stroke]
        rect.strokeWeight = 5;
        nodeIds.push(rect.id);
        (async () => {
          const text = figma.createText()
          await figma.loadFontAsync({ family: "Inter", style: "Bold" })
          text.characters = node.name
          text.fontSize = 36
          text.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }]
          text.x = rect.x + 10
          text.y = rect.y + 10
          nodeIds.push(text.id)
        })()
      }
      figma.ui.postMessage({ type: 'nodes-to-del', list: nodeIds })
    }
  }
  if(msg.type === 'delete-schema'){
    
  }
};

