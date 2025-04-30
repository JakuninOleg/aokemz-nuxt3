<template>
   <div class="lg:grid grid-main">
     <Nav />
     <div class="section mt-8 lg:mt-24">
     <div class="text-3xl font-bold mb-10">Сайт находится в разработке</div>
     <div class="mb-4">
       <Form header="Свяжитесь с нами" />
     </div>
   </div>
   </div>
 </template>
 
 
 <script>
 import Form from '~/components/Form.vue'
 
 export default {
   components: {
     Form,
   },
 }
 </script>
 