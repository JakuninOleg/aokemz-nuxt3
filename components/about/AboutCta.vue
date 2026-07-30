<template>
  <section class="about-cta">
    <div class="wrap about-cta__inner">
      <div>
        <span class="section-tag">Дальше</span>
        <h2>Каталог, документы<br />или заявка</h2>
        <p class="about-cta__lead">
          Нужны ТТХ, опросный лист или параметры машины: откройте каталог или напишите в отдел
          продаж.
        </p>
      </div>
      <div class="about-cta__actions">
        <NuxtLink to="/products" class="button button-solid">Каталог</NuxtLink>
        <NuxtLink to="/documents" class="button button-ghost">Документы</NuxtLink>
        <NuxtLink to="/contacts" class="button button-ghost">Контакты</NuxtLink>
      </div>
    </div>
  </section>
</template>
