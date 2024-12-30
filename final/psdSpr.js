$p = {}

jQuery.fn.exists = function () { return this.length > 0; }


function existElement($elementId) {
    return typeof $elementId != "undefined" & $elementId != null & $("#" + $elementId).length > 0;
}
function showWarning(type) {
    console.error(`${type} Error = ` + `المان  معرفی نشده و یا ای دی معرفی شده درست نمی باشد . ممکن است فایل درست اجرا نشود`);
}
function getElement(id) {
    return $("#" + id);
}

$p.spr = {
    fGenerateSPR: function ($content) {
        if (existElement($content)) {
            var textArea = this.fCreateSPR_TextArea($content);
            var enIcon = this.fCreateSPR_Microphone($content, "en");
            var faIcon = this.fCreateSPR_Microphone($content, "fa");
            this.isGeneration = true;
            this.fLoad(textArea, enIcon, faIcon);

        } else {
            showWarning("Content");
        }
    },
    fCreateSPR_TextArea: function (contentId) {
        var pId = contentId + "_textarea";
        getElement(contentId).append("<textarea id=" + pId + "></textarea>");
        getElement(pId).css({
            'position': 'relative',
            display: 'block',
            'padding': '10px',
            'border-radius': '10px',
        });
        return pId;
    },
    fCreateSPR_Microphone: function (contentId, lang) {
        var containerId = contentId + "_mic_container_" + lang;
        getElement(contentId).append("<div id=" + containerId + "></div>");

        let container = getElement(containerId);
        container.css({
            display: 'inline-block',
            'text-align': 'center',
            cursor: 'pointer',
            'margin-left': '10px',
            'margin-right': '10px',
            color: 'grey',
        });
        let color = lang == "en" ? "blue" : "green";
        container.hover(function (e) {
            $(this).css("color", e.type === "mouseenter" ? color : "grey")
        });


        var micSpanId = contentId + "_mic_span_" + lang;
        container.append("<span id=" + micSpanId + " ></span>");

        var micSpan = getElement(micSpanId);


        var micId = contentId + "_mic_" + lang;
        micSpan.html("<i id=" + micId + "></i>");

        let mic = getElement(micId);

        mic.addClass("fa-solid fa-microphone ");
        mic.css({ 'font-size': '1.5em', });

        var isRecording = false;
        mic.click(function () {
            if (isRecording) {
                isRecording = false;
                mic.css({ color: 'grey' });
                mic.removeClass("fa-fade");
            } else {
                isRecording = true;
                mic.css({ color: 'red' });
                mic.addClass("fa-fade");
            }

        });

        let text = lang == "en" ? "فارسی" : "انگلیسی";
        container.append("<span style='display: block;font-size: 0.7em;' >" + text + "</span>");


        return micId;

    },
    fLoad: function ($textId, $englishIconId, $farsiIconId) {

        this.fLoadTextArea($textId);

        this.fLoadMicrophons($englishIconId, $farsiIconId);

        this.fLoadRecognation();

        this.final_transcript = "";
        this.isRecording = false;
        this.self = this;

    },
    fLoadRecognation: function () {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            console.log("speech recognition API supported");
        }
        else {
            console.log("speech recognition API not supported")
        }
        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

        this.recognation = new SpeechRecognition();
        this.recognation.continuous = true;
        this.recognation.interimResults = true;
        this.recognation.lang = 'en-US';
        this.recognation.onresult = this.fOnResult.bind(this);
        this.recognation.onend = this.fOnEnd.bind(this);
    },
    fLoadTextArea: function ($textId) {
        if (existElement($textId)) {
            this.textElement = getElement($textId);
        } else {
            showWarning("TextArea");
        }
    },
    fLoadMicrophons: function ($englishIconId, $farsiIconId) {
        if (existElement($englishIconId)) {
            this.EnglishIconElement = getElement($englishIconId);
            this.EnglishIconElement.click({ lang: "en-US" }, this.fOnStart.bind(this));
        } else {
            showWarning("English Icon");
        }
        if (existElement($farsiIconId)) {
            this.FarsiIconElement = getElement($farsiIconId);
            this.FarsiIconElement.click({ lang: "fa-IR" }, this.fOnStart.bind(this));
        } else {
            showWarning("Farsi Icon");
        }
    },
    fOnStart: function (event) {
        if (this.isRecording) {
            this.isRecording = false;
            this.recognation.stop();
        } else {
            console.log("is recording ...");
            this.isRecording = true;
            this.fChangeLanguage(event.data.lang);
            this.recognation.start();
        }
    },
    fChangeLanguage: function (language) {
        this.recognation.lang = language;
    },
    fOnResult: function (event) {
        var interim_transcript = "";
        console.log("this is text to event : ", event);
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                this.final_transcript += event.results[i][0].transcript;
                this.fWriteOnText(this.final_transcript);
            } else {
                interim_transcript += event.results[i][0].transcript;
                this.fWriteOnText(this.final_transcript + interim_transcript);
            }
        }
    },
    fWriteOnText: function (text) {
        console.log("this is text to write : ", text);
        this.textElement.text(text);
    },
    fOnEnd: function () {
        if (this.self.isGeneration) {
            console.log("end of speach ");
            this.self.EnglishIconElement.css({ color: 'grey' });
            this.self.EnglishIconElement.removeClass("fa-fade");
            this.self.FarsiIconElement.css({ color: 'grey' });
            this.self.FarsiIconElement.removeClass("fa-fade");
        }
        this.self.isRecording = false;
    }
}


$p.hw = {
    fLoad: function ($textId, $canvasIconId, $canvasId, $clearIconId) {
        this.textElement = Checkelement($textId, "TextArea");

        this.CanvasIconElement = $("#" + $canvasIconId) ?? document.createElement($canvasIconId ?? "canvasIconId");
        this.CanvasElement = $("#" + $canvasId) ?? document.createElement($canvasId ?? "canvasId");
        this.ClearIconElement = $("#" + $clearIconId) ?? document.createElement($clearIconId ?? "clearIconId");

        this.CanvasIconElement.click(this.fOnShowHandWriting.bind(this));
        this.isHandWriting = this.CanvasElement.is(':visible');

        this.fCreateHandWriting($("#" + $canvasId)[0]);
        this.setCallBack(this.fWriteOnText.bind(this));

        $("#" + $clearIconId).click(this.erase.bind($p.hw));
    },
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
    fOnShowHandWriting: function () {
        if (this.isHandWriting) {
            this.isHandWriting = false;
            this.CanvasElement.hide();
        } else {
            this.isHandWriting = true;
            this.CanvasElement.show();
        }

    }

};

