/*
    zip-viewer plugin
    - 압축파일을 볼 수 있는 extension
    
    creator : Hacademy(www.sysout.co.kr)
*/

function zipViewerPlugin(){
    toastui.Editor.codeBlockManager.setReplacer("zipviewer", function (serial) {
        const wrapperId = 'zipviewer' + Math.random().toString(36).substr(2, 10);
        setTimeout(renderZipViewer.bind(null, wrapperId, serial), 0);

        return '<div id=' + wrapperId + '></div>';
    });
    
    function renderZipViewer(wrapperId, serial){
        var el = document.getElementById(wrapperId);
		var iframe = document.createElement('iframe');
        
//		스크롤 제거를 위한 overflow 설정
		iframe.scrolling = "no"
		iframe.style.width = "100%";
		iframe.style.height = "300px";
		iframe.style.overflow = "hidden";
		iframe.src="http://www.sysout.co.kr/home/zipviewer/"+serial;
		iframe.addEventListener("load", function(){
			resizeFrame();
		});
//		iframe 배치
		el.appendChild(iframe);
		
//		expand button
		var ex = createExpandButton();
		ex.addEventListener("click", expandFrame);
		el.appendChild(ex);
		
//		resize button
		var a = createResizeButton();
		a.addEventListener("click", function(){
			resizeFrame();
		});
		el.appendChild(a);
		
		function resizeFrame(){
			var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
			var height = parseInt(iframe.contentWindow.getComputedStyle(iframedoc.querySelector(".zip-viewer")).height);
			iframe.style.height = height+5+"px"; 
		}
		
		function expandFrame(){
			var wrapper = this.parentElement;
			var iframe = wrapper.children[0];
			var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
			var refresh = wrapper.children[2];
			wrapper.removeAttribute("style");
			if(wrapper.classList.contains("fullscreen")){
				wrapper.style.position="relative";
				wrapper.classList.remove("fullscreen");
				iframedoc.querySelector(".zip-viewer").classList.remove("fullscreen");
				this.classList.add("fa-expand");
				this.classList.remove("fa-compress")
				refresh.click();
			}
			else{
				wrapper.style.position = "fixed";
				wrapper.style.top = 0;
				wrapper.style.bottom = 0;
				wrapper.style.left = 0;
				wrapper.style.right = 0;
				wrapper.style.zIndex = 99999;
				wrapper.style.backgroundColor = "white";
				wrapper.classList.add("fullscreen");
				iframe.style.height = "";
				iframedoc.querySelector(".zip-viewer").classList.add("fullscreen");
				this.classList.remove("fa-expand");
				this.classList.add("fa-compress")
			}
		}
    }
}