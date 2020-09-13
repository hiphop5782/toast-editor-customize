(function(window){
    if(!window) throw "Window not defined";
    
    var document = window.document;

    var defaultOptions = {
        code:"",
        line:30,
        mode:"simple",
        host:"http://www.sysout.co.kr:80",
        //host:"http://www.sysout.co.kr:36500",
        //host:"http://localhost",
        edit:false,
    };

    window.Hacademy = window.Hacademy || {};
    window.Hacademy.JavaRunner = function(el, options){
        if(typeof el === "string"){
            el = document.querySelector(el);
        }

        if(!el) throw "target element not found";
        this.el = el;

        this.options = Object.assign({}, defaultOptions, options);
        this.options.code = decodeURIComponent(this.options.code || this.el.dataset.sourceCode || "");
        if(this.el.dataset.sourceCode){
            delete this.el.dataset.sourceCode;
        }

        this.ui = {
            el:el
        };

        this.initializeUI();
    };

    var Runner = window.Hacademy.JavaRunner;
    
    Runner.prototype.initializeUI = function(){
        var el = this.ui.el;
        
        //초기화
        el.classList.remove("hacademy-runner-pane");
        el.textContent = "";

        el.classList.add("hacademy-runner-pane");

        //add content
        var contentDiv = createElement("div", "content-panel");
        this.ui.contentDiv = contentDiv;
        el.appendChild(contentDiv);

        //add editor or code block
        if(this.options.edit){
            this.initializeEditor();
        }
        else{
            this.initializeViewer();
        }

        //add button
        this.initializeButton();

        //add result panel
        this.initializeResultPanel();
    };

    Runner.prototype.initializeEditor = function(){
        var contentDiv = this.ui.contentDiv;

        var textareaDiv = createElement("div", "editor-panel");
        this.ui.textareaDiv = textareaDiv;
        contentDiv.appendChild(textareaDiv);

        this.initializeTextarea();
    };

    Runner.prototype.initializeTextarea = function(){
        var textareaDiv = this.ui.textareaDiv;
        var textarea = createElement("textarea");
        textareaDiv.appendChild(textarea);
        var pre = createElement("pre");
        var code = createElement("code");
        textareaDiv.appendChild(pre);
        pre.appendChild(code);
        
        this.ui.textarea = textarea;
        this.ui.code = code;

        //disable spell check
        textarea.setAttribute("spellcheck", "false");

        //key listener for editor function
        textarea.addEventListener("keydown", TextareaKeyDownHandler);
        textarea.addEventListener("keyup", TextareaKeyUpHandler)
        
        //key listener for syntax highlight
        var event = ["keyup", "keypress", "keydown", "input", "change", "paste"];
        for(var i=0; i<event.length; i++){
            textarea.addEventListener(event[i], (e)=>{
                SyntaxHighlight.call(this, e);
            });
        }

        //scroll listener for sync scroll
        textarea.addEventListener("scroll", (e)=>{
            pre.style.top = -e.target.scrollTop + "px";
        });
        
        if(this.options.code){
            var count = Math.min(this.options.code.split(/\n/).length, this.options.line);
            textarea.style.minHeight = count+"rem";
        }
        textarea.value = this.options.code;
        
        
        SyntaxHighlight.call(this);
    };

    Runner.prototype.initializeViewer = function(){
        var contentDiv = this.ui.contentDiv;

        var codeBlockDiv = createElement("div", "code-panel");
        var pre = document.createElement("pre");
        var code = document.createElement("code");
        code.classList.add("java");
        code.textContent = this.options.code;
        
        pre.appendChild(code);
        codeBlockDiv.appendChild(pre);
        contentDiv.appendChild(codeBlockDiv);
        
        this.ui.codeBlockDiv = codeBlockDiv;
        this.ui.code = code;

        hljs.highlightBlock(code);
    };

    Runner.prototype.initializeButton = function(){
        var contentDiv = this.ui.contentDiv;
        var textarea = this.ui.textarea;

        var buttonDiv = createElement("div", "button-panel");
        var executeBtn = createElement("button", "execute-button", "실행");
        var clearBtn = createElement("button", "clear-button", "초기화");
        buttonDiv.appendChild(executeBtn);
        buttonDiv.appendChild(clearBtn);
        contentDiv.appendChild(buttonDiv);

        this.ui.buttonDiv = buttonDiv;
        this.ui.executeBtn = executeBtn;
        this.ui.clearBtn = clearBtn;
        executeBtn.addEventListener("click",()=>{
            var code = this.options.edit? textarea.value : this.options.code;
            if(!code) return false;
            this.loadingStart();
            axios.post(this.getURI(), {
                version:8,
                code:code
            })
            .then(result=>{
                this.setResult(result.data);
                this.loadingFinish();
            }).catch(e=>{
                this.setError(e.response.data);
                this.loadingFinish();
            });
        });
        
        clearBtn.addEventListener("click", ()=>{
            this.ui.resultDiv.textContent = "";
        });
        
        
    };

    Runner.prototype.initializeResultPanel = function(){
        var contentDiv = this.ui.contentDiv;

        var resultDiv = createElement("div", "result-panel");
        contentDiv.appendChild(resultDiv);

        this.ui.resultDiv = resultDiv;
    };

    Runner.prototype.loadingStart = function(){
        this.ui.executeBtn.textContent = "실행중...";
        this.ui.executeBtn.disabled = true;
    };
    Runner.prototype.loadingFinish = function(){
        this.ui.executeBtn.textContent = "실행";
        this.ui.executeBtn.disabled = false;
    };

    Runner.prototype.setResult = function(res){
        if(!res) return;
        this.ui.resultDiv.classList.remove("success", "error");
        this.ui.resultDiv.classList.add("success");
        this.ui.resultDiv.innerHTML = "<pre><code>"+res.result+"</code></pre>";
    };

    Runner.prototype.setError = function(res){
        if(!res) return;
        this.ui.resultDiv.classList.remove("success", "error");
        this.ui.resultDiv.classList.add("error");
        this.ui.resultDiv.innerHTML = "<pre><code>"+res.result+"</code></pre>";
    };

    Runner.prototype.getURI = function(){
        switch(this.options.mode){
            case "simple": return this.options.host + "/runner/java/simple";
            case "main": return this.options.host + "/runner/java/main";
        }
        return null;
    };

    function createElement(tagName, className, innerText){
        var el = document.createElement(tagName);
        if(className){
            el.classList.add(className);
        }
        if(innerText){
            el.textContent = innerText;
        }
        return el;
    }

    /*
        Textarea Keyboard Handler 

        prevent key list
        - 27 : ESC
        - 18 : LEFT ALT
        - 91 : LEFT WINDOWS
        - 92 : RIGHT WINDOWS
        - 93 : CONTEXT
    */
    var backupKey = null;
    function TextareaKeyDownHandler(e){
        switch(e.keyCode){
            case 27://ESC
            case 18://LEFT ALT
            case 21://RIGHT ALT
            case 91://LEFT WINDOWS
            case 92://RIGHT WINDOWS
            case 93://CONTEXT
                e.preventDefault();
                return;
        }

        switch(e.key){
            case "Shift":
            case "Control":
                backupKey = e.key;
                return;
        }

        //shift + @
        if(backupKey === "Shift"){
            e.preventDefault();
            if(e.key === "Tab"){
                removeIndent(this);
            }
            return;
        }

        //ctrl + @
        if(backupKey === "Control"){
            e.preventDefault();
            return;
        }
        
        //normal key
        if(e.key === "Tab"){
            e.preventDefault();
            addIndent(this);
        }

        function removeIndent(textarea){
            var start = textarea.selectionStart;
            var end = textarea.selectionEnd;

            //앞부분 불러오기
            var prefix = textarea.value.substring(0, start);

            //선택 영역 가장 윗 줄의 첫번째 시작점 탐색
            var lineFirstPos = prefix.lastIndexOf("\n");

            var count = 0;
            for(var i = lineFirstPos; i < textarea.selectionEnd; i = textarea.value.indexOf("\n", i+1)){
                var p = textarea.value.substring(0, i + 1);
                var s = textarea.value.substring(i + 1);
                if(s.startsWith("\t")){
                    s = s.substring(1);
                    textarea.value = p + s;
                    count++;
                    textarea.selectionEnd = end - count;
                }
            }
            textarea.selectionStart = start - 1;
        }
        function addIndent(textarea){
            var start = textarea.selectionStart;
            var end = textarea.selectionEnd;

            //선택된 문자열이 없을 경우 해당 위치에 탭을 삽입
            if(start === end){
                var prefix = textarea.value.substring(0, start);//앞부분
                var suffix = textarea.value.substring(end);//뒷부분

                //탭 삽입
                textarea.value = prefix + "\t" + suffix;

                //커서 위치 조정
                textarea.selectionStart = textarea.selectionEnd = start + 1;
            }
            //선택된 문자열이 있을 경우 해당 라인 앞에 탭을 삽입
            else{
                //앞부분 불러오기
                var prefix = textarea.value.substring(0, start);

                //선택 영역 가장 윗 줄의 첫번째 시작점 탐색
                var lineFirstPos = prefix.lastIndexOf("\n");

                var count = 0;
                for(var i = lineFirstPos; i < end; i = textarea.value.indexOf("\n", i+1)){
                    var p = textarea.value.substring(0, i + 1);
                    var s = textarea.value.substring(i + 1);
                    textarea.value = p + "\t" + s;
                    count++;
                }
                textarea.selectionStart = start + 1;
                textarea.selectionEnd = end + count;

            }
        }
    }

    function TextareaKeyUpHandler(e){
        switch(e.keyCode){
            case 27://ESC
            case 18://LEFT ALT
            case 21://RIGHT ALT
            case 91://LEFT WINDOWS
            case 92://RIGHT WINDOWS
            case 93://CONTEXT
                e.preventDefault();
                return;
        }

        switch(e.key){
            case "Shift":
            case "Control":
                backupKey = null;
                return;
        }
    }

    function SyntaxHighlight(){
        console.log(this.ui);
        var value = this.ui.textarea.value;
        var code = this.ui.code;

        if(!code.classList.contains("java")){
            code.classList.add("java");
        }

        code.textContent = value;

        hljs.highlightBlock(code);
    }
})(window);