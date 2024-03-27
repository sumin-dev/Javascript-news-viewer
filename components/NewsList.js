import { appendChildrenList, makeDOMWithProperties } from '../utils/dom.js';
import { state, subscribe } from '../state/index.js';

class NewsList {
  constructor($container) {
    this.$newsList = $container.querySelector('.news-list');
    this.$scrollObserver = $container.querySelector('.scroll-observer');
    this.page = 1;
    this.currentCategory = null;
    this.intersectionObserver = new IntersectionObserver(
      this.handleIntersection
    );
    this.render().then(() => {
      this.intersectionObserver.observe(this.$scrollObserver);
      subscribe(this);
    });
  }

  handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.page += 1;
        this.render();
      }
    });
  };

  render = async () => {
    const isChangedCategory = this.currentCategory !== state.category;

    if (isChangedCategory) {
      this.page = 1;
      this.currentCategory = state.category;
      this.$newsList.innerHTML = '';
    }

    const newsDataList = await fetchNews(state.category, this.page, 5);

    newsDataList.forEach((newsData) => {
      const newsItem = makeNewsItem(newsData);
      this.$newsList.appendChild(newsItem);
    });
  };
}

const fetchNews = async (category, page, pageSize = 5) => {
  try {
    category = category === 'all' ? '' : category;
    const apiKey = 'news APIKEY';
    const url = `https://newsapi.org/v2/top-headlines?country=kr&category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;
    // eslint-disable-next-line no-undef
    const response = await axios.get(url);
    const result = response.data.articles;

    return result;
  } catch (error) {
    const result = error.response.data;
    console.log(`News API ERROR: ${result.code} (${result.message})`);
    return [];
  }
};

const makeNewsItem = (newsData) => {
  const { title, description, url, urlToImage } = newsData;
  const defaultImageBase64 =
    'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';

  const newsItem = makeDOMWithProperties('section', {
    className: 'news-item',
  });

  const thumbnail = makeDOMWithProperties('div', {
    className: 'thumbnail',
  });

  const newsLink = makeDOMWithProperties('a', {
    href: url,
    target: '_blank',
    rel: 'noopener noreferrer',
  });

  const newsImg = makeDOMWithProperties('img', {
    src: urlToImage || defaultImageBase64,
    alt: 'thumbnail',
  });

  newsLink.appendChild(newsImg);

  thumbnail.appendChild(newsLink);

  const contents = makeDOMWithProperties('div', {
    className: 'contents',
  });

  const h2 = makeDOMWithProperties('h2');

  const newsLinkWithContents = newsLink.cloneNode(true);
  newsLinkWithContents.innerHTML = title;

  h2.appendChild(newsLinkWithContents);

  const p = makeDOMWithProperties('p', {
    innerHTML: description || '',
  });

  appendChildrenList(contents, [h2, p]);

  appendChildrenList(newsItem, [thumbnail, contents]);

  return newsItem;
};

export { NewsList };
