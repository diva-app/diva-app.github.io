
$p = {};


$p.spr = {
    fLoad: function ($textViewElement,$iconsElement,$handWritingElement) {
        this.textArea = $p.textArea.fCreate($textViewElement);

        if($iconsElement) {
            this.mic_container = $p.micContainer.fCreate($iconsElement);
        }else{
            this.mic_container = $p.micContainer.fCreate($textViewElement);
        }

        this.mic_en = $p.mic_en.fCreate(this.mic_container.pId);
        this.mic_fa = $p.mic_fa.fCreate(this.mic_container.pId);
        this.handWritingIcon = $p.handIcon.fCreate(this.mic_container.pId);

        this.handWritingElement = $handWritingElement;
        

        this.fInitialize();



    },
    fInitialize: function () {
        this.speechRecognition = new webkitSpeechRecognition();
        this.speechRecognition.continuous = true;

        this.speechRecognition.interimResults = true;
        this.speechRecognition.lang = 'en-US';
        this.speechRecognition.onresult = this.fOnResult.bind(this);
        this.speechRecognition.onend = this.fOnEnd.bind(this);
    },
    fStart: function () {
        // alert("start");
        this.speechRecognition.start();
    },
    fStop: function () {
        // alert("stop");
        this.speechRecognition.stop();

    },
    fChangeLanguage: function (language) {
        // alert("change language to " + language);
        this.speechRecognition.lang = language;
    },
    fOnResult: function (event) {
        var result = event.results[event.results.length - 1];
        if (result.isFinal) {
            this.textArea.fSetText(result[0].transcript);
        }
    },
    fOnEnd: function () {
        this.mic_en.isRecording = false;
        this.mic_en.fChangeToRecording();
        this.mic_fa.isRecording = false;
        this.mic_fa.fChangeToRecording();
    },
    fShowHandWriting: function (isShow) {
        if (isShow) {
            this.handWriting = $p.handWriting.fCreate(this.handWritingElement);  
        } else {
            this.handWriting = $p.handWriting.fRemove(this.handWritingElement);  
        }
        
    }
};
$p.textArea = {
    fCreate: function ($element) {
        this.pId = $element.attr("id") + "_textarea";
        this.fCreateChild($element);
        return this;
    },
    fSetText: function (pValue) {
        $("#" + this.pId).text(function (i, old) {
            return old + pValue;
        });
    },
    fCreateChild: function ($element) {
        $element.append("<textarea id=" + this.pId + "></textarea>");
        $("#" + this.pId).css({
            'position': 'relative',
            'width': '100%',
            'height': '100%',
            'padding': '10px',
            'border-radius': '10px',
            'resize': 'none',
        });
    },
}
$p.mic_en = {
    fCreate: function ($parentId,$language) {
        this.$lang = $language;
        this.micSpanId = $parentId + "_mic_span" + this.$lang;
        this.containerId = $parentId + "_mic_container" + this.$lang;
        this.micId = $parentId + "_mic" + this.$lang;
        this.fontAwesomeMic = "fa-solid fa-microphone ";
        this.isRecording = false;


        this.fCreateChild($parentId);

        $("#" + this.containerId).click(this.fOnClick.bind(this));

        return this;
    },
    fOnClick: function () {
        if (this.isRecording) {
            this.isRecording = false;
            this.fChangeToRecording();
            $p.spr.fStop();
        } else {
            this.isRecording = true;
            this.fChangeToRecording();
            $p.spr.fChangeLanguage(this.$lang);
            $p.spr.fStart();
        }
    },
    fChangeColor: function (pColor) {
        $("#" + this.micSpanId).css("color", pColor);
    },
    fCreateChild: function ($parentId) {
        var text = "انگلیسی";
        $("#" + $parentId).append("<div id=" + this.containerId + "></div>");
        $("#" + this.containerId).append("<span id=" + this.micSpanId + " ></span>");
        $("#" + this.containerId).css({
            display: 'inline-block',
            'text-align': 'center',
            cursor: 'pointer',
            'margin-left': '10px',
            'margin-right': '10px',
        });
        $("#" + this.containerId).hover(function (e) {
            $(this).css("color", e.type === "mouseenter" ? "green" : "grey")
        });
        $("#" + this.micSpanId).html("<i id=" + this.micId + "></i>");
        $("#" + this.micId).addClass(this.fontAwesomeMic);
        $("#" + this.micId).css({ 'font-size': '1.5em', });

        $("#" + this.containerId).append("<span style='display: block;font-size: 0.7em;' >" + text + "</span>");

    },
    fChangeToRecording: function () {
        if (this.isRecording) {
            this.fChangeColor("#ff0000");
            $("#" + this.micId).addClass("fa-fade");
        } else {
            this.fChangeColor("grey");
            $("#" + this.micId).removeClass("fa-fade");
        }
    }
}
$p.mic_fa = {
    fCreate: function ($parentId) {
        this.$lang = "fa-IR";
        this.micSpanId = $parentId + "_mic_span" + this.$lang;
        this.containerId = $parentId + "_mic_container" + this.$lang;
        this.micId = $parentId + "_mic" + this.$lang;
        this.fontAwesomeMic = "fa-solid fa-microphone ";
        this.isRecording = false;


        this.fCreateChild($parentId);

        $("#" + this.containerId).click(this.fOnClick.bind(this));

        return this;
    },
    fOnClick: function () {
        if (this.isRecording) {
            this.isRecording = false;
            this.fChangeToRecording();
            $p.spr.fStop();
        } else {
            this.isRecording = true;
            this.fChangeToRecording();
            $p.spr.fChangeLanguage(this.$lang);
            $p.spr.fStart();
        }
    },
    fChangeColor: function (pColor) {
        $("#" + this.micSpanId).css("color", pColor);
    },
    fCreateChild: function ($parentId) {
        var text = "فارسی";
        $("#" + $parentId).append("<div id=" + this.containerId + "></div>");
        $("#" + this.containerId).append("<span id=" + this.micSpanId + "></span>");
        $("#" + this.containerId).css({
            display: 'inline-block',
            'text-align': 'center',
            cursor: 'pointer',
            'margin-left': '10px',
            'margin-right': '10px',
        });
        $("#" + this.containerId).hover(function (e) {
            $(this).css("color", e.type === "mouseenter" ? "blue" : "grey")
        });
        $("#" + this.micSpanId).html("<i id=" + this.micId + "></i>");
        $("#" + this.micId).addClass(this.fontAwesomeMic);
        $("#" + this.micId).css({ 'font-size': '1.5em', });
        $("#" + this.containerId).append("<span style='display: block;font-size: 0.7em;' >" + text + "</span>");
    },
    fChangeToRecording: function () {
        if (this.isRecording) {
            this.fChangeColor("#ff0000");
            $("#" + this.micId).addClass("fa-fade");
        } else {
            this.fChangeColor("grey");
            $("#" + this.micId).removeClass("fa-fade");
        }
    },
}
$p.micContainer = {
    fCreate: function ($element) {
        this.pId = $element.attr("id") + "_mic_container";
        this.fCreateChild($element);
        return this;
    },
    fCreateChild: function ($element) {
        $element.append("<div id=" + this.pId + "></div>");
        $("#" + this.pId).css({
            position: 'absolute',
            left: '0px',
            bottom: '-10px',
            color: 'gray',
        });
    }

}
$p.handWriting = {
    fCreate: function ($element) {
        this.pId = $element.attr("id") + "_hand_writing";
        this.fCreateChild($element);

    },
    fRemove: function ($element) {
        this.pId = $element.attr("id") + "_hand_writing";
        $("#" + this.pId).remove();
    },
    fCreateChild: function ($element) {
        $element.after("<canvas id=" + this.pId + "></canvas>");
        $("#" + this.pId).css({
            margin: '0 auto',
            width: '100px',
            height: '100px',
            'border': "2px solid red",
            'cursor': 'crosshair',
            'position': 'relative',
            top: '20px',
            'background-color': 'white',
        });
        $p.handWritingCanvas.fCreate(document.getElementById(this.pId), 3);
        $p.handWritingCanvas.setCallBack(function (pCallBack) {
            $p.textArea.fSetText(pCallBack[0]);
        })
    },


}

