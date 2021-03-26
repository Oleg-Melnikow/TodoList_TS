import {TaskStateType, TodoListType} from "../App";
import {AddTodoListAC, todoListReducer, RemoveTodolistAC} from "./todoListReducer";
import {taskReducer} from "./taskReducer";

test("ids should be equals", () =>{
    const startTaskState: TaskStateType = {}
    const startTodoLIstState: Array<TodoListType> = [];

    const action = AddTodoListAC("new todo");

    const endTaskState = taskReducer(startTaskState, action);
    const endTodoLIstState = todoListReducer(startTodoLIstState, action);

    const keys = Object.keys(endTaskState);
    const idFromTask = keys[0];
    const idFromTodoList = endTodoLIstState[0].id;

    expect(idFromTask).toBe(action.id);
    expect(idFromTodoList).toBe(action.id);
})

test("property with todoListId should be deleted", () =>{
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

    const action = RemoveTodolistAC("todoListID_1");
    const endState = taskReducer(startState, action);

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todoListID_1"]).toBeUndefined();
})