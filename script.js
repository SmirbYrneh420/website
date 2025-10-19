var appList = [
  {
    title: "welcome",
    mainId: "welcome"
  },
  {
    title: "about",
    mainId: "about"
  },
  {
    title: "contact",
    mainId: "contact"
  },
  {
    title: "license",
    mainId: "license"
  },
  {
    title: "noteview",
    mainId: "notes"
  },
  {
    title: "gallery",
    mainId: "gallery"
  }
]

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
    eval(namer + "ScreenOpen.addEventListener('click', function() { iconTap(" + namer + "ScreenOpen, " + namer + "Screen); });");
  }
  dragElement(document.getElementById(app));
}

var dropdownMenu = document.querySelector("#dropdownmenu");
var dropdownMenuOpen = document.querySelector("#dropdownopen");
dropdownMenuOpen.addEventListener('click', function(event) { 
  event.stopPropagation();
  openWindow(dropdownMenu);
});
document.addEventListener('click', function() {
  closeWindow(dropdownMenu);
});

var topBar = document.querySelector("#topbar");
var largestIndex = 1;
var selectedIcon = undefined;

// consult blog.js for the content array
function setNotesContent(index) {
  var notesContent = document.querySelector('#notesContent');
  notesContent.innerHTML = content[index].content;
}

function noteViewTopBar(index) {
  var top = document.querySelector("#history");
  var note = content[index];
  var newEntry = document.createElement("div");
  newEntry.classList.add("cursor-pointer");
  newEntry.classList.add("border-solid");
  newEntry.classList.add("border-2");
  newEntry.classList.add("rounded-md");
  newEntry.classList.add("bg-gray-900");
  newEntry.innerHTML = `<p>${note.title} (${note.date})</p>`;
  
  newEntry.addEventListener("click", function() {
    setNotesContent(index);
  });

  top.appendChild(newEntry);
}
setNotesContent(0);

for (let i = 0; i < content.length; i++) {
  noteViewTopBar(i);
}

// time for topbar
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

function iconTap(element, window) {
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



