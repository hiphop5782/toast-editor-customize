(function (w) {
    if (!w) throw "Window is not defined";
    if (!toastui || !toastui.Editor) throw "Toast Dependency Not Defined";

    w.Hacademy = w.Hacademy || {};
    w.Hacademy.TuiEditor = w.Hacademy.TuiEditor || {};

    var util = w.Hacademy.TuiEditor;

    util.clone = function(obj) {
        if (obj === null || typeof (obj) !== 'object')
            return obj;

        var copy = obj.constructor();

        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = util.clone(obj[attr]);
            }
        }

        return copy;
    }

    const {chart, tableMergedCell, uml, colorSyntax, codeSyntaxHighlight} = toastui.Editor.plugin;
    const chartOptions = {
        minWidth: 100,
        maxWidth: 600,
        minHeight: 100,
        maxHeight: 300
    };

    const pluginList = [
        [chart, chartOptions]//chart plugin
        ,uml//uml plugin
        ,codeSyntaxHighlight//code highlight plugin
        ,tableMergedCell//table cell plugin
        ,colorSyntax//color syntax plugin
        ,treePathPlugin//custom tree path plugin
        ,katexPlugin//custom katex plugin
        ,youtubePlugin//custom youtube plugin
        ,zipViewerPlugin//custom zip-viewer plugin
        ,htmlRendererPlugin//custom html-renderer plugin(result base)
        ,htmlRendererSourcePlugin//custom html-renderer plugin(source base)
        ,htmlRendererSplitPlugin//custom html-renderer plugin(split base)
    ];
    
    const customHTMLRenderer = {
        //header anchor 추가
        heading(node, context){
            if(context.entering) util.sequence ++;
            return {
                type: context.entering ? 'openTag' : 'closeTag',
                tagName: 'h'+node.level,
                classNames:['header-anchor']
            }
        }
    };

    //editor 생성 함수
    // - editor를 생성할 때 내부에 있는 글자를 value로 설정하도록 구현
    // - ID가 있을 경우 ID로 등록하며, 없을 경우 번호로 등록
    // - 기본옵션에 클래스별 옵션이 적용되도록 변경
    // .vertical-editor : 미리보기가 같이 나오도록 변경
    // .wysiwyg-editor : wysiwyg 모드로 실행되도록 변경
    var defaultEditorOptions = {
        //대상은 생성 시 지정
        el: null,

        //기본 표시 형태를 markdown 모드로 설정
        initialEditType: "markdown",

        //높이 설정
        height: "400px",

        //통계 자동 전송 거부
        usageStatistics: false,

        //미리보기 스타일을 horizontal 모드로 설정
        previewStyle: "horizontal",

        //툴바 스타일 설정
        toolbarItems: [
            'heading','bold','italic',
            'divider',
            'hr','quote',
            'divider',
            'ul','ol','task','indent','outdent',
            'divider',
            'table','image','link',
            'divider',
            'code','codeblock',
            'divider'
        ],

        //플러그인 설정
        plugins: pluginList,
        
        //실시간 미리보기 설정
        contenteditable:false,
        
        //훅 설정
        hooks:{
            //파일 업로드 설정(axios 필요)
            'addImageBlobHook':function(blob, callback){
                var data = new FormData();
                data.append("upload", blob);
                
                axios.post("http://www.sysout.co.kr/file/upload-ckeditor", data, {
                    headers:{"Content-Type":"multipart/form-data"}
                })
                .then(result=>{
                    callback(result.data.url);
                })
                .catch(err=>{
                    alert("업로드 실패");
                });
            }
        },
        
        //custom render option 
        customHTMLRenderer:customHTMLRenderer    
    };

    var defaultViewerOptions = {
        //높이 설정
        height: "400px",

        //대상은 생성 시 지정
        el: null,

        //뷰어 설정
        viewer:true,

        //플러그인 설정
        plugins: pluginList,
        
        //custom render option 
        customHTMLRenderer:customHTMLRenderer    
    };

    util.createEditor = function (selector, callback) {
        var elements = document.querySelectorAll(selector);
        if (!elements.length) return;

        util.editors = util.editors || [];
        for (var i = 0; i < elements.length; i++) {
            //ID 계산(없으면 i로 설정)
            var idx = elements[i].id || i;

            var editor = util.createUnitEditor(elements[i]);
            
            util.editors[idx] = editor;
            if(callback && typeof callback === "function")
            	callback(editor);
        }
        clearLocalStorage(w, location.origin);
    };
    
    util.createUnitEditor = function(element){
    	//Option 복제 및 설정
        var cloneOptions = util.clone(defaultEditorOptions);

        //대상 설정
        cloneOptions.el = element;

        //내용을 불러와서 설정
        var content = element.dataset.content || "";
        if(content){
        	element.innerHTML = "";
        	delete element.dataset.content;
        	cloneOptions.initialValue = content;
        }

        //classList 점검 및 설정
        var classList = element.classList;

        // .vertical-editor : 미리보기가 같이 나오도록 변경
        // .wysiwyg-editor : wysiwyg 모드로 실행되도록 변경
        if (classList.contains("vertical-editor"))
            cloneOptions.previewStyle = "vertical";
        if (classList.contains("wysiwyg-editor"))
            cloneOptions.initialEditType = "wysiwyg";     
        
        //height setting
        cloneOptions.height = element.dataset.height || cloneOptions.height;

        //create editor and push
        var editor = toastui.Editor.factory(cloneOptions);
        
        //전송시 이름 설정
        var input = document.createElement("input");
        input.setAttribute("type", "hidden");
        var name = element.dataset.name || 'content';
        input.setAttribute("name", name);
        element.appendChild(input);
        
        editor.on("change", e=>{
            input.value = editor.getMarkdown();
        });
        
        //blur 이벤트 발생 시 localStorage에 저장
        // - 모든 에디터에 하지 말고 .record-editor에만 설정
        if(classList.contains("record-editor")){
            editor.on("blur", e=>{
                localStorage.setItem(location.href, editor.getMarkdown());
            });
        }
        
        //localStorage에 idx에 대한 이력이 존재하고, 입력값이 없을 때 confirm 띄우기
        var record = localStorage.getItem(location.href);
        if(classList.contains("record-editor") && record && !editor.getMarkdown()){
            if(confirm("이전 내역을 이어서 작성하시겠습니까?")){
                editor.setMarkdown(record);
            }
            localStorage.removeItem(location.href);
        }
        
        return editor;
    }
    
    //clear local storage
    function clearLocalStorage(window, origin){
    	for(var i=0; i < window.localStorage.length; i++){
    		var key = window.localStorage.key(i);
    		if(key.startsWith(origin)){
    			window.localStorage.removeItem(key);
    		}
    	}
    }
    
    util.isEditor = function(element){
    	if(typeof element === "string")
    		element = document.querySelector(element);
    	return !(!element.childNodes[0] || !element.childNodes[0].classList.contains("tui-editor-defaultUI"));
    };
    
    util.createOrReplaceEditor = function (selector, callback) {
    	var elements = document.querySelectorAll(selector);
        if (!elements.length) return;

        util.editors = [];
        
        for (var i = 0; i < elements.length; i++) {
        	var idx = elements[i].id || i;
        	if(!this.isEditor(elements[i])){
        		var editor = util.createUnitEditor(elements[i]);
        		util.editors[idx] = editor;
        	}
        	if(callback && typeof callback === "function")
        		callback(editor);
        }
        clearLocalStorage(w, location.origin);
    };

    util.createViewer = function (selector, callback) {
        var elements = document.querySelectorAll(selector);
        if (!elements.length) return;

        util.viewers = util.viewers || [];
        for (var i = 0; i < elements.length; i++) {
            //ID 계산(없으면 i로 설정)
            var idx = elements[i].id || i;

            //Option 복제 및 설정
            var cloneOptions = util.clone(defaultViewerOptions);

            //대상 설정
            cloneOptions.el = elements[i];

            //내용을 불러와서 설정
            var content = elements[i].dataset.content || "";
            delete elements[i].dataset.content;
            elements[i].textContent = "";
            cloneOptions.initialValue = content;

            //create editor and push
            var viewer = toastui.Editor.factory(cloneOptions);
            util.viewers[idx] = viewer;
            
            //create copy link in anchor
	        viewer.anchors = [];
	        var anchors = viewer.preview.el.querySelectorAll(".header-anchor");
	        for(var k=0; k < anchors.length; k++){
	            anchors[k].setAttribute("id", "header-anchor-"+k);
	            anchors[k].dataset.depth = anchors[k].tagName.substr(1, 1);
	            anchors[k].appendChild(util.createCopyElement());
	            viewer.anchors.push(anchors[k]);
	        }
            
	      //callback after viewer create
            if(callback && typeof callback === "function")
            	callback(viewer);
        }
        
    };
    
    util.createModeChanger = function(selector, callback){
    	 var elements = document.querySelectorAll(selector);
         if (!elements.length) return;
         
         for(var i=0; i < elements.length; i++){
        	 var button = elements[i];
        	 button.addEventListener("click", function(e){
        		 e.preventDefault();
        		 util.changeEditorMode();
        	 });
         }
    };
    
    util.changeEditorMode = function(){
        if(!util.editors.length) return;
        
        for(var i=0; i < util.editors.length; i++){
            var currentMode = util.editors[i].getCurrentPreviewStyle();
            var style = currentMode === 'tab' ? 'vertical' : 'tab';
            util.editors[i].changePreviewStyle(style);
        }
    };
    
    util.createCopyElement = function(){
        var small = document.createElement("small");
        small.classList.add("anchor-copy-element");
        
        var link = document.createElement("a");
        link.classList.add("anchor-copy-url");
        link.setAttribute("href", "#");
        link.setAttribute("title", "주소 복사");
        link.textContent = "★";
        link.addEventListener("click", util.copyToClipboard);
        
        small.appendChild(link);
        return small;
    };

    //clipboard 복사
    util.copyToClipboard = function(e){
    	e.preventDefault();
    	
        var el = document.createElement("textarea");
        var id = this.parentElement.parentElement.getAttribute("id");
        el.value = location.origin + location.pathname +"#" + id;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        
        //notification - required notification library
        if(window.createNotification){
            window.createNotification({
                closeOnClick: true,
                displayCloseButton: false,
                positionClass: 'nfc-bottom-right',
                showDuration: 3000,
                theme: 'info'
            })({
                title: '복사 완료',
                message: '주소가 클립보드에 복사되었습니다.'
            });
        }
        else{
            window.alert("링크 주소가 클립보드에 복사되었습니다");
        }
    };
    
})(window);