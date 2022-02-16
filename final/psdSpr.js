$p={}
$p.spr = {
    fLoad: function ($textId, $englishIconId, $farsiIconId, $canvasIconId, $canvasId,$clearIconId) {

        this.fInitialize();

        this.textId = $textId;
        this.canvasId = $canvasId;
        this.isRecording = false;
        this.isHandWriting = $("#" + $canvasId).is(':visible');


        $("#" + $englishIconId).click({ lang: "en-US" }, this.fOnStart.bind(this));

        $("#" + $farsiIconId).click({ lang: "fa-IR" }, this.fOnStart.bind(this));

        $("#" + $canvasIconId).click(this.fOnShowHandWriting.bind(this));

       
        //TODO  باید چک شود المنتی با این  ای دی پیدا نمی شود 
        // $p.hw.fCreateHandWriting($("#" + $canvasId)[0]);
        // $p.hw.setCallBack(this.fWriteOnText.bind(this));

        // $("#" + $clearIconId).click($p.hw.erase.bind($p.hw));


    },
    fInitialize: function () {
        this.speechRecognition = new webkitSpeechRecognition();
        this.speechRecognition.continuous = true;
        this.speechRecognition.interimResults = true;
        this.speechRecognition.lang = 'en-US';
        this.speechRecognition.onresult = this.fOnResult.bind(this);
        this.final_transcript = "";
    },
    fOnStart: function (event) {
        if (this.isRecording) {
            this.isRecording = false;
            this.fOnStop();
        } else {
            this.isRecording = true;
            this.fChangeLanguage(event.data.lang);
            this.speechRecognition.start();
        }
    },
    fOnStop: function () {
        this.speechRecognition.stop();
    },
    fChangeLanguage: function (language) {
        this.speechRecognition.lang = language;
    },
    fOnResult: function (event) {
        
        var interim_transcript = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              this.final_transcript += event.results[i][0].transcript;
              console.log("final = " + this.final_transcript);
              this.fWriteOnText(this.final_transcript);
            } else {
              interim_transcript += event.results[i][0].transcript;
              console.log("interim = " + interim_transcript);
              this.fWriteOnText(this.final_transcript+interim_transcript);
            }
          }
        // var result = event.results[event.results.length - 1];
        // if (result.isFinal) {
        //     this.fWriteContinuseOnText(result[0].transcript);
        // }
    },
    fWriteContinuseOnText: function (text) {
        $("#" + this.textId).text(function (i, old) {
            return old + text;
        });
    },
    fWriteOnText: function (text) {
        $("#" + this.textId).text(text);
    },
    fOnShowHandWriting: function () {
        if (this.isHandWriting) {
            this.isHandWriting = false;
            $("#" + this.canvasId).hide();
        } else {
            this.isHandWriting = true;
            $("#" + this.canvasId).show();
        }

    }

}


