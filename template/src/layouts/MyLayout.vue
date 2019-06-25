<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggle"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>Quasar App</q-toolbar-title>

        <div>{{ version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-2">
      <q-list>
        <q-item-label header>Essential Links</q-item-label>

        <q-item clickable :key="qItem.labelOne" v-for="qItem in qItems" @click="openURL(qItem.link)">
          <q-item-section avatar>
            <q-icon :name="qItem.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ qItem.labelOne }}</q-item-label>
            <q-item-label caption>{{ qItem.labelTwo }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      qItems: [
        {
          icon: 'school',
          labelOne: 'Docs',
          labelTwo: 'quasar.dev',
          link: 'https://quasar.dev'
        },
        {
          icon: 'code',
          labelOne: 'Github',
          labelTwo: 'github.com/quasarframework',
          link: 'https://github.com/quasarframework'
        },
        {
          icon: 'chat',
          labelOne: 'Discord Chat Channel',
          labelTwo: 'chat.quasar.dev',
          link: 'https://chat.quasar.dev'
        },
        {
          icon: 'record_voice_over',
          labelOne: 'Forum',
          labelTwo: 'forum.quasar.dev',
          link: 'https://forum.quasar.dev'
        },
        {
          icon: 'rss_feed',
          labelOne: 'Twitter',
          labelTwo: '@quasarframework',
          link: 'https://twitter.com/quasarframework'
        }
      ]
    }
  },
  computed: {
    version () {
      return `Quasar v${this.$q.version}`
    }
  },
  methods: {
    toggle () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  }
}
</script>

<style>
</style>
