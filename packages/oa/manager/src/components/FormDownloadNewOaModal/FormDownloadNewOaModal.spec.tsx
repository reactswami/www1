import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { FormDownloadNewOaModal } from './FormDownloadNewOaModal';
import { testWrapper } from '~/test/utils';

describe('<OaFormDownloadNewOaModal />', () => {
   global.open = vi.fn();
   const defaultProps = {
      isOpen: true,
      onClose: vi.fn(),
      newOaId: '99',
      newOaName: 'test',
   };
   it('should render successfully', () => {
      expect(() =>
         render(<FormDownloadNewOaModal {...defaultProps} />, testWrapper)
      ).not.toThrow();
   });

   it('should do nothing on close', async () => {
      const user = userEvent.setup();
      render(<FormDownloadNewOaModal {...defaultProps} />, testWrapper);

      await user.click(screen.getAllByRole('button', { name: /close/i })[0]);
      expect(global.open).not.toHaveBeenCalled();
   });

   it('should redirect the user to the download action page on click', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
         <FormDownloadNewOaModal {...{ ...defaultProps, onClose }} />,
         testWrapper
      );

      await user.click(screen.getByRole('button', { name: /download/i }));
      expect(global.open).toHaveBeenCalled();
   });
});
