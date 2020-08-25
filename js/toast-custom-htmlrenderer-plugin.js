/*
    ToastUI Editor HTML Renderer Plugin
    
    creator : Hacademy(www.sysout.co.kr)
*/
function htmlRendererPlugin(){
    toastui.Editor.codeBlockManager.setReplacer("render", function (htmlCode) {
        const wrapperId = 'render' + Math.random().toString(36).substr(2, 10);
        setTimeout(renderHtml.bind(null, wrapperId, htmlCode), 0);

        return '<div id=' + wrapperId + '></div>';
    });
    
    function renderHtml(wrapperId, htmlCode){
		var el = document.getElementById(wrapperId);
		var iframe = document.createElement('iframe');
//		스크롤 제거를 위한 overflow 설정
		iframe.scrolling = "no"
		iframe.style.width = "100%";
		iframe.style.minHeight = "150px";
		iframe.style.overflow = "hidden";
		iframe.style.border = "none";
		iframe.addEventListener("load", function(){
			resizeFrame();
		});
//		iframe 배치
		el.appendChild(iframe);
		
//		내용 작성
		var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
		iframedoc.open();
		iframedoc.write(htmlCode);
		iframedoc.close();
		
//		onload 이벤트 발생
		iframedoc.dispatchEvent(new Event("load"));
		
//		expand button
//		var ex = createExpandButton();
//		ex.addEventListener("click", expandFrame);
//		el.appendChild(ex);
		
//		resize button
//		var a = createResizeButton();
//		a.addEventListener("click", function(){
//			resizeFrame();
//		});
//		el.appendChild(a);
		
		function resizeFrame(){
			var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
			var height = parseInt(iframe.contentWindow.getComputedStyle(iframedoc.body).height);
			iframe.style.height = height+30+"px"; 
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
				this.classList.add("fa-expand");
				this.classList.remove("fa-compress")
				setTimeout(function(){
					refresh.click();
				}, 50);
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
				this.classList.remove("fa-expand");
				this.classList.add("fa-compress")
			}
		}
        
        //resize button
        function createResizeButton(){
            var tag = document.createElement("i");
            tag.classList.add("fa");
            tag.classList.add("fa-refresh");
            tag.title = "뷰어 크기 조정";
            tag.style.display = "inline-block";
            tag.style.position = "absolute";
            tag.style.textDecoration = "none";
            tag.style.top = "0.5rem";
            tag.style.right = "2.5rem";
            tag.style.cursor = "pointer";
            tag.style.color = "#666";
            tag.style.border = "1px solid gray;"
            return tag;
        }
        
        function createExpandButton(){
            var tag = document.createElement("i");
            tag.classList.add("fa");
            tag.classList.add("fa-expand");
            tag.title = "전체 화면 보기";
            tag.style.display = "inline-block";
            tag.style.position = "absolute";
            tag.style.textDecoration = "none";
            tag.style.top = "0.5rem";
            tag.style.right = "0.5rem";
            tag.style.cursor = "pointer";
            tag.style.color = "#666";
            tag.style.border = "1px solid gray;"
            return tag;
        }
	}
}