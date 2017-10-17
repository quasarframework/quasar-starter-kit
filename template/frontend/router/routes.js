
export default [
  { path: '/', component: load('Hello') },

  // Always leave this last one
  { path: '*', component: load('Error404') } // Not found
]
