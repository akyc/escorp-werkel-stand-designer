

figma.showUI(__html__, {"title": 'Конструктор стендов Werkel', 'width': 600, 'height': 700});
figma.ui.onmessage = msg => {
  if(msg.type === 'calc-products'){
    let result = {},
    group = figma.currentPage.findOne(node => node.type === "GROUP" && node.name === "Расчет")
    if (group) {
      for (const node of group.children) {
        let code = node.name
        if(result && code in result){
          result[code]++
        } else {
          result[code] = 1
        }
      }
      figma.ui.postMessage({ type: 'calc-result', value: result })
    } else {
      figma.ui.postMessage({ type: 'calc-result', value: false })
    }
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
      let group = figma.currentPage.findOne(node => node.type === "GROUP" && node.name === "Расчет")
      if(group){
        group.appendChild(rect)
      } else {
        let group = figma.group([rect], figma.currentPage)
          group.name = 'Расчет'
      }
      
      figma.currentPage.selection = [rect]
  }
  if(msg.type === 'draw-schema'){
    let group = figma.currentPage.findOne(node => node.type === "GROUP" && node.name === "Расчет")
    if (group.children.length) {
      let nodesList = [],
          gap = 500,
          maxX = Math.max(...group.children.map(node => node.x + node.width)),
          promisesList = [];

      for (const node of group.children) {
        const rect = figma.createRectangle()
        rect.resize(node.width, node.height)
        rect.x = node.x + gap + maxX
        rect.y = node.y
        rect.fills = [{
          type: 'SOLID',
          opacity: 0,
          color: {r:0,g:0,b:0},
        }]
        rect.strokes = [{
          type: "SOLID",
          color: {r: 0, g: 0, b: 0}
        }]
        rect.strokeWeight = 5;
        nodesList.push(rect);
        (async () => {
          const text = figma.createText()
          let promise = new Promise(resolve => resolve(nodesList.push(text)))
          promisesList.push(promise)
          await figma.loadFontAsync({ family: "Inter", style: "Regular" })
          text.characters = node.name
          text.fontSize = 38
          text.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }]
          text.x = rect.x + 10
          text.y = rect.y + 10
        })()
      }
      Promise.all(promisesList).then(
        resolve => {
          let group = figma.group(nodesList, figma.currentPage)
          group.name = 'Схема стенда'
          figma.ui.postMessage({ type: 'nodes-to-del', 'shemaGroupId': group.id})
        },
        error => { console.error('Load font failed. ',error) })
    }
  }
  if(msg.type === 'export-schema'){
    let group = figma.currentPage.findOne(node => node.id === msg.shemaGroupId)
    if(group){
      group.exportAsync({
          format: 'PDF',
      })
    }
  }
  if(msg.type === 'delete-schema'){
    figma.currentPage.findOne(n => n.id === msg.shemaGroupId).remove()
  }

};