$p.hw = {
    fCreateHandWriting: function (cvs, lineWidth) {
        this.canvas = cvs;
        this.cxt = cvs.getContext("2d");
        this.cxt.lineCap = "round";
        this.cxt.lineJoin = "round";
        this.lineWidth = lineWidth || 3;
        this.rect = cvs.getBoundingClientRect();
        this.width = cvs.width;
        this.height = cvs.height;
        this.drawing = false;
        this.handwritingX = [];
        this.handwritingY = [];
        this.trace = [];
        this.options = {};
        this.step = [];
        this.redo_step = [];
        this.redo_trace = [];
        this.allowUndo = false;
        this.allowRedo = false;
        this.callback = undefined;
        cvs.addEventListener("mousedown", this.mouseDown.bind(this));
        cvs.addEventListener("mousemove", this.mouseMove.bind(this));
        cvs.addEventListener("mouseup", this.mouseUp.bind(this));
        cvs.addEventListener("touchstart", this.touchStart.bind(this));
        cvs.addEventListener("touchmove", this.touchMove.bind(this));
        cvs.addEventListener("touchend", this.touchEnd.bind(this));

        // const dpr = window.devicePixelRatio;
        // this.height = document.body.offsetHeight;
        // this.width = document.body.offsetWidth;

        // this.canvas.style.height = this.height + "px";
        // this.canvas.style.width = this.width + "px";
        // this.canvas.setAttribute("width", (this.width * dpr) + "px");
        // this.canvas.setAttribute("height", (this.height * dpr) + "px");

        // this.cxt.scale(dpr, dpr);
    },
    mouseDown: function (e) {
        // new stroke
        this.cxt.lineWidth = this.lineWidth;
        this.handwritingX = [];
        this.handwritingY = [];
        this.drawing = true;
        this.cxt.beginPath();
        var x = e.clientX - this.rect.left;
        var y = e.clientY - this.rect.top;
        this.cxt.moveTo(x, y);
        this.handwritingX.push(x);
        this.handwritingY.push(y);
    },


    mouseMove: function (e) {
        if (this.drawing) {
            var x = e.clientX - this.rect.left;
            var y = e.clientY - this.rect.top;
            this.cxt.lineTo(x, y);
            this.cxt.stroke();
            this.handwritingX.push(x);
            this.handwritingY.push(y);
        }
    },

    mouseUp: function () {
        var w = [];
        w.push(this.handwritingX);
        w.push(this.handwritingY);
        w.push([]);
        this.trace.push(w);
        this.drawing = false;
        if (this.allowUndo) this.step.push(this.canvas.toDataURL());
        this.recognize();
    },


    touchStart: function (e) {
        e.preventDefault();
        this.cxt.lineWidth = this.lineWidth;
        this.handwritingX = [];
        this.handwritingY = [];
        var box = this.canvas.getBoundingClientRect();
        var top = box.top;
        var left = box.left;
        var touch = e.changedTouches[0];
        touchX = touch.pageX - left;
        touchY = touch.pageY - top;
        this.handwritingX.push(touchX);
        this.handwritingY.push(touchY);
        this.cxt.beginPath();
        this.cxt.moveTo(touchX, touchY);
    },

    touchMove: function (e) {
        e.preventDefault();
        var touch = e.targetTouches[0];
        var de = document.documentElement;
        var box = this.canvas.getBoundingClientRect();
        var top = box.top;
        var left = box.left;
        var x = touch.pageX - left;
        var y = touch.pageY - top;
        this.handwritingX.push(x);
        this.handwritingY.push(y);
        this.cxt.lineTo(x, y);
        this.cxt.stroke();
    },

    touchEnd: function (e) {
        var w = [];
        w.push(this.handwritingX);
        w.push(this.handwritingY);
        w.push([]);
        this.trace.push(w);
        if (this.allowUndo) this.step.push(this.canvas.toDataURL());
    },
    recognize: function (trace, options, callback) {
        if (this.canvas) {
            trace = this.trace;
            options = this.options;
            callback = this.callback;
        } else if (!options) options = {};
        var data = JSON.stringify({
            "options": "enable_pre_space",
            "requests": [{
                "writing_guide": {
                    "writing_area_width": options.width || this.width || undefined,
                    "writing_area_height": options.height || this.width || undefined
                },
                "ink": trace,
                "language": options.language || "en-US"
            }]
        });
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                switch (this.status) {
                    case 200:
                        var response = JSON.parse(this.responseText);
                        var results;
                        if (response.length === 1) callback(undefined, new Error(response[0]));
                        else results = response[1][0][1];
                        if (!!options.numOfWords) {
                            results = results.filter(function (result) {
                                return (result.length == options.numOfWords);
                            });
                        }
                        if (!!options.numOfReturn) {
                            results = results.slice(0, options.numOfReturn);
                        }
                        callback(results[0], undefined);
                        break;
                    case 403:
                        callback(undefined, new Error("access denied"));
                        break;
                    case 503:
                        callback(undefined, new Error("can't connect to recognition server"));
                        break;
                }


            }
        });
        xhr.open("POST", "https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send(data);
        return xhr.response;
    },
    setCallBack: function (callback) {
        this.callback = callback;
    },
    erase: function () {
        this.cxt.clearRect(0, 0, this.width, this.height);

    },
};

