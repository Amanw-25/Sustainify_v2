import * as React from 'react';
import Button from '@mui/material/Button';

export default function App() {
  return (
    <Button 
      variant="contained"
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', 
      }}
    >
      Hello World
    </Button>
  );
}
