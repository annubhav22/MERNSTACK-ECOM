import React from 'react';

const FilterCheckboxList = ({ title, options, selectedOptions, onChange }) => {
  return (
    <div className="mb-4">
      <h4 className="font-semibold mb-2">{title}</h4>
      {options.map((option) => (
        <label key={option} className="block mb-1 cursor-pointer">
          <input
            type="checkbox"
            value={option}
            checked={selectedOptions.includes(option)}
            onChange={() => onChange(option)}
            className="mr-2"
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default FilterCheckboxList;
