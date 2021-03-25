import {TaskStateType} from "../App";
import {addTaskAC, removeTaskAC, taskReducer, changeTaskStatusAC, changeTaskTitleAC} from "./taskReducer";
import {AddTodoListAC} from "./todoListReducer";

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

    const action = removeTaskAC("todoListID_2", "2");
    const endState = taskReducer(startState, action)

    expect(endState["todoListID_1"].length).toBe(3);
    expect(endState["todoListID_2"].length).toBe(2);
    expect(endState["todoListID_2"].every(t => t.id !== "2")).toBeTruthy();
});

test('correct task should be added from array', () => {

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

    const action = addTaskAC("todoListID_2", "juice");
    const endState = taskReducer(startState, action)

    expect(endState["todoListID_1"].length).toBe(3);
    expect(endState["todoListID_2"].length).toBe(4);
    expect(endState["todoListID_2"][0].id).toBeDefined();
    expect(endState["todoListID_2"][0].title).toBe("juice");
    expect(endState["todoListID_2"][0].isDone).toBe(false);
});

test('status of specified task should be changed', () => {

    const startState: TaskStateType = {
        "todoListID_1": [
            {id: "1", isDone: true, title: "HTML"},
            {id: "2", isDone: true, title: "JS"},
            {id: "3", isDone: false, title: "React"},
        ],
        "todoListID_2": [
            {id: "1", isDone: true, title: "bread"},
            {id: "2", isDone: true, title: "milk"},
            {id: "3", isDone: false, title: "butter"},
        ]
    }

    const action = changeTaskStatusAC("todoListID_2", "2", false);
    const endState = taskReducer(startState, action)

    expect(endState["todoListID_2"][1].isDone).toBeFalsy();
    expect(endState["todoListID_1"][1].isDone).toBeTruthy();
});

test('title of specified task should be changed', () => {

    const startState: TaskStateType = {
        "todoListID_1": [
            {id: "1", isDone: true, title: "HTML"},
            {id: "2", isDone: true, title: "JS"},
            {id: "3", isDone: false, title: "React"},
        ],
        "todoListID_2": [
            {id: "1", isDone: true, title: "bread"},
            {id: "2", isDone: true, title: "milk"},
            {id: "3", isDone: false, title: "butter"},
        ]
    }

    const action = changeTaskTitleAC("todoListID_2", "2", "MilkyWay");
    const endState = taskReducer(startState, action)

    expect(endState["todoListID_2"][1].title).toBe("MilkyWay");
    expect(endState["todoListID_1"][1].title).toBe("JS");
});

test('new property with new array should be added when new todoList is added', () => {

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

    const action = AddTodoListAC("newTodoList");
    const endState = taskReducer(startState, action);

    const keys = Object.keys(endState);
    const newKey = keys.find( k => k !== "todoListID_1" && k !== "todoListID_2");
    if(!newKey){
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState["todoListID_2"].length).toBe(2);
    expect(endState[newKey]).toEqual([]);
});