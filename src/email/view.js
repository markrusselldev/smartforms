document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.wp-block-smartforms-email input');
    
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            console.log(`Email input changed: ${this.value}`);
        });
    });
});