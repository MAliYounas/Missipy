const sidebarToggle = document.querySelector(".sidebar-toggle");
const form = document.querySelector(".invoice-entry");
const add_product_to_invoice = document.querySelector(".invoice-add-button");
const purchaseTable = document.querySelector(".invoice-table");
const invoiceTableBody = document.querySelector(".invoice-table tbody");
const clear_btn = document.querySelector(".invoice-clear-button");
const delete_item_btn = document.querySelector(".invoice-delete-item-button");
const delete_all_btn = document.querySelector(".invoice-delete-all-button");
const item_count_badge = document.querySelector(".invoice-cart__badge");
const payment_select = document.querySelector(".payment-select select");
const generate_invoice_btn = document.querySelector(".generate-invoice-button");
const summary_values = document.querySelectorAll(".invoice-summary__row strong");


const customer_name = document.getElementById("customer_name");
const phone_no = document.getElementById("phone_no");
const invoice_date = document.getElementById("invoice_date");
const qr_code = document.getElementById("qr_code");
const product_name = document.getElementById("product_name");
const price = document.getElementById("price");
const quantity = document.getElementById("quantity");
const discount = document.getElementById("discount");
const gst = document.getElementById("gst");
const product_search_list = document.getElementById("product_search_list");

let all_products = [];
let customer_data = null;
let selected_product_id = null;
let search_timer = null;

const API_BASE_URL = "http://127.0.0.1:8000";

function hide_product_suggestions() {
    if (!product_search_list) {
        return;
    }

    product_search_list.innerHTML = "";
    product_search_list.classList.remove("product-search-list--open");
}

function fill_product_fields(product) {
    if (product.qr_code) {
        qr_code.value = product.qr_code;
    }

    if (product.product_name) {
        product_name.value = product.product_name;
    }

    if (product.selling_price !== null && product.selling_price !== undefined) {
        price.value = product.selling_price;
    }

    if (product.discount !== null && product.discount !== undefined) {
        discount.value = product.discount;
    }

    if (product.gst !== null && product.gst !== undefined) {
        gst.value = product.gst;
    }

    hide_product_suggestions();
    quantity.focus();
}

async function fill_product_from_inventory(code) {
    try {
        const response = await fetch(
            API_BASE_URL + "/inventory/" + encodeURIComponent(code)
        );

        if (!response.ok) {
            return;
        }

        const product = await response.json();
        fill_product_fields(product);

    } catch (error) {
        console.log(error);
    }
}

async function search_products(search_text) {
    try {
        const response = await fetch(
            API_BASE_URL + "/inventory/search?query=" + encodeURIComponent(search_text)
        );

        if (!response.ok) {
            hide_product_suggestions();
            return;
        }

        const data = await response.json();
        show_product_suggestions(data.results || []);

    } catch (error) {
        console.log(error);
        hide_product_suggestions();
    }
}

function show_product_suggestions(results) {
    if (!product_search_list) {
        return;
    }

    product_search_list.innerHTML = "";

    if (results.length === 0) {
        const empty_item = document.createElement("li");
        empty_item.className = "product-search-list__item product-search-list__item--empty";
        empty_item.textContent = "No matching products";
        product_search_list.appendChild(empty_item);
        product_search_list.classList.add("product-search-list--open");
        return;
    }

    for (let index = 0; index < results.length; index++) {
        const product = results[index];
        const item = document.createElement("li");

        item.className = "product-search-list__item";
        item.textContent = product.product_name + " (" + product.qr_code + ")";

        item.addEventListener("mousedown", function (event) {
            event.preventDefault();
            fill_product_fields(product);
        });

        product_search_list.appendChild(item);
    }

    product_search_list.classList.add("product-search-list--open");
}

if (qr_code) {
    qr_code.addEventListener("blur", function () {
        const code = checkInput(qr_code.value);

        if (!code) {
            return;
        }

        fill_product_from_inventory(code);
    });
}

