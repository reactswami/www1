import { render, renderHook, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { vi } from 'vitest';
import { useDimensions } from './UseDimensions';

describe('<UseDimensions />', () => {
   it('should render successfully', () => {
      expect(() => renderHook(useDimensions)).not.toThrow();
   });

   it('should return the right dimensions', async () => {
      const HEIGHT = 200;
      const WIDTH = 100;
      const spy = vi.fn();

      HTMLDivElement.prototype.getBoundingClientRect = vi.fn(() => {
         // We have to mock this since it always returns 0 in vi-dom
         return {
            width: WIDTH,
            height: HEIGHT,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            x: 0,
            y: 0,
            toJSON: vi.fn(),
         };
      });

      const TestComponent = () => {
         const { dimensions, ref } = useDimensions<HTMLDivElement>();
         useEffect(() => {
            if (!dimensions) {
               return;
            }
            const { height, width } = dimensions;
            spy(height, width); // A bit of a hacky way to test that the height and width are correct
         }, [dimensions]);

         return <div ref={ref} />;
      };

      render(<TestComponent />);

      await waitFor(() => {
         expect(spy).toHaveBeenCalledWith(HEIGHT, WIDTH);
      });
   });
});
