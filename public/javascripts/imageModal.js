document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("globalModal");
  const img = document.getElementById("imgmodImage");
  const btnPrev = document.getElementById("imgmodPrev");
  const btnNext = document.getElementById("imgmodNext");
  const btnClose = document.getElementById("imgmodClose");
  const counter = document.getElementById("imgmodCounter");

  let images = [];
  let index = 0;

  function openModal(list, startIndex) {
    images = list;
    index = startIndex;
    updateImage();
    modal.classList.remove("d-none");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.add("d-none");
    document.body.style.overflow = "auto";
  }

  function updateImage() {
    img.src = images[index];
    counter.textContent = `${index + 1} / ${images.length}`;
  }

  btnPrev.onclick = () => {
    index = (index - 1 + images.length) % images.length;
    updateImage();
  };

  btnNext.onclick = () => {
    index = (index + 1) % images.length;
    updateImage();
  };

  btnClose.onclick = closeModal;

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (modal.classList.contains("d-none")) return;

    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") btnPrev.click();
    if (e.key === "ArrowRight") btnNext.click();
  });

  // Attach click handlers to all gallery images
  document.querySelectorAll("img[data-gallery]").forEach((imgEl) => {
    imgEl.addEventListener("click", () => {
      const group = imgEl.dataset.gallery;
      const groupImages = [...document.querySelectorAll(`img[data-gallery="${group}"]`)]
        .map(i => i.dataset.full || i.src);

      const startIndex = groupImages.indexOf(imgEl.dataset.full || imgEl.src);
      openModal(groupImages, startIndex);
    });
  });
});
