document.addEventListener("DOMContentLoaded", () => {
  const pairs = [
    { input: "#description", counter: "#descCount", max: 500 },
    { input: "#reviewBody", counter: "#reviewBodyCount", max: 500 }
  ];

  pairs.forEach(({ input, counter, max }) => {
    const inputEl = document.querySelector(input);
    const counterEl = document.querySelector(counter);

    if (inputEl && counterEl) {
      inputEl.addEventListener("input", () => {
        counterEl.textContent = `${inputEl.value.length} / ${max}`;
      });
    }
  });
});
