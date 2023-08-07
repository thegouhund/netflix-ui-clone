function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}

const urlParams = new URLSearchParams(window.location.search);
const nextPage = document.getElementById("nextPage");
const prevPage = document.getElementById("prevPage");

const currentPage = parseInt(gup("page", window.location.href));
if(!currentPage){
    urlParams.append("page", 1);
    window.location.search = urlParams;
}

if (currentPage == 1) {
    prevPage.style.display = "none";
}

nextPage.addEventListener("click", () => {
    urlParams.set("page", currentPage + 1);
    window.location.search = urlParams;
});

prevPage.addEventListener("click", () => {
    urlParams.set("page", currentPage - 1);
    window.location.search = urlParams;
});
