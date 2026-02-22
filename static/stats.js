document.addEventListener('DOMContentLoaded', function () {

    async function fetchData(id, name, units) {
        const ctx = document.getElementById(id);
        let data = await (fetch(`/${name}`));
        data = await data.json();
        console.log(data);
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets:// data.dataset
                    [{
                        label: `${units} Studied`,
                        data: data.dataset,
                        borderWidth: 1
                    }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                    
                },
                layout: {
                    padding:{
                        right: 50,
                    } 
                }
                
            }
        });
    }
    Chart.defaults.backgroundColor = '#f4e8c1';
    Chart.defaults.borderColor = '#274C77';
    Chart.defaults.color = '#f4e8c1';
    
    fetchData("hourlychart", "hourly_data", "Percentage");
    fetchData("monthchart", "month_data", "Minutes");
    fetchData("yearchart", "year_data", "Minutes");

});