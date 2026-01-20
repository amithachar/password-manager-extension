const appNameInput = document.getElementById("appName");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const saveBtn = document.getElementById("saveBtn");
const listDiv = document.getElementById("list");

function loadPasswords() {
  chrome.storage.local.get(["passwords"], (result) => {
    const passwords = result.passwords || [];
    listDiv.innerHTML = "";

    passwords.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "entry";

      div.innerHTML = `
        <strong>${item.app}</strong>
        <span>${item.username}</span>
        <span class="pwd" data-visible="false">••••••</span>

        <div class="entry-buttons">
          <button class="small-btn show-btn">Show</button>
          <button class="small-btn delete-btn">Delete</button>
        </div>
      `;

      // Show / Hide password
      div.querySelector(".show-btn").addEventListener("click", (e) => {
        const pwdSpan = div.querySelector(".pwd");
        const visible = pwdSpan.getAttribute("data-visible") === "true";

        pwdSpan.textContent = visible ? "••••••" : item.password;
        pwdSpan.setAttribute("data-visible", !visible);
        e.target.textContent = visible ? "Show" : "Hide";
      });

      // Delete entry
      div.querySelector(".delete-btn").addEventListener("click", () => {
        passwords.splice(index, 1);
        chrome.storage.local.set({ passwords }, loadPasswords);
      });

      listDiv.appendChild(div);
    });
  });
}

saveBtn.addEventListener("click", () => {
  const app = appNameInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!app || !username || !password) return;

  chrome.storage.local.get(["passwords"], (result) => {
    const passwords = result.passwords || [];
    passwords.push({ app, username, password });

    chrome.storage.local.set({ passwords }, () => {
      appNameInput.value = "";
      usernameInput.value = "";
      passwordInput.value = "";
      loadPasswords();
    });
  });
});

loadPasswords();
