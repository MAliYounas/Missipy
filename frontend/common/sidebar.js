(function () {
  var NAV = [
    { label: "Home", icon: "fa-house", href: "../Home Page/home_page.html" },
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
    { label: "AI Assistant", icon: "fa-robot", href: "../AI Assistant/ai_assistant.html" },
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
            '<a class="brand" href="' + resolveHref("../Home Page/home_page.html") + '" aria-label="Missipy home" data-label="Missipy">' +
              '<span class="brand__logo" aria-hidden="true"><i class="fa-solid fa-file-invoice-dollar"></i></span>' +
              '<span class="brand__content">' +
                '<span class="brand__name">Missipy</span>' +
                '<span class="brand__tagline">Business Suite</span>' +
              "</span>" +
            "</a>" +
            '<label class="sidebar-toggle-button" for="sidebar-toggle" aria-label="Toggle sidebar">' +
              '<i class="fa-solid fa-angles-left sidebar-toggle-button__close" aria-hidden="true"></i>' +
              '<i class="fa-solid fa-angles-right sidebar-toggle-button__open" aria-hidden="true"></i>' +
              '<i class="fa-solid fa-xmark sidebar-toggle-button__mobile-close" aria-hidden="true"></i>' +
            "</label>" +
          "</div>" +
          '<nav class="sidebar-nav" aria-label="Sidebar menu">' +
            '<ul class="sidebar-nav__list">' + items + "</ul>" +
          "</nav>" +
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

  function init() {
    mount();
    wireFilterBars();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
