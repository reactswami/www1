import { type Counts } from '../types';

type FooterPaginationArgs = {
   getCounts: () => Counts;
   nextPage: () => void;
   previousPage: () => void;
};

/**
 *  Footer with pagination (current page, next page, previous page).
 */
export default class FooterPagination {
   element;
   private getCounts;
   private nextPage;
   private previousPage;
   private previousButton!: HTMLButtonElement;
   private nextButton!: HTMLButtonElement;
   private currentDisplay!: HTMLElement;
   private counterElement!: HTMLElement;

   constructor({ getCounts, nextPage, previousPage }: FooterPaginationArgs) {
      this.getCounts = getCounts;
      this.nextPage = nextPage;
      this.previousPage = previousPage;
      const element = this.createElements();
      this.element = element;
      this.render();
   }

   render() {
      this.updatePageController();
      this.updateFooterCounts();
   }

   private createElements() {
      const element = document.createElement('div');

      element.setAttribute('role', 'contentinfo');
      element.className = 'footer';

      const pageController = document.createElement('div');
      pageController.className = 'footer__pagination';

      const previous = document.createElement('button');
      previous.addEventListener('click', this.previousPage);
      previous.textContent = 'Previous';

      const current = document.createElement('p');

      const next = document.createElement('button');
      next.addEventListener('click', this.nextPage);
      next.textContent = 'Next';

      pageController.append(previous);
      pageController.append(current);
      pageController.append(next);

      element.appendChild(pageController);

      const counterElement = document.createElement('div');
      element.appendChild(counterElement);

      this.previousButton = previous;
      this.currentDisplay = current;
      this.nextButton = next;
      this.counterElement = counterElement;

      return element;
   }

   private updatePageController() {
      const { pages } = this.getCounts();
      const { currentPage, lastPage } = pages;

      this.previousButton.style.visibility = currentPage === 1 ? 'hidden' : '';
      this.nextButton.style.visibility =
         currentPage === lastPage ? 'hidden' : '';
      this.currentDisplay.textContent = `Page ${currentPage.toString()} out of ${
         this.getCounts().pages.lastPage
      }.`;
   }

   private updateFooterCounts() {
      const { selected, total, visible } = this.getCounts();
      const sentence = `${visible} of ${total} displayed, ${selected} selected`;
      this.counterElement.textContent = sentence;
   }
}
