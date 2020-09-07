/*
    ToastUI Editor Typing Plugin
    
    creator : Hacademy(www.sysout.co.kr)
*/
function typingPlugin(){
    toastui.Editor.codeBlockManager.setReplacer("typing", function (sourceCode) {
        const wrapperId = 'typing' + Math.random().toString(36).substr(2, 10);
        setTimeout(renderHtml.bind(null, wrapperId, sourceCode.trim()), 0);
        return '<div id=' + wrapperId + ' data-source-code="'+encodeURIComponent(sourceCode.trim())+'"></div>';
    });
    
    function renderHtml(wrapperId, sourceCode){
		var el = document.getElementById(wrapperId);
		var app = new Hacademy.TypingPane(el, {
            strict:false,
            progress:true,
		});
	}
}

function typingStrictPlugin(){
    toastui.Editor.codeBlockManager.setReplacer("typing-strict", function (sourceCode) {
        const wrapperId = 'typing-strict' + Math.random().toString(36).substr(2, 10);
        setTimeout(renderHtml.bind(null, wrapperId, sourceCode), 0);
        return '<div id=' + wrapperId + ' data-source-code="'+encodeURIComponent(sourceCode)+'"></div>';
    });
    
    function renderHtml(wrapperId, sourceCode){
		var el = document.getElementById(wrapperId);
		var app = new Hacademy.TypingPane(el, {
            strict:true,
            progress:true,
		});
	}
}