<template>
  <section
    id="technical-request"
    class="ref-request"
    aria-labelledby="request-title"
  >
    <div class="ref-container ref-request__grid">
      <div class="ref-request__copy">
        <p class="ref-label">Запросить подбор</p>
        <h2 id="request-title" class="ref-title">
          Нужен привод<br />под вашу машину?
        </h2>
        <p>
          Поможем подобрать решение под ваши задачи.<br />Укажите модель техники
          и параметры привода.<br />Специалисты подготовят техническое
          предложение.
        </p>
        <ul class="ref-request__benefits">
          <li>
            <HomeEngineeringIcon name="shield" /><span
              >Техническая<br />консультация</span
            >
          </li>
          <li>
            <HomeEngineeringIcon name="design" /><span
              >Подбор<br />оборудования</span
            >
          </li>
          <li>
            <HomeEngineeringIcon name="document" /><span
              >Коммерческое<br />предложение</span
            >
          </li>
        </ul>
      </div>
      <Form variant="technical" header="Запрос на подбор оборудования" />
    </div>
  </section>
</template>
