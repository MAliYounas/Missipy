const form = document.querySelector(".purchase-form");

const addItemButton = document.querySelector(".add-item-button");

const purchaseTable = document.getElementById('purchase_tb');

const sidebarToggle = document.querySelector(".sidebar-toggle");
let lastSupplier = null;
let inventory = [];


const supplier_name = document.getElementById('supplier_name');
const purchase_date = document.getElementById('purchase_date');
const qr_code = document.getElementById('qr_code');
const product_name = document.getElementById('product_name');
const quantity = document.getElementById('quantity');
const unit_type = document.getElementById('unit_type');
const min_stock = document.getElementById('min_stock');
const buying_price = document.getElementById('buying_price');
const selling_price = document.getElementById('selling_price');
const gst = document.getElementById('gst');
const discount = document.getElementById('discount');

async function autoFillProduct() {

    console.log("autofill started", qr_code.value);

    if (!qr_code.value.trim()) return;

    const response = await fetch(
 `http://127.0.0.1:8000/automaticCompletion?qr_code=${qr_code.value}`
)

    const data = await response.json();

    console.log(data);

    if (data.found) {
        product_name.value = data.product_name;
        selling_price.value = data.selling_price ?? "";
        gst.value = data.gst ?? "";
        discount.value = data.discount ?? "";
        min_stock.value = data.min_stock ?? "";

    }
    else{
        product_name.value = "";
        selling_price.value = "";
        gst.value ="";
        discount.value = "";
        min_stock.value = "";

    }
}

qr_code.addEventListener('blur',autoFillProduct)





document.addEventListener("DOMContentLoaded", () => {

    const savedState = localStorage.getItem("sidebarCollapsed");

    if (savedState === "true") {
        sidebarToggle.checked = true;
    }

});


sidebarToggle.addEventListener("change", () => {

    localStorage.setItem(
        "sidebarCollapsed",
        sidebarToggle.checked
    );
    const qrCode = document.getElementById('qr_code');

    if (qrCode) {
        qrCode.focus();
    };

});





document.addEventListener("DOMContentLoaded", function () {

    const qrCode = document.getElementById('qr_code');

    if (qrCode) {
        qrCode.focus();
    }
    reload_table_on_reload();


});

function reload_table_on_reload() {
    const saved_inventory = localStorage.getItem('inventory');
    if (saved_inventory) {
        inventory = JSON.parse(saved_inventory);
        inventory.forEach(product => { purchase_item_table(product) });
    }
}




// Enter moves to next field
const inputs = Array.from(
    form.querySelectorAll("input")
);



inputs.forEach((input, index) => {


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


                    addItemButton.focus();


                }


            }


        }
    );


});





// Enter on Add Item button submits
addItemButton.addEventListener(
    "keydown",
    function (event) {


        if (event.key === "Enter") {

            event.preventDefault();

            form.requestSubmit();


        }


    }
);



form.addEventListener("submit", function (event) {

    event.preventDefault();

    add_item();

});

function emptyToNull(value) {
    return value === "" ? null : value;
}


function add_item() {


    let supplier_name_value = emptyToNull(supplier_name.value);

    let purchase_date_value =
        purchase_date.value === ""
            ? new Date().toISOString().split("T")[0]
            : purchase_date.value;

    let qr_code_value = emptyToNull(qr_code.value);
    let product_name_value = emptyToNull(product_name.value);
    let quantity_value = emptyToNull(quantity.value);
    let unit_type_value = emptyToNull(unit_type.value);
    let min_stock_value = emptyToNull(min_stock.value);
    let buying_price_value = emptyToNull(buying_price.value);
    let selling_price_value = emptyToNull(selling_price.value);
    let gst_value = emptyToNull(gst.value);
    let discount_value = emptyToNull(discount.value);


    if (inventory.find(item => item.qr_code === qr_code_value)) {
        alert('Same Qr Code / Barcode already exist in table you can click on row to update it.');
        const qrCode = document.getElementById('qr_code');

        if (qrCode) {
            qrCode.focus();
        }

        return;
    };

    if (quantity_value < 0) {
        alert("Quantity cannot be negative");
        quantity.focus();
        return;
    }


    else if (min_stock_value < 0) {
        alert("Minimum stock cannot be negative");
        min_stock.focus();
        return;
    }


    else if (buying_price_value < 0) {
        alert("Buying price cannot be negative");
        buying_price.focus();
        return;
    }


    else if (selling_price_value < 0) {
        alert("Selling price cannot be negative");
        selling_price.focus();
        return;
    }


    else if (gst_value < 0 || gst_value > 100) {
        alert("GST must be between 0 and 100");
        gst.focus();
        return;
    }


    else if (discount_value < 0 || discount_value > 100) {
        alert("Discount must be between 0 and 100");
        discount.focus();
        return;
    }



    const product_data = {

    id: crypto.randomUUID(),

    qr_code: qr_code_value,
    product_name: product_name_value,
    price: price_value,
    quantity: quantity_value,
    discount: discount_value,
    gst: gst_value

}

    purchase_item_table(productData);
    inventory.push(productData);
    console.log(productData);
    clear_inputs();

    localStorage.setItem('inventory', JSON.stringify(inventory));


}




