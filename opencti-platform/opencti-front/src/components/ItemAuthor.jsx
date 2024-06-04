import React from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { resolveLink } from '../utils/Entity';
import useHelper from '../utils/hooks/useHelper';

const ItemAuthor = (props) => {
  const { isFeatureEnable } = useHelper();
  const isMonochromeFeatureEnabled = isFeatureEnable('MONOCHROME_LABELS');
  const { createdBy } = props;
  return (
    <>
      {createdBy ? (
        <Button
          variant={isMonochromeFeatureEnabled ? 'text' : 'outlined'}
          color="primary"
          size="small"
          component={Link}
          to={`${resolveLink(createdBy.entity_type)}/${
            createdBy.id
          }?viewAs=author`}
        >
          {createdBy.name}
        </Button>
      ) : (
        '-'
      )}
    </>
  );
};

ItemAuthor.propTypes = {
  createdBy: PropTypes.object,
};

export default ItemAuthor;
