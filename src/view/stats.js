import { calculateDiff, formatDuration } from '../utils/date';
import AbstractView from './abstract';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const Color = {
  FONT: '#000000',
  BACKGROUND: '#ffffff',
};

const FontSize = {
  TEXT: 13,
  TITLE: 23,
};

const BAR_HEIGHT = 55;

const CANVAS = {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
};

const OPTIONS = {
  scales: {
    yAxes: [{
      ticks: {
        fontColor: Color.FONT,
        padding: 5,
        fontSize: FontSize.TEXT,
      },
      gridLines: {
        display: false,
        drawBorder: false,
      },
    }],
    xAxes: [{
      ticks: {
        display: false,
        beginAtZero: true,
      },
      gridLines: {
        display: false,
        drawBorder: false,
      },
    }],
  },
  legend: {
    display: false,
  },
  tooltips: {
    enabled: false,
  },
};

const DATASETS = {
  data: [],
  backgroundColor: Color.BACKGROUND,
  hoverBackgroundColor: Color.BACKGROUND,
  anchor: 'start',
  barThickness: 44,
  minBarLength: 50,
};

const DATALABELS = {
  font: {
    size: FontSize.TEXT,
  },
  color: Color.FONT,
  anchor: 'end',
  align: 'start',
  formatter: '',
};

const TITLE = {
  display: true,
  fontColor: Color.FONT,
  fontSize: FontSize.TITLE,
  position: 'left',
};

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
    const barCount = labels.length;

    moneyElement.height = BAR_HEIGHT * barCount;
    typeElement.height = BAR_HEIGHT * barCount;
    timeElement.height = BAR_HEIGHT * barCount;

    new Chart(moneyElement,
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
    );

    new Chart(typeElement, {
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
    });

    new Chart(timeElement,
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
    );
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
