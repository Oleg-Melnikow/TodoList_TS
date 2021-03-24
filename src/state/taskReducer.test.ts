import {TaskStateType} from "../App";
import {removeTaskAC, taskReducer} from "./taskReducer";

test('correct task should be deleted from array', () => {

    const startState: TaskStateType = {
        "todoListID_1": [
            {id: "1", isDone: true, title: "HTML"},
            {id: "2", isDone: true, title: "JS"},
            {id: "3", isDone: false, title: "React"},
        ],
        "todoListID_2": [
            {id: "1", isDone: true, title: "bread"},
            {id: "2", isDone: false, title: "milk"},
            {id: "3", isDone: false, title: "butter"},
        ]
    }

    const action = removeTaskAC("2", "todoListID_2");
    const endState = taskReducer(startState, action)

    expect(endState["todoListID_1"].length).toBe(3);
    expect(endState["todoListID_2"].length).toBe(2);
    expect(endState["todoListID_2"].every(t => t.id !== "2")).toBeTruthy();
});