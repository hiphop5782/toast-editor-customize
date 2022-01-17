/*
    ToastUI Editor Java Runner
    
    creator : Hacademy(www.sysout.co.kr)
*/

//2.x
/* 
function javaSimpleRunner(){
    toastui.Editor.codeBlockManager.setReplacer("java-simple", function (sourceCode) {
        const wrapperId = 'java-simple-' + Math.random().toString(36).substr(2, 10);
        setTimeout(render.bind(null, wrapperId, sourceCode.trim()), 0);
        return '<div id=' + wrapperId + '></div>';
    });
    
    function render(wrapperId, sourceCode){
		var el = document.getElementById(wrapperId);
		var app = new Hacademy.JavaRunner(el, {
            code:encodeURIComponent(sourceCode),
            mode:"simple"
		});
	}
} 
*/

//3.x
function javaSimpleRunner(){
    const toHTMLRenderers = {
        javaSimple(node){
            const wrapperId = 'java-simple-' + Math.random().toString(36).substring(2, 12);

            if(node.literal.trim()){
                setTimeout(()=>{
                    var el = document.getElementById(wrapperId);
                    var app = new Hacademy.JavaRunner(el, {
                        code:encodeURIComponent(node.literal.trim()),
                        mode:"simple"
                    });
                }, 50);
            }
            return [
                {type:'openTag', tagName:'div', outerNewLine:true, attributes:{id:wrapperId}},
                {type:'html', content:""},
                {type:'closeTag', tagName:'div', outerNewLine:true},
            ];
        }
    };
    return {toHTMLRenderers};    
}

//2.x
/* function javaMainRunner(){
    toastui.Editor.codeBlockManager.setReplacer("java-main", function (sourceCode) {
        const wrapperId = 'java-main-' + Math.random().toString(36).substr(2, 10);
        setTimeout(render.bind(null, wrapperId, sourceCode), 0);
        return '<div id=' + wrapperId + '></div>';
    });
    
    function render(wrapperId, sourceCode){
		var el = document.getElementById(wrapperId);
		var app = new Hacademy.JavaRunner(el, {
            code:encodeURIComponent(sourceCode),
            mode:"main"
		});
	}
} */

//3.x
function javaMainRunner(){
    const toHTMLRenderers = {
        javaMain(node){
            const wrapperId = 'java-main-' + Math.random().toString(36).substring(2, 12);

            if(node.literal.trim()){
                setTimeout(()=>{
                    var el = document.getElementById(wrapperId);
                    var app = new Hacademy.JavaRunner(el, {
                        code:encodeURIComponent(node.literal.trim()),
                        mode:"main"
                    });
                }, 50);
            }
            return [
                {type:'openTag', tagName:'div', outerNewLine:true, attributes:{id:wrapperId}},
                {type:'html', content:""},
                {type:'closeTag', tagName:'div', outerNewLine:true},
            ];
        }
    };
    return {toHTMLRenderers};    
}

//2.x
/* 
function javaSimpleIDE(){
    toastui.Editor.codeBlockManager.setReplacer("java-ide-simple", function (sourceCode) {
        const wrapperId = 'java-ide-simple-' + Math.random().toString(36).substr(2, 10);
        setTimeout(render.bind(null, wrapperId, sourceCode), 0);
        return '<div id=' + wrapperId + '></div>';
    });
    
    function render(wrapperId, sourceCode){
		var el = document.getElementById(wrapperId);
		var app = new Hacademy.JavaRunner(el, {
            code:encodeURIComponent(sourceCode),
            edit:true,
            mode:"simple"
		});
	}
} 
*/

//3.x
function javaSimpleIDE(){
    const toHTMLRenderers = {
        javaIdeSimple(node){
            const wrapperId = 'java-ide-simple-' + Math.random().toString(36).substring(2, 12);

            if(node.literal.trim()){
                setTimeout(()=>{
                    var el = document.getElementById(wrapperId);
                    var app = new Hacademy.JavaRunner(el, {
                        code:encodeURIComponent(node.literal.trim()),
                        edit:true,
                        mode:"simple"
                    });
                }, 50);
            }
            return [
                {type:'openTag', tagName:'div', outerNewLine:true, attributes:{id:wrapperId}},
                {type:'html', content:""},
                {type:'closeTag', tagName:'div', outerNewLine:true},
            ];
        }
    };
    return {toHTMLRenderers};    
}


//2.x
/* function javaMainIDE(){
    toastui.Editor.codeBlockManager.setReplacer("java-ide-main", function (sourceCode) {
        const wrapperId = 'java-ide-main-' + Math.random().toString(36).substr(2, 10);
        setTimeout(render.bind(null, wrapperId, sourceCode), 0);
        return '<div id=' + wrapperId + '></div>';
    });
    
    function render(wrapperId, sourceCode){
		var el = document.getElementById(wrapperId);
		var app = new Hacademy.JavaRunner(el, {
            code:encodeURIComponent(sourceCode),
            edit:true,
            mode:"main"
		});
	}
} */

//3.x
function javaMainIDE(){
    const toHTMLRenderers = {
        javaIdeSimple(node){
            const wrapperId = 'java-ide-main-' + Math.random().toString(36).substring(2, 12);

            if(node.literal.trim()){
                setTimeout(()=>{
                    var el = document.getElementById(wrapperId);
                    var app = new Hacademy.JavaRunner(el, {
                        code:encodeURIComponent(node.literal.trim()),
                        edit:true,
                        mode:"main"
                    });
                }, 50);
            }
            return [
                {type:'openTag', tagName:'div', outerNewLine:true, attributes:{id:wrapperId}},
                {type:'html', content:""},
                {type:'closeTag', tagName:'div', outerNewLine:true},
            ];
        }
    };
    return {toHTMLRenderers};    
}