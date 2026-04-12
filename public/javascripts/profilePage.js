document.addEventListener("DOMContentLoaded", () => {

  // ===== IMAGE CROP LOGIC =====
  let cropper;
  const input = document.getElementById('profileInput');
  const cropImage = document.getElementById('cropImage');
  const preview = document.getElementById('profilePreview');

  if (input && cropImage && preview) {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      cropImage.onload = null;
      cropImage.src = url;

      const modal = new bootstrap.Modal(document.getElementById('cropModal'));
      modal.show();

      cropImage.onload = () => {
        if (cropper) cropper.destroy();

        cropper = new Cropper(cropImage, {
          aspectRatio: 1,
          viewMode: 1
        });
      };
    });

    document.getElementById('cropDone')?.addEventListener('click', () => {
      const canvas = cropper.getCroppedCanvas({
        width: 300,
        height: 300
      });

      preview.src = canvas.toDataURL();

      canvas.toBlob(blob => {
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        input.files = dataTransfer.files;
      });

      bootstrap.Modal.getInstance(document.getElementById('cropModal')).hide();
    });
  }


  // ===== FORM CHANGE DETECTION =====
  const form = document.querySelector('form');
  const usernameInput = document.getElementById('username');
  const fullNameInput = document.querySelector('input[name="fullName"]');
  const fileInput = document.getElementById('profileInput');
  const btn = document.getElementById('updateBtn');

  if (!form || !usernameInput || !fullNameInput || !fileInput || !btn) return;

  const originalUsername = usernameInput.defaultValue;
  const originalFullName = fullNameInput.defaultValue;

  function checkChanges() {
    const username = usernameInput.value.trim();
    const fullName = fullNameInput.value.trim();
    const fileChanged = fileInput.files.length > 0;

    btn.disabled = !(
      username !== originalUsername ||
      fullName !== originalFullName ||
      fileChanged
    );
  }

  form.addEventListener('submit', (e) => {
    const username = usernameInput.value.trim();
    const fullName = fullNameInput.value.trim();

    if (!username) {
      e.preventDefault();
      return;
    }

    if (username === originalUsername && fullName === originalFullName) {
      e.preventDefault();
    }
  });

  usernameInput.addEventListener('input', checkChanges);
  fullNameInput.addEventListener('input', checkChanges);
  fileInput.addEventListener('change', checkChanges);

});