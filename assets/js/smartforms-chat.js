document.addEventListener("DOMContentLoaded", function() {
    let currentStep = 0;
    let steps = document.querySelectorAll(".smartforms-chat-step");
    let prevButton = document.getElementById("prev-btn");
    let nextButton = document.getElementById("next-btn");

    if (steps.length > 0) {
        steps[0].classList.remove("d-none");
    }

    function updateButtons() {
        prevButton.style.display = currentStep > 0 ? "inline-block" : "none";
        nextButton.innerText = currentStep === steps.length - 1 ? "Submit" : "Next";
    }

    nextButton.addEventListener("click", function() {
        if (currentStep < steps.length - 1) {
            steps[currentStep].classList.add("d-none");
            currentStep++;
            steps[currentStep].classList.remove("d-none");
            updateButtons();
        } else {
            alert("Form submitted! (Simulated)");
        }
    });

    prevButton.addEventListener("click", function() {
        if (currentStep > 0) {
            steps[currentStep].classList.add("d-none");
            currentStep--;
            steps[currentStep].classList.remove("d-none");
            updateButtons();
        }
    });
});
