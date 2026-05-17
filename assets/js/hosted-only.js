(() => {
  const blockedHosts = new Set(["localhost", "127.0.0.1", "::1"]);

  function isHosted() {
    return window.location.protocol === "https:" && !blockedHosts.has(window.location.hostname);
  }

  function loadScript(src, options = {}) {
    if (!isHosted()) return null;
    const script = document.createElement("script");
    script.src = src;
    Object.entries(options).forEach(([key, value]) => {
      if (value === true) {
        script.setAttribute(key, "");
      } else if (value !== false && value != null) {
        script.setAttribute(key, String(value));
      }
    });
    document.head.appendChild(script);
    return script;
  }

  function loadStyle(href) {
    if (!isHosted()) return null;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
    return link;
  }

  window.AmazingGraceHostedOnly = { isHosted, loadScript, loadStyle };
})();
