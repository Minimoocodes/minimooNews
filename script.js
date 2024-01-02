"use strict";

// Variables

const apiKey = `26b222ed7de043469415a6eaff114810`;
const searchInputEl = document.querySelector("#searchInput");
const menus = document.querySelectorAll(".menus button");

let newsList = [];
let articleEl = document.querySelector("#article");
let newsImgEl = document.querySelector("#newsImg");
let newsTitleEl = document.querySelector("#newsTitle");
let newsSummaryEl = document.querySelector("#newsSummary");
let newsSourceEl = document.querySelector("#newsSource");
let url = new URL(
  `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`
);

// Rendering

const getNews = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      render();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getNewsByKeyword = async () => {
  let searchKeyword = searchInputEl.value;
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&q=${searchKeyword}&apiKey=${apiKey}`
  );
  getNews();
};

async function getLatestNews() {
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`
  );
  getNews();
}

const render = () => {
  for (let i = 0; i < newsList.length; i++) {
    (newsImgEl.src = newsList[i].urlToImage),
      (newsTitleEl.textContent = newsList[i].title),
      (newsSummaryEl.textContent = newsList[i].description),
      (newsSourceEl.textContent = `${newsList[
        i
      ].source.name.toLowerCase()} ${moment(newsList.publishedAt).fromNow()}`);
  }
};

getLatestNews();

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  console.log("category:", category);
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`
  );
  getNews();
};

const errorRender = () => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
    ${error.message}</div>`;

  articleEl.textContent = errorHTML;
};

// pagination render
const paginationRender = () => {};

// Event Listeners
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);
