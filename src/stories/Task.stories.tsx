import React from 'react';
//@ts-ignore
import {action} from "@storybook/addon-actions";
//@ts-ignore
import {Meta, Story} from "@storybook/react";
import {Task, TaskPropsType} from "../Task";

export default {
  title: 'TodoList/Task',
  component: Task,
  argTypes: {
    onClick: {
      description: "Button inside from clicked"
    }
  },
} as Meta;

const changeTaskStatusCallback = action("Status changed inside Task");
const changeTaskTitleCallback = action("Title changed inside Task");
const removeTaskCallback = action("Remove button inside Task clicked");

const baseArg = {
  changeTaskStatus: changeTaskStatusCallback,
  changeTaskTitle: changeTaskTitleCallback,
  removeTask: removeTaskCallback
}

const Template: Story<TaskPropsType> = (args: TaskPropsType) => <Task {...args} />;

export const TaskExample = Template.bind({});
TaskExample.args = {
  ...baseArg,
  task: {id: "1", isDone: true, title: "JS"},
}

export const TaskIsNotDoneExample = TaskExample.bind({});
TaskIsNotDoneExample.args = {
  ...baseArg,
  task: {id: "1", isDone: false, title: "JS"},
}