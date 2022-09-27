figma.showUI(__html__);
figma.ui.onmessage = msg => {
  if(msg.type === 'copy'){
    let result = {}
    for (const node of figma.currentPage.selection) {
      let code = node.name.replace(/^.*\(|\)$/gm, '')
      if(code in result){
        result[code]++
      } else {
        result[code] = 1
      }
    }
    figma.ui.postMessage({
      type: 'ok',
      value: result,
    })
  }
};
