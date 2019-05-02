import React from 'react';

import Card from './Card';

export default props => {
  const price = props.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  return (
    <Card>
      <p>Current Price</p>
      <h3>IDR {price}</h3>
    </Card>
  );
};
