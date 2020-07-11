import { TodoController } from './src/TodoController.js';
import { TaskController } from './src/TaskController.js';

const user = 'hayato';

const formElement = document.querySelector('#js-form');
const formInputElement = document.querySelector('#js-form-input');
const todoCountElement = document.querySelector('#js-todo-count');
const todoListContainerElement = document.querySelector('#js-todo-list');

const todoController = new TodoController({
    user,
    formElement,
    formInputElement,
    todoCountElement,
    todoListContainerElement,
});

const taskFormElement = document.querySelector('#js-task-form');
const taskFormInputElement = document.querySelector('#js-task-form-input');
const taskCountElement = document.querySelector('#js-task-count');
const taskListContainerElement = document.querySelector('#js-task-list');

const taskController = new TaskController({
    user,
    taskFormElement,
    taskFormInputElement,
    taskCountElement,
    taskListContainerElement,
});

window.addEventListener('load', () => {
    todoController.mount();
    taskController.mount();
});
window.addEventListener('unload', () => {
    todoController.unmount();
    taskController.unmount();
});
