import { FC } from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { CheckboxComponent } from '@/config/appSettings';

interface Props {
  component: CheckboxComponent;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CheckboxBlock: FC<Props> = ({ component, checked, onChange }) => (
  <FormControlLabel
    control={
      <Checkbox
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    }
    label={component.required ? `${component.label} *` : component.label}
  />
);

export default CheckboxBlock;
