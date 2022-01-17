/*
    ToastUI Editor Typing Plugin
    
    creator : Hacademy(www.sysout.co.kr)
*/

//구버전(2.x)
// function typingPlugin(){
//     toastui.Editor.codeBlockManager.setReplacer("typing", function (sourceCode) {
//         const wrapperId = 'typing' + Math.random().toString(36).substr(2, 10);
//         setTimeout(renderHtml.bind(null, wrapperId, sourceCode.trim()), 0);
//         return '<div id=' + wrapperId + ' data-source-code="'+encodeURIComponent(sourceCode.trim())+'"></div>';
//     });
// }

//신버전(3.x)
function typingPlugin(){
    const toHTMLRenderers = {
        typing(node){
            const wrapperId = 'typing-' + Math.random().toString(36).substring(2, 12);
            
            
            if(node.literal.trim()){
                setTimeout(renderTypingHtml.bind(null, wrapperId, null), 50);
            }

            return [
                {type:'openTag', tagName:'div', outerNewLine:true, attributes:{id:wrapperId, "data-source-code":encodeURIComponent(node.literal.trim())}},
                {type:'html', content:""},
                {type:'closeTag', tagName:'div', outerNewLine:true},
            ];
        }
    };
    return {toHTMLRenderers};
}
    
function renderTypingHtml(wrapperId, sourceCode){
    var el = document.getElementById(wrapperId);
    var app = new Hacademy.TypingPane(el, {
        strict:false,
        progress:true,
    });
}

// 구버전(2.x)
// function typingStrictPlugin(){
//     toastui.Editor.codeBlockManager.setReplacer("typing-strict", function (sourceCode) {
//         const wrapperId = 'typing-strict' + Math.random().toString(36).substr(2, 10);
//         setTimeout(renderHtml.bind(null, wrapperId, sourceCode), 0);
//         return '<div id=' + wrapperId + ' data-source-code="'+encodeURIComponent(sourceCode)+'"></div>';
//     });
// }

//신버전(3.x)
function typingStrictPlugin(){
    const toHTMLRenderers = {
        typingStrict(node){
            const wrapperId = 'typing-strict-' + Math.random().toString(36).substring(2, 12);

            if(node.literal.trim()){
                setTimeout(renderTypingStrictHtml.bind(null, wrapperId, null), 50);
            }
            return [
                {type:'openTag', tagName:'div', outerNewLine:true, attributes:{id:wrapperId, "data-source-code":encodeURIComponent(node.literal.trim())}},
                {type:'html', content:""},
                {type:'closeTag', tagName:'div', outerNewLine:true},
            ];
        }
    };
    return {toHTMLRenderers};
}

function renderTypingStrictHtml(wrapperId, sourceCode){
    var el = document.getElementById(wrapperId);
    var app = new Hacademy.TypingPane(el, {
        strict:true,
        progress:true,
    });
}