import { createFileRoute } from '@tanstack/react-router';
import Menu from '~/features/menu/routes/MenuRoute';

export const Route = createFileRoute('/')({
   component: Menu,
});
