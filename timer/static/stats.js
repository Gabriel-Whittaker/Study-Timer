document.addEventListener('DOMContentLoaded', function () {

    async function fetchData(id, name, args, units) {
        const ctx = document.getElementById(id);
        let data = await (fetch(`/${name}?${args}`));
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
    
    fetchData("hourlychart", "hourly_data", null, "Percentage");
    fetchData("monthchart", "month_data", "month=8", "Minutes");
    fetchData("yearchart", "year_data", "year=2025", "Minutes");

});