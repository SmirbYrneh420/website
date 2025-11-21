// TODO: Maybe copyparty is a little too slow for my needs?
const json = "https://comment-walt-warrior-donated.trycloudflare.com/drive/webpage_data";
const topBar = document.querySelector("#topbar");
const dock = document.querySelector("#desktopApps");
var largestIndex = 1;
var selectedIcon = undefined;
var audio = null;
var appList = undefined;

// navbar logic
const goUp = document.querySelector("#moveup");
var a = 0;
goUp.addEventListener('click', function() {
  const galleryContent = document.querySelector("#gallerycontents");
  const filepath = document.querySelector("#filepath");
  galleryContent.innerHTML = '';
  filepath.innerHTML = '/';
  gallery();
  // this will work for now but will have to redo logic later
});

configureSettings();

async function setWindows() {
  appList = await getJsonData(json, "applist.json");
  // set all them variables for them windows
  // image viewer is called within gallery, so skip that
  for (var i = 0; i < appList.length; i++) {
    var app = appList[i].title;
    var namer = appList[i].mainId;
    eval('var ' + namer + "Screen = document.querySelector(`#" + app + "`);");
    eval('var ' + namer + "ScreenClose = document.querySelector(`#" + app + "close`);");
    eval(namer + "ScreenClose.addEventListener('click', function() { closeWindow(" + namer + "Screen); });");
    if (i > 0) {
      eval('var ' + namer + "ScreenOpen = document.querySelector(`#" + app + "open`);");
      if (i < 6) {
        eval(namer + "ScreenOpen.addEventListener('click', function() { openWindow(" + namer + "Screen); });");
      } else {
        eval(namer + "ScreenOpen.addEventListener('click', function() { iconTap(" + namer + "Screen, '" + app + "'); });");
      }
    }
    // there are currently only 4 apps only accessible from the top bar. Other apps are accessible from the dock, or in a future implementation if necessary, a launchpad-style folder.
    dragElement(document.getElementById(app));
  }
}
setWindows();

// the lone dropdown menu
const dropdownMenu = document.querySelector("#dropdownmenu");
const dropdownMenuOpen = document.querySelector("#dropdownopen");
dropdownMenuOpen.addEventListener('click', function(event) { 
  event.stopPropagation();
  openWindow(dropdownMenu);
});
document.addEventListener('click', function() {
  closeWindow(dropdownMenu);
});

