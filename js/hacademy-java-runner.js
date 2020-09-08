(function(window){
    if(!window) throw "Window not defined";
    
    var document = window.document;

    var defaultOptions = {
        code:"",
        line:10,
        mode:"simple",
        baseUrl:"http://www.sysout.co.kr"
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

        //add editor
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

        //add button
        var buttonDiv = createElement("div", "button-panel");
        var button = createElement("button", "execute-button", "실행");
        button.addEventListener("click",()=>{
            var code = textarea.value;
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

        contentDiv.appendChild(textareaDiv);
        contentDiv.appendChild(buttonDiv);

        //add result panel
        var resultDiv = createElement("div", "result-panel");
        contentDiv.appendChild(resultDiv);

        el.appendChild(contentDiv);

        this.ui.resultDiv = resultDiv;
        this.ui.contentDiv = contentDiv;
        this.ui.buttonDiv = buttonDiv;
        this.ui.button = button;
        this.ui.textarea = textarea;
        this.ui.textareaDiv = textareaDiv;
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
        this.ui.resultDiv.classList.remove("success", "error");
        this.ui.resultDiv.classList.add("success");
        this.ui.resultDiv.innerHTML = "<pre><code>"+res+"</code></pre>";
    };

    Runner.prototype.setError = function(res){
        this.ui.resultDiv.classList.remove("success", "error");
        this.ui.resultDiv.classList.add("error");
        this.ui.resultDiv.innerHTML = "<pre><code>"+res+"</code></pre>";
    };

    Runner.prototype.getURI = function(){
        switch(this.options.mode){
            case "simple": return this.options.baseUrl + "/runner/java/simple";
            case "main": return this.options.baseUrl + "/runner/java/main";
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