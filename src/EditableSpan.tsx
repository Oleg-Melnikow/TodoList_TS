import React, {ChangeEvent, useState} from "react";

type EditableSpanPropsType = {
    value: string,
}

export function EditableSpan(props: EditableSpanPropsType) {
    
    const [editMode, setEditMode] = useState(false)
    let [title, setTitle] = useState(props.value)
    
    function activeEditMode() {
        setEditMode(true)
        setTitle(props.value)
    }

    function activeViewMode() {
        setEditMode(false)
    }

    function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        setTitle(e.currentTarget.value)
    }
    
    return editMode ?
        <input value={title} autoFocus onBlur={activeViewMode} onChange={onChangeHandler}/> :
        <span onDoubleClick={activeEditMode}>{props.value}</span>
}