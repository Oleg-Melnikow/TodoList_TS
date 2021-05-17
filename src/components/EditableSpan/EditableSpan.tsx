import React, {ChangeEvent, useState} from "react";
import {TextField} from "@material-ui/core";

export type EditableSpanPropsType = {
    value: string,
    changeTitle: (newValue: string) => void,
    disabled?: boolean
}

export const EditableSpan = React.memo((props: EditableSpanPropsType) => {

    const [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(props.value);

    function activeEditMode() {
        setEditMode(true)
        setTitle(props.value)
    }

    function activeViewMode() {
        setEditMode(false)
        props.changeTitle(title)
    }

    function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        setTitle(e.currentTarget.value)
    }
    debugger

    return editMode && !props.disabled ?
        <TextField value={title} autoFocus onBlur={activeViewMode} onChange={onChangeHandler}/> :
        <span onDoubleClick={activeEditMode}>{props.value}</span>
})