import React, { useRef } from 'react';
import { Box, Button, Text, Input } from '@chakra-ui/react';
import { useSlae } from '../context/SlaeContext';

const Dropzone = () => {
  const fileInputRef = useRef(null);

  const parseFile = (file) => {
    // This is a simplified parser. A more robust implementation
    // would be needed for a production application.
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      // In a real app, you would parse the file content here
      // and dispatch an action to update the state.
      console.log('File content:', text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) parseFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <Box
      p={4}
      borderWidth="2px"
      borderRadius="lg"
      borderStyle="dashed"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      textAlign="center"
    >
      <Text fontSize="xl">Drag & drop file here</Text>
      <Text>or</Text>
      <Button onClick={() => fileInputRef.current?.click()} mt={2}>
        Choose File
      </Button>
      <Input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt"
        display="none"
        onChange={(e) =>
          e.target.files && parseFile(e.target.files[0])
        }
      />
    </Box>
  );
};

export default Dropzone;