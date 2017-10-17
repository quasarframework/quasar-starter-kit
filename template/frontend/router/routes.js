function layout (name) {
  return () => import(`layouts/${name}.vue`)
}

function page (name) {
  return () => import(`pages/${name}.vue`)
}

export default [
  {
    path: '/',
    component: layout('default'),
    children: [
      { path: '', component: page('index') }
    ]
  },

  // Always leave this as last one
  { path: '*', component: page('404') } // Not found
]
