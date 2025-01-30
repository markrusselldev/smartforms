document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.wp-block-smartforms-radio-button input');
    
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            console.log(`Radio Button input changed: ${this.value}`);
        });
    });
});