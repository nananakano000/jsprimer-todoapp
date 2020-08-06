import { element } from './html-util.js';

export class TaskItemView {
    createElement(taskItem, { onUpdateTask: onUpdateTask, onDeleteTask: onDeleteTask, onAddTaskToTodo: onAddTaskToTodo }) {
        const taskItemElement = taskItem.completed
            ? element`<li><input type="checkbox" class="checkbox" checked>
                                    <s>${taskItem.title}</s>
                                    <button class="add-todo btn-outline-secondary"> [todoに追加] </button>
                                    <button class="delete btn-outline-danger">x</button>
                                </li>`
            : element`<li><input type="checkbox" class="checkbox">
                                    <span class="font-weight-bold">${taskItem.title}</span>
                                    <button class="add-todo btn-outline-secondary"> [todoに追加] </button>
                                    <button class="delete btn-outline-danger">x</button>
                                </li>`;
        const inputCheckboxElement = taskItemElement.querySelector('.checkbox');
        inputCheckboxElement.addEventListener('change', () => {
            // コールバック関数に変更
            onUpdateTask({
                id: taskItem.id,
                completed: !taskItem.completed,
            });
        });
        const deleteButtonElement = taskItemElement.querySelector('.delete');
        deleteButtonElement.addEventListener('click', () => {
            // コールバック関数に変更
            onDeleteTask({
                id: taskItem.id,
            });
        });
        const addTodoButtonElement = taskItemElement.querySelector('.add-todo');
        addTodoButtonElement.addEventListener('click', () => {
            // コールバック関数に変更
            onAddTaskToTodo({
                id: taskItem.id,
            });
        });
        // 作成したTodoアイテムのHTML要素を返す
        return taskItemElement;
    }
}
