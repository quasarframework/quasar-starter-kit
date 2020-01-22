<template>
  <div>
    <p>{{ title }}</p>
    <ul>
      <li v-for="todo in todos" :key="todo.id" @click="increment">
        {{ prettyTodo(todo) }}
      </li>
    </ul>
    <p>Count: {{ todoCount }} / {{ meta.totalCount }}</p>
    <p>Active: {{ active ? 'yes' : 'no' }}</p>
    <p>Clicks on todos: {{ clickCount }}</p>
  </div>
</template>

<script lang="ts">
import { createComponent, PropType, computed, ref } from '@vue/composition-api';
import { Todo, Meta } from './models';

function clickFeatures() {
  const clickCount = ref(0);
  function increment() {
    return clickCount.value++;
  }

  return { clickCount, increment };
}

function todoFeatures(todos: Todo[]) {
  const todoCount = computed(() => todos.length);

  function prettyTodo(todo: Todo) {
    return `${todo.id} - ${todo.content}`;
  }

  return { todoCount, prettyTodo };
}

export default createComponent({
  name: 'CompositionComponent',
  props: {
    title: {
      type: String,
      required: true
    },
    todos: {
      type: (Array as unknown) as PropType<Todo[]>,
      default: () => []
    },
    meta: {
      type: (Object as unknown) as PropType<Meta>,
      required: true
    },
    active: {
      type: Boolean
    }
  },
  setup({ todos }) {
    return { ...clickFeatures(), ...todoFeatures(todos) };
  }
});
</script>
