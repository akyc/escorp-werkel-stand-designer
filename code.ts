

figma.showUI(__html__, {"title": 'Конструктор стендов Werkel', 'width': 400, 'height': 600});
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
    console.log(msg.imgData)
  }
};

