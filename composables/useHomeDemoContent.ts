export function useHomeDemoContent() {
  const trust = [
    { value: '1960', label: 'год основания' },
    { value: '1250 кВт', label: 'генераторы 4ГПЭ' },
    { value: '−60…+40 °C', label: 'климат' },
    { value: '8000 м', label: 'бурение ДПБ' },
  ]

  const directions = [
    {
      title: 'Экскаваторные комплекты',
      text: 'Генераторные группы и двигатели подъёма, поворота, напора, хода для ЭКГ и ЭШ.',
    },
    {
      title: 'Шахтные машины',
      text: 'Тяговые ДПТ и взрывобезопасные асинхронные серии ДАТВ / ДАКВ / ДАРВ.',
    },
    {
      title: 'Буровые установки',
      text: 'Серия ДПБ до 1000 кВт, тормоза ТЭП и индукционные.',
    },
    {
      title: 'Железнодорожный транспорт',
      text: 'Тяговый ДПТ 810-2, реакторы, дроссели, разъединители.',
    },
    {
      title: 'Вводы и ВВ-аппаратура',
      text: 'Трансформаторные вводы; классы 27,5 / 35 кВ.',
    },
    {
      title: 'Ремонт и ЗИП',
      text: 'Ремонт электрических машин и запасные части по перечню завода.',
    },
  ]

  const caps = [
    { title: 'Литьё', text: 'Al, Cu, бронза, сталь и чугун: давление, кокиль, песок.' },
    { title: 'Гальваника', text: 'Zn, Cd, Ni, Sn; линия до 1000×600×600 мм.' },
    { title: 'Механообработка', text: 'Вал Ø до 250 мм, длина до 5000 мм (HECKERT).' },
    { title: 'Испытания', text: 'Стенды завода под агрегаты главных приводов.' },
  ]

  const media = {
    excavator: '/media/quarry-excavator.jpg',
    factory: '/media/factory-floor.jpg',
    copper: '/media/copper-motor.jpg',
    heavy: '/media/heavy-industry.jpg',
    steel: '/media/steel-workshop.jpg',
    generatedExcavator: '/media/hero-excavator-dusk.png',
    generatedMotor: '/media/hero-motor-copper.png',
  }

  return { trust, directions, caps, media }
}
