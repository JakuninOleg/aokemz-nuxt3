export default defineNuxtPlugin(() => {
   return {
     provide: {
       yandexMaps: () => import('https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=1a2a21cf-1f34-4289-a9d9-76199865eb96')
     }
   }
 })