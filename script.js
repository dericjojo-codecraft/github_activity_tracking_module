async function fetchContributions() {
    try {
        // We fetch from your local server, not GitHub!
        const response = await fetch('http://localhost:3000/api/contributions');
        const result = await response.json();
        
        // Based on the JSON you shared, the path is result.data.user...
        const calendar = result.data.user.contributionsCollection.contributionCalendar;
        
        renderGraph(calendar);
    } catch (err) {
        console.error("Frontend Error:", err);
    }
}

function renderGraph(calendar) {
    const graph = document.getElementById('contribution-graph');
    document.getElementById('total-count').innerText = calendar.totalContributions;

    calendar.weeks.forEach(week => {
        week.contributionDays.forEach(day => {
            const div = document.createElement('div');
            div.classList.add('sq');
            div.title = `${day.date}: ${day.contributionCount} commits`;
            
            // Map count to color level
            if (day.contributionCount > 0 && day.contributionCount < 3) div.classList.add('level-1');
            else if (day.contributionCount >= 3 && day.contributionCount < 6) div.classList.add('level-2');
            else if (day.contributionCount >= 6 && day.contributionCount < 9) div.classList.add('level-3');
            else if (day.contributionCount >= 9) div.classList.add('level-4');
            
            graph.appendChild(div);
        });
    });
}

fetchContributions();