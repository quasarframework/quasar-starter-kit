<template>
  <q-item
    clickable
    tag="a"
    target="_blank"
    :href="link"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>\{{ title }}</q-item-label>
      <q-item-label caption>
        \{{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script{{#preset.typescript}} lang="ts"{{/preset.typescript}}>
{{#if_eq typescriptConfig "class"}}import { Vue, prop, Options } from 'vue-class-component';

class Props {
  readonly title!: string;
  readonly caption = prop({ default: '' });
  readonly link = prop({ default: '#' });
  readonly icon = prop({ default: '' });
}

@Options({})
export default class EssentialLink extends Vue.with(Props) {}{{else}}import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    }
  }
}){{/if_eq}}
</script>
