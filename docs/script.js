var WolframCloudCall;

(function () {
    WolframCloudCall = function () { this.init(); };

    var p = WolframCloudCall.prototype;

    p.init = function () { };

    p._createCORSRequest = function (method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            xhr = null;
        }
        return xhr;
    };

    p._encodeArgs = function (args) {
        var argName;
        var params = "";
        for (argName in args) {
            params += (params == "" ? "" : "&");
            params += encodeURIComponent(argName) + "=" + encodeURIComponent(args[argName]);
        }
        return params;
    };

    p._auxCall = function (url, args, callback) {
        var params = this._encodeArgs(args);
        var xhr = this._createCORSRequest("post", url);
        if (xhr) {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("EmbedCode-User-Agent", "EmbedCode-JavaScript/1.0");
            xhr.onload = function () {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    callback(xhr.responseText);
                } else {
                    callback(null);
                }
            };
            xhr.send(params);
        } else {
            throw new Error("Could not create request object.");
        }
    };

    p.call = function (text, callback) {
        var url = "https://www.wolframcloud.com/obj/shivumbanerjee24/evaluateQueerphobia";
        var args = { text: text };
        var callbackWrapper = function (result) {
            if (result === null) callback(null);
            else callback(result);
        };
        this._auxCall(url, args, callbackWrapper);
    };
})();

var wcc = new WolframCloudCall();

var input = document.getElementById("query");
var output = document.getElementById("result");
output.classList.toggle("scale-150");
output.classList.toggle("translate-x-40");

var locked = false;

input.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && !locked) {

        locked = true;

        output.classList.toggle("scale-150");
        output.classList.toggle("translate-x-40");
        output.textContent = "thinking...";

        event.preventDefault();

        wcc.call(input.value, function (result) {
            output.textContent = (result == 0) ? "classification: not queerphobic" : "classification: queerphobic";
            output.classList.toggle("scale-150");
            output.classList.toggle("translate-x-40");
            locked = false;
        });
    }
});

//hide intro
var seenIntro = JSON.parse(window.localStorage.getItem("seenIntro"));
if(seenIntro == null) seenIntro = false;

const intro = document.getElementById("intro");
const main = document.getElementById("main");

if(seenIntro) hideIntro();

function hideIntro() {
    intro.style.opacity = 0;
    intro.style.pointerEvents = "none";
    main.classList.remove("blur-xl");
    window.localStorage.setItem("seenIntro", JSON.stringify(true));
}