// Builds the studio email address in the browser so scrapers reading raw HTML never see it.
// Usage: <a class="js-mail" data-subject="Optional subject" href="contact.html">contact form</a>
(function () {
  var addr = ['essentialscreative', 'gmail.com'].join('@');
  document.querySelectorAll('.js-mail').forEach(function (el) {
    if (el.tagName === 'A') {
      var subject = el.getAttribute('data-subject');
      el.href = 'mailto:' + addr + (subject ? '?subject=' + encodeURIComponent(subject) : '');
    }
    el.textContent = addr;
  });
})();
