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
let totalResults = 0;
let page = 1;
let pageSize = 10;
let groupSize = 5;

// Rendering

const getNews = async () => {
  try {
    url.searchParams.set("page", page); // &page=page
    url.searchParams.set("pageSize", pageSize);
    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error);
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

/**
 * convert the `newsList` array into an HTML Element versioned article array
 *
 * REF: Element https://developer.mozilla.org/en-US/docs/Web/API/Element
 * @param {Array} newsList the news list fetched from the API
 * @returns {Array<Element>} array of HTML Element
 */
const convertNewsListToArticlesEl = (newsList) => {
  // `articles` contains the HTML version of news
  let articles = [];
  for (let news of newsList) {
    // news image part in HTML
    let imageEl = document.createElement("img");
    imageEl.classList.add("news_img");
    // check on this urlToImage may be `null`
    // adopt a default image if the urlToImage is `null`
    imageEl.src == null
      ? (imageEl.src =
          "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg?")
      : (imageEl.src = news.urlToImage);

    let colLg4El = document.createElement("div");
    colLg4El.classList.add("col-lg-4");
    colLg4El.append(imageEl);

    // news text part in HTML
    let titleEl = document.createElement("h2");
    titleEl.textContent = news.title;
    let summaryEl = document.createElement("p");
    summaryEl.textContent = news.description;
    let sourceEl = document.createElement("div");
    sourceEl.textContent = `${news.source.name.toLowerCase()} ${moment(
      news.publishedAt
    ).fromNow()}`;
    let colLg8El = document.createElement("div");
    colLg8El.classList.add("col-lg-8");
    colLg8El.append(titleEl, summaryEl, sourceEl);

    // the whole article in HTML
    let articleEl = document.createElement("div");
    articleEl.classList.add("row", "article");
    articleEl.append(colLg4El, colLg8El);

    // push to the articles array
    articles.push(articleEl);
  }

  return articles;
};

const render = () => {
  let newsBoardEl = document.querySelector("#newsBoard");
  newsBoardEl.innerHTML = ""; // clear first

  let articles = convertNewsListToArticlesEl(newsList);
  for (let article of articles) {
    // article.outerHTML https://developer.mozilla.org/en-US/docs/Web/API/Element/outerHTML
    newsBoardEl.innerHTML += article.outerHTML;
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

const errorRender = (error) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
    ${error}</div>`;
  articleEl.textContent = errorHTML;
};

// pagination render
const paginationRender = () => {
  let totalPages = Math.ceil(totalResults / pageSize);
  let pageGroup = Math.ceil(page / groupSize);
  let lastPage = pageGroup * groupSize;
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }
  const firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : (lastPage = groupSize - 1);
  let paginationHTML = `<li class="page-item" onclick="moveToPage(${
    page - 1
  })"><a class="page-link" href="#">Previous</a></li>`;
  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "active" : ""
    }" onclick="moveToPage(${i})"><a class="page-link" href="#">${i}</a></li>
    `;
  }
  paginationHTML += `<li class="page-item" onclick="moveToPage(${
    page + 1
  })"><a class="page-link" href="#">Next</a></li>`;
  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  console.log("pageNum: ", pageNum);
  page = pageNum;
  getNews();
};
// Event Listeners
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);
