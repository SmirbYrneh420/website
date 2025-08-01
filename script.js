function update() {
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

function dropUp(event) {
    event.stopPropagation();
    const appList = document.getElementById("appList");
    appList.style.display = "flex";
    appList.style.flexDirection = "column";
}

function clearAllMenus() {
    // temporary stub
    const appList = document.getElementById("appList");
    if (appList.style.display != "none") {
        appList.style.display = "none";
    }
}

document.getElementById("appName").innerHTML = "Files";
document.getElementById("Apps").addEventListener("click", dropUp);
document.getElementById("body").addEventListener("click", clearAllMenus);

update();
setInterval(update, 1000);

// new if statement logic
            // condition ? true : false
            // how to get active window???