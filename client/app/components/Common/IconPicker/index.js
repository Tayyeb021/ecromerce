/**
 * IconPicker — FA4 icon grid selector for category forms
 */

import React, { useState } from 'react';

const ICONS = [
  { value: 'fa-home',         label: 'Home' },
  { value: 'fa-shopping-bag', label: 'Shopping' },
  { value: 'fa-tag',          label: 'Tag / Label' },
  { value: 'fa-laptop',       label: 'Electronics' },
  { value: 'fa-mobile',       label: 'Mobile' },
  { value: 'fa-desktop',      label: 'Computer' },
  { value: 'fa-diamond',      label: 'Jewelry' },
  { value: 'fa-book',         label: 'Books' },
  { value: 'fa-cutlery',      label: 'Food / Kitchen' },
  { value: 'fa-futbol-o',     label: 'Sports' },
  { value: 'fa-gamepad',      label: 'Games' },
  { value: 'fa-puzzle-piece', label: 'Toys' },
  { value: 'fa-leaf',         label: 'Garden / Beauty' },
  { value: 'fa-heartbeat',    label: 'Health' },
  { value: 'fa-bed',          label: 'Furniture' },
  { value: 'fa-clock-o',      label: 'Watch' },
  { value: 'fa-car',          label: 'Automotive' },
  { value: 'fa-music',        label: 'Music' },
  { value: 'fa-paw',          label: 'Pets' },
  { value: 'fa-glass',        label: 'Drinks' },
  { value: 'fa-film',         label: 'Movies / Media' },
  { value: 'fa-industry',     label: 'Industrial' },
  { value: 'fa-wrench',       label: 'Tools' },
  { value: 'fa-briefcase',    label: 'Office' },
  { value: 'fa-pencil',       label: 'Stationery' },
  { value: 'fa-gift',         label: 'Gifts' },
  { value: 'fa-child',        label: 'Baby / Kids' },
  { value: 'fa-plane',        label: 'Travel' },
  { value: 'fa-suitcase',     label: 'Luggage' },
  { value: 'fa-paint-brush',  label: 'Art / Craft' },
  { value: 'fa-camera',       label: 'Photography' },
  { value: 'fa-bicycle',      label: 'Cycling' },
  { value: 'fa-medkit',       label: 'Medical' },
  { value: 'fa-graduation-cap', label: 'Education' },
  { value: 'fa-bolt',         label: 'Electronics / Power' },
];

const IconPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const selected = ICONS.find(i => i.value === value);

  return (
    <div className='icon-picker-wrapper'>
      <label className='input-label'>Category Icon</label>
      <button
        type='button'
        className='icon-picker-trigger'
        onClick={() => setOpen(o => !o)}
      >
        {value ? (
          <>
            <i className={`fa ${value}`} />
            <span>{selected ? selected.label : value}</span>
          </>
        ) : (
          <span className='icon-picker-placeholder'>
            <i className='fa fa-th-large' /> Click to choose an icon…
          </span>
        )}
        <i className={`fa fa-chevron-${open ? 'up' : 'down'} icon-picker-caret`} />
      </button>

      {open && (
        <div className='icon-picker-grid'>
          <div
            className={`icon-picker-item ${!value ? 'icon-picker-item--selected' : ''}`}
            onClick={() => { onChange(''); setOpen(false); }}
            title='No icon'
          >
            <i className='fa fa-ban' />
            <span>None</span>
          </div>
          {ICONS.map(icon => (
            <div
              key={icon.value}
              className={`icon-picker-item ${value === icon.value ? 'icon-picker-item--selected' : ''}`}
              onClick={() => { onChange(icon.value); setOpen(false); }}
              title={icon.label}
            >
              <i className={`fa ${icon.value}`} />
              <span>{icon.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IconPicker;
