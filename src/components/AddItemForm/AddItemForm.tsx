import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

export type AddItemFormPropsType = {
    addItem: (title: string) => void,
    disabled?: boolean
}

export const AddItemForm = React.memo(function (props: AddItemFormPropsType) {
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState("");

    const addItem = () => {
        const trimmedTitle = title.trim();
        if (trimmedTitle !== "") {
            props.addItem(trimmedTitle);
            setTitle("");
        } else {
            setError("Title is required");
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) setError(null)
        e.key === "Enter" && addItem()
    }

    return (
        <div>
            <TextField id="outlined-basic" label="Type value" variant="outlined" error={!!error} helperText={error}
                       value={title} onChange={onChangeHandler} onKeyPress={onKeyPressHandler}
                       disabled={props.disabled}/>
            <IconButton onClick={addItem} disabled={props.disabled}>
                <AddBox style={{color: "#0ab400"}}/>
            </IconButton>
        </div>
    )
})