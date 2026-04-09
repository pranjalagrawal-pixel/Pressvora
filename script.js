let currentCategory = "general";
console.log("JS loaded");

const apiKey = "827e3fe5f9ef4617978b44c25df32891";

// 🔥 Load default news on start
window.onload = () => {
  getNews("general");

  // Enter key search
  document.getElementById("search").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      searchNews();
    }
  });
};

// 🔹 Get category news
async function getNews(category) {
  currentCategory = category;   // ✅ save selected category

  document.getElementById("loader").style.display = "block";

  try {
    const url = `https://newsapi.org/v2/everything?q=${category}&sortBy=publishedAt&language=en&apiKey=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    console.log("Category:", currentCategory, data);

    displayNews(data.articles);
  } catch (error) {
    console.log("Error:", error);
  }

  document.getElementById("loader").style.display = "none";
}
// 🔹 Display news cards
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
      <p>${article.description || "No description available"}</p>
      <a href="${article.url}" target="_blank">Read more</a>
    `;

    container.appendChild(card);
  });
}

// 🔍 Search news
function searchNews() {
  const query = document.getElementById("search").value.trim();

  if (!query) {
    alert("Enter something to search!");
    return;
  }

  document.getElementById("loader").style.display = "block";

  // ✅ combine search + category PROPERLY
  const finalQuery = `${query} AND ${currentCategory}`;

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(finalQuery)}&sortBy=publishedAt&language=en&apiKey=${apiKey}`;

  console.log("Search:", finalQuery);

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      displayNews(data.articles);
      document.getElementById("loader").style.display = "none";
    })
    .catch(err => {
      console.log(err);
      document.getElementById("loader").style.display = "none";
    });
}
// 🌙 Dark mode
function toggleDark() {
  document.body.classList.toggle("dark");

  const btn = document.querySelector(".navbar button:last-child");

  if (document.body.classList.contains("dark")) {
    btn.innerText = "☀️";
  } else {
    btn.innerText = "🌙";
  }
}

// 🎯 Defense news
function searchNewsByTopic(topic) {
  document.getElementById("loader").style.display = "block";

  fetch(`https://newsapi.org/v2/everything?q=${topic}&apiKey=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      displayNews(data.articles);
      document.getElementById("loader").style.display = "none";
    })
    .catch(err => {
      console.log(err);
      document.getElementById("loader").style.display = "none";
    });
}
let startX = 0;

document.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", (e) => {
  let endX = e.changedTouches[0].clientX;

  if (startX - endX > 50) {
    nextCategory(); // swipe left
  }

  if (endX - startX > 50) {
    prevCategory(); // swipe right
  }
});

const categories = ["general", "technology", "sports", "business"];

function nextCategory() {
  let index = categories.indexOf(currentCategory);
  index = (index + 1) % categories.length;
  getNews(categories[index]);
}

function prevCategory() {
  let index = categories.indexOf(currentCategory);
  index = (index - 1 + categories.length) % categories.length;
  getNews(categories[index]);
}