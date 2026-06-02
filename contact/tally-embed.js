(function () {
  var formId = window.TALLY_CONTACT_FORM_ID;
  if (!formId || formId === "REPLACE_WITH_YOUR_FORM_ID") return;

  var thanksUrl =
    window.TALLY_CONTACT_THANKS_URL || "/contact/thanks/";

  var params =
    "alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";
  var embedUrl = "https://tally.so/embed/" + formId + "?" + params;

  window.addEventListener("message", function (e) {
    if (!e.data || typeof e.data !== "string") return;
    if (e.data.indexOf("Tally.FormSubmitted") === -1) return;
    try {
      var data = JSON.parse(e.data);
      var payload = data && data.payload;
      if (!payload || payload.formId !== formId) return;
      window.location.href = thanksUrl;
    } catch (err) {
      /* ignore malformed postMessage */
    }
  });

  document.querySelectorAll("[data-tally-contact]").forEach(function (el) {
    el.dataset.tallySrc = embedUrl;
  });

  function loadEmbeds() {
    if (typeof Tally !== "undefined") {
      Tally.loadEmbeds();
      return;
    }
    document
      .querySelectorAll("iframe[data-tally-src]:not([src])")
      .forEach(function (frame) {
        frame.src = frame.dataset.tallySrc;
      });
  }

  var scriptUrl = "https://tally.so/widgets/embed.js";
  if (typeof Tally !== "undefined") {
    loadEmbeds();
    return;
  }
  if (document.querySelector('script[src="' + scriptUrl + '"]')) {
    loadEmbeds();
    return;
  }
  var script = document.createElement("script");
  script.src = scriptUrl;
  script.onload = loadEmbeds;
  script.onerror = loadEmbeds;
  document.body.appendChild(script);
})();
