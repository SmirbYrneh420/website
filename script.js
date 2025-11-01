// set all them variables for them windows
for (var i = 0; i < appList.length; i++) {
  var app = appList[i].title;
  var namer = appList[i].mainId;
  eval('var ' + namer + "Screen = document.querySelector(`#" + app + "`);");
  eval('var ' + namer + "ScreenOpen = document.querySelector(`#" + app + "open`);");
  eval('var ' + namer + "ScreenClose = document.querySelector(`#" + app + "close`);");
  eval(namer + "ScreenClose.addEventListener('click', function() { closeWindow(" + namer + "Screen); });");
  // there are currently only 5 apps only accessible from the top bar. Other apps are accessible from the dock, or in a future implementation if necessary, a launchpad-style folder.
  if (i < 5) {
    eval(namer + "ScreenOpen.addEventListener('click', function() { openWindow(" + namer + "Screen); });");
  } else {
    eval(namer + "ScreenOpen.addEventListener('click', function() { iconTap(" + namer + "Screen, '" + app + "'); });");
  }
  dragElement(document.getElementById(app));
}

// the lone dropdown menu
var dropdownMenu = document.querySelector("#dropdownmenu");
var dropdownMenuOpen = document.querySelector("#dropdownopen");
dropdownMenuOpen.addEventListener('click', function(event) { 
  event.stopPropagation();
  openWindow(dropdownMenu);
});
document.addEventListener('click', function() {
  closeWindow(dropdownMenu);
});

// additional variables
var topBar = document.querySelector("#topbar");
var dock = document.querySelector("#desktopApps");
var largestIndex = 1;
var selectedIcon = undefined;
var audio = null;
// navbar logic
var goUp = document.querySelector("#moveup");
goUp.addEventListener('click', function() {
  clearAllGalleryContent();
  setInitialGalleryContent();
  // this will work for now but will have to redo logic later
});

// consult blog.js for the content array
function noteview() {
  var notesContent = document.querySelector('#notescontent');
  var top = document.querySelector("#history");
  for (let i = 0; i < content.length; i++) {
    var note = content[i];
    var newEntry = document.createElement("div");
    newEntry.classList.add("cursor-[url(./cursors/select.cur),_pointer]");
    newEntry.classList.add("border-solid");
    newEntry.classList.add("border-2");
    newEntry.classList.add("rounded-md");
    newEntry.classList.add("bg-gray-900");
    newEntry.innerHTML = `<p>${note.title} (${note.date})</p>`;
    newEntry.addEventListener("click", function() {
      notesContent.innerHTML = content[i].content;
    });
    top.appendChild(newEntry);
  }
  notesContent.innerHTML = content[0].content;
}

function gallery() {
  for (var i = 0; i < galleryStructure.length; i++) {
    setGalleryContent(galleryStructure, i);
    // i ain't gonna make your life harder than it has to be
  }
  // consult gallery.js for the file structure array
  function setGalleryContent(inputArray, index) {
    var galleryContent = document.querySelector("#gallerycontents");
    var newEntry = document.createElement("span");
    newEntry.innerHTML = `<img class="w-20 h-20" src="${inputArray[index].image}"><p>${inputArray[index].name}</p>`;
    if (inputArray[index].isFolder) {
      newEntry.addEventListener("click", function() {
        for (var i = 0; i < inputArray[index].contents.length; i++) {
          var galleryContent = document.querySelector("#gallerycontents");
          galleryContent.innerHTML = '';
          setGalleryContent(inputArray[index].contents, i);
        } 
      });
    } else {
      newEntry.addEventListener("click", function() {
        // here's the plan:
        // store the boilerplate somewhere around here.
        // when this function is called, create a new div in #desktop with the boilerplate, setting variables and everything.
        // then, set the contents to whatever is in the file.
        // consult the first loop for more details.
        console.log("Attempted to open file");
      })
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

function musicplayer() {
  var target = document.querySelector("#playlist");
  var pauseButton = document.querySelector("#pause");
  var shuffle = false;
  var repeat = false;
  var shuffleOrder = [];
  var increment = 0;
  var index = 0;
  var newClass = "";
  var original = "";
  for (let i = 0; i < playlist.length; i++) {
    var song = playlist[i];
    var newSong = document.createElement("li");
    newSong.classList.add("cursor-[url(./cursors/select.cur),pointer]");
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
    var seekbar = document.querySelector("#seekbar");
    var seekleft = document.querySelector("#seekprogress");
    var seekright = document.querySelector("#totalprogress");
    var currentProgressInSeconds = 0;
    var totalProgressInSeconds = 0;
    if (audio) {
      audio.pause();
      audio = null;
    }
    audio = new Audio(song.file);
    document.querySelector("#thumbnail").innerHTML = `<img src="${song.image}">`;
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
    audio.play();
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

function closeWindow(element, id) {
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