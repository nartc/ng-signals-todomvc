import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-new-todo',
    standalone: true,
    template: `
        <input
            id="new-todo"
            class="new-todo"
            type="text"
            autofocus
            placeholder="What needs to be done?"
            #textInput
            (keyup.enter)="newTodo(textInput.value); textInput.value = ''"
        />
    `,
})
export class NewTodo {
    @Output() addTodo = new EventEmitter<string>();

    newTodo(text: string): void {
        if (text && text.trim()) {
            this.addTodo.emit(text.trim());
        }
    }
}
