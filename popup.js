// let reportShift = document.getElementById("reportShift");
let reportShiftOnDate = document.getElementById("reportShiftOnDate");
let cleanShifts = document.getElementById("cleanShifts");
let month = document.getElementById("month");
var today = new Date();
month.value = today.getMonth() + 1;

// reportShift.addEventListener("click", async () => {
//   console.info("Apply shifts clicked");
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: applyShifts,
//   });
// });

reportShiftOnDate.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let month = document.getElementById("month").value;


  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: applyShiftsOnDate,
    args: [month]
  });
});


cleanShifts.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let month = document.getElementById("month").value;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: applyCleanShifts,
    args: [month]
  });
});


function applyShifts() {
  console.info("Apply shifts run");
  chrome.storage.sync.get({
    schedule1_active: true,
    schedule1_in: '9:30',
    schedule1_out: '13:00',
    schedule2_active: true,
    schedule2_in: '14:00',
    schedule2_out: '18:30'
  }, function (items) {
    let clock = [];
    if (items.schedule1_active) {
      clock.push({ clock_in: items.schedule1_in, clock_out: items.schedule1_out });
    }
    if (items.schedule2_active) {
      clock.push({ clock_in: items.schedule2_in, clock_out: items.schedule2_out });
    }

    var today = new Date();

    let fac = new Hacktorial(today.getFullYear(), today.getMonth() + 1, clock);
    fac.run();
  });
}

function applyShiftsOnDate(month) {
  chrome.storage.sync.get({
    schedule1_active: true,
    schedule1_in: '9:30',
    schedule1_out: '13:00',
    schedule2_active: true,
    schedule2_in: '14:00',
    schedule2_out: '18:30'
  }, function (items) {
    let clock = [];
    if (items.schedule1_active) {
      clock.push({ clock_in: items.schedule1_in, clock_out: items.schedule1_out });
    }
    if (items.schedule2_active) {
      clock.push({ clock_in: items.schedule2_in, clock_out: items.schedule2_out });
    }

    var today = new Date();

    let fac = new Hacktorial(today.getFullYear(), month, clock);
    console.log("Running hacktorial!")
    fac.run();
  });
}


function applyCleanShifts(month) {
  console.info("Running applyCleanShifts")
  var today = new Date();
  let fac = new Hacktorial(today.getFullYear(), month, false);
  fac.clean();
}
