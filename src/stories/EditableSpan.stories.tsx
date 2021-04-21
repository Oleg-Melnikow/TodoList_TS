import React from 'react';
//@ts-ignore
import {Meta, Story} from '@storybook/react';

//@ts-ignore
import {action} from "@storybook/addon-actions";
import { EditableSpan, EditableSpanPropsType } from '../EditableSpan';


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

const Template: Story<EditableSpanPropsType> = (args:EditableSpanPropsType) => <EditableSpan {...args} />;

export const EditableSpanExample = Template.bind({});
EditableSpanExample.args = {
  onChange: action('Value EditableSpan changed')
};

