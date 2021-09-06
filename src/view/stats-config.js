import ChartDataLabels from 'chartjs-plugin-datalabels';
import { cloneDeep} from 'lodash';

const BAR_HEIGHT = 55;

const Color = {
  FONT: '#000000',
  BACKGROUND: '#ffffff',
};

const FontSize = {
  TEXT: 13,
  TITLE: 23,
};

const getStatsConfig = (
  element,
  labels,
  property,
  formatter,
) => [
  element,
  cloneDeep({
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels,
      datasets: [{
        data: Object.values(property),
        backgroundColor: Color.BACKGROUND,
        hoverBackgroundColor: Color.BACKGROUND,
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: FontSize.TEXT,
          },
          color: Color.FONT,
          anchor: 'end',
          align: 'start',
          formatter,
        },
      },
      title: {
        display: true,
        fontColor: Color.FONT,
        fontSize: FontSize.TITLE,
        position: 'left',
        text: element.id.toUpperCase(),
      },
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
    },
  })
  ,
];

export { getStatsConfig, BAR_HEIGHT };
