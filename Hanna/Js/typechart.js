// Fetch data from the URL
fetch('https://data.wa.gov/resource/f6w7-q2d2.json?$limit=1000')
.then(response => response.json())
.then(data => {
  // Prepare data for the graph
  const datasets = {};
  data.forEach(item => {
    const evType = item.ev_type;
    const modelYear = item.model_year;

    if (!datasets[evType]) {
      datasets[evType] = {};
    }

    if (!datasets[evType][modelYear]) {
      datasets[evType][modelYear] = 0;
    }

    datasets[evType][modelYear]++;
  });

  // sort the model_years in az order
  const labels = Object.keys(datasets)
    .reduce((allModelYears, evType) => {
      const modelYears = Object.keys(datasets[evType]);
      return allModelYears.concat(modelYears);
    }, [])
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort();

  // Bar Chart
  const ctx = document.getElementById('graph').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: Object.keys(datasets).map((evType, index) => ({
        label: evType,
        data: labels.map(modelYear => datasets[evType][modelYear] || 0),
        backgroundColor: index % 2 === 0 ? 'palegreen' : 'grey',
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1
      }))
    },
    options: {
      responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Model Year'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'No. Vehicle Sales'
          },
          beginAtZero: true
        }
      }
    }
  });
});
