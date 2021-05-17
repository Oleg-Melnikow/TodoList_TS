import React from 'react';
import {action} from "@storybook/addon-actions";
import {Meta, Story} from "@storybook/react";
import {Task, TaskPropsType} from "../Task";
import {v1} from "uuid";
import {TaskStatuses} from "../api/todolist-api";

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
  task: {id: v1(), title: "JS", order: TaskStatuses.InProgress, addedDate: "",
    todoListId: "todolistId1", status: 1, startDate: "", priority: 1, deadline: "", description: "", entityStatus: "idle"}
}

export const TaskIsNotDoneExample = TaskExample.bind({});
TaskIsNotDoneExample.args = {
  ...baseArg,
  task: {id: v1(), title: "JS", order: TaskStatuses.InProgress, addedDate: "",
    todoListId: "todolistId1", status: 1, startDate: "", priority: 1, deadline: "", description: "", entityStatus: "idle"},
}
