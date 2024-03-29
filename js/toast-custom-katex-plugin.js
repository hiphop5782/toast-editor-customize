/*
    toast ui editor custom plugin
    - katex 수식 플러그인
    - katex 라이브러리 필요
    
    creator : Hacademy(http://www.sysout.co.kr)
*/

function katexPlugin(){
    const toHTMLRenderers = {
        katex(node){
            const html = katex.renderToString(node.literal, {
                throwOnError: false
            });
            return [
                {type:'openTag', tagName:'div', outerNewLine:true},
                {type:'html', content:html},
                {type:'closeTag', tagName:'div', outerNewLine:true},
            ];
        },
    };
    return {toHTMLRenderers};
    
    // 구버전 코드

    // toastui.Editor.codeBlockManager.setReplacer("katex", function(text){
    //     const wrapperId = 'katex' + Math.random().toString(36).substr(2, 10);
    //     setTimeout(renderKatex.bind(null, wrapperId, text), 0);
    //     return '<div id="'+ wrapperId + '"></div>';
    // });
    
    // function renderKatex(wrapperId, text){
    //     var el = document.getElementById(wrapperId);//대상 div
	// 	katex.render(text.trim(), el, {
	// 		throwOnError:false
	// 	});
    // }
}