if (product_name) {
    product_name.addEventListener("input", function () {
        const search_text = checkInput(product_name.value);

        if (!search_text) {
            hide_product_suggestions();
            return;
        }

        clearTimeout(search_timer);

        search_timer = setTimeout(function () {
            search_products(search_text);
        }, 300);
    });

    product_name.addEventListener("blur", function () {
        setTimeout(function () {
            hide_product_suggestions();
        }, 150);
    });
}

clear_btn.addEventListener("click", function () {
    qr_code.value = "";
    product_name.value = "";
    price.value = "";
    quantity.value = "";
    discount.value = "";
    gst.value = "";
    hide_product_suggestions();
});

document.addEventListener("DOMContentLoaded", function () {

    const savedState = localStorage.getItem("sidebarCollapsed");

    if (savedState === "true") {
        sidebarToggle.checked = true;
    }

    const products_added_before_refresh =
        JSON.parse(localStorage.getItem("all_products")) || [];

    if (products_added_before_refresh.length !== 0) {

        all_products = products_added_before_refresh;
        render_invoice_table();

    }
    const customer_added_before_refresh =
        JSON.parse(localStorage.getItem("customer_data"));

    if (customer_added_before_refresh) {

        customer_data = customer_added_before_refresh;

        customer_name.value = customer_data.customer_name || "";
        phone_no.value = customer_data.phone_no || "";
        invoice_date.value = customer_data.invoice_date || "";

    } else {

        invoice_date.value = new Date().toISOString().split("T")[0];

    }

    update_invoice_summary();




    if (qr_code) {
        qr_code.focus();
    }

});


sidebarToggle.addEventListener("change", function () {

    localStorage.setItem(
        "sidebarCollapsed",
        sidebarToggle.checked
    );


});


const inputs = Array.from(
    form.querySelectorAll("input")
);



for (let index = 0; index < inputs.length; index++) {
    const input = inputs[index];


    input.addEventListener(
        "keydown",
        function (event) {


            if (event.key === "Enter") {


                event.preventDefault();



                const nextInput =
                    inputs[index + 1];



                if (nextInput) {


                    nextInput.focus();


                }
                else {
                    add_product_to_invoice.focus();





                }


            }


        }
    );


}

function checkInput(value) {

    if (!value) return null;

    const cleaned = value.trim();

    return cleaned === "" ? null : cleaned;
}

function reset_form_after_product_is_added() {
    qr_code.value = '';
    product_name.value = '';
    price.value = '';
    quantity.value = '';
    discount.value = '';
    gst.value = '';
}

function toNumber(value) {
    return Number(value || 0);
}

function formatMoney(value) {
    return toNumber(value).toFixed(2);
}

