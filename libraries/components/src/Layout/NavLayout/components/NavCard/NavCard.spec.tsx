// ============================================================================
// NavCard.test.tsx - Tests for NavCard component
// ============================================================================

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NavCard } from './NavCard';
import { NavCardBuilder } from './NavCardBuilder';

// Mock the child components
vi.mock('./NavCardContainer', () => ({
   NavCardContainer: ({ children, className }: any) => (
      <div data-testid="nav-card-container" className={className}>
         {children}
      </div>
   ),
}));

vi.mock('./NavStatsus', () => ({
   NavStatus: ({ status, text }: any) => (
      <div data-testid="nav-status">
         {status}-{text}
      </div>
   ),
}));

vi.mock('./ActionButtonGroup', () => ({
   ActionButton: ({ buttonText }: any) => (
      <button data-testid="action-button">{buttonText}</button>
   ),
   ActionButtonGroup: ({ buttons }: any) => (
      <div data-testid="action-button-group">
         {buttons.map((btn: any, idx: number) => (
            <button key={idx}>{btn.buttonText}</button>
         ))}
      </div>
   ),
}));

vi.mock('@chakra-ui/react', () => ({
   Heading: ({ children, size }: any) => (
      <h1 data-testid="heading" data-size={size}>
         {children}
      </h1>
   ),
   Text: ({ children }: any) => <p data-testid="text">{children}</p>,
}));

vi.mock('@statseeker/components/Layout/Flex', () => ({
   Flex: ({ children, ...props }: any) => (
      <div data-testid="flex" {...props}>
         {children}
      </div>
   ),
}));

