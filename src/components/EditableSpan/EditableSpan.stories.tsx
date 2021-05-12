import React from 'react';
import {Meta, Story} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import { EditableSpan, EditableSpanPropsType } from './EditableSpan';

export default {
  title: 'TodoList/EditableSpan',
  component: EditableSpan,
  argTypes: {
    onChange: {
      description: 'Value EditableSpan changed',
    },
    title: {
      defaultValue: "HTML",
      description: 'Start value EditableSpan'
    }
  },
} as Meta;

const Template: Story<EditableSpanPropsType> = (args) => <EditableSpan {...args} />;

export const EditableSpanExample = Template.bind({});
EditableSpanExample.args = {
  changeTitle: action('Value EditableSpan changed')
};

