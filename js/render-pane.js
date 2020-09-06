(function(w){
    if(!w) throw "Window not defined";
    w.Hacademy = w.Hacademy || {};
    w.Hacademy.RenderPane = function(el, options){
        if(typeof el === "string")
            el = document.querySelector(el);
        
        this.el = el;
        if(!this.el.classList.contains("render-pane")){
            this.el.classList.add("render-pane");
        }

        var defaultOptions = {
            mode:"result",  //result or source or split
            edit:false,         //enable edit mode
        };

        this.options = Object.assign({}, defaultOptions, options);

        this.createRenderPane();
        
        this.displayContent();
        
        //split 모드가 아닐 경우 mode 설정
        if(this.options.mode !== "split"){
            this.tabChange(this.options.mode);
        }
        else{
            this.el.classList.add("split-pane");
            this.renderContent();
        }
    }

    w.Hacademy.RenderPane.prototype.createRenderPane = function(){
        var app = this;

        //create header
        var headerDiv = document.createElement("div");
        headerDiv.classList.add("tab-header");

        var sourceTitleDiv = document.createElement("div");
        sourceTitleDiv.classList.add("tab-title");

        var span = document.createElement("span");
        span.textContent = "source";
        sourceTitleDiv.appendChild(span);
        
        var resultTitleDiv = document.createElement("div");
        resultTitleDiv.classList.add("tab-title");
        span = document.createElement("span");
        span.textContent = "result";
        resultTitleDiv.appendChild(span);
        
        headerDiv.appendChild(sourceTitleDiv);
        headerDiv.appendChild(resultTitleDiv);

        var copyElementDiv = document.createElement("div");
        copyElementDiv.classList.add("header-element");
        var copyElement = document.createElement("span");
        copyElement.classList.add("copy-element");
        copyElement.addEventListener("click", function(){
            //copy to clipboard
            if(app.content){
                copyToClipboard(app.content);
                this.textContent = "copied!";
                this.style.color = "black";
            }
        });
        copyElement.textContent = "copy";
        copyElementDiv.appendChild(copyElement);
        headerDiv.appendChild(copyElementDiv);

        //create body
        var bodyDiv = document.createElement("div");
        bodyDiv.classList.add("tab-body");

        var sourceContentDiv = document.createElement("div");
        sourceContentDiv.classList.add("tab-content");

        var resultContentDiv = document.createElement("div");
        resultContentDiv.classList.add("tab-content");

        bodyDiv.appendChild(sourceContentDiv);
        bodyDiv.appendChild(resultContentDiv);
        
        this.el.appendChild(headerDiv);
        this.el.appendChild(bodyDiv);

        if(this.options.mode !== "split"){
            sourceTitleDiv.addEventListener("click", function(){
                app.tabChange("source");
            });
            resultTitleDiv.addEventListener("click", function(){
                app.tabChange("result");
            });
        }
    };

    w.Hacademy.RenderPane.prototype.displayContent = function(){
        var content = this.el.dataset.content || "";
        if(!content) return;

        this.content = decodeURIComponent(content);

        this.el.removeAttribute("data-content");

        var pre = document.createElement("pre");
        var code = document.createElement("code");
        code.classList.add("html");
        code.textContent = this.content;

        pre.appendChild(code);

        var contents = this.el.querySelectorAll(".tab-content");
        contents[0].textContent = "";
        contents[0].appendChild(pre);

        hljs.highlightBlock(code);
    };

    w.Hacademy.RenderPane.prototype.renderContent = function(){
        if(!this.content) return;

        var iframe = this.el.querySelector("iframe") || document.createElement("iframe");

        //iframe 생성
        this.el.querySelectorAll(".tab-content")[1].appendChild(iframe);                

        //내용 작성
        var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
        iframedoc.open();
        iframedoc.write(this.content);
        iframedoc.close();                

        iframe.addEventListener("load", function(){
            var frame = this;
            setTimeout(function(){
                frameWindow = frame.contentWindow;
                frameBody = frame.contentWindow.document.body;
                
                var minHeight = 150;
                var fixOffset = 30;
                var height = Math.max(parseInt(frameWindow.getComputedStyle(frameBody).height) || minHeight, minHeight) + fixOffset;
                frame.style.height = height + "px";
            }, 10);
        });

        //onload 이벤트 강제 발생
        iframe.dispatchEvent(new Event("load"));
    };

    w.Hacademy.RenderPane.prototype.tabChange = function(mode){
        mode = mode || "result";
        if(this.curMode === mode) return;
        
        var titles = this.el.querySelectorAll(".tab-title");
        var contents = this.el.querySelectorAll(".tab-content");
        if(mode == "source"){
            titles[0].classList.add("active");
            titles[1].classList.remove("active");
            contents[0].classList.add("active");
            contents[1].classList.remove("active");
        }
        else{
            titles[0].classList.remove("active");
            titles[1].classList.add("active");
            contents[0].classList.remove("active");
            contents[1].classList.add("active");

            this.renderContent();
        }

        this.curMode = mode;
    };

    function copyToClipboard(text){
        var el = document.createElement("textarea");
        document.body.appendChild(el);
        el.value = text;
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);       
    }
})(window);