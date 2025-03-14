// src/blocks/smartforms-buttons/buttonGroupHelper.js
export function updateOption(options, index, newLabel) {
  return options.map((option, i) => {
    if (i === index) {
      return {
        label: newLabel,
        value: newLabel.toLowerCase().replace(/\s+/g, '-'),
      };
    }
    return option;
  });
}

export function addOption(options) {
  let maxNumber = 0;
  options.forEach((option) => {
    const match = option.label.match(/^Option (\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNumber) {
        maxNumber = num;
      }
    }
  });
  const newLabel = `Option ${maxNumber + 1}`;
  const newValue = newLabel.toLowerCase().replace(/\s+/g, '-');
  return [...options, { label: newLabel, value: newValue }];
}

export function removeOption(options, index) {
  return options.filter((_, i) => i !== index);
}
