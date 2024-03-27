import { createState } from './state/index.js';
import { appendChildrenList, makeDOMWithProperties } from './utils/dom.js';
import { Nav } from './components/Nav.js';
import { NewsList } from './components/NewsList.js';

const rootDOM = document.getElementById('root');

const categoryList = makeDOMWithProperties('nav', {
  className: 'category-list',
});

const newsListContainer = makeDOMWithProperties('div', {
  className: 'news-list-container',
});

const newsList = makeDOMWithProperties('article', {
  className: 'news-list',
});

const scrollObserver = makeDOMWithProperties('div', {
  className: 'scroll-observer',
});

const scrollObserverImg = makeDOMWithProperties('img', {
  src: 'img/ball-triangle.svg',
  alt: 'Loading...',
});

scrollObserver.appendChild(scrollObserverImg);

appendChildrenList(newsListContainer, [newsList, scrollObserver]);

appendChildrenList(rootDOM, [categoryList, newsListContainer]);

createState({ category: 'all' });

new Nav(categoryList);
new NewsList(newsListContainer);
