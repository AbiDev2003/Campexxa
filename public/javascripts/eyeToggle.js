document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("auth-toggle")) return;

  const eye = e.target;
  const input = eye.previousElementSibling; // password input before eye icon

  if (input.type === "password") {
    input.type = "text";
    eye.src = "/images/eye-off.png";
  } else {
    input.type = "password";
    eye.src = "/images/eye.png";
  }
});
