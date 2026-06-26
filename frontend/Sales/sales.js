const form = document.querySelector(".sales-search-form");

const searchButton = document.getElementById("search_button");

const clearButton = document.getElementById("clear_button");

const salesTable = document.querySelector(".customer-table");

const sidebarToggle = document.querySelector(".sidebar-toggle");

let sales = [];

const billNumber = document.getElementById("bill_number");
const customerName = document.getElementById("customer_name");
const paymentStatus = document.getElementById("payment_status");
const startDate = document.getElementById("start_date");
const startTime = document.getElementById("start_time");
const endDate = document.getElementById("end_date");
const endTime = document.getElementById("end_time");


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

    if (billNumber) {
        billNumber.focus();
    }

});


document.addEventListener("DOMContentLoaded", function () {

    if (billNumber) {
        billNumber.focus();
    }

});


// Enter moves to next field
const inputs = Array.from(
    form.querySelectorAll("input, select")
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


                    searchButton.focus();


                }


            }


        }
    );


});





// Enter on Search button submits
searchButton.addEventListener(
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

    searchSales();

});


clearButton.addEventListener("click", function () {

    clearSearchForm();

});


function clearSearchForm() {

    [
        billNumber,
        customerName,
        startDate,
        startTime,
        endDate,
        endTime
    ].forEach(field => field.value = "");

    paymentStatus.value = "All";

    if (billNumber) {
        billNumber.focus();
    }

}


function searchSales() {

    let billNumberValue = billNumber.value.trim();
    let customerNameValue = customerName.value.trim();
    let paymentStatusValue = paymentStatus.value;
    let startDateValue = startDate.value;
    let startTimeValue = startTime.value;
    let endDateValue = endDate.value;
    let endTimeValue = endTime.value;

    console.log({
        billNumber: billNumberValue,
        customerName: customerNameValue,
        paymentStatus: paymentStatusValue,
        startDate: startDateValue,
        startTime: startTimeValue,
        endDate: endDateValue,
        endTime: endTimeValue
    });

}
