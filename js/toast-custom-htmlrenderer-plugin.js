/*
    ToastUI Editor HTML Renderer Plugin
    
    creator : Hacademy(www.sysout.co.kr)
*/

//2.x
// function htmlRendererPlugin(){
//     toastui.Editor.codeBlockManager.setReplacer("render", function (htmlCode) {
//         const wrapperId = 'render' + Math.random().toString(36).substr(2, 10);
//         setTimeout(renderHtml.bind(null, wrapperId, htmlCode), 0);
//         return '<div id=' + wrapperId + ' data-content="'+encodeURIComponent(htmlCode)+'"></div>';
//     });
    
//     function renderHtml(wrapperId, htmlCode){
// 		var el = document.getElementById(wrapperId);
// 		var app = new Hacademy.RenderPane(el, {
// 			mode:"result"
// 		});
// 	}
// }

// 3.x
function htmlRendererPlugin(){
    const toHTMLRenderers = { 
        render(node){
            const wrapperId = 'render-' + Math.random().toString(36).substring(2, 12);
            //console.log(wrapperId);

            //Hacademy RenderPane 사용(내용이 있을 경우에만)
            if(node.literal.trim()){
                setTimeout(()=>{
                    var el = document.getElementById(wrapperId);
                    console.log(el);
                    var app = new Hacademy.RenderPane(el, {
                        mode:"result"
                    });
                }, 50);
            }

            return [
                {type:'openTag', tagName:'div', outerNewLine:true, attributes:{id:wrapperId, "data-content":encodeURIComponent(node.literal.trim())}},
                {type:'html', content:""},
                {type:'closeTag', tagName:'div', outerNewLine:true},
            ];
        }
    };
    return {toHTMLRenderers};
};


// 2.x
// function htmlRendererSourcePlugin(){
//     toastui.Editor.codeBlockManager.setReplacer("render-source", function (htmlCode) {
//         const wrapperId = 'render-source' + Math.random().toString(36).substr(2, 10);
//         setTimeout(renderHtml.bind(null, wrapperId, htmlCode), 0);
//         return '<div id=' + wrapperId + ' data-content="'+encodeURIComponent(htmlCode)+'"></div>';
//     });
    
//     function renderHtml(wrapperId, htmlCode){
// 		var el = document.getElementById(wrapperId);
// 		var app = new Hacademy.RenderPane(el, {
// 			mode:"source"
// 		});
// 	}
// }

function htmlRendererSourcePlugin(){
    const toHTMLRenderers = { 
        renderSource(node){
            const wrapperId = 'render-source-' + Math.random().toString(36).substring(2, 12);
            //console.log(wrapperId);

            //Hacademy RenderPane 사용(내용이 있을 경우에만)
            if(node.literal.trim()){
                setTimeout(()=>{
                    var el = document.getElementById(wrapperId);
                    console.log(el);
                    var app = new Hacademy.RenderPane(el, {
                        mode:"source"
                    });
                }, 50);
            }

            return [
                {type:'openTag', tagName:'div', outerNewLine:true, attributes:{id:wrapperId, "data-content":encodeURIComponent(node.literal.trim())}},
                {type:'html', content:""},
                {type:'closeTag', tagName:'div', outerNewLine:true},
            ];
        }
    };
    return {toHTMLRenderers};
};

// 2.x
// function htmlRendererSplitPlugin(){
//     toastui.Editor.codeBlockManager.setReplacer("render-split", function (htmlCode) {
//         const wrapperId = 'render-split' + Math.random().toString(36).substr(2, 10);
//         setTimeout(renderHtml.bind(null, wrapperId, htmlCode), 0);
//         return '<div id=' + wrapperId + ' data-content="'+htmlencodeURIComponent(htmlCode)+'"></div>';
//     });
    
//     function renderHtml(wrapperId, htmlCode){
// 		var el = document.getElementById(wrapperId);
// 		var app = new Hacademy.RenderPane(el, {
// 			mode:"split"
// 		});
// 	}
// }

// 3.x
function htmlRendererSplitPlugin(){
    const toHTMLRenderers = { 
        renderSplit(node){
            const wrapperId = 'render-split-' + Math.random().toString(36).substring(2, 12);
            //console.log(wrapperId);

            //Hacademy RenderPane 사용(내용이 있을 경우에만)
            if(node.literal.trim()){
                setTimeout(()=>{
                    var el = document.getElementById(wrapperId);
                    console.log(el);
                    var app = new Hacademy.RenderPane(el, {
                        mode:"split"
                    });
                }, 50);
            }

            return [
                {type:'openTag', tagName:'div', outerNewLine:true, attributes:{id:wrapperId, "data-content":encodeURIComponent(node.literal.trim())}},
                {type:'html', content:""},
                {type:'closeTag', tagName:'div', outerNewLine:true},
            ];
        }
    };
    return {toHTMLRenderers};
};