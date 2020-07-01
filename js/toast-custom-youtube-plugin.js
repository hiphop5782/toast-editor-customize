/*
    youtube plugin
    ToastUI editor 공식 페이지 참조
*/

function youtubePlugin() {
    toastui.Editor.codeBlockManager.setReplacer("youtube", function (youtubeId) {
        const wrapperId = 'youtube' + Math.random().toString(36).substr(2, 10);
        setTimeout(renderYoutube.bind(null, wrapperId, youtubeId), 0);

        return '<div id=' + wrapperId + '></div>';
    });

    function renderYoutube(wrapperId, youtubeId) {
        const el = document.getElementById(wrapperId);
        el.innerHTML = '<iframe src="https://www.youtube.com/embed/' + youtubeId + '" style="width:100%; height:315px; max-height:400px;"></iframe>';
    }
}
