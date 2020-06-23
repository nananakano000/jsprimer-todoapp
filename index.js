import { App } from './src/App.js';
import { TaskController } from './src/TaskController.js';

const formElement = document.querySelector('#js-form');
const formInputElement = document.querySelector('#js-form-input');
const todoCountElement = document.querySelector('#js-todo-count');
const todoListContainerElement = document.querySelector('#js-todo-list');

const app = new App({
    formElement,
    formInputElement,
    todoCountElement,
    todoListContainerElement,
});

const taskFormElement = document.querySelector('#js-task-form');
const taskFormInputElement = document.querySelector('#js-task-form-input');
const taskCountElement = document.querySelector('#js-task-count');
const taskListContainerElement = document.querySelector('#js-task-list');

const taskCtl = new TaskController({
    taskFormElement,
    taskFormInputElement,
    taskCountElement,
    taskListContainerElement,
});


window.addEventListener('load', () => {
    app.mount();
    taskCtl.mount();
});
window.addEventListener('unload', () => {
    app.unmount();
    taskCtl.unmount();
});
