import { render } from "./view/html-util.js";
import { TaskListView } from "./view/TaskListView.js";
import { TaskItemModel } from "./model/TaskItemModel.js";
import { TaskListModel } from "./model/TaskListModel.js";

export class TaskController {
    // 紐づけするHTML要素を引数として受け取る
    constructor({ taskFormElement, taskFormInputElement, taskListContainerElement, taskCountElement }) {
        this.taskListView = new TaskListView();
        this.taskListModel = new TaskListModel([]);
        // bind to Element
        this.taskFormElement = taskFormElement;
        this.taskFormInputElement = taskFormInputElement;
        this.taskListContainerElement = taskListContainerElement;
        this.taskCountElement = taskCountElement;
        // ハンドラ呼び出しで、`this`が変わらないように固定する
        // `this`が常に`App`のインスタンスを示すようにする
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    /**
     * Taskを追加時に呼ばれるリスナー関数
     * @param {string} title
     */
    handleAdd(title) {
        this.taskListModel.addTask(new TaskItemModel({ title, completed: false }));
    };

    /**
     * Taskの状態を更新時に呼ばれるリスナー関数
     * @param {{ id:number, completed: boolean }}
     */
    handleUpdate({ id, completed }) {
        this.taskListModel.updateTask({ id, completed });
    };

    /**
     * Taskを削除時に呼ばれるリスナー関数
     * @param {{ id: number }}
     */
    handleDelete({ id }) {
        this.taskListModel.deleteTask({ id });
    };

    /**
     * フォームを送信時に呼ばれるリスナー関数
     * @param {Event} event
     */
    handleSubmit(event) {
        event.preventDefault();
        const inputElement = this.taskFormInputElement;
        this.handleAdd(inputElement.value);
        inputElement.value = "";
    }

    /**
     * TaskListViewが変更した時に呼ばれるリスナー関数
     */
    handleChange() {
        const taskCountElement = this.taskCountElement;
        const taskListContainerElement = this.taskListContainerElement;
        const taskItems = this.taskListModel.getTaskItems();
        const taskListElement = this.taskListView.createElement(taskItems, {
            // Appに定義したリスナー関数を呼び出す
            onUpdateTask: ({ id, completed }) => {
                this.handleUpdate({ id, completed });
            },
            onDeleteTask: ({ id }) => {
                this.handleDelete({ id });
            }
        });
        render(taskListElement, taskListContainerElement);
        taskCountElement.textContent = `Task数: ${this.taskListModel.getTotalCount()}`;
    }

    /**
     * アプリとDOMの紐づけを登録する関数
     */
    mount() {
        this.taskListModel.onChange(this.handleChange);
        this.taskFormElement.addEventListener("submit", this.handleSubmit);
    }

    /**
     * アプリとDOMの紐づけを解除する関数
     */
    unmount() {
        this.taskListModel.offChange(this.handleChange);
        this.taskFormElement.removeEventListener("submit", this.handleSubmit);
    }
}