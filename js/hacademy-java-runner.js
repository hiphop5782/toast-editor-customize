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

        //add editor or code block
        if(this.options.edit){
            var textareaDiv = createElement("div", "editor-panel");

            var textarea = createElement("textarea");
            textarea.addEventListener("keydown", function(e){
                switch(e.keyCode){
                    case 27://ESC
                    case 144://NUMLOCK
                    case 20://CAPSLOCK
                    case 18://LEFT ALT
                    case 21://RIGHT ALT
                    case 91://LEFT WINDOWS
                    case 92://RIGHT WINDOWS
                    case 93://CONTEXT
                        e.preventDefault();
                        return;
                }
                
                if(e.key === "Tab"){
                    var start = this.selectionStart;
                    var end = this.selectionEnd;
                    
                    var prefix = this.value.substring(0, start);
                    var suffix = this.value.substring(end);
                    this.value = prefix + "\t" + suffix;

                    this.selectionStart = this.selectionEnd = start + 1;
                    e.preventDefault();
                }
            });

            if(this.options.code){
                var count = Math.min(this.options.code.split(/\n/).length, this.options.line);
                textarea.style.minHeight = count+"rem";
            }
            textarea.value = this.options.code;
                            
            textareaDiv.appendChild(textarea);
            contentDiv.appendChild(textareaDiv);

            this.ui.textarea = textarea;
            this.ui.textareaDiv = textareaDiv;
        }
        else{
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
        }
        

        //add button
        var buttonDiv = createElement("div", "button-panel");
        var button = createElement("button", "execute-button", "실행");
        button.addEventListener("click",()=>{
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
        buttonDiv.appendChild(button);

        var clearBtn = createElement("button", "clear-button", "초기화");
        clearBtn.addEventListener("click", ()=>{
            this.ui.resultDiv.textContent = "";
        });
        buttonDiv.appendChild(clearBtn);

        
        contentDiv.appendChild(buttonDiv);

        //add result panel
        var resultDiv = createElement("div", "result-panel");
        contentDiv.appendChild(resultDiv);

        el.appendChild(contentDiv);

        this.ui.resultDiv = resultDiv;
        this.ui.contentDiv = contentDiv;
        this.ui.buttonDiv = buttonDiv;
        this.ui.button = button;
        
    };

    Runner.prototype.loadingStart = function(){
        this.ui.button.textContent = "실행중...";
        this.ui.button.disabled = true;
    };
    Runner.prototype.loadingFinish = function(){
        this.ui.button.textContent = "실행";
        this.ui.button.disabled = false;
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
        el.classList.add(className);
        if(innerText){
            el.textContent = innerText;
        }
        return el;
    }
})(window);