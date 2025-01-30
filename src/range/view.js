document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.wp-block-smartforms-range input');
    
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            console.log(`Range input changed: ${this.value}`);
        });
    });
});