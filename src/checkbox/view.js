document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.wp-block-smartforms-checkbox input');
    
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            console.log(`Checkbox input changed: ${this.value}`);
        });
    });
});