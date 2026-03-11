document.addEventListener("DOMContentLoaded", (event) => {
  let localTheme = localStorage.getItem("theme");
  let currentThemeSetting = localTheme === null ? "light" : localTheme;

  document.querySelector("html").setAttribute("data-theme", localTheme);

  const button = document.querySelector("[data-theme-toggle]");

  button.addEventListener("click", () => {
    let newTheme = document.querySelector("html").getAttribute("data-theme") === "dark" ? "light" : "dark";

    // const newCta = newTheme === "dark" ? "Change to light theme" : "Change to dark theme";
    // button.innerText = newCta;
    // button.setAttribute("aria-label", newCta);
    document.querySelector("html").setAttribute("data-theme", newTheme);

    localStorage.setItem("theme", newTheme);
    currentThemeSetting = newTheme;
  });
});
