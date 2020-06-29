(function(w){
    
    if(!w) throw "Window is not defined";
    if(!toastui || !toastui.Editor) throw "Toast Dependency Not Defined";

    w.Hacademy = w.Hacademy || {};
    w.Hacademy.TuiEditor = w.Hacademy.TuiEditor || {};

    var util = w.Hacademy.TuiEditor;

    //viewer 생성 함수
    // - viewer를 생성할 때 내부에 있는 글자를 value로 설정하도록 구현
    // - ID까 있을 경우 ID로 등록하며, 없을 경우 번호로 등록
    util.createViewer = function(selector){
        var elements = document.querySelectorAll(selector);
        if(!elements.length) return;

        util.viewers = util.viewers || [];
        for(var i=0; i < elements.length; i++){
            //ID 계산(없으면 i로 설정)
            var idx = elements[i].id || i;
            
            //내용을 불러와서 설정
            var content = elements[i].textContent || "";
            elements[i].textContent = "";

            //create editor and push

            util.viewers[idx] = toastui.Editor.factory({
                el:elements[i],
                viewer:true,
                initialValue: content
            });
        }
    };
        
})(window);