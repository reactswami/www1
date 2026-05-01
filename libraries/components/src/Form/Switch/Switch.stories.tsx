import { type Meta, type StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Switch } from './Switch';
import { useArgs } from 'storybook/internal/preview-api';
import { ChangeEvent, useState } from 'react';

const meta = {
   component: Switch,
   argTypes: {
      label: {
         control: 'text',
         description: 'Label for the switch.',
      },
      name: {
         control: 'text',
         description: 'Name attribute for the switch input.',
      },
      isChecked: {
         control: 'boolean',
         description: 'Controls the checked state of the switch.',
      },
      defaultChecked: {
         control: 'boolean',
         description: 'Initial checked state of the switch.',
      },
      isDisabled: {
         control: 'boolean',
         description: 'If true, disables the switch.',
      },
      onChange: {
         action: 'changed',
         description: 'Function called when the switch state changes.',
      },
   },
   args: {
      label: 'Field Label',
      name: 'toggle',
      isChecked: undefined,
      defaultChecked: false,
      isDisabled: false,
      onChange: fn(),
   },
   parameters: {
      docs: {
         description: {
            component: 'A simple switch component for enabling/disabling states.',
         },
      },
   },
} satisfies Meta<typeof Switch>;

export default meta;

export const Basic: StoryObj<typeof meta> = {
   args: {},
};

export const DefaultChecked: StoryObj<typeof meta> = {
   args: {
      defaultChecked: true,
   },
};

export const Disabled: StoryObj<typeof meta> = {
   args: {
      isDisabled: true,
   },
};
