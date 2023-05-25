// Fetch data from the URL
fetch('https://data.wa.gov/resource/f6w7-q2d2.json?$limit=1000')
.then(response => response.json())
.then(data => {
  // Prepare data for the graph
  const makeCount = {};
  data.forEach(item => {
    const make = item.make;

    if (!makeCount[make]) {
      makeCount[make] = 0;
    }

    makeCount[make]++;
  });

  // Sort makes by occurrence in descending order
  const sortedMakes = Object.keys(makeCount).sort((a, b) => makeCount[b] - makeCount[a]);
  const topThreeMakes = sortedMakes.slice(0, 3);

  // Extract data for the top three makes
  const labels = topThreeMakes;
  const dataPoints = topThreeMakes.map(make => makeCount[make]);

  // Create the graph using Chart.js
  const ctx = document.getElementById('graph').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'No. Vehicles',
        data: dataPoints,
        backgroundColor: ['palegreen', 'grey', 'paleturquoise'],
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Vehicle Make'
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
      },
      plugins: {
        title: {
          display: true,
          text: 'Top Three Vehicle Makes by Sales'
        },
        legend: {
          display: false
        }
      }
    }
  });

  // Create the year filter
  const yearFilter = document.getElementById('year-filter');

  // Get unique years from the data
  const uniqueYears = [...new Set(data.map(item => item.model_year))];

  // Add options to the dropdown filter
  uniqueYears.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearFilter.appendChild(option);
  });

  // Add event listener to the year filter
  yearFilter.addEventListener('change', () => {
    const selectedYear = yearFilter.value;

    // Filter data based on selected year
    const filteredData = selectedYear === 'all' ? data : data.filter(item => item.model_year === selectedYear);

    // Prepare filtered data for the graph
    const filteredMakeCount = {};
    filteredData.forEach(item => {
      const make = item.make;

      if (!filteredMakeCount[make]) {
        filteredMakeCount[make] = 0;
      }

      filteredMakeCount[make]++;
    });

    // Sort makes by occurrence in descending order
    const filteredSortedMakes = Object.keys(filteredMakeCount).sort((a, b) => filteredMakeCount[b] - filteredMakeCount[a]);
    const filteredTopThreeMakes = filteredSortedMakes.slice(0, 3);

    // Extract data for the top three makes
    const filteredLabels = filteredTopThreeMakes;
    const filteredDataPoints = filteredTopThreeMakes.map(make => filteredMakeCount[make]);

    // Update the graph with the filtered data
    chart.data.labels = filteredLabels;
    chart.data.datasets[0].data = filteredDataPoints;
    chart.update();
  });
});
