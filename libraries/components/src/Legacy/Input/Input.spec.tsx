import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { vi } from 'vitest';
import { Input } from './Input';

describe('<Input /> component', () => {
   it('can render the input with a placeholder prop', () => {
      expect.assertions(1);
      const LABEL = 'Testing';
      render(<Input label={LABEL} />);
      const Regexp = new RegExp(LABEL, 'i');

      expect(screen.getByLabelText(Regexp)).toBeInTheDocument();
   });

   it('can render the input with a default value prop', () => {
      expect.assertions(1);
      // Arrange

      const VALUE = 'Testing';
      render(<Input defaultValue={VALUE} />);
      // Act

      // Assert
      expect(screen.getByDisplayValue(VALUE)).toBeInTheDocument();
   });

   it('calls the onchange when setting the text', async () => {
      expect.assertions(3);
      // Arrange

      const onChangeMock = vi.fn();
      const PLACEHOLDER = 'Testing';
      const VALUE = '10.2.12.1';
      render(
         <Input
            placeholder={PLACEHOLDER}
            onChange={(e) => onChangeMock(e.target.value)}
         />
      );

      const input = screen.getByPlaceholderText(PLACEHOLDER);
      expect(input).toBeInTheDocument();

      // Act
      await user.type(input, VALUE);

      // Assert
      expect(onChangeMock).toHaveBeenCalledWith(VALUE);
      expect(screen.getByDisplayValue(VALUE)).toBeInTheDocument();
   });

   it('should call the onChange when rendering a password input', async () => {
      expect.assertions(2);
      // Arrange
      const PLACEHOLDER = 'Testing';
      // const BUTTON_TEXT = 'Show';

      const onChangeMock = vi.fn();
      const VALUE = 'test';

      render(
         <Input
            placeholder={PLACEHOLDER}
            type="password"
            onChange={(e) => onChangeMock(e.target.value)}
         />
      );
      const input = screen.getByPlaceholderText(PLACEHOLDER);
      await user.type(input, VALUE);

      expect(onChangeMock).toHaveBeenCalledWith(VALUE);
      expect(screen.getByDisplayValue(VALUE)).toBeInTheDocument();
   });

   it('should allow me to show and hide the password', async () => {
      expect.assertions(6);
      // Arrange
      const PLACEHOLDER = 'Testing';
      const VALUE = 'test';
      const onChangeMock = vi.fn();

      render(
         <Input
            placeholder={PLACEHOLDER}
            type="password"
            onChange={(e) => onChangeMock(e.target.value)}
            value={VALUE}
         />
      );

      // Initial state check
      const input = screen.getByPlaceholderText(PLACEHOLDER);
      expect(input).toHaveAttribute('type', 'password');

      // Find icon button by aria-label
      const showButton = screen.getByLabelText('Show password');

      // Act - show password
      await user.click(showButton);

      // Assert - password visible
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveValue(VALUE); // Verify value persists after toggle
      const hideButton = screen.getByLabelText('Hide password');
      expect(hideButton).toBeInTheDocument();

      // Act - hide password
      await user.click(hideButton);

      // Assert - password hidden
      expect(input).toHaveAttribute('type', 'password');
      expect(screen.getByLabelText('Show password')).toBeInTheDocument();
   });
});
