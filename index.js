import { TodoController } from './src/TodoController.js';
import { TaskController } from './src/TaskController.js';

const formElement = document.querySelector('#js-form');
const formInputElement = document.querySelector('#js-form-input');
const todoCountElement = document.querySelector('#js-todo-count');
const todoListContainerElement = document.querySelector('#js-todo-list');

let todoController = new TodoController({
    formElement,
    formInputElement,
    todoCountElement,
    todoListContainerElement,
});

const taskFormElement = document.querySelector('#js-task-form');
const taskFormInputElement = document.querySelector('#js-task-form-input');
const taskCountElement = document.querySelector('#js-task-count');
const taskListContainerElement = document.querySelector('#js-task-list');

let taskController = new TaskController({
    taskFormElement,
    taskFormInputElement,
    taskCountElement,
    taskListContainerElement,
});

window.addEventListener('load', () => {
    todoController.mount('');
    taskController.mount('');
});
window.addEventListener('unload', () => {
    todoController.unmount();
    taskController.unmount();
});

document.getElementById('login-btn').addEventListener('click', () => {
    // console.log(document.getElementById('login-inp').value);
    todoController = new TodoController({
        formElement,
        formInputElement,
        todoCountElement,
        todoListContainerElement,
    });
    taskController = new TaskController({
        taskFormElement,
        taskFormInputElement,
        taskCountElement,
        taskListContainerElement,
    });
    todoController.mount(document.getElementById('login-inp').value);
    taskController.mount(document.getElementById('login-inp').value);
});