function escapeHTML(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function createProductId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    return "product-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

function calculate_item_total(product_data) {
    const price = toNumber(product_data.price);
    const quantity = toNumber(product_data.quantity);
    const discount = toNumber(product_data.discount);
    const gst = toNumber(product_data.gst);

    const subtotal = price * quantity;

    // GST applied first
    const gstAmount = subtotal * (gst / 100);
    const afterGst = subtotal + gstAmount;

    // Discount applied on GST-inclusive amount
    const discountAmount = afterGst * (discount / 100);
    const total = afterGst - discountAmount;

    return {
        price,
        quantity,
        discount,
        gst,
        subtotal,
        gstAmount,
        discountAmount,
        total
    };
}

function get_invoice_totals() {
    const totals = {
        subtotal: 0,
        discount: 0,
        gst: 0,
        total: 0
    };

    for (let index = 0; index < all_products.length; index++) {
        const product = all_products[index];
        const itemTotals = calculate_item_total(product);

        totals.subtotal = totals.subtotal + itemTotals.subtotal;
        totals.discount = totals.discount + itemTotals.discountAmount;
        totals.gst = totals.gst + itemTotals.gstAmount;
        totals.total = totals.total + itemTotals.total;
    }

    return totals;
}

function update_invoice_summary() {
    const totals = get_invoice_totals();

    if (summary_values.length >= 4) {
        summary_values[0].textContent = formatMoney(totals.subtotal);
        summary_values[1].textContent = formatMoney(totals.discount);
        summary_values[2].textContent = formatMoney(totals.gst);
        summary_values[3].textContent = formatMoney(totals.total);
    }

    if (item_count_badge) {
        let itemText = all_products.length + " Items";

        if (all_products.length === 1) {
            itemText = "1 Item";
        }

        item_count_badge.textContent = itemText;
    }
}

function show_empty_invoice_table() {
    invoiceTableBody.insertAdjacentHTML(
        "beforeend",
        `
        <tr class="invoice-table__empty">
            <td colspan="7">
                <i class="fa-solid fa-barcode"></i>
                <span>No items added.</span>
            </td>
        </tr>
        `
    );
}

function render_invoice_table() {
    invoiceTableBody.innerHTML = "";

    if (all_products.length === 0) {
        show_empty_invoice_table();
        update_invoice_summary();
        return;
    }

    for (let index = 0; index < all_products.length; index++) {
        const product = all_products[index];
        invoice_item_table(product);
    }

    update_invoice_summary();
}

function save_invoice_items() {
    localStorage.setItem('all_products', JSON.stringify(all_products));
}

function select_invoice_row(row) {
    const rows = document.querySelectorAll(".invoice-table tbody tr");

    for (let index = 0; index < rows.length; index++) {
        rows[index].classList.remove("invoice-table__row--selected");
    }

    row.classList.add("invoice-table__row--selected");
    selected_product_id = row.dataset.productId;
}

function delete_invoice_item(productId) {
    const updated_products = [];

    for (let index = 0; index < all_products.length; index++) {
        const product = all_products[index];

        if (product.id !== productId) {
            updated_products.push(product);
        }
    }

    all_products = updated_products;

    if (selected_product_id === productId) {
        selected_product_id = null;
    }

    save_invoice_items();
    render_invoice_table();
}


function add_item() {

    const customer_name_value = checkInput(customer_name.value);
    const phone_no_value = checkInput(phone_no.value);
    const invoice_date_value = checkInput(invoice_date.value);
    const qr_code_value = checkInput(qr_code.value);
    const product_name_value = checkInput(product_name.value);
    const price_value = checkInput(price.value);
    const quantity_value = checkInput(quantity.value);
    const discount_value = checkInput(discount.value);
    const gst_value = checkInput(gst.value);




    if (price_value !== null && isNaN(price_value)) {
        alert("Price must be a valid number");
        price.focus();
        return;
    }

    if (quantity_value !== null && isNaN(quantity_value)) {
        alert("Quantity must be a valid number");
        quantity.focus();
        return;
    }

    if (discount_value !== null) {
        const discount_num = Number(discount_value);

        if (isNaN(discount_num) || discount_num < 0 || discount_num > 100) {
            alert("Discount must be between 0 and 100");
            discount.focus();
            return;
        }
    }


    if (gst_value !== null) {
        const gst_num = Number(gst_value);

        if (isNaN(gst_num) || gst_num < 0 || gst_num > 100) {
            alert("GST must be between 0 and 100");
            discount.focus();
            return;
        }
    }


    if (phone_no_value !== null && isNaN(phone_no_value)) {
        alert("Phone number must be valid");
        phone_no.focus();
        return;
    }


    if (price_value !== null && Number(price_value) <= 0) {
        alert("Price must be greater than 0");
        price.focus();
        return;
    }


    if (quantity_value !== null && Number(quantity_value) <= 0) {
        alert("Quantity must be greater than 0");
        quantity.focus();
        return;
    }

    customer_data = {
        customer_name: customer_name_value,
        phone_no: phone_no_value,
        invoice_date: invoice_date_value
    };

    const product_data = {
        id: createProductId(),
        qr_code: qr_code_value,
        product_name: product_name_value,
        price: price_value,
        quantity: quantity_value,
        discount: discount_value,
        gst: gst_value
    };

    all_products.push(product_data);
    localStorage.setItem("customer_data", JSON.stringify(customer_data));
    save_invoice_items();


    invoice_item_table(product_data);
    update_invoice_summary();

    reset_form_after_product_is_added();


    console.log(product_data);
    console.log(all_products);

    if (qr_code) {
        qr_code.focus();
    }



}

function invoice_item_table(product_data) {

    const emptyRow = document.querySelector(".invoice-table__empty");

    if (emptyRow) {
        emptyRow.remove();
    }

    const itemTotals = calculate_item_total(product_data);

    invoiceTableBody.insertAdjacentHTML(
        "beforeend",
        `
    <tr data-product-id="${product_data.id}">
        <td>${escapeHTML(product_data.qr_code || "-")}</td>
        <td>${escapeHTML(product_data.product_name || "-")}</td>
        <td>${itemTotals.quantity}</td>
        <td>${formatMoney(itemTotals.price)}</td>
        <td>${itemTotals.discount}%</td>
        <td>${itemTotals.gst}%</td>
        <td>${formatMoney(itemTotals.total)}</td>
    </tr>
    `
    );

}



form.addEventListener("submit", function (event) {
    event.preventDefault();
    add_item();

});


purchaseTable.addEventListener("click", function (event) {

    const row = event.target.closest("tbody tr");

    if (!row || row.classList.contains("invoice-table__empty")) {
        return;
    }

    const productId = row.dataset.productId;

    if (!productId) {
        return;
    }

    select_invoice_row(row);

});

if (delete_item_btn) {
    delete_item_btn.addEventListener("click", function () {
        if (!selected_product_id) {
            alert("Please select one row to delete.");
            return;
        }

        delete_invoice_item(selected_product_id);

        if (qr_code) {
            qr_code.focus();
        }
    });
}

if (delete_all_btn) {
    delete_all_btn.addEventListener("click", function () {
        if (all_products.length === 0) {
            return;
        }

        all_products = [];
        selected_product_id = null;
        save_invoice_items();
        render_invoice_table();

        if (qr_code) {
            qr_code.focus();
        }
    });
}

function build_invoice_data() {
    customer_data = {
        customer_name: checkInput(customer_name.value),
        phone_no: checkInput(phone_no.value),
        invoice_date: checkInput(invoice_date.value)
    };

    let payment_method = "Cash";

    if (payment_select) {
        payment_method = payment_select.value;
    }

    const invoice_items = [];

    for (let index = 0; index < all_products.length; index++) {
        const product = all_products[index];
        const itemTotals = calculate_item_total(product);

        const invoice_item = {
            id: product.id,
            qr_code: product.qr_code,
            product_name: product.product_name,
            price: itemTotals.price,
            quantity: itemTotals.quantity,
            discount: itemTotals.discount,
            gst: itemTotals.gst,
            subtotal: formatMoney(itemTotals.subtotal),
            gst_amount: formatMoney(itemTotals.gstAmount),
            discount_amount: formatMoney(itemTotals.discountAmount),
            total: formatMoney(itemTotals.total)
        };

        invoice_items.push(invoice_item);
    }

    const invoice_data = {
        invoice_number: "INV-" + Date.now(),
        created_at: new Date().toISOString(),
        customer: customer_data,
        payment_method: payment_method,
        items: invoice_items,
        totals: get_invoice_totals()
    };

    localStorage.setItem("customer_data", JSON.stringify(customer_data));
    localStorage.setItem("current_invoice", JSON.stringify(invoice_data));

    return invoice_data;
}

async function save_invoice(invoice_data) {
    try {
        const response = await fetch(
            API_BASE_URL + "/invoice",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(invoice_data)
            }
        );

        const result = await response.json();

        if (response.ok && result.success) {
            console.log(result);
            return true;
        }

        let error_message = "Failed To Save Invoice";

        if (result.error) {
            error_message = result.error;
        }

        if (result.detail) {
            error_message = JSON.stringify(result.detail);
        }

        alert(error_message);
        console.error(result);
        return false;

    } catch (error) {
        console.error(error);
        alert("Server Connection Error");
        return false;
    }
}

if (generate_invoice_btn) {
    generate_invoice_btn.addEventListener("click", async function () {
        if (all_products.length === 0) {
            alert("Please add at least one product before generating invoice.");
            qr_code.focus();
            return;
        }

        const invoice_data = build_invoice_data();
        const invoice_saved = await save_invoice(invoice_data);

        if (invoice_saved) {
            window.location.href = "print_invoice.html";
        }
    });
}