import AbstractView from './abstract';

const createStatsTemplate = () =>
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
    </div>
  </section>`;

class Statistics extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createStatsTemplate();
  }
}

export default Statistics;
