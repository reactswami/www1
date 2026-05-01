import { Menu } from '@chakra-ui/react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode } from 'react';
import { vi } from 'vitest';
import { DeleteOaMenuItem } from './DeleteOaMenuItem';
import { db } from '~/test/server/db';
import { testWrapper } from '~/test/utils';

const ID = '999';
const defaultProps = {
    name: 'hello',
    title: 'my-title',
    id: ID,
};
const spy = vi.fn();
vi.mock('~/hooks/useDeleteOa', () => ({
    useDeleteOa: () => ({
        mutate: spy,
        isLoading: false,
    }),
}));

describe('<DeleteOaButton />', () => {
    const MenuWrapper = {
        wrapper: ({ children }: { children: ReactNode }) => (
            <Menu>{testWrapper.wrapper({ children })}</Menu>
        ),
    };

    beforeAll(() => {
        if (!db.device_oa.findFirst({ where: { id: { equals: ID } } })) {
            db.device_oa.create({ id: ID }); // Creating a device that has a known id if there are none (some tests will delete it)
        }
    });

    afterEach(() => {
        spy.mockClear();
    });

    it('should render successfully', () => {
        expect(() =>
            render(<DeleteOaMenuItem {...defaultProps} />, MenuWrapper)
        ).not.toThrow();
    });

    it('should open a modal to confirm the disabling', async () => {
        const user = userEvent.setup();
        render(<DeleteOaMenuItem {...defaultProps} />, MenuWrapper);

        await user.click(screen.getByRole('menuitem', { name: /delete/i }));
        await user.click(
            within(screen.getByRole('alertdialog')).getByRole('button', {
                name: /delete/i,
            })
        );

        expect(spy).toHaveBeenCalled();
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('should not call the delete action if the user hits cancel', async () => {
        const user = userEvent.setup();
        render(<DeleteOaMenuItem {...defaultProps} />, MenuWrapper);

        await user.click(screen.getByRole('menuitem', { name: /delete/i }));
        await user.click(
            within(screen.getByRole('alertdialog')).getByRole('button', {
                name: /cancel/i,
            })
        );

        expect(spy).not.toHaveBeenCalled();
        expect(screen.queryByRole('dialog')).toBeNull();
    });
});