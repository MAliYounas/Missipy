const invoiceData = JSON.parse(localStorage.getItem("current_invoice"));
const printButton = document.getElementById("print_button");
const backButton = document.getElementById("back_button");
const itemsBody = document.getElementById("print_invoice_items");

let hasReturned = false;

function formatMoney(value) {
  return Number(value || 0).toFixed(2);
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(value) {
  if (!value) {
    return new Date().toLocaleDateString();
  }

  return new Date(value).toLocaleDateString();
}

function clearInvoiceStorage() {
  localStorage.removeItem("all_products");
  localStorage.removeItem("customer_data");
  localStorage.removeItem("current_invoice");
}

function returnToInvoice() {
  if (hasReturned) {
    return;
  }

  hasReturned = true;
  clearInvoiceStorage();
  window.location.href = "invoice.html";
}

function renderInvoice() {
  if (!invoiceData || !Array.isArray(invoiceData.items) || invoiceData.items.length === 0) {
    itemsBody.innerHTML = `
      <tr>
        <td colspan="8">No invoice data found.</td>
      </tr>
    `;
    return;
  }

  const customer = invoiceData.customer || {};
  const totals = invoiceData.totals || {};

  document.getElementById("print_customer_name").textContent =
    customer.customer_name || "Walk-in customer";
  document.getElementById("print_customer_phone").textContent =
    customer.phone_no || "-";
  document.getElementById("print_invoice_number").textContent =
    invoiceData.invoice_number || "-";
  document.getElementById("print_invoice_date").textContent =
    formatDate(customer.invoice_date || invoiceData.created_at);
  document.getElementById("print_payment_method").textContent =
    invoiceData.payment_method || "Cash";

  itemsBody.innerHTML = invoiceData.items.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHTML(item.qr_code || "-")}</td>
      <td><strong>${escapeHTML(item.product_name || "-")}</strong></td>
      <td>${escapeHTML(item.quantity || "0")}</td>
      <td>${formatMoney(item.price)}</td>
      <td>${escapeHTML(item.gst || "0")}%</td>
      <td>${escapeHTML(item.discount || "0")}%</td>
      <td>${formatMoney(item.total)}</td>
    </tr>
  `).join("");

  document.getElementById("print_subtotal").textContent = formatMoney(totals.subtotal);
  document.getElementById("print_discount").textContent = formatMoney(totals.discount);
  document.getElementById("print_gst").textContent = formatMoney(totals.gst);
  document.getElementById("print_total").textContent = formatMoney(totals.total);
}

window.addEventListener("load", function () {
  renderInvoice();

  if (invoiceData && invoiceData.items && invoiceData.items.length > 0) {
    setTimeout(function () {
      
    }, 400);
  }
});

window.addEventListener("afterprint", returnToInvoice);

printButton.addEventListener("click", function () {
  window.print();
});

backButton.addEventListener("click", returnToInvoice);
