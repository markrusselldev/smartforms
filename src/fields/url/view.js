document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.wp-block-smartforms-url input');
    
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            console.log(`URL input changed: ${this.value}`);
        });
    });
});