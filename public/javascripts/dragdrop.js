document.addEventListener("DOMContentLoaded", () => {

  const dropAreas = document.querySelectorAll("[data-droparea]");

  dropAreas.forEach(dropArea => {

    const id = dropArea.getAttribute("data-droparea");
    const fileInput = document.querySelector(`[data-fileinput="${id}"]`);
    const previewBox = document.querySelector(`[data-preview="${id}"]`);

    if (!fileInput || !previewBox) return;

    // ⭐ MAX IMAGE LOGIC
    let MAX_IMAGES = 15;
    if (id === "reviewImages") MAX_IMAGES = 5;

    let masterFiles = [];

    // 🟣 Count existing (mostly for edit pages)
    let existingCount = Number(dropArea.getAttribute("data-existing")) || 0;

    // UPDATE INPUT FILES
    const updateInputFiles = () => {
      const dt = new DataTransfer();
      masterFiles.forEach(f => dt.items.add(f));
      fileInput.files = dt.files;

      dropArea.querySelector(".drop-text").innerText =
        `${masterFiles.length} new file(s)`;
    };

    // RENDER PREVIEWS
    const renderPreviews = () => {
      previewBox.innerHTML = "";
      masterFiles.forEach((file, i) => {
        const thumb = document.createElement("div");
        thumb.classList.add("mini-thumb");

        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);

        const del = document.createElement("div");
        del.className = "mini-remove-btn";
        del.innerText = "×";
        del.onclick = () => removeImage(i);

        thumb.appendChild(img);
        thumb.appendChild(del);
        previewBox.appendChild(thumb);
      });
    };

    // REMOVE IMAGE
    const removeImage = (index) => {
      masterFiles.splice(index, 1);
      updateInputFiles();
      renderPreviews();
    };

    // ADD FILES (LIMIT LOGIC)
    const addFiles = (files) => {
      const incoming = [...files];

      let newCount = masterFiles.length;
      const totalAfter = existingCount + newCount + incoming.length;

      // OVER LIMIT
      if (totalAfter > MAX_IMAGES) {
        alert(
          `Maximum ${MAX_IMAGES} images allowed.\n` +
          `Existing: ${existingCount}`
        );
        return;
      }

      // ADD THEM
      incoming.forEach(f => masterFiles.push(f));
      updateInputFiles();
      renderPreviews();
    };

    // CLICK → open picker
    dropArea.addEventListener("click", () => fileInput.click());

    // DRAGOVER
    dropArea.addEventListener("dragover", e => {
      e.preventDefault();
      dropArea.style.background = "#e9ecef";
    });

    dropArea.addEventListener("dragleave", () => {
      dropArea.style.background = "#f8f9fa";
    });

    // DROP
    dropArea.addEventListener("drop", e => {
      e.preventDefault();
      dropArea.style.background = "#f8f9fa";
      addFiles(e.dataTransfer.files);
    });

    // FILE PICKER
    fileInput.addEventListener("change", () => {
      addFiles(fileInput.files);
    });
  });
});
