/**
 * Return the name of the product. Typically this is 'Statseeker', but could be different, e.g. 'ScanBI'
 */
export function getProductName() {
   return document.querySelector('meta[name="product"]')?.getAttribute('content') || 'Product';
}