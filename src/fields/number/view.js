document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.wp-block-smartforms-number input');
    
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            console.log(`Number input changed: ${this.value}`);
        });
    });
});