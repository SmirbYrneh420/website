// each and every window, close, and open. there should be a better way to write this, but eh
// todo: shift to an array-object approach
var welcomeScreen = document.querySelector("#welcome");
var welcomeScreenClose = document.querySelector("#welcomeclose");
var welcomeScreenOpen = document.querySelector("#welcomeopen");
var notesScreen = document.querySelector("#noteview");
var notesScreenClose = document.querySelector("#noteviewclose");
var notesScreenOpen = document.querySelector("#noteviewopen");
var topBar = document.querySelector("#topbar");

var largestIndex = 1;

var selectedIcon = undefined;

var content = [
  {
    title: "Welcome",
    date: "10/15/25",
    content: `<h2>Welcome to NoteView</h2>
    <p>This is more of a personal blog of sorts. Use the Top Bar to navigate through past posts.</p>
    <p>For the art I post here and there, check out the Gallery app.</p>`
  },

  {
    title: "Test 2",
    date: "10/17/25",
    content: `<p>This is a test of separate blogposts</p>
    <img src="./rin.png">`
  },

  {
    title: "Test 4",
    date: "10/17/25",
    content: `<p>This is a test of separate blogposts</p>
    <img src="./rin.png">`
  },

  {
    title: "Test 3",
    date: "10/17/25",
    content: `<p>This is a test of separate blogposts</p>
    <img src="./rin.png">`
  }
]

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

// Make the windows draggable:
dragElement(document.getElementById("welcome"));
dragElement(document.getElementById("noteview"));

function dragElement(element) {
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

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
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

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

// Event Listener Libraries
welcomeScreenClose.addEventListener("click", function() {
  closeWindow(welcomeScreen);
});

welcomeScreenOpen.addEventListener("click", function() {
  openWindow(welcomeScreen);
});

notesScreenClose.addEventListener("click", function() {
  closeWindow(notesScreen);
});

notesScreenOpen.addEventListener("click", function() {
  iconTap(notesScreenOpen, notesScreen);
});

