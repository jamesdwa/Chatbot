// Stores all messages on the screen.
// Each is a record {party: string, text: string}
let messages = [
    {party: "Doctor",
     text: "How do you do. Please tell me your difficulties."}
  ];

// An banner message shown and a timer to remove it or undefined if not.
// The former, if present, should be a pair (boolean, string), with the latter
// part indicating if it is an error.
let bannerMsg = undefined;
let bannerTimer = undefined;


// Called when the user types in the answer box.
const HandleAnswer = (evt) => {
  if (evt.keyCode !== 13)
    return;
  if (!evt.target.value)
    return;

  const url = "/chat?message=" + encodeURIComponent(evt.target.value);
  fetch(url).then((val) => {
    if (val.status === 200) {
      return val.json();
    } else {
      ShowBanner(true, `Server Error: ${val.statusText}`);
    }
  }).then((val) => {
    AddMessage("Doctor", val.response);
  }).catch((res) => {
    ShowBanner(true, "could not connect to server");
  });

  AddMessage("Patient", evt.target.value);
  evt.target.value = "";
};

// Called when the user presses the Load button.
const HandleLoad = (evt) => {
  const elem = document.getElementById("name");
  const name = elem.value.trim();
  if (name === "") {
    ShowBanner(true, "you must enter a name for the transcript to load");
    return;
  }

  const url = "/load?name=" + encodeURIComponent(name);
  fetch(url).then((val) => {
    if (val.status === 200) {
      return val.json();
    } else {
      return val.text();
    }
  }).then((val) => {
    if (typeof val == 'string') {
      ShowBanner(true, `Server Error: ${val}`);
    } else {
      messages = val.value;
      ShowBanner(false, `successfully loaded transcript "${name}"`);
    }
  }).catch((res) => {
    ShowBanner(true, "could not connect to server");
  });
};

// Called when the user presses the Save button.
const HandleSave = (evt) => {
  const elem = document.getElementById("name");
  const name = elem.value.trim();
  if (name === "") {
    ShowBanner(true, "you must enter a name for the transcript to save");
    return;
  }

  const url = "/save";
  const body = {name: name, value: messages};
  fetch(url, {method: "POST", body: JSON.stringify(body),
              headers: {'Content-Type': 'application/json'}}).then((val) => {
    if (val.status === 200) {
      ShowBanner(false, `successfully saved transcript "${name}"`);
    } else {
      ShowBanner(true, `Server Error: ${val.statusText}`);
    }
  }).catch((res) => {
    ShowBanner(true, "could not connect to server");
  });
};


// Adds the given message to the transcript on the screen.
const AddMessage = (party, text) => {
  messages.push({party, text})
  UpdateUI();

  const input = document.getElementById("msg");
  input.scrollIntoView();
};

// Shows the given message (for a time).
const ShowBanner = (error, text) => {
  bannerMsg = [error, text];
  UpdateUI();

  bannerTimer = setTimeout(() => {
      if (bannerMsg[1] === text) {
        bannerMsg = undefined;
        UpdateUI();
      }
    }, 3000);
};

// Update the UI to show the current messages.
const UpdateUI = (party, text) => {
  const chat = document.getElementById("chat");
  chat.innerHTML = RenderMessages();

  const banner = document.getElementById("banner");
  banner.innerHTML = RenderBanner();
};

// Return HTML for showing all the messages.
const RenderMessages = () => {
  const divs = [];
  for (const msg of messages) {
    divs.push(
        `<div class="${msg.party.toLowerCase()}">` +
          `<span class="name">${msg.party}</span>` +
          `<span class="text">${msg.text}</span>` +
        "</div>");
  }
  return divs.join("\n");
};

// Return HTML to display a banner message.
const RenderBanner = () => {
  if (bannerMsg === undefined) {
    return "";
  } else if (bannerMsg[0]) {
    return (
        "<div class='error'>" +
          "<b>Error</b>:" +
          `<span class="text">${bannerMsg[1]}</span>` +
        "</div>");
  } else {
    return (
        "<div class='info'>" +
          `<span class="text">${bannerMsg[1]}</span>` +
        "</div>");
  }
};


// Show the initial transcript.
UpdateUI();
