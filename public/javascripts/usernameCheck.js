document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('username');
  const feedback = document.getElementById('usernameFeedback');

  if (!input || !feedback) return;

  let timeout;

  input.addEventListener('input', () => {
    clearTimeout(timeout);

    const username = input.value.trim();

    if (!username) {
      feedback.innerText = '';
      return;
    }

    feedback.innerText = 'Checking...';
    feedback.style.color = 'gray';

    timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/check-username?username=${username}`);
        const data = await res.json();

        if (data.available) {
          feedback.innerText = '✅ Username available';
          feedback.style.color = 'green';
        } else {
          feedback.innerText = '❌ Username taken';
          feedback.style.color = 'red';
        }
      } catch (err) {
        feedback.innerText = '';
      }
    }, 400);
  });
});