import {AddTodoListAC, todoListReducer, RemoveTodolistAC, TodoListDomainType} from "./todoListReducer";
import {taskReducer} from "./taskReducer";
import { TaskStateType } from "../AppWithRedux";
import {TaskStatuses} from "../api/todolist-api";
import {v1} from "uuid";

test("ids should be equals", () =>{
    const startTaskState: TaskStateType = {}
    const startTodoListState: Array<TodoListDomainType> = [];

    const action = AddTodoListAC({id: "1", addedDate: "", order: 1, title: "newToDo"});

    const endTaskState = taskReducer(startTaskState, action);
    const endTodoLIstState = todoListReducer(startTodoListState, action);

    const keys = Object.keys(endTaskState);
    const idFromTask = keys[0];
    const idFromTodoList = endTodoLIstState[0].id;

    expect(idFromTask).toBe(action.todoList.id);
    expect(idFromTodoList).toBe(action.todoList.id);
})

test("property with todoListId should be deleted", () =>{
    const startState: TaskStateType = {
        "todoListID_1": [
            {id: v1(), title: "HTML", status: TaskStatuses.New, order: 1, addedDate: "",
                todoListId: "todoListID_1", startDate: "", priority: 1, deadline: "", description: ""},
            {id: v1(), title: "JS", status: TaskStatuses.New, order: 1, addedDate: "",
                todoListId: "todoListID_1", startDate: "", priority: 1, deadline: "", description: ""},
        ],
        "todoListID_2": [
            {id: v1(), title: "CSS", status: TaskStatuses.New, order: 1, addedDate: "",
                todoListId: "todoListID_2", startDate: "", priority: 1, deadline: "", description: ""},
            {id: v1(), title: "Redux", status: TaskStatuses.New, order: 1, addedDate: "",
                todoListId: "todoListID_2", startDate: "", priority: 1, deadline: "", description: ""},
        ]
    }

    const action = RemoveTodolistAC("todoListID_1");
    const endState = taskReducer(startState, action);

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todoListID_1"]).toBeUndefined();
})