function setOutsideCookie(name, event) {
    event.preventDefault();
    setCookie(name, event.target.value, 365);
}
function setCookie(cname, cvalue, exdays) {
    a = getCookie('cursor');
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    configureSettings();
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookiearray = decodedCookie.split(';');
  for(let i = 0; i < cookiearray.length; i++) {
    let c = cookiearray[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function configureSettings() {

  // check cookie
  let cursor = getCookie("cursor");
  if (cursor != "") {
    configureCursor(cursor);
  } else {   
    setCookie("cursor", "1", 365);
  }

  function configureCursor(num) {
    num = num || 1
    const cursorPointer = document.querySelectorAll(".pointer");
    const cursorDefault = document.querySelectorAll(".normal");
    const cursorText = document.querySelectorAll(".text");
    var param = ["cursor-", "0", "-", "~"];
    var a = getCookie("cursor");
    param[1] = num.toString();
    routeCursorStyle(cursorPointer, param, "pointer");
    routeCursorStyle(cursorDefault, param, "normal");
    routeCursorStyle(cursorText, param, "text");

    function routeCursorStyle(cursor, arr, style) {
      arr[3] = style;
      var text = arr.join('');
      if (cursor.length < 1) {
        arr[1] = a;
        cursor = document.querySelectorAll(arr.join(''));
        style = arr.join('');
      }
      setCursors(cursor, style, text);
    }

    function setCursors(list, target, replacer) {
      for (var i = 0; i < list.length; i++) {
        list[i].classList.replace(target, replacer);
      }
    }
  }
}

async function getJsonData(url, file) {
  var finale = [];
  const signal = await fetch(url.concat("/json/", file));
  const json = await signal.json();
  for (var i in json) {
    finale.push(json[i]);
  }
  return finale[0];
}

// consult blog.json for the content array
async function noteview() {
  const blog = await getJsonData(json, "blog.json");
  const notesContent = document.querySelector('#notescontent');
  const top = document.querySelector("#history");
  for (let i = 0; i < blog.length; i++) {
    var note = blog[i];
    var newEntry = document.createElement("div");
    newEntry.classList.add("border-solid", "border-2", "rounded-md", "bg-gray-900", "pointer");
    newEntry.innerHTML = `<p>${note.title} (${note.date})</p>`;
    newEntry.addEventListener("click", function() {
      notesContent.innerHTML = blog[i].content;
    });
    top.appendChild(newEntry);
  }
  notesContent.innerHTML = blog[0].content;
  configureSettings();
}

async function gallery() {
  const galleryStructure = await getJsonData(json, "gallery.json");
  
  for (var i = 0; i < galleryStructure.length; i++) {
    setGalleryContent(galleryStructure, i);
    // i ain't gonna make your life harder than it has to be
  }
  // consult gallery.json for the file structure array
  function setGalleryContent(inputArray, index) {
    const galleryContent = document.querySelector("#gallerycontents");
    const filePath = document.querySelector("#filepath");
    var newEntry = document.createElement("span");
    newEntry.innerHTML = `<img class="w-20 h-20" src="${inputArray[index].image}"><p class="break-all text-sm">${inputArray[index].name}</p>`;
    if (inputArray[index].isFolder) {
      newEntry.addEventListener("click", function() {
        galleryContent.innerHTML = '';
        filePath.innerHTML = '/' + inputArray[index].name + '/';
        for (var i = 0; i < inputArray[index].contents.length; i++) {
          setGalleryContent(inputArray[index].contents, i);
        } 
      });
    } else {
      newEntry.addEventListener("click", function() {
        document.getElementById("imgviewcontents").innerHTML = inputArray[index].contents;
        openWindow(document.querySelector("#imgview"));
      });
    }
    galleryContent.appendChild(newEntry);
  }
}

function gamedemo() {
  document.querySelector("#thing").innerHTML = `<iframe class="cursor-[url('./cursors/normal.cur'),default]" frameborder="0" src="https://itch.io/embed-upload/15081350?color=333333" allowfullscreen="" width="640" height="380"><a href="https://smirbyrneh420.itch.io/together-or-never-demo">Itch.io link</a></iframe>`;
}

function email() {
  // TODO: Buy a domain to migrate from GitHub Pages to another provider for PHP and MySQL support
  return;
}

function interwebz() {
  return;
}

function refreshToHomeScreen() {
  document.getElementById("webview").src = "https://comment-walt-warrior-donated.trycloudflare.com/";
}

function python() {
  return;
}

// i can't get this to work
async function parseAsTextDoc() {
  var message = document.getElementById('message').value;
  message = "<-- BEGIN PGP MESSAGE --> \\n".concat(message);
  message = message.concat("\\n <-- END PGP MESSAGE -->")
  // this web user is already extremely restricted anyway
  fetch("https://comment-walt-warrior-donated.trycloudflare.com/mail/mail.txt?pw=p4ssw0rd69", {
    method: 'PUT',
    body: message,
    headers: {
      "Content-Type": "text/markdown; charset=UTF-8"
    }
  });
}

async function musicplayer() {
  const target = document.querySelector("#playlist");
  const pauseButton = document.querySelector("#pause");
  const playlist = await getJsonData(json, "music.json");
  var shuffle = false;
  var repeat = false;
  var shuffleOrder = [];
  var increment = 0;
  var index = 0;
  var newClass = "";
  var original = "";
  var context = new AudioContext();
  var analyser = context.createAnalyser();
  for (let i = 0; i < playlist.length; i++) {
    var song = playlist[i];
    var newSong = document.createElement("li");
    newSong.classList.add("pointer");
    newSong.innerHTML = `<p>${song.title}</p><p class="text-xs">${song.author}</p><br>`;
    newSong.addEventListener('click', (function(currentSong) {
      return function() {
        // is only called once but it's one hell of a logic segment
        playSong(currentSong);
      };
    })(song));
    target.appendChild(newSong);
  }
  pauseButton.addEventListener('click', function() {
    if (!audio.paused) {
      audio.pause();
      pauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z"/></svg>`;
    } else {
      audio.play();
      pauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M2 6c0-1.886 0-2.828.586-3.414S4.114 2 6 2s2.828 0 3.414.586S10 4.114 10 6v12c0 1.886 0 2.828-.586 3.414S7.886 22 6 22s-2.828 0-3.414-.586S2 19.886 2 18zm12 0c0-1.886 0-2.828.586-3.414S16.114 2 18 2s2.828 0 3.414.586S22 4.114 22 6v12c0 1.886 0 2.828-.586 3.414S19.886 22 18 22s-2.828 0-3.414-.586S14 19.886 14 18z"/></svg>`;
    }
  });

  // Set the buttons and shuffle functionality
  document.querySelector("#shuffle").addEventListener('click', function() {
    var temp = 0;
    while (shuffleOrder.length <= (playlist.length - 1)) {
      temp = Math.abs(Math.round((Math.random() * playlist.length) - 1));
      if (shuffleOrder.indexOf(temp) < 0) {
        shuffleOrder.push(temp);
      }
    }
    setSvgAndStuff('shuffle');
    if (!(audio)) {
      playSong(playlist[shuffleOrder[increment]]);
    }
  });
  document.querySelector("#repeat").addEventListener('click', function() {
    setSvgAndStuff('repeat');
  });
  document.querySelector("#nextsong").addEventListener('click', function() {
    if (shuffle) {
      increment++;
      playNextSong(playlist[shuffleOrder[increment]]);
    } else if (repeat) {
      playNextSong(playlist[index]);
    } else { 
      playNextSong(playlist[index+1]);
    }
  });
  document.querySelector("#rewind").addEventListener('click', function() {
    if (shuffle) {
      increment--;
      playNextSong(playlist[shuffleOrder[increment]]);
    } else if (repeat) {
      playNextSong(playlist[index]);
    } else { 
      playNextSong(playlist[index-1]);
    }
  });

  configureSettings();
  function setSvgAndStuff(vari) {
    eval(vari + ` = !(` + vari + `)`);
    var variName = eval(vari);
    newClass = variName ? "fill-cyan-500" : "fill-white";
    original = variName ? "fill-white" : "fill-cyan-500";
    eval(`document.querySelector("#` + vari + `button").classList.replace(original, newClass)`);
    newClass = variName ? "stroke-cyan-500" : "stroke-white";
    original = variName ? "stroke-white" : "stroke-cyan-500";
    eval(`document.querySelector("#` + vari + `stroke").classList.replace(original, newClass)`);
  }

  function playSong(song) {
    // Handles anything related to the Audio class.

    // basically the equivalent of taking an integral of a derivative.
    // takes the index of a song in the array
    index = playlist.findIndex(s => s.title === song.title && s.author === song.author);
    const seekbar = document.querySelector("#seekbar");
    const seekleft = document.querySelector("#seekprogress");
    const seekright = document.querySelector("#totalprogress");
    var currentProgressInSeconds = 0;
    var totalProgressInSeconds = 0;
    if (audio) {
      audio.pause();
      audio = null;
    }
    audio = new Audio(json.concat(song.file));
    audio.crossOrigin = "anonymous";
    document.querySelector("#thumbnail").innerHTML = `<img src="${json.concat(song.image)}">`;
    document.querySelector("#songtitle").innerHTML = `<h3>${song.title}</h3>`;
    document.querySelector("#songauthor").innerHTML = `<p>${song.author}</p>`;
    pauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M2 6c0-1.886 0-2.828.586-3.414S4.114 2 6 2s2.828 0 3.414.586S10 4.114 10 6v12c0 1.886 0 2.828-.586 3.414S7.886 22 6 22s-2.828 0-3.414-.586S2 19.886 2 18zm12 0c0-1.886 0-2.828.586-3.414S16.114 2 18 2s2.828 0 3.414.586S22 4.114 22 6v12c0 1.886 0 2.828-.586 3.414S19.886 22 18 22s-2.828 0-3.414-.586S14 19.886 14 18z"/></svg>`;
    audio.addEventListener('timeupdate', function() {
      seekbar.value = (this.currentTime / this.duration) * 100;
      currentProgressInSeconds = convertToProperMinutesOrSeconds(Math.round(this.currentTime) % 60);
      totalProgressInSeconds = convertToProperMinutesOrSeconds(Math.round(this.duration) % 60);
      seekleft.innerHTML = `${(Math.floor(Math.round(this.currentTime) / 60))}:${currentProgressInSeconds}`;
      seekright.innerHTML = `${Math.floor(Math.round(this.duration) / 60)}:${totalProgressInSeconds}`;
    });
    // The following logic initializes UI, then plays audio, then sets event listeners to check for headphone input or song ending
    seekbar.addEventListener('input', function() {
      if (audio && audio.duration) {
        audio.currentTime = (seekbar.value / 100) * audio.duration;
      }
    });
    play_and_draw();
    audio.addEventListener('ended', function() {
      if (shuffle) {
        increment++;
        playNextSong(playlist[shuffleOrder[increment]]);
      } else if (repeat) {
        playNextSong(playlist[index]);
      } else { 
        playNextSong(playlist[index+1]);
      }
    });
    audio.addEventListener('pause', function() {
      pauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z"/></svg>`;
    });
    audio.addEventListener('play', function() {
      pauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M2 6c0-1.886 0-2.828.586-3.414S4.114 2 6 2s2.828 0 3.414.586S10 4.114 10 6v12c0 1.886 0 2.828-.586 3.414S7.886 22 6 22s-2.828 0-3.414-.586S2 19.886 2 18zm12 0c0-1.886 0-2.828.586-3.414S16.114 2 18 2s2.828 0 3.414.586S22 4.114 22 6v12c0 1.886 0 2.828-.586 3.414S19.886 22 18 22s-2.828 0-3.414-.586S14 19.886 14 18z"/></svg>`;
    });
  }
  function playNextSong(song) {
    if (song) {
      playSong(song);
    } else {
      pauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z"/></svg>`;
      audio.pause();
    }
  }
  function play_and_draw() {
    if (!src) {
      var src = context.createMediaElementSource(audio);
      src.connect(analyser);
      analyser.connect(context.destination);
    }
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;
    function renderFrame() {
      requestAnimationFrame(renderFrame);
      x = 0;
      analyser.getByteFrequencyData(dataArray);
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 1.5 - 50;
        
        var r = barHeight + (25 * (i/bufferLength));
        var g = 250 * (i/bufferLength);
        var b = 50;

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }
    audio.play();
    renderFrame();
  }

  async function ensureAudioContextRunning() {
    if (context.state === "suspended") {
        try {
            audio.pause();
            audio.currentTime = 0; // if this somehow fixes the pitchup i will eat my hat
            await context.resume();
            console.log("AudioContext resumed");
            audio.play();
        } catch (e) {
            console.warn("Could not resume context:", e);
        }
    }
  }
  // Resume on wake
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        ensureAudioContextRunning();
    }
  });

  window.addEventListener("focus", ensureAudioContextRunning);

  // Mobile, why?
  window.addEventListener("touchstart", () => {
    if (context.state === "suspended") {
        ensureAudioContextRunning();
    }
  }, { once: true });
}

