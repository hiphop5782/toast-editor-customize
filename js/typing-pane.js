(function(window){
    if(!window) throw "window not defined";

    var document = window.document;

    var defaultOptions = {
        strict:false,
        progress:false,
        refresh:true,
        tab:4,
    };

    window.Hacademy = window.Hacademy || {};
    window.Hacademy.TypingPane = function(el, options){
        if(typeof el === "string"){
            el = document.querySelector(el);
        }

        this.options = Object.assign({}, defaultOptions, options);
        if(!el.dataset.sourceCode.trim())
            throw "Source code not defined";
        
        this.options.sourceCode = decodeURIComponent(el.dataset.sourceCode);
        delete el.dataset.sourceCode;

        var sourceEl = document.createElement("div");
        el.appendChild(sourceEl);

        this.ui = {
            el : el,
            sourceEl : sourceEl,
        };

        this.initializeUI();

    };

    var TypingPane = window.Hacademy.TypingPane;
    TypingPane.seq = 0;

    TypingPane.prototype.initializeUI = function(){
        var el = this.ui.el;
        var sourceEl = this.ui.sourceEl;
        
        if(!sourceEl.classList.contains("hacademy-typing-pane"))
        sourceEl.classList.add("hacademy-typing-pane");
        
        if(this.options.strict){
            sourceEl.classList.add("strict-mode");
        }

        sourceEl.setAttribute("tabindex", TypingPane.seq++);
        sourceEl.textContent = "";

        sourceEl.onclick = function(){
            this.focus();
        };
        sourceEl.onfocus = ()=>{
            this.hasFocus = true;
        };
        sourceEl.onblur = ()=>{
            this.hasFocus = false;
        };
        sourceEl.onkeydown = (e)=>{
            e.preventDefault();

            this.processTyping(e);
        };

        //create refresh panel
        if(this.options.refresh){
            var refreshEl = document.createElement("div");
            refreshEl.classList.add("refresh-panel");
            
            var icon = document.createElement("i");
            icon.classList.add("fa","fa-refresh");
            icon.addEventListener("click", ()=>{
                this.refreshAll();
            });
            
            refreshEl.appendChild(icon);

            sourceEl.appendChild(refreshEl);

            this.ui.refreshEl = refreshEl;
        }

        //create source code unit
        var sourceCode = this.options.sourceCode;
        for(var i=0; i < sourceCode.length; i++){
            var unit;
            if(this.isTab(sourceCode, i)){
                unit = this.createTextUnit("\t");
                i += 3;
            }
            else{
                unit = this.createTextUnit(sourceCode[i]);
            }
            sourceEl.appendChild(unit);
        }
        sourceEl.querySelector(".typing-unit").classList.add("current");

        //append progress component
        if(this.options.progress){
            var progressEl = document.createElement("div");
            progressEl.classList.add("progress-panel");

            var span1 = document.createElement("span");
            span1.textContent = "0";
            span1.classList.add("count");
            var span2 = document.createElement("span");
            span2.textContent = "/";
            var span3 = document.createElement("span");
            span3.textContent = sourceCode.length;
            span3.classList.add("total");

            progressEl.appendChild(span1);
            progressEl.appendChild(span2);
            progressEl.appendChild(span3);

            sourceEl.appendChild(progressEl);

            this.ui.progressEl = progressEl;
        }

    };

    TypingPane.prototype.isTab = function(text, index){
        var count = 0;
        for(var i=index; i < text.length; i++){
            if(text[i].charCodeAt(0) === 32){
                if(++count == 4) break;
            }
            else{
                break;
            }
        }
        return count === this.options.tab;
    };

    TypingPane.prototype.createTextUnit = function(t, m){
        var span = document.createElement("span");
        span.classList.add("typing-unit");
        
        switch(t.charCodeAt(0)){
            case 10://enter
                span.classList.add("enter");
                span.textContent = "↵";
                break;
            case 9://tab
                span.classList.add("tab");
                span.textContent = "→";
                break;
            case 32://space
                span.classList.add("space");
            default:
                span.textContent = t;
        }

        if(m){
            span.classList.add(m);
        }
        return span;
    };

    TypingPane.prototype.processTyping = function(e){
        var cur = this.getCurrentUnit();
        if(!cur) return;

        var prev = this.getPreviousUnit();//이전 항목
        var next = this.getNextUnit();
        
        var text = cur.textContent;

        if(this.isNormalInput(e.keyCode)){
            //strict mode에서는 틀린 항목이 있으면 진행 불가
            if(this.options.strict && prev && prev.classList.contains("incorrect")){
                return false;
            }
            
            var t = this.convertTextValue(text);
            var k = this.convertEventValue(e);
            
            cur.classList.remove("correct", "incorrect", "current");
            cur.classList.add(t === k ? "correct" : "incorrect");

            if(next){
                next.classList.remove("correct", "incorrect", "current");
                next.classList.add("current");
            }
        }
        else{
            this.processKey(e.keyCode);
        }

        if(this.options.progress){
            this.refreshProgress();
        }
    };

    TypingPane.prototype.isNormalInput = function(k){
        switch(k){
            case 16://SHIFT(LEFT, RIGHT)
            case 27://ESC
            case 112://F1
            case 113://F2
            case 114://F3
            case 115://F4
            case 116://F5
            case 117://F6
            case 118://F7
            case 119://F8
            case 120://F9
            case 121://F10
            case 122://F11
            case 123://F12
            case 8://BACKSPACE
            case 144://NUMLOCK
            case 20://CAPSLOCK
            case 17://LEFT CTRL
            case 25://RIGHT CTRL
            case 18://LEFT ALT
            case 21://RIGHT ALT
            case 91://LEFT WINDOWS
            case 92://RIGHT WINDOWS
            case 93://CONTEXT
            case 46://DELETE
            case 35://END
            case 34://PAGEDOWN
            case 45://INSERT
            case 36://HOME
            case 33://PAGEUP
            case 120://PrintScreen
            case 121://Scroll Lock
            case 122://PAUSE
            case 37://LEFT ARROW
            case 38://UP ARROW
            case 39://RIGHT ARROW
            case 40://DOWN ARROW
            case 12://NON-NUMLOCK 5
            //case 13://ENTER
                return false;
        }
        return true;
    };

    Hacademy.TypingPane.prototype.processKey = function(k){
        switch(k){
            case 8: this.backspace();
        }
    };
    
    Hacademy.TypingPane.prototype.backspace = function(){
        var cur = this.getCurrentUnit();
        var prev = this.getPreviousUnit();
        if(prev){
            cur.classList.remove("correct", "incorrect", "current");
            prev.classList.remove("correct", "incorrect", "current");
            prev.classList.add("current");
        }
    };

    Hacademy.TypingPane.prototype.getCurrentUnit = function(){
        return this.ui.sourceEl.querySelector(".typing-unit.current") || null;
    };

    Hacademy.TypingPane.prototype.getNextUnit = function(){
        var cur = this.getCurrentUnit();
        if(!cur) return null;
        var next = cur.nextElementSibling || null;
        if(!next || !next.classList.contains("typing-unit")) 
            return null;
        return next;
    };

    Hacademy.TypingPane.prototype.getPreviousUnit = function(){
        var cur = this.getCurrentUnit();
        if(!cur) return null;
        var prev = cur.previousElementSibling || null;
        if(!prev || !prev.classList.contains("typing-unit")) 
            return null;
        return prev;
    };

    Hacademy.TypingPane.prototype.convertTextValue = function(text){
        switch(text.charCodeAt(0)){
            case 8629: return 13;//↵ : enter
            case 8594: return 9;//→ : tab
        }
        return text;
    };

    Hacademy.TypingPane.prototype.convertEventValue = function(e){
        switch(e.keyCode){
            case 13: return 13;//enter
            case 9: return 9;//tab
        }
        return e.key;
    };

    Hacademy.TypingPane.prototype.refreshProgress = function(){
        var progressEl = this.ui.progressEl;
        if(!progressEl) return;

        var sourceEl = this.ui.sourceEl;

        var correctUnit = sourceEl.querySelectorAll(".typing-unit.correct") || [];
        progressEl.querySelector(".count").textContent = correctUnit.length;
    };

    Hacademy.TypingPane.prototype.refreshAll = function(){
        var unitList = this.ui.sourceEl.querySelectorAll(".typing-unit");
        if(unitList.length > 0){
            for(var i=0; i < unitList.length; i++){
                unitList[i].classList.remove("correct", "incorrect", "current");
            }
            unitList[0].classList.add("current");
        }
        
        if(this.ui.progressEl){
            this.ui.progressEl.querySelector(".count").textContent = "0";
        }
    };
})(window);