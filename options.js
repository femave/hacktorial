// Saves options to chrome.storage
function save_options() {
  var schedule1_active = document.getElementById('schedule1_active').checked;
  var schedule1_in = document.getElementById('schedule1_in').value;
  var schedule1_out = document.getElementById('schedule1_out').value;
  var schedule2_active = document.getElementById('schedule2_active').checked;
  var schedule2_in = document.getElementById('schedule2_in').value;
  var schedule2_out = document.getElementById('schedule2_out').value;

  chrome.storage.sync.set({
    schedule1_active: schedule1_active,
    schedule1_in: schedule1_in,
    schedule1_out: schedule1_out,
    schedule2_active: schedule2_active,
    schedule2_in: schedule2_in,
    schedule2_out: schedule2_out
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    schedule1_active: true,
    schedule1_in: '9:00',
    schedule1_out: '13:00',
    schedule2_active: true,
    schedule2_in: '14:00',
    schedule2_out: '18:00'
  }, function(items) {
    document.getElementById('schedule1_active').checked = items.schedule1_active;
    document.getElementById('schedule1_in').value = items.schedule1_in;
    document.getElementById('schedule1_out').value = items.schedule1_out;
    document.getElementById('schedule2_active').checked = items.schedule2_active;
    document.getElementById('schedule2_in').value = items.schedule2_in;
    document.getElementById('schedule2_out').value = items.schedule2_out;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