describe('NavCard', () => {
   describe('Basic Rendering', () => {
      it('renders simple card with text only', () => {
         const card = new NavCardBuilder().text('Test Card').build();

         render(<NavCard {...card} />);

         expect(screen.getByTestId('heading')).toHaveTextContent('Test Card');
         expect(screen.getByTestId('nav-card-container')).toBeInTheDocument();
      });

      it('renders card with text and description', () => {
         const card = new NavCardBuilder()
            .text('Test Card')
            .description('This is a test description')
            .build();

         render(<NavCard {...card} />);

         expect(screen.getByTestId('heading')).toHaveTextContent('Test Card');
         expect(screen.getByTestId('text')).toHaveTextContent(
            'This is a test description'
         );
      });

      it('renders card with icon', () => {
         const TestIcon = () => <svg data-testid="test-icon" />;
         const card = new NavCardBuilder()
            .text('Test Card')
            .icon(<TestIcon />)
            .build();

         render(<NavCard {...card} />);

         expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      });

      it('applies custom className', () => {
         const card = new NavCardBuilder()
            .text('Test Card')
            .className('custom-class')
            .build();

         render(<NavCard {...card} />);

         const container = screen.getByTestId('nav-card-container');
         expect(container).toHaveClass('nav-card');
         expect(container).toHaveClass('custom-class');
      });
   });

   describe('Visibility', () => {
      it('renders when visible is true', () => {
         const card = new NavCardBuilder()
            .text('Visible Card')
            .visible(true)
            .build();

         render(<NavCard {...card} />);

         expect(screen.getByTestId('heading')).toBeInTheDocument();
      });

      it('renders when visible is undefined (default true)', () => {
         const card = new NavCardBuilder().text('Default Visible').build();

         render(<NavCard {...card} />);

         expect(screen.getByTestId('heading')).toBeInTheDocument();
      });

      it('does not render when visible is false', () => {
         const card = new NavCardBuilder()
            .text('Hidden Card')
            .visible(false)
            .build();

         render(<NavCard {...card} />);

         expect(screen.queryByTestId('heading')).not.toBeInTheDocument();
      });
   });

   describe('Visibility', () => {
      it('renders when visible is true', () => {
         const card = new NavCardBuilder()
            .text('Visible Card')
            .visible(true)
            .build();

         render(<NavCard {...card} />);

         expect(screen.getByTestId('heading')).toBeInTheDocument();
      });

      it('renders when visible is undefined (default true)', () => {
         const card = new NavCardBuilder().text('Default Visible').build();

         render(<NavCard {...card} />);

         expect(screen.getByTestId('heading')).toBeInTheDocument();
      });

      it('does not render when visible is false', () => {
         const card = new NavCardBuilder()
            .text('Hidden Card')
            .visible(false)
            .build();

         render(<NavCard {...card} />);

         expect(screen.queryByTestId('heading')).not.toBeInTheDocument();
      });
   });

   describe('Status', () => {
      it('renders status when provided', () => {
         const card = new NavCardBuilder()
            .text('Test Card')
            .status('active', 'System Active')
            .build();

         render(<NavCard {...card} />);

         const status = screen.getByTestId('nav-status');
         expect(status).toHaveTextContent('active-System Active');
      });

      it('does not render status when not provided', () => {
         const card = new NavCardBuilder().text('Test Card').build();

         render(<NavCard {...card} />);

         expect(screen.queryByTestId('nav-status')).not.toBeInTheDocument();
      });

      it('renders disable status', () => {
         const card = new NavCardBuilder()
            .text('Test Card')
            .status('disable', 'System Offline')
            .build();

         render(<NavCard {...card} />);

         const status = screen.getByTestId('nav-status');
         expect(status).toHaveTextContent('disable-System Offline');
      });
   });

   describe('Header and Footer', () => {
      it('renders custom header', () => {
         const Header = () => <div data-testid="custom-header">Loading...</div>;
         const card = new NavCardBuilder()
            .text('Test Card')
            .header(<Header />)
            .build();

         render(<NavCard {...card} />);

         expect(screen.getByTestId('custom-header')).toBeInTheDocument();
      });

      it('renders custom footer', () => {
         const Footer = () => <div data-testid="custom-footer">Footer Text</div>;
         const card = new NavCardBuilder()
            .text('Test Card')
            .footer(<Footer />)
            .build();

         render(<NavCard {...card} />);

         expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
      });

      it('renders both header and footer', () => {
         const Header = () => <div data-testid="custom-header">Header</div>;
         const Footer = () => <div data-testid="custom-footer">Footer</div>;
         const card = new NavCardBuilder()
            .text('Test Card')
            .header(<Header />)
            .footer(<Footer />)
            .build();

         render(<NavCard {...card} />);

         expect(screen.getByTestId('custom-header')).toBeInTheDocument();
         expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
      });
   });

   describe('Action Buttons', () => {
      it('renders single action button', () => {
         const card = new NavCardBuilder()
            .text('Test Card')
            .cardAction(vi.fn())
            .addStandardButton('Click Me', vi.fn())
            .build();

         render(<NavCard {...card} />);

         const button = screen.getByTestId('action-button');
         expect(button).toHaveTextContent('Click Me');
      });

      it('renders multiple action buttons', () => {
         const card = new NavCardBuilder()
            .text('Test Card')
            .addStandardButton('Button 1', vi.fn())
            .addStandardButton('Button 2', vi.fn())
            .build();

         render(<NavCard {...card} />);

         const buttonGroup = screen.getByTestId('action-button-group');
         expect(buttonGroup).toBeInTheDocument();
         expect(buttonGroup).toHaveTextContent('Button 1');
         expect(buttonGroup).toHaveTextContent('Button 2');
      });

      it('renders link button', () => {
         const card = new NavCardBuilder()
            .text('Test Card')
            .cardAction(vi.fn())
            .addLinkButton('Go to Settings', '/settings')
            .build();

         render(<NavCard {...card} />);

         const button = screen.getByTestId('action-button');
         expect(button).toHaveTextContent('Go to Settings');
      });

      it('renders dropdown button', () => {
         const card = new NavCardBuilder()
            .text('Test Card')
            .cardAction(vi.fn())
            .addDropdownButton([
               { buttonText: 'Option 1', link: vi.fn(), disabled: false },
               { buttonText: 'Option 2', link: vi.fn(), disabled: false },
            ])
            .build();

         render(<NavCard {...card} />);

         expect(screen.getByTestId('action-button')).toBeInTheDocument();
      });
   });

   describe('Card Actions', () => {
      it('passes function cardAction to container', () => {
         const mockAction = vi.fn();
         const card = new NavCardBuilder()
            .text('Test Card')
            .cardAction(mockAction)
            .build();

         render(<NavCard {...card} />);

         expect(screen.getByTestId('nav-card-container')).toBeInTheDocument();
      });

      it('passes link cardAction to container', () => {
         const card = new NavCardBuilder()
            .text('Test Card')
            .cardAction('/settings')
            .build();

         render(<NavCard {...card} />);

         expect(screen.getByTestId('nav-card-container')).toBeInTheDocument();
      });

      it('renders card with cardAction and single button', () => {
         const card = new NavCardBuilder()
            .text('Test Card')
            .cardAction(() => { })
            .addStandardButton('Action', vi.fn())
            .build();

         render(<NavCard {...card} />);

         expect(screen.getByTestId('action-button')).toBeInTheDocument();
      });
   });

   describe('Error Cases', () => {
      it('throws error when card is not created through builder', () => {
         const invalidProps = {
            text: 'Invalid Card',
            description: 'This should throw',
         } as any;

         expect(() => {
            render(<NavCard {...invalidProps} />);
         }).toThrow('NavCard must be created through NavBuilder');
      });
   });

   describe('Complex Scenarios', () => {
      it('renders complete card with all features', () => {
         const TestIcon = () => <svg data-testid="test-icon" />;
         const Header = () => <div data-testid="custom-header">Loading</div>;
         const Footer = () => <div data-testid="custom-footer">Footer</div>;

         const card = new NavCardBuilder()
            .text('Complete Card')
            .description('Full featured card')
            .icon(<TestIcon />)
            .status('active', 'Running')
            .header(<Header />)
            .footer(<Footer />)
            .className('complete-card')
            .addStandardButton('Action 1', vi.fn())
            .addLinkButton('Action 2', '/link')
            .build();

         render(<NavCard {...card} />);

         expect(screen.getByTestId('heading')).toHaveTextContent('Complete Card');
         expect(screen.getByTestId('text')).toHaveTextContent(
            'Full featured card'
         );
         expect(screen.getByTestId('test-icon')).toBeInTheDocument();
         expect(screen.getByTestId('nav-status')).toBeInTheDocument();
         expect(screen.getByTestId('custom-header')).toBeInTheDocument();
         expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
         expect(screen.getByTestId('action-button-group')).toBeInTheDocument();
      });

      it('handles disabled state', () => {
         const card = new NavCardBuilder()
            .text('Disabled Card')
            .disable(true)
            .cardAction(() => { })
            .build();

         render(<NavCard {...card} />);

         expect(screen.getByTestId('nav-card-container')).toBeInTheDocument();
      });
   });

   describe('Type Guards', () => {
      it('correctly identifies card with action buttons array', () => {
         const card = new NavCardBuilder()
            .text('Test')
            .addStandardButton('Button 1', vi.fn())
            .addStandardButton('Button 2', vi.fn())
            .build();

         render(<NavCard {...card} />);

         expect(screen.getByTestId('action-button-group')).toBeInTheDocument();
      });

      it('correctly identifies card with single action button', () => {
         const card = new NavCardBuilder()
            .text('Test')
            .cardAction(vi.fn())
            .addStandardButton('Single Button', vi.fn())
            .build();

         render(<NavCard {...card} />);

         expect(screen.getByTestId('action-button')).toBeInTheDocument();
         expect(screen.queryByTestId('action-button-group')).not.toBeInTheDocument();
      });
   });

});