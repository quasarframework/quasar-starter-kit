<template>
  <div>
    <p>\{{ title }}</p>
    <ul>
      <li v-for="todo in todos" :key="todo.id" @click="increment">
        \{{ prettyTodo(todo) }}
      </li>
    </ul>
    <p>Count: \{{ todoCount }} / \{{ meta.totalCount }}</p>
    <p>Active: \{{ active ? 'yes' : 'no' }}</p>
    <p>Clicks on todos: \{{ clickCount }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Todo, Meta } from './models';

@Component
export default class ClassComponent extends Vue {
  @Prop({ type: String, required: true }) readonly title!: string;
  @Prop({ type: Array, default: () => [] }) readonly todos!: Todo[];
  @Prop({ type: Object, required: true }) readonly meta!: Meta;
  @Prop(Boolean) readonly active!: boolean;

  clickCount = 0;

  increment() {
    this.clickCount++;
  }

  get todoCount() {
    return this.todos.length;
  }

  prettyTodo(todo: Todo) {
    return `${todo.id} - ${todo.content}`;
  }
}
</script>
