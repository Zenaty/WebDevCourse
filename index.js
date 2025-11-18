// -- Page to navigate
function loadPage(page) {
  let iframeElement = document.getElementById("contentFrame");
  iframeElement.src = page;

  // Close sidebar on mobile
  document.getElementById("sidebar").classList.remove("show");
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("show");
}
