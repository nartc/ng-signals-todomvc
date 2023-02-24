/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { ChangeDetectorRef, computed, inject, signal, Signal, ViewRef } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Get the current value of an `Observable` as a reactive `Signal`.
 *
 * `fromObservable` returns a `Signal` which provides synchronous reactive access to values produced
 * by the given `Observable`, by subscribing to that `Observable`. The returned `Signal` will always
 * have the most recent value emitted by the subscription, and will throw an error if the
 * `Observable` errors.
 *
 * If the `Observable` does not produce a value before the `Signal` is read, the `Signal` will throw
 * an error. To avoid this, use a synchronous `Observable` (potentially created with the `startWith`
 * operator) or pass an initial value to `fromObservable` as the second argument.
 */
export function fromObservable<T>(obs$: Observable<T>): Signal<T>;

/**
 * Get the current value of an `Observable` as a reactive `Signal`.
 *
 * `fromObservable` returns a `Signal` which provides synchronous reactive access to values produced
 * by the given `Observable`, by subscribing to that `Observable`. The returned `Signal` will always
 * have the most recent value emitted by the subscription, and will throw an error if the
 * `Observable` errors.
 *
 * Before the `Observable` emits its first value, the `Signal` will return the configured
 * `initialValue`. If the `Observable` is known to produce a value before the `Signal` will be read,
 * `initialValue` does not need to be passed.
 *
 * @developerPreview
 */
export function fromObservable<T, U>(source: Observable<T>, initialValue: U): Signal<T | U>;
export function fromObservable<T, U = never>(source: Observable<T>, initialValue?: U): Signal<T | U> {
    let initialState: State<T | U>;
    if (initialValue === undefined && arguments.length !== 2) {
        initialState = { kind: StateKind.NoValue };
    } else {
        initialState = { kind: StateKind.Value, value: initialValue! };
    }

    const state = signal<State<T | U>>(initialState);

    const subscription = source.subscribe({
        next: (value) => state.set({ kind: StateKind.Value, value }),
        error: (error) => state.set({ kind: StateKind.Error, error }),
    });

    const viewRef = inject(ChangeDetectorRef) as ViewRef;
    queueMicrotask(() => {
        viewRef.onDestroy(() => {
            subscription.unsubscribe();
        });
    });

    return computed(() => {
        const current = state();
        switch (current.kind) {
            case StateKind.NoValue:
                throw new Error(`fromObservable() signal read before the Observable emitted`);
            case StateKind.Value:
                return current.value;
            case StateKind.Error:
                throw current.error;
        }
    });
}
const enum StateKind {
    NoValue,
    Value,
    Error,
}

interface NoValueState {
    kind: StateKind.NoValue;
}

interface ValueState<T> {
    kind: StateKind.Value;
    value: T;
}

interface ErrorState {
    kind: StateKind.Error;
    error: unknown;
}

type State<T> = NoValueState | ValueState<T> | ErrorState;
