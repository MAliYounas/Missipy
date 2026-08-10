(function () {
  var NAV = [
    { label: "Home", icon: "fa-house", href: "../Home%20Page/home_page.html" },
    { label: "Dashboard", icon: "fa-chart-pie", href: "../Dashboard/dashboard.html" },
    { label: "Invoice", icon: "fa-file-invoice", href: "../Invoice/invoice.html" },
    { label: "Sales", icon: "fa-receipt", href: "../Sales/sales.html" },
    { label: "Purchases", icon: "fa-cart-shopping", href: "../Purchases/purchases.html" },
    { label: "Inventory", icon: "fa-boxes-stacked", href: "../Inventory/inventory.html" },
    { label: "Customers", icon: "fa-users", href: "../Customer/customer.html" },
    { label: "Suppliers", icon: "fa-truck-fast", href: "../Supplier/supplier.html" },
    { label: "Expenses", icon: "fa-wallet", href: "../Expense/expense.html" },
    { label: "Debt", icon: "fa-scale-unbalanced", href: "../Debt/debt.html" },
    { label: "Assets", icon: "fa-building", href: "../Assets/assets.html" },
    { label: "Reports", icon: "fa-chart-line", href: "../Reports/reports.html" },
    { label: "Forecasting", icon: "fa-chart-area", href: "../Forecasting/forecasting.html" },
    { label: "AI Assistant", icon: "fa-robot", href: "../AI-Assistant/ai_assistant.html" },
    { label: "Accounts", icon: "fa-building-columns", href: "../Accounts/accounts.html" },
    { label: "Settings", icon: "fa-gear", href: "../Settings/settings.html" }
  ];

  function resolveHref(href) {
    var script = document.querySelector('script[src*="sidebar.js"]');
    if (!script) return href;
    return new URL(href, script.src).href;
  }

  function render(activeLabel) {
    var items = NAV.map(function (item) {
      var active = item.label === activeLabel;
      var cls = active ? "sidebar-nav__link sidebar-nav__link--active" : "sidebar-nav__link";
      var aria = active ? ' aria-current="page"' : "";
      return (
        '<li class="sidebar-nav__item">' +
          '<a class="' + cls + '" href="' + resolveHref(item.href) + '"' + aria + ' data-label="' + item.label + '">' +
            '<i class="fa-solid ' + item.icon + ' sidebar-nav__icon"></i>' +
            '<span class="sidebar-nav__text">' + item.label + "</span>" +
          "</a>" +
        "</li>"
      );
    }).join("");

    return (
      '<input class="sidebar-toggle" type="checkbox" id="sidebar-toggle" aria-label="Toggle sidebar">' +
      '<label class="sidebar-mobile-open" for="sidebar-toggle" aria-label="Open menu">' +
        '<i class="fa-solid fa-bars" aria-hidden="true"></i>' +
      "</label>" +
      '<label class="sidebar-backdrop" for="sidebar-toggle" aria-label="Close menu"></label>' +
      '<aside class="app-sidebar" aria-label="Main navigation">' +
        '<div class="sidebar__top">' +
          '<div class="sidebar__header">' +
            '<a class="brand" href="' + resolveHref("../Home%20Page/home_page.html") + '" aria-label="Missipy home" data-label="Missipy">' +
              '<span class="brand__logo" aria-hidden="true"><i class="fa-solid fa-file-invoice-dollar"></i></span>' +
              '<span class="brand__content">' +
                '<span class="brand__name">Missipy</span>' +
                '<span class="brand__tagline">Business Suite</span>' +
              "</span>" +
            "</a>" +
            '<label class="sidebar-toggle-button" for="sidebar-toggle" aria-label="Close menu">' +
              '<i class="fa-solid fa-xmark sidebar-toggle-button__mobile-close" aria-hidden="true"></i>' +
            "</label>" +
          "</div>" +
          '<nav class="sidebar-nav" aria-label="Sidebar menu">' +
            '<ul class="sidebar-nav__list">' + items + "</ul>" +
          "</nav>" +
        "</div>" +
        '<div class="sidebar__footer">' +
          '<a class="sidebar-logout" href="' + resolveHref("../Login/login.html") + '" data-label="Logout">' +
            '<i class="fa-solid fa-right-from-bracket sidebar-nav__icon" aria-hidden="true"></i>' +
            '<span class="sidebar-nav__text">Logout</span>' +
          "</a>" +
        "</div>" +
      "</aside>"
    );
  }

  function mount() {
    var el = document.getElementById("missipy-sidebar");
    if (!el) return;
    var active = el.getAttribute("data-active") || "Home";
    el.outerHTML = render(active);
  }

  function wireSidebarMobileScroll() {
    var toggle = document.getElementById("sidebar-toggle");
    var sidebar = document.querySelector(".app-sidebar");
    if (!toggle || !sidebar) return;

    function setOpen(open) {
      document.documentElement.classList.toggle("sidebar-is-open", open);
      document.body.classList.toggle("sidebar-is-open", open);
      if (!open) return;

      // Re-enable touch scrolling after the open transition (iOS / Android quirk)
      sidebar.scrollTop = 0;
      requestAnimationFrame(function () {
        sidebar.style.overflowY = "scroll";
        sidebar.style.webkitOverflowScrolling = "touch";
      });
    }

    toggle.addEventListener("change", function () {
      setOpen(toggle.checked);
    });

    sidebar.addEventListener(
      "touchstart",
      function () {
        if (!toggle.checked) return;
        // Nudge scroll layer awake if it got stuck
        if (sidebar.scrollHeight <= sidebar.clientHeight + 1) return;
        sidebar.style.overflowY = "scroll";
      },
      { passive: true }
    );

    setOpen(toggle.checked);
  }

  function wireFilterBars() {
    var bars = document.querySelectorAll(".expense-filter-bar");
    bars.forEach(function (bar) {
      bar.addEventListener("click", function (event) {
        var btn = event.target.closest(".expense-filter-bar__item");
        if (!btn || !bar.contains(btn)) return;
        bar.querySelectorAll(".expense-filter-bar__item").forEach(function (item) {
          item.classList.remove("expense-filter-bar__item--active");
          item.blur();
        });
        btn.classList.add("expense-filter-bar__item--active");
      });
    });
  }

  function formatFileSize(bytes) {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function fileIconClass(name) {
    var ext = (name.split(".").pop() || "").toLowerCase();
    if (["png", "jpg", "jpeg", "webp", "gif"].indexOf(ext) !== -1) return "fa-image";
    if (["xls", "xlsx", "csv"].indexOf(ext) !== -1) return "fa-file-excel";
    if (["doc", "docx"].indexOf(ext) !== -1) return "fa-file-word";
    if (ext === "pdf") return "fa-file-pdf";
    return "fa-file-lines";
  }

  function wireAiComposer() {
    var attachBtn = document.getElementById("ai-attach-btn");
    var fileInput = document.getElementById("ai-file-input");
    var list = document.getElementById("ai-attachments");
    if (!attachBtn || !fileInput || !list) return;

    var files = [];

    function renderFiles() {
      list.innerHTML = "";
      if (!files.length) {
        list.hidden = true;
        return;
      }
      list.hidden = false;
      files.forEach(function (file, index) {
        var chip = document.createElement("div");
        chip.className = "ai-file";
        chip.innerHTML =
          '<span class="ai-file__icon" aria-hidden="true"><i class="fa-solid ' +
          fileIconClass(file.name) +
          '"></i></span>' +
          '<span class="ai-file__meta">' +
          '<span class="ai-file__name"></span>' +
          '<span class="ai-file__size"></span>' +
          "</span>" +
          '<button class="ai-file__remove" type="button" aria-label="Remove file">' +
          '<i class="fa-solid fa-xmark" aria-hidden="true"></i>' +
          "</button>";
        chip.querySelector(".ai-file__name").textContent = file.name;
        chip.querySelector(".ai-file__size").textContent = formatFileSize(file.size);
        chip.querySelector(".ai-file__remove").addEventListener("click", function () {
          files.splice(index, 1);
          renderFiles();
        });
        list.appendChild(chip);
      });
    }

    attachBtn.addEventListener("click", function () {
      fileInput.click();
    });

    fileInput.addEventListener("change", function () {
      var selected = Array.prototype.slice.call(fileInput.files || []);
      selected.forEach(function (file) {
        var exists = files.some(function (f) {
          return f.name === file.name && f.size === file.size && f.lastModified === file.lastModified;
        });
        if (!exists) files.push(file);
      });
      fileInput.value = "";
      renderFiles();
    });
  }

  function init() {
    mount();
    wireSidebarMobileScroll();
    wireFilterBars();
    wireAiComposer();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
