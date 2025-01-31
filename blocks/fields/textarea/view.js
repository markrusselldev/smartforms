document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.wp-block-smartforms-textarea input');
    
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            console.log(`Textarea input changed: ${this.value}`);
        });
    });
});