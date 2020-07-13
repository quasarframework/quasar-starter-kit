<template>
  <div>
    <p>\{{ title }}</p>
    <ul>
      <li v-for="todo in todos" :key="todo.id" @click="increment">
        \{{ todo.id }} - \{{ todo.content }}
      </li>
    </ul>
    <p>Count: \{{ todoCount }} / \{{ meta.totalCount }}</p>
    <p>Active: \{{ active ? 'yes' : 'no' }}</p>
    <p>Clicks on todos: \{{ clickCount }}</p>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Todo, Meta } from './models';

export default Vue.extend({
  name: 'OptionsComponent',
  props: {
    title: {
      type: String,
      required: true
    },
    todos: {
      type: (Array as unknown) as PropType<Todo[]>,
      default: () => [] as Todo[]
    },
    meta: {
      type: (Object as unknown) as PropType<Meta>,
      required: true
    },
    active: {
      type: Boolean
    }
  },
  data(): { clickCount: number } {
    return {
      clickCount: 0
    };
  },
  methods: {
    increment(): void {
      this.clickCount += 1;
    }
  },
  computed: {
    todoCount(): number {
      return this.todos.length;
    }
  }
});
</script>
