import { db } from './helpers/firebase.js';
import {
  collection,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import Highcharts from 'https://code.highcharts.com/es-modules/masters/highcharts.src.js';
import ExportingModule from 'https://code.highcharts.com/es-modules/masters/modules/exporting.src.js';
import AccessibilityModule from 'https://code.highcharts.com/es-modules/masters/modules/accessibility.src.js';

ExportingModule(Highcharts);
AccessibilityModule(Highcharts);

function initEarn() {
  const classNames = [
    "2IE","1EA","1IA","1IB","1IC","1ID","1IE","1IF","1IG","1MA","1MB",
    "2IA","2IB","2IC","2ID","2IF","2IG","2IH","2MA","2MB",
    "3IA","3IB","3IC","3ID","3IF","3IG","3MA","3MB","3UA",
    "4IA","4IB","4IC","4ID","4IF","4MA","4MB","4UA",
    "5EA","5IB","5IA","5IC","5ID","5IE","5IF","5MA"
  ];

  // Total orders counter
  (async () => {
    let total = 0;
    for (let cls of classNames) {
      const snap = await getDocs(collection(db, `orders/${cls}/orders`));
      total += snap.size;
    }
    document.getElementById('tot_orders')
            .textContent = `Ordini Totale: ${total}`;
  })();

  // Total revenue counter
  (async () => {
    let revenue = 0;
    for (let cls of classNames) {
      const snap = await getDocs(collection(db, `orders/${cls}/orders`));
      snap.forEach(doc => {
        const data = doc.data();
        if (data.total) revenue += data.total;
      });
    }
    document.getElementById('tot_money')
            .textContent = `Guadagno totale: €${revenue.toFixed(2)}`;
  })();

  // Prepare initial chart data (past 20 seconds)
  const data = (() => {
    const now = Date.now();
    const arr = [];
    for (let i = -19; i <= 0; i++) {
      arr.push({ x: now + i * 1000, y: 0 });
    }
    return arr;
  })();

  // Highcharts load callback
  function onLoadChart() {
    const series = this.series[0];

    setInterval(() => {
      let total = 0;
      const ts = Date.now();

      // fetch live counts from every class
      Promise.all(
        classNames.map(cls =>
          new Promise(res =>
            onSnapshot(
              collection(db, `orders/${cls}/orders`),
              snap => {
                total += snap.size;
                res();
              }
            )
          )
        )
      ).then(() => {
        series.addPoint([ts, total], true, true);
      });
    }, 1000);
  }

  // Render the chart
  Highcharts.chart('chart', {
    chart: {
      type: 'spline',
      events: {
        load: onLoadChart
      }
    },
    time: {
      useUTC: false
    },
    title: {
      text: 'Ordini in tempo reale'
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 150
    },
    yAxis: {
      title: {
        text: 'Ordini'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br/>',
      pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.0f}'
    },
    legend: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    series: [{
      name: 'Ordini effettuati',
      data
    }]
  });
}

initEarn();