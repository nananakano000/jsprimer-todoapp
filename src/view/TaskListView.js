import { element } from "./html-util.js";
import { TaskItemView } from "./TaskItemView.js";

export class TaskListView {
    createElement(taskItems, { onUpdateTask, onDeleteTask }) {
        const taskListElement = element`<ul />`;
        // 各TodoItemモデルに対応したHTML要素を作成し、リスト要素へ追加する
        taskItems.forEach(taskItem => {
            const taskItemView = new TaskItemView();
            const taskItemElement = taskItemView.createElement(taskItem, {
                onDeleteTask,
                onUpdateTask
            });
            taskListElement.appendChild(taskItemElement);
        });
        return taskListElement;
    }
}