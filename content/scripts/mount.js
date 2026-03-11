window.addEventListener('DOMContentLoaded', (event) => {
  new PagefindUI({
    element: "#search",
    showImages: true,
    excerptLength: 90,
    baseUrl: "/posts/"
  });
});