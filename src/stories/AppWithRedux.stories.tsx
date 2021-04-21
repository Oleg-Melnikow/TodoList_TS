import React from 'react';
//@ts-ignore
import {Meta, Story} from '@storybook/react';
//@ts-ignore
import {action} from "@storybook/addon-actions";
import {ReduxStoreProviderDecorator} from "./decorators/ReduxStoreProviderDecorator";
import {AppWithRedux} from "../AppWithRedux";


export default {
    title: 'TodoList/AppWithRedux',
    component: AppWithRedux,
    decorators: [ReduxStoreProviderDecorator]

} as Meta;

//@ts-ignore
const Template: Story = () => <AppWithRedux/>

export const AppWithReduxExample = Template.bind({});
AppWithReduxExample.args = {};

