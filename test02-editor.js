(function(w){
    
    if(!w) throw "Window is not defined";
    if(!toastui || !toastui.Editor) throw "Toast Dependency Not Defined";

    w.Hacademy = w.Hacademy || {};
    w.Hacademy.TuiEditor = w.Hacademy.TuiEditor || {};

    var util = w.Hacademy.TuiEditor;

    //editor 생성 함수
    // - editor를 생성할 때 내부에 있는 글자를 value로 설정하도록 구현
    // - ID가 있을 경우 ID로 등록하며, 없을 경우 번호로 등록
    util.createEditor = function(selector){
        var elements = document.querySelectorAll(selector);
        if(!elements.length) return;

        util.editors = util.editors || [];
        for(var i=0; i < elements.length; i++){
            //ID 계산(없으면 i로 설정)
            var idx = elements[i].id || i;
            
            //내용을 불러와서 설정
            var content = elements[i].textContent || "";
            elements[i].textContent = "";

            //create editor and push
            util.editors[idx] = toastui.Editor.factory({
                el:elements[i],
                initialValue: content
            });
        }
    };
        
})(window);