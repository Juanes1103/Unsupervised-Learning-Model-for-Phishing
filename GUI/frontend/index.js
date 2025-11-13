document.getElementById('emailForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const emailData = {
        sender: document.getElementById('sender').value,
        receiver: document.getElementById('receiver').value,
        subject: document.getElementById('subject').value,
        body: document.getElementById('body').value,
        url: document.getElementById('url').value
    };

    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = '<div class="alert alert-info">Processing...</div>';

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData)
        });

        const data = await response.json();

        if (response.ok) {
            let title = '';
            let description = '';
            let badgeClass = '';

            switch(data.cluster) {
                case 0:
                    title = 'Cluster 0 - News Alert & Social Content';
                    description = 'Words like CNN, news, top and network are in charge of talking about the news and the information work.';
                    badgeClass = 'bg-danger';
                    break;
                case 1:
                    title = 'Cluster 1 - Replica Goods';
                    description = 'Words like replica, watches and patek philippe represent the whole group.';
                    badgeClass = 'bg-warning';
                    break;
                case 2:
                    title = 'Cluster 2 - Pharmaceutics & Dating';
                    description = 'Words related to pharmaceuticals, health products, and dating topics define this cluster.';
                    badgeClass = 'bg-success';
                    break;
                default:
                    title = 'Unknown Cluster';
                    description = '';
                    badgeClass = 'bg-secondary';
            }

            resultContainer.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${title} <span class="badge ${badgeClass}">${data.cluster}</span></h5>
                        <p class="card-text">${description}</p>
                    </div>
                </div>
            `;
        } else {
            resultContainer.innerHTML = `<div class="alert alert-danger">Error: ${data.error}</div>`;
        }
    } catch (error) {
        resultContainer.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
        console.error('Error:', error);
    }
});