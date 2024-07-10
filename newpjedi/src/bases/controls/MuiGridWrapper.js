import { Grid } from '@mui/material';
import React from 'react';

const MuiGridWrapper = ({ left = false, children = [] }) => {
  const items = React.Children.toArray(children);
  const count = items.length;

  return (
    <Grid
      container
      // rowSpacing={1}
      // columnSpacing={{ xs: 4, sm: 3, md: 2, lg: 1 }}
      spacing={2}
      // columns={{ xs: 3, sm: 6, md: 9, lg: 12 }}
      // direction="row"
      justifyContent="flex-end"
      alignItems="center"
    >
      {items.map((item, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={Math.floor(12 / count) > 3 ? Math.floor(12 / count) : 3}
          lg={Math.floor(12 / count) > 2 ? Math.floor(12 / count) : 2}
          key={index}
        >
          {item}
        </Grid>
      ))}
    </Grid>
  );
};

export default MuiGridWrapper;
