import { EventEmitter } from "../EventEmitter.js";

export class TaskListModel extends EventEmitter {
    constructor(tasks = []) {
        super();
        this.tasks = tasks;
    }

    getTotalCount() {
        return this.tasks.length;
    }

    getTaskItems() {
        return this.tasks;
    }

    onChange(listener) {
        this.addEventListener("change", listener);
    }

    offChange(listener) {
        this.removeEventListener("change", listener);
    }

    /**
     * 状態が変更されたときに呼ぶ。登録済みのリスナー関数を呼び出す
     */
    emitChange() {
        this.emit("change");
    }

    addTask(taskItem) {
        // タイトルが空のものは追加しない
        if (taskItem.isEmptyTitle()) {
            return;
        }
        this.tasks.push(taskItem);
        this.emitChange();
    }

    /**
     * 指定したidのTodoItemのcompletedを更新する
     * @param {{ id:number, completed: boolean }}
     */
    updateTask({ id, completed }) {
        const taskItem = this.tasks.find(task => task.id === id);
        if (!taskItem) {
            return;
        }
        taskItem.completed = completed;
        this.emitChange();
    }

    /**
     * 指定したidのTodoItemを削除する
     * @param {{ id: number }}
     */
    deleteTask({ id }) {
        // `id`に一致しないTodoItemだけを残すことで、`id`に一致するTodoItemを削除する
        this.tasks = this.tasks.filter(task => {
            return task.id !== id;
        });
        this.emitChange();
    }
}