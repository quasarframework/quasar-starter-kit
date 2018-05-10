
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', name: 'Index', component: () => import('pages/index') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
