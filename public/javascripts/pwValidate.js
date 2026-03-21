document.addEventListener("DOMContentLoaded", () => {
  // Select elements
  const form = document.getElementById("registerForm");
  const pw = document.querySelector("input[name='password']");
  const cpw = document.querySelector("input[name='confirmPassword']");

  const rulesBox = document.getElementById("pw-rules");
  const pwError = document.getElementById("pw-error");
  const matchError = document.getElementById("pw-match-error");

  // password strenght checker
  // Strength meter elements result
  const strengthBox = document.getElementById("pw-strength");
  const strengthBar = document.querySelector(".pw-strength-bar");
  const strengthText = document.querySelector(".pw-strength-text");

  const ruleItems = {
    lower: /[a-z]/,
    upper: /[A-Z]/,
    number: /[0-9]/,
    special: /[^A-Za-z0-9]/,
    length: /.{6,}/,
  };

  if (!form || !pw || !cpw) return;

  if (form && pw && cpw) {
    pw.addEventListener('keydown', (e) => {
      if(e.key === " "){
        e.preventDefault(); 
      }
    })
    pw.addEventListener("input", () => {
      pw.value = pw.value.replace(/\s/g, "");
      const val = pw.value.trim();

      if (val.length === 0) {
        rulesBox.style.display = "none";
        strengthBox.style.display = "none";
        pwError.style.display = "none";
        matchError.style.display = "none";
        return;
      }

      rulesBox.style.display = "block";
      strengthBox.style.display = "block";

      // --- RULE CHECKING ---
      Object.entries(ruleItems).forEach(([key, regex]) => {
        const item = rulesBox.querySelector(`[data-rule='${key}']`);
        const icon = item.querySelector(".rule-icon");

        if (regex.test(val)) {
          item.style.color = "green";
          icon.textContent = "✅";
          icon.style.color = "green";
        } else {
          // item.style.color = "red";
          icon.textContent = "❌";
          icon.style.color = "red";
        }
      });

      // hide/show password error in REAL time
      let allGoodLive = true;
      Object.entries(ruleItems).forEach(([key, regex]) => {
        if (!regex.test(val)) allGoodLive = false;
      });
      pwError.style.display = allGoodLive ? "none" : "block";

      const result = zxcvbn(val);
      const score = result.score; // score = 0–4

      if (score === 0 || score === 1) {
        strengthBar.style.width = "40px";
        strengthBar.style.background = "red";
        strengthText.textContent = "Very Weak";
      } else if (score === 2) {
        strengthBar.style.width = "70px";
        strengthBar.style.background = "orange";
        strengthText.textContent = "Weak";
      } else if (score === 3) {
        strengthBar.style.width = "100px";
        strengthBar.style.background = "#facc15"; // yellow
        strengthText.textContent = "Medium";
      } else if (score === 4) {
        strengthBar.style.width = "130px";
        strengthBar.style.background = "green";
        strengthText.textContent = "Strong";
      }
    });
  }

  // Form submit validation
  form.addEventListener("submit", (e) => {
    const val = pw.value;
    let allGood = true;

    Object.entries(ruleItems).forEach(([key, regex]) => {
      if (!regex.test(val)) allGood = false;
    });

    if (!allGood) {
      e.preventDefault();
      pwError.style.display = "block";
      rulesBox.style.display = "block";
      return;
    } else {
      pwError.style.display = "none";
    }

    if (pw.value !== cpw.value) {
      e.preventDefault();
      matchError.style.display = "block";
    } else {
      matchError.style.display = "none";
    }
  });

  // REAL-TIME confirmPassword match checker
  if (pw && cpw && matchError) {
    const liveMatch = () => {
      // nothing typed yet → hide
      if (cpw.value.length === 0) {
        matchError.style.display = "none";
        return;
      }

      // match → hide
      if (pw.value === cpw.value) {
        matchError.style.display = "none";
      }
      // mismatch → show
      else {
        matchError.style.display = "block";
      }
    };

    pw.addEventListener("input", liveMatch);
    cpw.addEventListener("input", liveMatch);
  }
});
