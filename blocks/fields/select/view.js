document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.wp-block-smartforms-select input');
    
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            console.log(`Select input changed: ${this.value}`);
        });
    });
});