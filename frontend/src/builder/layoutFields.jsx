import { defaultBox } from '../constants/layoutBox';
import { ALIGN_OPTIONS } from '../constants/builder';
import { AlignField } from './fields/AlignField';
import { DataDisplayField } from './fields/DataDisplayField';
import { LayoutBoxField } from './fields/LayoutBoxField';
import { MeasureField } from './fields/MeasureField';

export { defaultBox };

export function dataBindField(options) {
  return {
    bind: { type: 'select', label: 'Tautkan ke data', options },
  };
}

export function dataDisplayField(fields) {
  return {
    display: {
      type: 'custom',
      label: 'Tampilan data',
      render: (props) => <DataDisplayField {...props} fields={fields} />,
    },
  };
}

/**
 * Field gaya lanjutan yang dipakai ulang di blok tata letak.
 */
export function layoutFields({
  includeColor = true,
  includeTextColor = false,
  includeWidth = true,
  includeHeight = true,
  includeFont = false,
  includeBorder = true,
  defaultPosition = 'static',
} = {}) {
  return {
    box: {
      type: 'custom',
      label: 'Gaya',
      render: (props) => (
        <LayoutBoxField
          {...props}
          includeColor={includeColor}
          includeTextColor={includeTextColor}
          includeWidth={includeWidth}
          includeHeight={includeHeight}
          includeFont={includeFont}
          includeBorder={includeBorder}
          defaultPosition={defaultPosition}
        />
      ),
    },
  };
}

export const gapSizeField = {
  type: 'custom',
  label: 'Jarak kolom (angka)',
  render: (props) => <MeasureField {...props} label="Jarak kolom" />,
};

export function alignField(options = ALIGN_OPTIONS) {
  return {
    type: 'custom',
    label: 'Rata',
    render: (props) => <AlignField {...props} options={options} />,
  };
}
