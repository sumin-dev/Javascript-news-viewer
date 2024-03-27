import { makeDOMWithProperties } from '../utils/dom.js';
import { state } from '../state/index.js';

class Nav {
  constructor($container) {
    this.$container = $container;

    this.CATEGORIES = {
      all: '전체보기',
      business: '비즈니스',
      entertainment: '엔터테인먼트',
      health: '건강',
      science: '과학',
      sports: '스포츠',
      technology: '기술',
    };

    this.render();
    this.bindEvents();
  }

  render = () => {
    const itemUl = makeDOMWithProperties('ul');

    Object.keys(this.CATEGORIES).forEach((key) => {
      const itemLi = makeDOMWithProperties('li', {
        id: key,
        className: 'category-item',
        innerHTML: this.CATEGORIES[key],
      });

      if (state.category === key) {
        itemLi.classList.add('active');
      }

      itemUl.appendChild(itemLi);
    });

    this.$container.appendChild(itemUl);
  };

  bindEvents = () => {
    this.$container.addEventListener('click', async ({ target }) => {
      if (!target.matches('.category-item:not(.active)')) return;

      this.$container.querySelector('.active').classList.remove('active');
      target.classList.add('active');

      state.category = target.id;
    });
  };
}

export { Nav };
