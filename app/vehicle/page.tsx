import React from 'react';
import VehicleForm from '../components/VehicleForm';
import { Container, Box } from '@mui/material';

const VehiclePage = () => {

  return (
      <Container maxWidth="md">
        <Box sx={{ mt: 8 }}>
          <VehicleForm />
        </Box>
      </Container>
  );
};

export default VehiclePage;
