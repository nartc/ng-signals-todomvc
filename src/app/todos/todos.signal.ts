import { ChangeDetectorRef, computed, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { fromObservable } from '../rxjs-interop/from-observable';

export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
    id: number;
    text: string;
    creationDate: Date;
    completed: boolean;
}

@Injectable()
export class TodosSignal {
    private readonly route = inject(ActivatedRoute);
    private readonly cdr = inject(ChangeDetectorRef);

    private readonly todos = signal<Todo[]>([]);

    readonly filterParam = fromObservable(this.route.params.pipe(map((params) => params['filter'])), 'all');
    readonly filteredTodos = computed(() => {
        switch (this.filterParam()) {
            default:
            case 'all':
                return this.todos();
            case 'active':
                return this.todos().filter((todo) => !todo.completed);
            case 'completed':
                return this.todos().filter((todo) => todo.completed);
        }
    });

    readonly hasTodos = computed(() => this.todos().length > 0);
    readonly hasCompletedTodos = computed(() => this.todos().some((todo) => todo.completed));
    readonly incompleteTodosCount = computed(() => this.todos().filter((todo) => !todo.completed).length);

    async load() {
        const todos = await fetch('assets/todos.json').then((res) => res.json());
        this.todos.set(todos);
        this.cdr.markForCheck();
    }

    add(text: string) {
        this.todos.update((todos) => [
            ...todos,
            { id: Math.random(), text, creationDate: new Date(), completed: false },
        ]);
    }

    toggle(id: number) {
        this.todos.update((todos) =>
            todos.map((todo) => {
                if (todo.id === id) return { ...todo, completed: !todo.completed };
                return todo;
            })
        );
    }

    delete(id: number) {
        this.todos.update((todos) => todos.filter((todo) => todo.id !== id));
    }

    update(id: number, text: string) {
        this.todos.update((todos) =>
            todos.map((todo) => {
                if (todo.id === id) return { ...todo, text };
                return todo;
            })
        );
    }

    clearComplete() {
        this.todos.update((todos) => todos.filter((todo) => !todo.completed));
    }
}
