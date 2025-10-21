// set all them variables for them windows
for (var i = 0; i < appList.length; i++) {
  var app = appList[i].title;
  var namer = appList[i].mainId;
  eval('var ' + namer + "Screen = document.querySelector(`#" + app + "`);");
  eval('var ' + namer + "ScreenOpen = document.querySelector(`#" + app + "open`);");
  eval('var ' + namer + "ScreenClose = document.querySelector(`#" + app + "close`);");
  eval(namer + "ScreenClose.addEventListener('click', function() { closeWindow(" + namer + "Screen); });");
  if (i < 4) {
    eval(namer + "ScreenOpen.addEventListener('click', function() { openWindow(" + namer + "Screen); });");
  } else {
    eval(namer + "ScreenOpen.addEventListener('click', function() { iconTap(" + namer + "ScreenOpen, " + namer + "Screen, true); });");
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
var largestIndex = 1;
var selectedIcon = undefined;
var audio = null;

// consult blog.js for the content array
function setNotesContent(index) {
  var notesContent = document.querySelector('#notescontent');
  notesContent.innerHTML = content[index].content;
}

function noteViewTopBar() {
  var top = document.querySelector("#history");
  for (let i = 0; i < content.length; i++) {
    var note = content[i];
    var newEntry = document.createElement("div");
    newEntry.classList.add("cursor-pointer");
    newEntry.classList.add("border-solid");
    newEntry.classList.add("border-2");
    newEntry.classList.add("rounded-md");
    newEntry.classList.add("bg-gray-900");
    newEntry.innerHTML = `<p>${note.title} (${note.date})</p>`;
    
    newEntry.addEventListener("click", function() {
      setNotesContent(i);
    });

    top.appendChild(newEntry);
  }
}

setNotesContent(0);
noteViewTopBar();

// consult gallery.js for the file structure array
function setGalleryContent(inputArray, index) {
  var galleryContent = document.querySelector("#gallerycontents");
  var newEntry = document.createElement("span");
  newEntry.innerHTML = `<img class="w-20 h-20" src="${inputArray[index].image}"><p>${inputArray[index].name}</p>`;

  if (inputArray[index].isFolder) {
    newEntry.addEventListener("click", function() {
      for (var i = 0; i < inputArray[index].contents.length; i++) {
        clearAllGalleryContent();
        setGalleryContent(inputArray[index].contents, i);
      } 
    });
  } else {
    newEntry.addEventListener("click", function() {
      console.log("Attempted to open file");
    })
  }
  galleryContent.appendChild(newEntry);
}

function clearAllGalleryContent() {
  var galleryContent = document.querySelector("#gallerycontents");
  galleryContent.innerHTML = '';
}

function setInitialGalleryContent() {
  for (var i = 0; i < galleryStructure.length; i++) {
    setGalleryContent(galleryStructure, i);
  }
}
setInitialGalleryContent();

// navbar logic
var goUp = document.querySelector("#moveup");
goUp.addEventListener('click', function() {
  clearAllGalleryContent();
  setInitialGalleryContent();
  // this will work for now but will have to redo logic later
});

function setPlaylistContent() {
  var target = document.querySelector("#playlist");
  for (let i = 0; i < playlist.length; i++) {
    var song = playlist[i];
    var newSong = document.createElement("li");
    newSong.classList.add("cursor-pointer");
    newSong.innerHTML = `<p>${song.title}</p><p class="text-xs">${song.author}</p><br>`;
    newSong.addEventListener('click', (function(currentSong) {
      return function() {
        playSong(currentSong);
      };
    })(song));
    target.appendChild(newSong);
  }

  // not in the naming scheme but set the pause button event listener too
  var pauseButton = document.querySelector("#pause");
  pauseButton.addEventListener('click', function() {
    if (!audio.paused) {
      audio.pause();
      pauseButton.innerHTML = `<p>&#9205</p>`;
    } else {
      audio.play();
      pauseButton.innerHTML = `<p>&#9208</p>`;
    }
  });
}
setPlaylistContent();

function playSong(song) {
  var image = document.querySelector("#thumbnail");
  var title = document.querySelector("#songtitle");
  var author = document.querySelector("#songauthor");
  if (audio) {
    audio.pause();
    audio = null;
  }
  audio = new Audio(song.file);
  image.innerHTML = `<img src="${song.image}">`;
  title.innerHTML = `<h3>${song.title}</h3>`;
  author.innerHTML = `<p>${song.author}</p>`;
  audio.play();
}

// set time for topbar
function time() {
    const deez = new Date();
    let hour = deez.getHours();
    let minutes = deez.getMinutes();
    let period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    hour = hour ? hour : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    const actualDate = `${hour}:${minutes} ${period}`;
    document.getElementById("time").innerHTML = actualDate;
}
time();
setInterval(time, 1000);

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
    // check for mouse movement and button release
    document.onmouseup = stopDragging;
    document.onmousemove = elementDrag;
  }

  // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 10: Calculate the new cursor position.
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
    newX = element.offsetTop - currentY;
    newY = element.offsetLeft - currentX;
    if (newX < 0) {
      stopDragging();
      newX = 1;
    }
    if (newY < 0) {
      stopDragging();
      newY = 1;
    }
    element.style.top = (newX) + "px";
    element.style.left = (newY) + "px";
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
function selectIcon(element) {
    element.classList.add("selected");
    selectedIcon = element;
}

function deselectIcon(element) {
    element.classList.remove("selected");
    selectedIcon = undefined;
}

function iconTap(element, window, isFolder) {
    if (element.classList.contains("selected")) {
      deselectIcon(element);
      openWindow(window);
    } else {
      selectIcon(element);
    }
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
}

function windowTap(element) {
  reorganizeWindows(element);
  deselectIcon(selectedIcon);
}