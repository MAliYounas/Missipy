const create_account_button = document.getElementById("create_account_button");

create_account_button.addEventListener("click", function () {
  const full_name = document.getElementById("full_name").value.trim();
  const email = document.getElementById("email").value.trim();
  const business = document.getElementById("business").value.trim();
  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const confirm_password = document.getElementById("confirm_password").value;
  const terms = document.getElementById("terms").checked;

  if (!full_name || !email || !business || !username || !password || !confirm_password) {
    alert("Please fill in all required fields.");
    return;
  }

  if (!terms) {
    alert("Please confirm you are authorized to manage this business.");
    return;
  }

  if (password !== confirm_password) {
    alert("Password doesn't match !");
    return;
  }

  const user_info = {
    full_name,
    email,
    business,
    role,
    username,
    phone,
    password,
    terms,
  };

  console.log(user_info);
});
