/*
    ToastUI Editor HTML Renderer Plugin
    
    creator : Hacademy(www.sysout.co.kr)
*/
function htmlRendererPlugin(){
    toastui.Editor.codeBlockManager.setReplacer("render", function (htmlCode) {
        const wrapperId = 'render' + Math.random().toString(36).substr(2, 10);
        setTimeout(renderHtml.bind(null, wrapperId, htmlCode), 0);
        return '<div id=' + wrapperId + ' data-content="'+htmlCode+'"></div>';
    });
    
    function renderHtml(wrapperId, htmlCode){
		var el = document.getElementById(wrapperId);
		var app = new Hacademy.RenderPane(el, {
			mode:"result"
		});
	}
}