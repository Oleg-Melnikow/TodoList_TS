import React from 'react';
import { AddItemForm, AddItemFormPropsType } from '../AddItemForm';
import {action} from "@storybook/addon-actions";
import {Meta, Story} from "@storybook/react";

export default {
  title: 'TodoList/AddItemForm',
  component: AddItemForm,
  argTypes: {
    onClick: {
      description: "Button inside from clicked"
    }
  },
} as Meta;


const Template: Story<AddItemFormPropsType> = (args: AddItemFormPropsType) => <AddItemForm {...args} />;

export const AddItemFormExample = Template.bind({});
AddItemFormExample.args = {
  addItem: action("Button inside form clicked")
}