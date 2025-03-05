document.addEventListener('DOMContentLoaded', function () {
	// Find all button group containers.
	const buttonGroups = document.querySelectorAll('.sf-buttons-group');
	buttonGroups.forEach(group => {
	  // Read the "data-multiple" attribute from the container.
	  const isMultiple = group.getAttribute('data-multiple') === 'true';
	  // Find the hidden input from the parent container.
	  const hiddenInput = group.parentElement.querySelector('input[type="hidden"]');
	  if (!hiddenInput) return;
	  
	  // Function to update the hidden input's value based on active buttons.
	  function updateHiddenValue() {
		const activeButtons = group.querySelectorAll('button.active');
		if (isMultiple) {
		  // For multiple, store comma-separated values.
		  const values = Array.from(activeButtons).map(btn => btn.getAttribute('data-value'));
		  hiddenInput.value = values.join(',');
		} else {
		  // For single selection, store the value of the one active button.
		  if (activeButtons.length > 0) {
			hiddenInput.value = activeButtons[0].getAttribute('data-value');
		  } else {
			hiddenInput.value = '';
		  }
		}
	  }
	  
	  // Attach click event to each button.
	  const buttons = group.querySelectorAll('button');
	  buttons.forEach(btn => {
		btn.addEventListener('click', function () {
		  if (isMultiple) {
			// Toggle active class for multiple selections.
			btn.classList.toggle('active');
		  } else {
			// In single selection mode, remove active from all and add to clicked button.
			buttons.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
		  }
		  updateHiddenValue();
		});
	  });
	  
	  // For single selection, if required and no button is selected, automatically select the first button.
	  if (hiddenInput.hasAttribute('required') && hiddenInput.value === "" && !isMultiple) {
		if (buttons.length > 0) {
		  buttons[0].classList.add('active');
		  updateHiddenValue();
		}
	  }
	});
  });
  