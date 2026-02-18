async function fetchContributions() {
    const query = `
    {
      user(login: "${USERNAME}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }`;

    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });

    const data = await response.json();
    renderGraph(data.data.user.contributionsCollection.contributionCalendar);
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