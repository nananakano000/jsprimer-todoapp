import { render } from './view/html-util.js';
import { TaskListView } from './view/TaskListView.js';
import { TaskItemModel } from './model/TaskItemModel.js';
import { TaskListModel } from './model/TaskListModel.js';

import firebase from '../plugins/firebase.js';

export class TaskController {
    // 紐づけするHTML要素を引数として受け取る
    constructor({
        taskFormElement,
        taskFormInputElement,
        taskListContainerElement,
        taskCountElement,
    }) {
        this.taskListView = new TaskListView();
        this.taskListModel = new TaskListModel([]);

        const db = firebase.firestore();
        db.collection('taskItems')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // console.log(doc.data());
                    const taskItemData = doc.data();
                    const taskItem = new TaskItemModel({
                        id: doc.id,
                        title: taskItemData.title,
                        completed: taskItemData.completed,
                    });
                    // console.log(taskItem);
                    this.taskListModel.addTask(taskItem);
                });
            });
        console.log(this.taskListModel);

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
        // this.taskListModel.addTask(new TaskItemModel({ title, completed: false }));
        const self = this;
        const db = firebase.firestore();
        console.log(db);
        const taskItem = {
            id: 0,
            title: title,
            completed: false,
        };
        db.collection('taskItems')
            .add(taskItem)
            .then(function (docRef) {
                console.log('Document written with ID: ', docRef.id);
                docRef
                    .get()
                    .then(function (doc) {
                        self.dbUpdateIdFor(doc);
                        self.taskListModel.addTask(
                            new TaskItemModel({
                                id: doc.id,
                                title: doc.data().title,
                                completed: false,
                            })
                        );
                    })
                    .catch(function (error) {
                        console.log('Error getting document:', error);
                    });
            })
            .catch(function (error) {
                console.error('Error adding document: ', error);
            });
    }

    dbUpdateIdFor(doc) {
        const db = firebase.firestore();
        db.collection('taskItems')
            .doc(doc.id)
            .update({
                id: doc.id,
            })
            .catch(function (error) {
                console.error('Error upda document: ', error);
            });
    }

    /**
     * Taskの状態を更新時に呼ばれるリスナー関数
     * @param {{ id:number, completed: boolean }}
     */
    handleUpdate({ id, completed }) {
        this.taskListModel.updateTask({ id, completed });
        this.dbUpdateCompletedFor(id, completed);
    }

    dbUpdateCompletedFor(id, completed) {
        const db = firebase.firestore();
        db.collection('taskItems')
            .doc(id)
            .update({
                completed: completed,
            })
            .then(function () {
                console.log('Document successfully update!');
            })
            .catch(function (error) {
                console.error('Error updating document: ', error);
            });
    }

    /**
     * Taskを削除時に呼ばれるリスナー関数
     * @param {{ id: number }}
     */
    handleDelete({ id }) {
        this.taskListModel.deleteTask({ id });
        this.dbDeletedFor(id);
    }

    dbDeletedFor(id) {
        // console.log(id)
        const db = firebase.firestore();
        db.collection('taskItems')
            .doc(id)
            .delete()
            .then(function () {
                console.log('Document successfully deleted!');
            })
            .catch(function (error) {
                console.error('Error removing document: ', error);
            });
    }

    handleAddTaskToTodo({ id }) {
        // const newarr = [0, 1, 3].filter(n=>n>0)
        // console.log(newarr)
        const addItems = this.taskListModel
            .getTaskItems()
            .filter((taskItem) => taskItem.id === id);
        // console.log(addItems[0].id)
        const db = firebase.firestore();
        console.log(db);
        const taskItem = {
            id: 0,
            title: addItems[0].title,
            completed: false,
        };
        db.collection('todoItems')
            .add(taskItem)
            .then(function (docRef) {
                console.log('Document written with ID: ', docRef.id);
                docRef
                    .get()
                    .then(function (doc) {
                        const db = firebase.firestore();
                        db.collection('todoItems')
                            .doc(doc.id)
                            .update({
                                id: doc.id,
                            })
                            .catch(function (error) {
                                console.error('Error upda document: ', error);
                            });
                    })
                    .catch(function (error) {
                        console.log('Error getting document:', error);
                    });
            })
            .catch(function (error) {
                console.error('Error adding document: ', error);
            });
    }

    /**
     * フォームを送信時に呼ばれるリスナー関数
     * @param {Event} event
     */
    handleSubmit(event) {
        event.preventDefault();
        const inputElement = this.taskFormInputElement;
        this.handleAdd(inputElement.value);
        inputElement.value = '';
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
            },
            onAddTaskToTodo: ({ id }) => {
                this.handleAddTaskToTodo({ id });
            },
        });
        render(taskListElement, taskListContainerElement);
        taskCountElement.textContent = `Task数: ${this.taskListModel.getTotalCount()}`;
    }

    /**
     * アプリとDOMの紐づけを登録する関数
     */
    mount() {
        this.taskListModel.onChange(this.handleChange);
        this.taskFormElement.addEventListener('submit', this.handleSubmit);
    }

    /**
     * アプリとDOMの紐づけを解除する関数
     */
    unmount() {
        this.taskListModel.offChange(this.handleChange);
        this.taskFormElement.removeEventListener('submit', this.handleSubmit);
    }
}
