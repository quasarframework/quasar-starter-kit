{{#if preset.typescript}}
<template>
  <q-page class="row items-center justify-evenly">
    <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component>
  </q-page>
</template>

<script lang="ts">{{#preset.typescript}}{{#if_eq typescriptConfig "composition"}}
import ExampleComponent from 'components/CompositionComponent.vue';
{{/if_eq}}{{#if_eq typescriptConfig "class"}}
import ExampleComponent from 'components/ClassComponent.vue';
{{/if_eq}}{{#if_eq typescriptConfig "object"}}
import ExampleComponent from 'components/ObjectComponent.vue';
{{/if_eq}}
import { Todo, Meta } from 'components/models';
{{/preset.typescript}}

export default {
  name: 'PageIndex',
  components: { ExampleComponent },
  data() {
    const todos: Todo[] = [
      {
        id: 1,
        content: 'ct1'
      },
      {
        id: 2,
        content: 'ct2'
      },
      {
        id: 3,
        content: 'ct3'
      },
      {
        id: 4,
        content: 'ct4'
      },
      {
        id: 5,
        content: 'ct5'
      }
    ];
    const meta: Meta = {
      totalCount: 1200
    };
    return { todos, meta };
  }
}
</script>
{{else}}
<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/quasar-logo-full.svg">
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex'
}
</script>
{{/if}}
