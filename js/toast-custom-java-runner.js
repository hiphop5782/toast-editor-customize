/*
    ToastUI Editor Java Runner
    
    creator : Hacademy(www.sysout.co.kr)
*/
function javaSimpleRunner(){
    toastui.Editor.codeBlockManager.setReplacer("java-simple", function (sourceCode) {
        const wrapperId = 'java-simple-' + Math.random().toString(36).substr(2, 10);
        setTimeout(render.bind(null, wrapperId, sourceCode.trim()), 0);
        return '<div id=' + wrapperId + '></div>';
    });
    
    function render(wrapperId, sourceCode){
		var el = document.getElementById(wrapperId);
		var app = new Hacademy.JavaRunner(el, {
            code:sourceCode,
            mode:"simple"
		});
	}
}

function javaMainRunner(){
    toastui.Editor.codeBlockManager.setReplacer("java-main", function (sourceCode) {
        const wrapperId = 'java-main-' + Math.random().toString(36).substr(2, 10);
        setTimeout(render.bind(null, wrapperId, sourceCode), 0);
        return '<div id=' + wrapperId + '></div>';
    });
    
    function render(wrapperId, sourceCode){
		var el = document.getElementById(wrapperId);
		var app = new Hacademy.JavaRunner(el, {
            code:sourceCode,
            mode:"main"
		});
	}
}

function javaSimpleIDE(){
    toastui.Editor.codeBlockManager.setReplacer("java-ide-simple", function (sourceCode) {
        const wrapperId = 'java-ide-simple-' + Math.random().toString(36).substr(2, 10);
        setTimeout(render.bind(null, wrapperId, sourceCode), 0);
        return '<div id=' + wrapperId + '></div>';
    });
    
    function render(wrapperId, sourceCode){
		var el = document.getElementById(wrapperId);
		var app = new Hacademy.JavaRunner(el, {
            code:sourceCode,
            edit:true,
            mode:"simple"
		});
	}
}

function javaMainIDE(){
    toastui.Editor.codeBlockManager.setReplacer("java-ide-main", function (sourceCode) {
        const wrapperId = 'java-ide-main-' + Math.random().toString(36).substr(2, 10);
        setTimeout(render.bind(null, wrapperId, sourceCode), 0);
        return '<div id=' + wrapperId + '></div>';
    });
    
    function render(wrapperId, sourceCode){
		var el = document.getElementById(wrapperId);
		var app = new Hacademy.JavaRunner(el, {
            code:sourceCode,
            edit:true,
            mode:"main"
		});
	}
}