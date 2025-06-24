// FilterSidebar.jsx
import React from 'react';
import { Disclosure } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';

export default function FilterSidebar({ filters, handleFilter }) {
  return (
    <form className="space-y-4">
      {filters.map((section) => (
        <Disclosure key={section.id}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between py-2 text-sm font-medium text-left text-gray-900">
                {section.name}
                {open ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
              </Disclosure.Button>
              <Disclosure.Panel>
                {section.options.length === 0 ? (
                  <p className="text-gray-500 px-2">No options</p>
                ) : (
                  section.options.map((option) => (
                    <div key={option.value} className="flex items-center py-1 px-2">
                      <input
                        type="checkbox"
                        checked={option.checked}
                        onChange={(e) => handleFilter(e, section, option)}
                        className="mr-2"
                      />
                      <label className="text-sm text-gray-700">{option.label}</label>
                    </div>
                  ))
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}

    </form>
  );
}
