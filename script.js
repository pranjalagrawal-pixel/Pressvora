console.log("JS loaded");

const apiKey = "827e3fe5f9ef4617978b44c25df32891"; // keep your key

let currentCategory = "general";

// load default
window.onload = () => getNews("general");

// 🔹 GET NEWS
async function getNews(category) {
  currentCategory = category;

  document.getElementById("loader").style.display = "block";

  try {
    const apiUrl = `https://newsapi.org/v2/everything?q=${category}+india&sortBy=publishedAt&language=en&apiKey=${apiKey}`;

    const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;

    const res = await fetch(url);
    const data = await res.json();

    displayNews(data.articles);
  } catch (error) {
    console.log("Error:", error);
  }

  document.getElementById("loader").style.display = "none";
}

// 🔹 DISPLAY NEWS
function displayNews(articles) {
  const container = document.getElementById("news-container");
  container.innerHTML = "";

  if (!articles || articles.length === 0) {
    container.innerHTML = "<h2>No news found 😢</h2>";
    return;
  }

  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${article.urlToImage || ''}">
      <h3>${article.title}</h3>
      <p>${article.description || ""}</p>
      <a href="${article.url}" target="_blank">Read more</a>
    `;

    container.appendChild(card);
  });
}

// 🔹 SEARCH
function searchNews() {
  const query = document.getElementById("search").value;

  if (!query) return;

  document.getElementById("loader").style.display = "block";

  const apiUrl = `https://newsapi.org/v2/everything?q=${query}+${currentCategory}&sortBy=publishedAt&language=en&apiKey=${apiKey}`;

  const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      displayNews(data.articles);
      document.getElementById("loader").style.display = "none";
    })
    .catch(err => console.log(err));
}

// 🌙 DARK MODE
function toggleDark() {
  document.body.classList.toggle("dark");
}