function time() {
    const deez = new Date();
    let hour = deez.getHours();
    let minute = deez.getMinutes();
    let period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    hour = hour ? hour : 12;
    minute = convertToProperMinutesOrSeconds(minute);

    const actualDate = `${hour}:${minute} ${period}`;
    document.getElementById("time").innerHTML = actualDate;
}
time();
setInterval(time, 1000);

// used for both mp3 player and current time
function convertToProperMinutesOrSeconds(minutes) {
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return minutes;
}

// window management.sys
function dragElement(element) {
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;
  var newX = 0;
  var newY = 0;

  // Check if there is a special header element associated with the draggable element.
  if (document.getElementById(element.id + "header")) {
    // drag from header only
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    // drag from anywhere
    element.onmousedown = startDragging;
  }

  // capture the initial mouse position and set up event listeners
  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    reorganizeWindows(element);
    // initial mouse pos
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = elementDrag;
  }

  // checks mouse position and drags window accordingly, with limitations
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    // I inverted these at one point...
    newY = element.offsetTop - currentY;
    newX = element.offsetLeft - currentX;
    if (newX < 0) {
      stopDragging();
      newX = 1;
    }
    if (newY < 0) {
      stopDragging();
      newY = 1;
    }
    if (newX > (document.documentElement.clientWidth)) {
      stopDragging();
      newX = document.documentElement.clientWidth - 32;
    }
    if (newY > document.documentElement.clientHeight) {
      stopDragging();
      newY = document.documentElement.clientHeight - 32;
    }
    element.style.top = (newY) + "px";
    element.style.left = (newX) + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function refresh() {
  window.location.reload();
}

// icon and window stuffs

function iconTap(window, id) {
    loadApp(id);
    openWindow(window);
}

function closeWindow(element) {
    element.style.display = "none"
}

function openWindow(element) {
    element.style.display = "block"
    reorganizeWindows(element);
}

function reorganizeWindows(element) {
  largestIndex = largestIndex + 1;
  element.style.zIndex = largestIndex;
  topBar.style.zIndex = largestIndex + 1;
  dock.style.zIndex = largestIndex + 1;
}

function windowTap(element) {
  reorganizeWindows(element);
  deselectIcon(selectedIcon);
}

function loadApp(ignition) {
  var index = appList.findIndex(a => a.title === ignition);
  if (!(appList[index].hasBeenOpened)) { 
    eval(ignition + "();");
    appList[index].hasBeenOpened = true;
  } else { return; }
}
