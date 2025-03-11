import React from 'react';
import ItemNumberDifference from '../ItemNumberDifference';
import { useFormatter } from '../i18n';

interface WidgetNumberProps {
  count: number
  change: number
}

const WidgetNumber = ({ count, change }: WidgetNumberProps) => {
  const { t_i18n, n } = useFormatter();

  return (
    <>
      <div style={{ float: 'left', fontSize: 40 }}>
        {n(count)}
      </div>
      <ItemNumberDifference
        difference={change}
        description={t_i18n('From previous Month')}
      />
    </>
  );
};

export default WidgetNumber;
