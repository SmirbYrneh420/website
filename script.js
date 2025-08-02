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

function clearAllMenus() {
    // temporary stub
    const appList = document.getElementById("appList");
    if (appList.style.display != "none") {
        appList.style.display = "none";
    }
}

document.getElementById("appName").innerHTML = "Files";
document.getElementById("body").addEventListener("click", clearAllMenus);

time();
setInterval(time, 1000);

// new if statement logic
// condition ? true : false
// how to get active window???
// notes between time logic and WinBox stuff

const position = "center"
function terminal() {
    new WinBox("Terminal", { mount: document.getElementById("terminal").cloneNode(true), x: position, y: position });
}

function aboutMe() {
    new WinBox("About", { mount: document.getElementById("about").cloneNode(true), x: position, y: position });
}

function refresh() {
    window.location.reload();
}

function appList() {
    new WinBox("All Apps", { mount: document.getElementById("launchpad").cloneNode(true), x: position, y: position, class: "just-x"});
}

document.getElementById("Terminal").addEventListener("click", terminal);
document.getElementById("Apps").addEventListener("click", appList);