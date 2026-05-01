import { type Counts } from '../types';

interface FooterShowMoreArgs {
   getCounts: () => Counts;
   fetchData: () => void;
}

/**
 * Simple footer with a show more button that appends more data.
 */
export default class FooterShowMore {
   element;
   private showMoreElement;
   private counterElement;
   private getCounts;
   private fetchData;

   constructor({ getCounts, fetchData }: FooterShowMoreArgs) {
      this.getCounts = getCounts;
      const { element, showMoreElement, counterElement } =
         this.createElements();
      this.element = element;
      this.counterElement = counterElement;
      this.showMoreElement = showMoreElement;
      this.fetchData = fetchData;
      this.render();
   }

   render() {
      const { visible, total } = this.getCounts();
      this.updateFooterCounts();
      this.updateShowMoreButton(visible, total);
   }

   private updateShowMoreButton(visible: number, total: number) {
      const { showMoreElement } = this;
      const shouldShow = visible < total && visible > 0;

      showMoreElement.style.display = shouldShow ? 'block' : 'none';
      showMoreElement.addEventListener('click', this.fetchData);
      showMoreElement.setAttribute('tabindex', shouldShow ? '0' : '');
      showMoreElement.setAttribute('role', 'button');
   }

   private createElements() {
      const element = document.createElement('div');

      element.setAttribute('role', 'contentinfo');
      element.className = 'footer footer--row';

      const counterElement = document.createElement('span');
      element.appendChild(counterElement);

      const showMoreElement = document.createElement('button');
      showMoreElement.className = 'footer__button--show-more';
      showMoreElement.textContent = 'Show more';
      showMoreElement.addEventListener('click', this.fetchData);
      element.appendChild(showMoreElement);

      return { element, showMoreElement, counterElement };
   }

   private updateFooterCounts() {
      const { selected, total, visible } = this.getCounts();
      const sentence = `${visible} of ${total} displayed, ${selected} selected`;
      this.counterElement.textContent = sentence;
   }
}