$p.handWritingCanvas = {
    fCreate: function (cvs, lineWidth) {
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

        const dpr = window.devicePixelRatio;
        this.height = document.body.offsetHeight;
        this.width = document.body.offsetWidth;

        this.canvas.style.height = this.height + "px";
        this.canvas.style.width = this.width + "px";
        this.canvas.setAttribute("width", (this.width * dpr) + "px");
        this.canvas.setAttribute("height", (this.height * dpr) + "px");

        this.cxt.scale(dpr, dpr);


        // this.Canvas.prototype.set_Undo_Redo = this.set_Undo_Redo.bind(this);

        // this.Canvas.prototype.setLineWidth = this.setLineWidth.bind(this);

        // this.Canvas.prototype.setCallBack = this.setCallBack.bind(this);

        // this.Canvas.prototype.setOptions = this.setOptions.bind(this);


        // this.canvas.addEventListener("mousedown", this.mouseDown.bind(this));


        // this.Canvas.prototype.mouseMove = this.mouseMove.bind(this);

        // this.Canvas.prototype.mouseUp = this.mouseUp.bind(this);


        // this.Canvas.prototype.touchStart = this.touchStart.bind(this);

        // this.Canvas.prototype.touchMove = this.touchMove.bind(this);

        // this.Canvas.prototype.touchEnd = this.touchEnd.bind(this);

        // this.Canvas.prototype.undo = this.undo.bind(this);

        // this.Canvas.prototype.redo = this.redo.bind(this);
        // this.Canvas.prototype.erase = this.erase.bind(this);

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
                        callback(results, undefined);
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

    set_Undo_Redo: function (undo, redo) {
        this.allowUndo = undo;
        this.allowRedo = undo ? redo : false;
        if (!this.allowUndo) {
            this.step = [];
            this.redo_step = [];
            this.redo_trace = [];
        }
    },

    setLineWidth: function (lineWidth) {
        this.lineWidth = lineWidth;
    },

    setCallBack: function (callback) {
        this.callback = callback;
    },

    setOptions: function (options) {
        this.options = options;
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

    undo: function () {
        if (!this.allowUndo || this.step.length <= 0) return;
        else if (this.step.length === 1) {
            if (this.allowRedo) {
                this.redo_step.push(this.step.pop());
                this.redo_trace.push(this.trace.pop());
                this.cxt.clearRect(0, 0, this.width, this.height);
            }
        } else {
            if (this.allowRedo) {
                this.redo_step.push(this.step.pop());
                this.redo_trace.push(this.trace.pop());
            } else {
                this.step.pop();
                this.trace.pop();
            }
            loadFromUrl(this.step.slice(-1)[0], this);
        }
    },

    redo: function () {
        if (!this.allowRedo || this.redo_step.length <= 0) return;
        this.step.push(this.redo_step.pop());
        this.trace.push(this.redo_trace.pop());
        loadFromUrl(this.step.slice(-1)[0], this);
    },

    erase: function () {
        this.cxt.clearRect(0, 0, this.width, this.height);
        this.step = [];
        this.redo_step = [];
        this.redo_trace = [];
        this.trace = [];
    },
}
$p.handIcon = {
    fCreate : function($parentId){
        this.handSpanId = $parentId + "_hand_span" ;
        this.containerId = $parentId + "_hand_container";
        this.handId = $parentId + "_hand";
        this.fontAwesomeMic = "fa-solid fa-pen";
        this.isHandWriting = false;
        this.fCreateChild($parentId);

        $("#" + this.containerId).click(this.fOnClick.bind(this));

        return this;
    },
    fCreateChild : function($parentId){
        var text = "قلم";
        $("#" + $parentId).append("<div id=" + this.containerId + "></div>");
        $("#" + this.containerId).append("<span id=" + this.handSpanId + "></span>");
        $("#" + this.containerId).css({
            display: 'inline-block',
            'text-align': 'center',
            cursor: 'pointer',
            'margin-left': '10px',
            'margin-right': '10px',
        });
        $("#" + this.containerId).hover(function (e) {
            $(this).css("color", e.type === "mouseenter" ? "maroon" : "grey")
        });
        $("#" + this.handSpanId).html("<i id=" + this.handId + "></i>");
        $("#" + this.handId).addClass(this.fontAwesomeMic);
        $("#" + this.handId).css({ 'font-size': '1.5em', });
        $("#" + this.containerId).append("<span style='display: block;font-size: 0.7em;' >" + text + "</span>");
    },
    fOnClick : function(){
        if (this.isHandWriting) {
            this.isHandWriting = false;
            this.fShow();
        } else {
            this.isHandWriting = true;
            this.fShow();
        }
    },
    fShow : function(){
        if (this.isHandWriting) {
            this.fChangeColor("#ff0000");
            $("#" + this.handId).addClass("fa-fade");
            $p.spr.fShowHandWriting(true);
            
        } else {
            this.fChangeColor("grey");
            $("#" + this.handId).removeClass("fa-fade");
            $p.spr.fShowHandWriting(false);
        }
    },
    fChangeColor: function (pColor) {
        $("#" + this.handSpanId).css("color", pColor);
    },
}

