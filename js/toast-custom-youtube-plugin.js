/*
    youtube plugin
    ToastUI editor 공식 페이지 참조

    <주소 시작 패턴에 따른 처리>
    - https://www.youtube.com/watch?v=faMtaP80SSE : 유튜브 주소창을 복사한 경우
    - https://youtu.be/faMtaP80SSE : 공유 단축 URL을 복사한 경우
*/

//3.x
function youtubePlugin(){
    const toHTMLRenderers = { 
        youtube(node){
            let url = node.literal.trim();
            if(!url) return;
            
            const question = url.lastIndexOf("?");
            if(question >= 0){
                url = url.substring(question+1);
                url = url.substring("v=".length);
            }
            const slash = url.lastIndexOf("/");
            if(slash >= 0){
                url = url.substring(slash+1);
            }

            const iframe = '<iframe src="https://www.youtube.com/embed/' + url + '" title="Youtube video player frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; height:315px; max-height:400px;"></iframe>';
            return [
                {type:'openTag', tagName:'div', outerNewLine:true},
                {type:'html', content:iframe},
                {type:'closeTag', tagName:'div', outerNewLine:true},
            ];
        },
    };
    return {toHTMLRenderers};
}


//2.x
// function youtubePlugin() {
//     toastui.Editor.codeBlockManager.setReplacer("youtube", function (youtubeId) {
//         const wrapperId = 'youtube' + Math.random().toString(36).substr(2, 10);
//         setTimeout(renderYoutube.bind(null, wrapperId, youtubeId), 0);
//         return '<div id=' + wrapperId + '></div>';
//     });

//     function renderYoutube(wrapperId, youtubeId) {
//         const el = document.getElementById(wrapperId);
//         el.innerHTML = '<iframe src="https://www.youtube.com/embed/' + youtubeId + '" style="width:100%; height:315px; max-height:400px;"></iframe>';
//     }
// }
