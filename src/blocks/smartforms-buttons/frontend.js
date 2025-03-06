document.addEventListener('DOMContentLoaded', function () {
	// Process every button group on the page.
	const buttonGroups = document.querySelectorAll('.sf-buttons-group');
	
	buttonGroups.forEach(group => {
	  // Read the "data-multiple" attribute; default to true if not explicitly set.
	  const isMultiple = group.getAttribute('data-multiple') === 'true' || group.getAttribute('data-multiple') === null;
	  
	  // Find the associated hidden input. In our dynamic PHP, the hidden input is a sibling of the group.
	  const hiddenInput = group.parentElement.querySelector('input[type="hidden"]');
	  if (!hiddenInput) return;
	  
	  // Function to update the hidden input's value based on active buttons.
	  function updateHiddenInput() {
		if (isMultiple) {
		  // In multiple mode, join the data-values of all active buttons with commas.
		  const activeButtons = group.querySelectorAll('button.active');
		  const values = Array.from(activeButtons).map(btn => btn.getAttribute('data-value'));
		  hiddenInput.value = values.join(',');
		} else {
		  // In single mode, only one button should be active.
		  const activeButton = group.querySelector('button.active');
		  hiddenInput.value = activeButton ? activeButton.getAttribute('data-value') : '';
		}
	  }
	  
	  // Attach click events to each button in this group.
	  const buttons = group.querySelectorAll('button');
	  buttons.forEach(button => {
		button.addEventListener('click', function () {
		  if (isMultiple) {
			// In multiple mode, toggle the active class.
			button.classList.toggle('active');
		  } else {
			// In single mode, remove active class from all buttons and add to the clicked one.
			buttons.forEach(b => b.classList.remove('active'));
			// If the clicked button was already active, deselect it.
			if (button.classList.contains('active')) {
			  button.classList.remove('active');
			} else {
			  button.classList.add('active');
			}
		  }
		  updateHiddenInput();
		});
	  });
	  
	  // Optionally initialize: for single selection, if required and no selection exists, select the first button.
	  if (!isMultiple && hiddenInput.hasAttribute('required') && hiddenInput.value.trim() === "") {
		if (buttons.length > 0) {
		  buttons[0].classList.add('active');
		  updateHiddenInput();
		}
	  }
	});
  });
  