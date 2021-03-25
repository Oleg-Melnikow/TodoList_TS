import {TaskStateType, TodoListType} from "../App";
import {AddTodoListAC, todoListReducer} from "./todoListReducer";
import {taskReducer} from "./taskReducer";

test("ids should be equals", () =>{
    const startTaskState: TaskStateType = {}
    const startTodoLIstState: Array<TodoListType> = [];

    const action = AddTodoListAC("new todo");

    const endTaskState = taskReducer(startTaskState, action);
    const endTodoLIstState = todoListReducer(startTodoLIstState, action);

    const keys = Object.keys(endTaskState)
    const idFromTask = keys[0];
    const idFromTodoList = endTodoLIstState[0].id;

    expect(idFromTask).toBe(action.id)
    expect(idFromTodoList).toBe(action.id)
})