import './index.css';

const h1 = document.getElementById("heading_1");
const h2 = document.getElementById("heading_2");
const h3 = document.getElementById("heading_3");
const colorPicker = document.getElementById("head-color");
const newMailBtn = document.getElementById("new-mail");
const popupSend = document.getElementById("popup-send-data");
const popupSendClose = document.getElementById("popup-send-close");
const popupSettings = document.getElementById("popup-settings-wrapper");
const popupSettingsBtn = document.getElementById("popup-settings-btn");
const closeSettingsBtn = document.getElementById("close-settings-btn");
const statsMailUsers = document.getElementById("stats-mail-users");

// inputs
const hostInput = document.getElementById("host");
const portInput = document.getElementById("port");
const secretInput = document.getElementById("secret-key");
const directoryInput = document.getElementById("directory-select");
const directoryPathElement = document.getElementById("directory-path");
const sendBtn = document.getElementById("send-btn");

// send elements
const textData = document.getElementById("text-data");
const toInput = document.getElementById("send-to");
const subjectInput = document.getElementById("send-subject");

const recentEmails = document.getElementById("recent-email");

const settingsSaveBtn = document.getElementById("settings-save");

// email view
const emailContentWrapper = document.getElementById("email-content");
const emailViewInfo = document.getElementById("email-view-info");
const emailViewCloseBtn = document.getElementById("email-view-close-btn");
const emailViewWrapper = document.getElementById("popup-emails-viewer-wrapper");

let appDirectory;

let settings;

let emailsSent = [];

document.addEventListener("DOMContentLoaded", async () => {
  // loads the path from memory if it exists
  loadPath();

  window.electronAPI.setAppDir(appDirectory);

  // load settings inputs
  const settingsD = await window.electronAPI.getSettings();
  if(!settingsD) return alert("There was an issue finding settings please make sure you update your settings! or select a app path");

  hostInput.value = settingsD.backend.host;
  portInput.value = settingsD.backend.port;
  secretInput.value = settingsD.backend.secret;
  directoryPathElement.textContent = settingsD.directoryPath;

  settings = {
    host: settingsD.backend.host,
    port: settingsD.backend.port,
    secret: settingsD.backend.secret
  }

  const emails = await window.electronAPI.getEmails();
  emailsSent = emails;
  updateEmails();

  try {
    const totalUsers = await window.electronAPI.getTotalUsers(settings);

    if(!totalUsers.status) return;

    statsMailUsers.textContent = totalUsers.total;
  } catch(e) {
    console.log(`Error: ${e}`)
  }
})

h1.addEventListener("click", () => {
  document.execCommand("fontSize", false, "3")
})

h2.addEventListener("click", () => {
  document.execCommand("fontSize", false, "5");
})

h3.addEventListener("click", () => {
    document.execCommand("fontSize", false, "7");
})

colorPicker.addEventListener("input", () => {
  document.execCommand("foreColor", false, colorPicker.value);
})

sendBtn.addEventListener("click", () => {
  console.log(textData.innerHTML);
})

newMailBtn.addEventListener("click", () => {
  closePopups();
  popupSend.style.display = "flex";
})

popupSendClose.addEventListener("click", () => {
  closePopups();
})

popupSettingsBtn.addEventListener("click", () => {
  closePopups();
  popupSettings.style.display = "flex"
})

closeSettingsBtn.addEventListener("click", () => {
  closePopups();
})

directoryInput.addEventListener("click", async () => {
    const folder = await window.electronAPI.selectFolder();
    if(!folder) return alert("Please select a folder and try again");

    appDirectory = folder;

    // save it to local storage
    savePath();

    window.electronAPI.setAppDir(appDirectory);
})

settingsSaveBtn.addEventListener("click", async () => {
  if(!appDirectory) return alert("Please select an app directory");

  window.electronAPI.setSettings({
    backend: {
      host: hostInput.value,
      port: portInput.value,
      secret: secretInput.value
    },
  })

  settings = {
    host: hostInput.value,
    port: portInput.value,
    secret: secretInput.value
  }
})

sendBtn.addEventListener("click", async () => {
  const response = await window.electronAPI.sendEmail({
    backend: {
      host: settings.host,
      port: settings.port,
      secret: settings.secret
    },
    email: {
      subject: subjectInput.value,
      to: toInput.value,
      html: textData.innerHTML
    }
  })

  if(!response.status) return alert(response.message);

  const date = new Date();

  window.electronAPI.addEmails({
    to: toInput.value,
    subject: subjectInput.value,
    placeholder: "Click to view",
    dateMade: `${date.getMonth()} ${date.getDay()} ${date.getUTCFullYear()}`,
    id: date.getTime(),
    html: textData.innerHTML
  })

  emailsSent.push({
    to: toInput.value,
    subject: subjectInput.value,
    placeholder: "Click to view",
    dateMade: `${date.getMonth()}/${date.getDay()}/${date.getUTCFullYear()}`,
    id: date.getTime(),
    html: textData.innerHTML
  })

  updateEmails();

  toInput.value = "";
  subjectInput.value = "";
  textData.innerHTML = "";


  alert(response.message);
})

function updateEmails() {
  recentEmails.innerHTML = ""

  emailsSent.forEach((email) => {
    const emailAddr = email.to;

    const startLetter = emailAddr.slice(0, 1);
    const ending = emailAddr.replace(/^[^@]*/, "");

    const formatAddr = `${startLetter}..${ending}`;

    const div = document.createElement("div");
    div.classList.add("recent");
    div.innerHTML += `
      <div class="top-wrapper">
                  <span>Sent to: ${formatAddr}</span>
                  <span>${email.dateMade}</span>
      </div>
                <p>
                  ${email.placeholder}
                </p>
    `

    div.addEventListener("click", () => {
        emailViewInfo.textContent = `To: ${formatAddr} | Subject ${email.subject}`
        emailContentWrapper.innerHTML = email.html;

        closePopups();
        emailViewWrapper.style.display = "flex";
    })

    recentEmails.appendChild(div);
  })
}

emailViewCloseBtn.addEventListener("click", () => {
  closePopups();
})

function closePopups() {
  popupSend.style.display = "none";
  popupSettings.style.display = "none";
  emailViewWrapper.style.display = "none";
}

// DATA LOADER - Loads from localstorage our directory path (this is the only thing that is local storage so that we can get the path to then load the data from our project directory)
function loadPath() {
  if(localStorage.getItem("dir-path")) {
    appDirectory = localStorage.getItem("dir-path");
  }
}

function savePath() {
  localStorage.setItem("dir-path", appDirectory);
}