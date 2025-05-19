document.addEventListener('DOMContentLoaded', () => {
    const img = document.getElementById('cat-img');
    const newBtn = document.getElementById('new-btn');
    const saveBtn = document.getElementById('save-btn');

    let cat = null;

    getCat();

    newBtn.addEventListener('click', getCat);

    saveBtn.addEventListener('click', () => {
        if (cat) {
            fetch('/api/save-favorite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: cat.url })
            })
            .then(res => res.json())
            .then(() => {
                alert('Saved to Supabase!');
            })
            .catch(err => {
                console.error('Save failed:', err);
            });
        }
    });

    function getCat() {
        fetch('/api/cat')
            .then(res => res.json())
            .then(data => {
                cat = data[0];
                img.classList.remove('show');
                img.src = cat.url;
                img.onload = () => img.classList.add('show');
            })
            .catch(err => {
                console.log('Error:', err);
                img.src = 'https://via.placeholder.com/300?text=No+Pic';
            });
    }
});
