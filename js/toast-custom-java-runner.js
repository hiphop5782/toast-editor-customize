/*
    ToastUI Editor Java Runner
    
    creator : Hacademy(www.sysout.co.kr)
*/
function javaSimpleRunner(){
    toastui.Editor.codeBlockManager.setReplacer("java-simple", function (sourceCode) {
        const wrapperId = 'java-simple' + Math.random().toString(36).substr(2, 10);
        setTimeout(render.bind(null, wrapperId, sourceCode.trim()), 0);
        return '<div id=' + wrapperId + '></div>';
    });
    
    function render(wrapperId, sourceCode){
		var el = document.getElementById(wrapperId);
		var app = new Hacademy.TypingPane(el, {
            strict:false,
            progress:true,
		});
	}
}

function javaMainRunner(){
    toastui.Editor.codeBlockManager.setReplacer("java-main", function (sourceCode) {
        const wrapperId = 'java-main' + Math.random().toString(36).substr(2, 10);
        setTimeout(render.bind(null, wrapperId, sourceCode), 0);
        return '<div id=' + wrapperId + ' data-source-code="'+encodeURIComponent(sourceCode)+'"></div>';
    });
    
    function render(wrapperId, sourceCode){
		var el = document.getElementById(wrapperId);
		var app = new Hacademy.TypingPane(el, {
            strict:true,
            progress:true,
		});
	}
}