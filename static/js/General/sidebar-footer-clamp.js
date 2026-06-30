(function () {
  function clamp() {
    var footer = document.getElementById('footer');
    var sidebars = document.querySelectorAll('.sidebar, .sidebar-right');
    if (!footer || !sidebars.length) return;
    var footerTop = footer.getBoundingClientRect().top;
    var gap = Math.max(0, window.innerHeight - footerTop + 10);
    sidebars.forEach(function (el) {
      el.style.bottom = gap + 'px';
    });
  }
  window.addEventListener('scroll', clamp);
  window.addEventListener('resize', clamp);
  document.addEventListener('DOMContentLoaded', clamp);
  if (window.ResizeObserver) {
    new ResizeObserver(clamp).observe(document.body);
  }
})();
