import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { FormDownloadUpdatedOaModal } from './FormDownloadUpdatedOaModal';
import { testWrapper } from '~/test/utils';

describe('<OaFormDownloadUpdatedOaModal />', () => {
   global.open = vi.fn();
   const defaultProps = {
      isOpen: true,
      onClose: vi.fn(),
      newOaId: '99',
      newOaName: 'test',
   };
   it('should render successfully', () => {
      expect(() =>
         render(<FormDownloadUpdatedOaModal {...defaultProps} />, testWrapper)
      ).not.toThrow();
   });

   it('should do nothing on close', async () => {
      const user = userEvent.setup();
      render(<FormDownloadUpdatedOaModal {...defaultProps} />, testWrapper);

      await user.click(screen.getAllByRole('button', { name: /close/i })[0]);
      expect(global.open).not.toHaveBeenCalled();
   });

   it('should redirect the user to the download action page on click', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
         <FormDownloadUpdatedOaModal {...{ ...defaultProps, onClose }} />,
         testWrapper
      );

      await user.click(screen.getByRole('button', { name: /download/i }));
      expect(global.open).toHaveBeenCalled();
   });
});
