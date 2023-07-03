// const foo: chrome.audio.AudioDeviceInfo = 42;
// console.log(foo);

// chrome.tabs;

const exploreRepositoriesSideBar = document.querySelector(
  "div[aria-label='Explore repositories']",
);

if (exploreRepositoriesSideBar) {
  const button = document.createElement("button");
  const buttonText = document.createTextNode(":)");
  button.appendChild(buttonText);
  exploreRepositoriesSideBar.appendChild(button);
}
