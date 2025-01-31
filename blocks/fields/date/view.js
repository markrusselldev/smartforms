document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.wp-block-smartforms-date input');
    
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            console.log(`Date input changed: ${this.value}`);
        });
    });
});