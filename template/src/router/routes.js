function loadpage (path) {
  return () => import(`pages/${path}`)
}

const pages = require.context('../pages', true, /^\.\/.*\.vue$/) // Requires all files in pages folder
  .keys()
  .filter(page => page.split('/').length >= 2) // remove folders
  .filter(page => page.indexOf('.vue')) // keep only vue files
  .map(page => page.slice(2).slice(0, -4)) // remove leading './' and trailing '.vue'
  .filter(page => {
    switch (page) {
      // add exceptions for special pages
      case 'index':
      case '404':
        return false
      default:
        return true
    }
  })

export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: loadpage('index') },
      { path: '404', component: loadpage('404') },
      ...pages.map(p => { return { path: p, component: loadpage(p) } }),
      { path: 'index2/test', component: () => import('pages/index2') },
      { path: 'action-sheet', component: () => import('pages/demo/action-sheet') },
      { path: 'alert', component: () => import('pages/demo/alert') },
      { path: 'collapsible', component: () => import('pages/demo/collapsible') },
      { path: 'dialog', component: () => import('pages/demo/dialog') },
      { path: 'fab', component: () => import('pages/demo/fab') },
      { path: 'modal', component: () => import('pages/demo/modal') },
      { path: 'popover', component: () => import('pages/demo/popover') },
      { path: 'tooltip', component: () => import('pages/demo/tooltip') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    redirect: '/404'
  }
]

export { pages }
