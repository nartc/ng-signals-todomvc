import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Todo } from '../todos.signal';

@Component({
    selector: 'app-todo-item[todo]',
    standalone: true,
    template: `
        <li [class.completed]="todo.completed" [class.editing]="editing()">
            <div class="view">
                <input class="toggle" type="checkbox" [checked]="todo.completed" (click)="toggle.emit(todo.id)" />
                <label (dblclick)="editing.set(true)">
                    {{ todo.text }}
                </label>
                <button class="destroy" (click)="delete.emit(todo.id)"></button>
            </div>
            <input
                class="edit"
                type="text"
                #textInput
                [hidden]="editing()"
                [value]="todo.text"
                (keyup.enter)="updateText(todo.id, textInput.value)"
                (blur)="updateText(todo.id, textInput.value)"
            />
        </li>
    `,
})
export class TodoItem {
    @Input() todo!: Todo;
    @Output() toggle = new EventEmitter<number>();
    @Output() update = new EventEmitter<{ id: number; text: string }>();
    @Output() delete = new EventEmitter<number>();

    // 'local state is fine'
    editing = signal(false);

    updateText(todoId: number, text: string): void {
        if (text && text.trim() !== this.todo?.text) {
            this.update.emit({ id: todoId, text: text.trim() });
        }
        this.editing.set(false);
    }
}
