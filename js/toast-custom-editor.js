(function (w) {
    if (!w) throw "Window is not defined";
    if (!toastui || !toastui.Editor) throw "Toast Dependency Not Defined";

    w.Hacademy = w.Hacademy || {};
    w.Hacademy.TuiEditor = w.Hacademy.TuiEditor || {};

    var util = w.Hacademy.TuiEditor;
    util.sequence = 0;

    util.clone = function clone(obj) {
        if (obj === null || typeof (obj) !== 'object')
            return obj;

        var copy = obj.constructor();

        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = clone(obj[attr]);
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
        ,htmlRendererPlugin//custom html-renderer plugin
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

    util.createEditor = function (selector) {
        var elements = document.querySelectorAll(selector);
        if (!elements.length) return;

        util.editors = util.editors || [];
        for (var i = 0; i < elements.length; i++) {
            //ID 계산(없으면 i로 설정)
            var idx = elements[i].id || i;

            //Option 복제 및 설정
            var cloneOptions = util.clone(defaultEditorOptions);

            //대상 설정
            cloneOptions.el = elements[i];

            //내용을 불러와서 설정
            var content = elements[i].textContent || "";
            elements[i].textContent = "";
            cloneOptions.initialValue = content;

            //classList 점검 및 설정
            var classList = elements[i].classList;

            // .vertical-editor : 미리보기가 같이 나오도록 변경
            // .wysiwyg-editor : wysiwyg 모드로 실행되도록 변경
            if (classList.contains("vertical-editor"))
                cloneOptions.previewStyle = "vertical";
            if (classList.contains("wysiwyg-editor"))
                cloneOptions.initialEditType = "wysiwyg";     
            
            //height setting
            cloneOptions.height = elements[i].dataset.height || cloneOptions.height;

            //create editor and push
            var editor = toastui.Editor.factory(cloneOptions);
            util.editors[idx] = editor;
            
            //전송시 이름 설정
            var input = document.createElement("input");
            input.setAttribute("type", "hidden");
            var name = elements[i].dataset.name || 'content';
            input.setAttribute("name", name);
            elements[i].appendChild(input);
            
            editor.on("change", e=>{
                input.value = editor.getMarkdown();
            });
            
            //blur 이벤트 발생 시 localStorage에 저장
            editor.on("blur", e=>{
                localStorage.setItem(idx, editor.getMarkdown());
            });
            
            //localStorage에 idx에 대한 이력이 존재하고, 입력값이 없을 때 confirm 띄우기
            var record = localStorage.getItem(idx);
            if(record && !editor.getMarkdown()){
                if(confirm("이전 내역을 이어서 작성하시겠습니까?")){
                    editor.setMarkdown(record);
                }
                localStorage.removeItem(idx);
            }
        }
    };

    util.createViewer = function (selector) {
        var elements = document.querySelectorAll(selector);
        if (!elements.length) return;

        util.viewers = util.editors || [];
        for (var i = 0; i < elements.length; i++) {
            //ID 계산(없으면 i로 설정)
            var idx = elements[i].id || i;

            //Option 복제 및 설정
            var cloneOptions = util.clone(defaultViewerOptions);

            //대상 설정
            cloneOptions.el = elements[i];

            //내용을 불러와서 설정
            var content = elements[i].textContent || "";
            elements[i].textContent = "";
            cloneOptions.initialValue = content;

            //create editor and push
            var viewer = toastui.Editor.factory(cloneOptions);
            util.viewers[idx] = viewer;
            
            //create copy link in anchor
            var anchors = viewer.preview.el.querySelectorAll(".header-anchor");
            for(var i=0; i < anchors.length; i++){
                console.log(anchors[i]);
                anchors[i].appendChild(util.createColyElement());                
            }
        }
    };
    
    util.changeEditorMode = function(){
        for(var i=0; i < util.editors.length; i++){
            var currentMode = util.editors[i].getCurrentPreviewStyle();
            var style = currentMode === 'tab' ? 'vertical' : 'tab';
            util.editors[i].changePreviewStyle(style);
        }
    };
    
    util.createColyElement = function(){
        var small = document.createElement("small");
        small.classList.add("anchor-copy-element");
        
        var link = document.createElement("a");
        link.classList.add("anchor-copy-url");
        link.setAttribute("href", "#");
        link.setAttribute("title", "주소 복사");
        link.textContent = "★";
        
        small.appendChild(link);
        return small;
    };

})(window);