import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 55;

const Color = {
  FONT: '#000000',
  BACKGROUND: '#ffffff',
};

const FontSize = {
  TEXT: 13,
  TITLE: 23,
};

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

export {
  BAR_HEIGHT,
  CANVAS,
  OPTIONS,
  DATASETS,
  DATALABELS,
  TITLE
};
