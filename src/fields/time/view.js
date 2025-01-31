document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.wp-block-smartforms-time input');
    
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            console.log(`Time input changed: ${this.value}`);
        });
    });
});