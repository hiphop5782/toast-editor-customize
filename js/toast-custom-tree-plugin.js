/*
    custom plugin
    - create tree path from unorder list markdown syntax
*/
function treePathPlugin(){
    const toHTMLRenderers = { 
        tree(node){
            const body = createTreePath(node.literal);
            return [
                {type:'openTag', tagName:'div', outerNewLine:true},
                {type:'html', content:body.outerHTML},
                {type:'closeTag', tagName:'div', outerNewLine:true},
            ];
        },
    };
    return {toHTMLRenderers};
//    구버전 코드
//    toastui.Editor.codeBlockManager.setReplacer("tree", function(text){
//         const wrapperId = 'tree' + Math.random().toString(36).substr(2, 10);
//         setTimeout(renderTreePath.bind(null, wrapperId, text), 0);
//         return '<div id="'+ wrapperId + '"></div>';
//    });
//    function renderTreePath(wrapperId, text){
//         const el = document.querySelector('#' + wrapperId);
//         el.appendChild(createTreePath(text));
//    }

   function createTreePath(text, hasRootNode){
        if(!text.trim()) "content not found";

        //seperate token : delimiter is \n
        var token = text.split("\n");
        if(!token.length) throw "content not found";

        var root = document.createElement("ul");
        root.classList.add("tree");

        for(var i=0; i < token.length; i++){
            createTreeElement(root, token[i], hasRootNode);    
        }
        return root;
    }

    //rule
    //1. if token start with "-" then create tag
    //2. if token start with "\t" then recursive call
    function createTreeElement(tag, token, hasRootNode, depth){
        depth = depth || 0;
        if(token.startsWith("-")){
            var trimToken = token.substr(1).trim();

            //create tag
            var li = createListitem(trimToken, hasRootNode && depth == 0);
            tag.appendChild(li);
        }
        else{
            var trimIndex = 0;
            if(token.startsWith("\t")){
                trimIndex = 1;
            }
            else if(token.startsWith("    ")){
                trimIndex = 4;
            }
            if(trimIndex > 0){
                var trimToken = token.substr(trimIndex);
                var li = tag.childNodes[tag.childElementCount-1];
                var ul;
                if(li.lastElementChild.tagName.toLowerCase() === 'div'){
                    ul = document.createElement("ul");
                    li.appendChild(ul);
                }
                else{
                    ul = li.lastElementChild;
                }
                createTreeElement(ul, trimToken, hasRootNode, depth + 1);
            }
        }

    }

    function createListitem(text, isRoot){
        var li = document.createElement("li");
        var div = document.createElement("div");
        li.appendChild(div);
        div.textContent = text;

        if(isRoot) li.classList.add("root");

        return li;
    }
}