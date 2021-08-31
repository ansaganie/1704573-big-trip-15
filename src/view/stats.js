import { calculateDiff, formatDuration } from '../utils/date';
import AbstractView from './abstract';
import Chart from 'chart.js';
import {
  BAR_HEIGHT,
  CANVAS,
  OPTIONS,
  DATASETS,
  DATALABELS,
  TITLE
} from './stats-config.js';

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
  constructor(points) {
    super();

    this._points = points;
    this._props = {};

    this._calculateProps();
    this._renderStatsCharts();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  _renderStatsCharts() {
    const { money, type, timeSpend } = this._props;
    const moneyElement = this.getElement().querySelector('#money');
    const typeElement = this.getElement().querySelector('#type');
    const timeElement = this.getElement().querySelector('#time-spend');

    const labels = Object.keys(this._props.type).map((typeName) => typeName.toUpperCase());
    const chartHeight = BAR_HEIGHT * labels.length;

    moneyElement.height = chartHeight;
    typeElement.height = chartHeight;
    timeElement.height = chartHeight;

    const chartConfigs = [
      [
        typeElement,
        {
          ...CANVAS,
          data: {
            labels,
            datasets: [{
              ...DATASETS,
              data: Object.values(type),
            }],
          },
          options: {
            ...OPTIONS,
            title: {
              ...TITLE,
              text: typeElement.id.toUpperCase(),
            },
            plugins: {
              datalabels: {
                ...DATALABELS,
                formatter: (val) => `${val}x`,
              },
            },
          },
        },
      ],
      [
        timeElement,
        {
          ...CANVAS,
          data: {
            labels,
            datasets: [{
              ...DATASETS,
              data: Object.values(timeSpend),
            }],
          },
          options: {
            ...OPTIONS,
            title: {
              ...TITLE,
              text: timeElement.id.toUpperCase(),
            },
            plugins: {
              datalabels: {
                ...DATALABELS,
                formatter: (val) => `${formatDuration(val)}`,
              },
            },
          },
        },
      ],
      [
        moneyElement,
        {
          ...CANVAS,
          data: {
            labels,
            datasets: [{
              ...DATASETS,
              data: Object.values(money),
            }],
          },
          options: {
            ...OPTIONS,
            title: {
              ...TITLE,
              text: moneyElement.id.toUpperCase(),
            },
            plugins: {
              datalabels: {
                ...DATALABELS,
                formatter: (val) => `€ ${val}`,
              },
            },
          },
        },
      ],
    ];

    chartConfigs.forEach((config) => new Chart(...config));
  }

  _calculateProps() {
    const money = {};
    const typeCount = {};
    const timeSpend = {};

    this._points.forEach(({type, basePrice, dateFrom, dateTo}) => {
      money[type] = money[type] !== undefined ? money[type] + basePrice : basePrice;

      typeCount[type] = typeCount[type] !== undefined ? typeCount[type] + 1 : 1;

      const diff = calculateDiff(dateFrom, dateTo);
      timeSpend[type] = timeSpend[type] !== undefined ? timeSpend[type] + diff : diff;
    });

    this._props = {
      money,
      type: typeCount,
      timeSpend,
    };
  }
}

export default Statistics;
