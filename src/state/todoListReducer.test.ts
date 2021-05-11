import {v1} from 'uuid';
import {
    RemoveTodolistAC,
    todoListReducer,
    AddTodoListAC,
    changeTodoListTitleAC,
    changeTodoListFilterAC, TodoListDomainType, FilterValueType, setTodoLists
} from "./todoListReducer";

let todolistId1: string;
let todolistId2: string;
let startState: Array<TodoListDomainType> = [];

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {id: todolistId1, title: "What to learn", filter: "all", order: 0, addedDate: ""},
        {id: todolistId2, title: "What to buy", filter: "all", order: 0, addedDate: ""}
    ]
})

test('correct todolist should be removed', () => {
    const endState = todoListReducer(startState, RemoveTodolistAC(todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {

    let newTodolistTitle = "New Todolist";

    const endState = todoListReducer(startState, AddTodoListAC(
        {id: "1", addedDate: "", order: 0, title: newTodolistTitle}))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolistTitle);
});

test('correct todolist should change its name', () => {

    let newTodolistTitle = "New Todolist";

    const endState = todoListReducer(startState, changeTodoListTitleAC(todolistId2, newTodolistTitle));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValueType = "completed";

    const endState = todoListReducer(startState, changeTodoListFilterAC(todolistId2, newFilter));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

test('todolist should be set to state', () => {

    const endState = todoListReducer(startState, setTodoLists(startState));
    expect(endState.length).toBe(2);
});
