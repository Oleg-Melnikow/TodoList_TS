import {TaskStateType} from "../App";
import {addTaskAC, removeTaskAC, taskReducer, updateTaskAC, setTasksAC} from "./taskReducer";
import {AddTodoListAC, setTodoLists} from "./todoListReducer";
import {v1} from "uuid";
import {TaskStatuses} from "../api/todolist-api";

let startState: TaskStateType = {};

beforeEach(() => {
    startState = {
        "todoListID_1": [
            {id: "1", title: "HTML", status: TaskStatuses.New, order: 1, addedDate: "",
                todoListId: "todoListID_1", startDate: "", priority: 1, deadline: "", description: ""},
            {id: "2", title: "JS", status: TaskStatuses.New, order: 1, addedDate: "",
                todoListId: "todoListID_1", startDate: "", priority: 1, deadline: "", description: ""},
            {id: "3", title: "React", status: TaskStatuses.New, order: 1, addedDate: "",
                todoListId: "todoListID_1", startDate: "", priority: 1, deadline: "", description: ""},
        ],
        "todoListID_2": [
            {id: "1", title: "CSS", status: TaskStatuses.New, order: 1, addedDate: "",
                todoListId: "todoListID_2", startDate: "", priority: 1, deadline: "", description: ""},
            {id: "2", title: "Redux", status: TaskStatuses.New, order: 1, addedDate: "",
                todoListId: "todoListID_2", startDate: "", priority: 1, deadline: "", description: ""},
            {id: "3", title: "VirtualDOM", status: TaskStatuses.New, order: 1, addedDate: "",
                todoListId: "todoListID_2", startDate: "", priority: 1, deadline: "", description: ""}
        ]
    }
})

test('correct task should be deleted from array', () => {

    const action = removeTaskAC("todoListID_2", "2");
    const endState = taskReducer(startState, action)

    expect(endState["todoListID_1"].length).toBe(3);
    expect(endState["todoListID_2"].length).toBe(2);
    expect(endState["todoListID_2"].every(t => t.id !== "2")).toBeTruthy();
});

test('correct task should be added from array', () => {

    const action = addTaskAC({id: v1(), title: "VirtualDOM", status: TaskStatuses.New, order: 1, addedDate: "",
        todoListId: "todoListID_2", startDate: "", priority: 1, deadline: "", description: ""});
    const endState = taskReducer(startState, action)

    expect(endState["todoListID_1"].length).toBe(3);
    expect(endState["todoListID_2"].length).toBe(4);
    expect(endState["todoListID_2"][0].id).toBeDefined();
    expect(endState["todoListID_2"][0].title).toBe("VirtualDOM");
});

test('status of specified task should be changed', () => {

    const action = updateTaskAC("todoListID_2", "2", {status: TaskStatuses.Completed});
    const endState = taskReducer(startState, action)

    expect(endState["todoListID_2"][1].status).toBe(TaskStatuses.Completed);
    expect(endState["todoListID_1"][1].status).toBe(TaskStatuses.New);
});

test('title of specified task should be changed', () => {

    const action = updateTaskAC("todoListID_2", "2", {title: "MilkyWay"});
    const endState = taskReducer(startState, action)

    expect(endState["todoListID_2"][1].title).toBe("MilkyWay");
    expect(endState["todoListID_1"][1].title).toBe("JS");
});

test('new property with new array should be added when new todoList is added', () => {

    const action = AddTodoListAC(
        {id: "1", addedDate: "", order: 0, title: "NewDoTo"});
    const endState = taskReducer(startState, action);

    const keys = Object.keys(endState);
    const newKey = keys.find( k => k !== "todoListID_1" && k !== "todoListID_2");
    if(!newKey){
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState["todoListID_2"].length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test("empty array should be added when we set todoList", () =>{
    const action = setTodoLists([
        {id: "1", title: "title1", order: 0, addedDate: "" },
        {id: "2", title: "title2", order: 0, addedDate: "" }
    ])

    const endState = taskReducer({}, action);
    const keys = Object.keys(endState);
    expect(keys.length).toBe(2);
    expect(endState["1"]).toStrictEqual([]);
    expect(endState["2"]).toStrictEqual([]);
})

test("task should be added for todoList", () =>{
    const action = setTasksAC(startState["todoListID_1"], "todoListID_1")

    const endState = taskReducer({
        ["todoListID_1"]: [],
        ["todoListID_2"]: [],
    }, action);

    expect(endState["todoListID_1"].length).toBe(3);
    expect(endState["todoListID_2"].length).toBe(0);
})