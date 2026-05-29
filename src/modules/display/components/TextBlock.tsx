import { FC } from 'react';

import Box from '@mui/material/Box';

import { TextComponent } from '@/config/appSettings';

interface Props {
  component: TextComponent;
}

const TextBlock: FC<Props> = ({ component }) => (
  // eslint-disable-next-line react/no-danger
  <Box
    className="text-block"
    dangerouslySetInnerHTML={{ __html: component.html }}
  />
);

export default TextBlock;
