window.onload = function() {

    var oBtn = document.getElementById('btn');

    oBtn.onclick = function() {

        var script = document.createElement("script");
        script.src = "urls";
        document.body.insertBefore(script, document.body.firstChild);
    }
}