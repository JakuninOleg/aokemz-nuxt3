export default defineNuxtPlugin((nuxtApp) => {
   const router = useRouter()
 
   router.beforeEach((to, from, next) => {
     // логика как раньше
     next()
   })
 })
 