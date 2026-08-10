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
          '<a class="' + cls + '" href="' + resolveHref(item.href) + '"' + aria + '>' +
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
            '<a class="brand" href="' + resolveHref("../Home%20Page/home_page.html") + '" aria-label="Missipy home">' +
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
          '<a class="sidebar-logout" href="' + resolveHref("../Login/login.html") + '">' +
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

  function wireDashboardPeriod() {
    var bar = document.querySelector(".dash-period");
    if (!bar) return;

    var data = {
      "30": {
        label: "Last 30 days",
        sales: "Rs 428,500",
        revenue: "Rs 392,100",
        expenses: "Rs 146,800",
        debt: "Rs 87,250",
        cash: "Rs 245,300",
        salesHint: "+12% vs prior period",
        revenueHint: "Collected payments",
        expensesHint: "Operating costs",
        debtHint: "Receivables due",
        cashHint: "After expenses & debt",
        bars: [42, 58, 51, 74],
        barLabels: ["W1", "W2", "W3", "W4"],
        mix: { revenue: 73, expenses: 27, debt: 16 }
      },
      "180": {
        label: "Last 6 months",
        sales: "Rs 2.41M",
        revenue: "Rs 2.18M",
        expenses: "Rs 812,400",
        debt: "Rs 214,900",
        cash: "Rs 1.37M",
        salesHint: "+8% vs prior 6 months",
        revenueHint: "Collected payments",
        expensesHint: "Operating costs",
        debtHint: "Receivables due",
        cashHint: "After expenses & debt",
        bars: [48, 55, 62, 58, 70, 76],
        barLabels: ["M1", "M2", "M3", "M4", "M5", "M6"],
        mix: { revenue: 73, expenses: 27, debt: 10 }
      },
      "365": {
        label: "This year",
        sales: "Rs 4.86M",
        revenue: "Rs 4.41M",
        expenses: "Rs 1.62M",
        debt: "Rs 318,500",
        cash: "Rs 2.79M",
        salesHint: "+15% vs last year",
        revenueHint: "Collected payments",
        expensesHint: "Operating costs",
        debtHint: "Receivables due",
        cashHint: "After expenses & debt",
        bars: [40, 46, 52, 49, 61, 68, 64, 72, 70, 78, 81, 86],
        barLabels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
        mix: { revenue: 73, expenses: 27, debt: 7 }
      }
    };

    function apply(period) {
      var set = data[period] || data["30"];
      var map = {
        sales: set.sales,
        revenue: set.revenue,
        expenses: set.expenses,
        debt: set.debt,
        cash: set.cash
      };
      Object.keys(map).forEach(function (key) {
        var el = document.querySelector('[data-metric="' + key + '"]');
        if (el) el.textContent = map[key];
      });
      ["sales", "revenue", "expenses", "debt", "cash"].forEach(function (key) {
        var hint = document.querySelector('[data-metric-hint="' + key + '"]');
        if (hint) hint.textContent = set[key + "Hint"];
      });
      var label = document.querySelector("[data-chart-label]");
      if (label) label.textContent = set.label;

      var mixKeys = ["revenue", "expenses", "debt"];
      mixKeys.forEach(function (key) {
        var val = document.querySelector('[data-mix="' + key + '"]');
        if (val) val.textContent = set[key];
        var track = document.querySelector("#dash-mix .dash-stack__row:nth-child(" + (mixKeys.indexOf(key) + 1) + ") i");
        if (track) track.style.setProperty("--w", set.mix[key] + "%");
      });

      var bars = document.getElementById("dash-sales-bars");
      if (!bars) return;
      bars.innerHTML = set.bars
        .map(function (h, i) {
          return (
            '<div class="dash-bars__col"><span style="--h:' +
            h +
            '%"></span><em>' +
            (set.barLabels[i] || "") +
            "</em></div>"
          );
        })
        .join("");
      bars.style.gridTemplateColumns = "repeat(" + set.bars.length + ", minmax(0, 1fr))";
    }

    bar.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-period]");
      if (!btn || !bar.contains(btn)) return;
      apply(btn.getAttribute("data-period"));
    });

    var active = bar.querySelector(".expense-filter-bar__item--active[data-period]");
    apply(active ? active.getAttribute("data-period") : "30");
  }

  function init() {
    mount();
    wireSidebarMobileScroll();
    wireFilterBars();
    wireDashboardPeriod();
    wireAiComposer();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