function clear_inputs() {
    [
        supplier_name,
        purchase_date,
        qr_code,
        product_name,
        quantity,
        min_stock,
        buying_price,
        selling_price,
        gst,
        discount

    ].forEach(field => field.value = "");

    const qrCode = document.getElementById('qr_code');

    if (qrCode) {
        qrCode.focus();
    };
}

function purchase_item_table(productData) {


    const emptyRow = document.querySelector(".purchase-table__empty");

    if (emptyRow) {
        emptyRow.remove();
    }


    purchaseTable.innerHTML += `
<tr data-qr-code="${productData.qr_code}">
<td>${productData.qr_code ?? ""}</td>
<td>${productData.product_name ?? ""}</td>
<td>${productData.supplier_name ?? ""}</td>
<td>${productData.quantity ?? ""}</td>
<td>${productData.unit_type ?? ""}</td>
<td>${productData.min_stock ?? ""}</td>
<td>${productData.buying_price ?? ""}</td>
<td>${productData.selling_price ?? ""}</td>
<td>${productData.gst ?? ""}</td>
<td>${productData.discount ?? ""}</td>
<td>
    ${(Number(productData.quantity) * Number(productData.selling_price)) || 0}
</td>
</tr>
`





}




let selectedRow = null;

document.getElementById("purchase_tb")
    .addEventListener("click", function (event) {

        const row = event.target.closest("tr");

        if (!row) return;

        if (selectedRow) {
            selectedRow.classList.remove("purchase-table__selected");
        }

        selectedRow = row;

        row.classList.add("purchase-table__selected");

    });



document
    .getElementById("deleteItem")
    .addEventListener("click", function () {


        if (!selectedRow) {
            alert("Select an item first");
            return;
        }



        const qr = selectedRow.dataset.qrCode;


        inventory = inventory.filter(
            item => String(item.qr_code) !== String(qr)
        );


        // remove html row
        selectedRow.remove();



        selectedRow = null;



        console.log(inventory);

        localStorage.setItem('inventory', JSON.stringify(inventory));

        const saved_inventory = localStorage.getItem('inventory');
        if (inventory.length === 0) {

        clear_table();
    }




    });



document
    .getElementById("updateItem")
    .addEventListener("click", function () {


        if (!selectedRow) {
            alert("Select an item first");
            return;
        }



        const qr = selectedRow.dataset.qrCode;

        const product = inventory.find(item => item.qr_code === qr);
        inventory = inventory.filter(
            item => String(item.qr_code) !== String(qr)
        );


        // remove html row
        selectedRow.remove();



        selectedRow = null;

        supplier_name.value = product.supplier_name ?? "";
        purchase_date.value = product.purchase_date ?? "";
        qr_code.value = product.qr_code ?? "";
        product_name.value = product.product_name ?? "";
        quantity.value = product.quantity ?? "";
        unit_type.value = product.unit_type ?? "";
        min_stock.value = product.min_stock ?? "";
        buying_price.value = product.buying_price ?? "";
        selling_price.value = product.selling_price ?? "";
        gst.value = product.gst ?? "";
        discount.value = product.discount ?? "";



        localStorage.setItem('inventory', JSON.stringify(inventory));


        console.log(product);

        const qrCode = document.getElementById('qr_code');

        if (qrCode) {
            qrCode.focus();
        }

        const saved_inventory = localStorage.getItem('inventory');
        if (inventory.length === 0) {

        clear_table();
    }





    });



document
.getElementById('save_all_items')
.addEventListener('click', async function () {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/add_products",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    items: inventory
                })
            }
            
            
        );


        if (!response.ok) {
            throw new Error("Failed to save");
        }


        const data = await response.json();

        alert(data.message);

        // clear memory
        inventory = [];



        localStorage.removeItem("inventory");
        clear_table();


    }
    catch(error) {

        alert(`Error: ${error.message}`);

    }

});


function clear_table(){
    purchaseTable.innerHTML = `
<thead>
<tr>
    <th>Code</th>
    <th>Product</th>
    <th>Supplier</th>
    <th>Qty</th>
    <th>Unit</th>
    <th>Min Stock</th>
    <th>Buying Price</th>
    <th>Selling Price</th>
    <th>GST</th>
    <th>Discount</th>
    <th>Net Total</th>
</tr>
</thead>

<tbody>

<tr class="purchase-table__empty">
    <td colspan="12">
        <i class="fa-solid fa-box-open"></i>
        <span>No purchase items added yet.</span>
    </td>
</tr>

</tbody>
`;

}



