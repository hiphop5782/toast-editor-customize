(function (w) {

    if (!w) throw "Window is not defined";
    if (!toastui || !toastui.Editor) throw "Toast Dependency Not Defined";

    w.Hacademy = w.Hacademy || {};
    w.Hacademy.TuiEditor = w.Hacademy.TuiEditor || {};

    var util = w.Hacademy.TuiEditor;

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

        plugins: [
            [chart, chartOptions]//chart plugin
            ,uml//uml plugin
            ,codeSyntaxHighlight//code highlight plugin
            ,tableMergedCell//table cell plugin
            ,colorSyntax//color syntax plugin
        ],
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

            //create editor and push
            util.editors[idx] = new toastui.Editor(cloneOptions);
        }
    };

})(window);