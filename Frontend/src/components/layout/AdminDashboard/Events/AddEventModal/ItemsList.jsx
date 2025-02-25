import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Chip,
} from "@mui/material";

const ItemsList = ({ title, items, onItemsChange }) => {
  const [newItem, setNewItem] = useState("");

  const handleItemChange = (e) => {
    setNewItem(e.target.value);
  };

  const addItem = () => {
    if (newItem.trim()) {
      const updatedItems = [...items, newItem.trim()];
      onItemsChange(updatedItems);
      setNewItem("");
    }
  };

  const removeItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    onItemsChange(updatedItems);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', mb: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={`Add ${title.toLowerCase()}`}
          value={newItem}
          onChange={handleItemChange}
          onKeyPress={handleKeyPress}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 1 }}
          onClick={addItem}
        >
          Add
        </Button>
      </Box>
      <Paper
        variant="outlined"
        sx={{
          p: 1,
          minHeight: '100px',
          maxHeight: '150px',
          overflowY: 'auto'
        }}
      >
        {items.length > 0 ? (
          items.map((item, idx) => (
            <Chip
              key={idx}
              label={item}
              onDelete={() => removeItem(idx)}
              sx={{ m: 0.5 }}
            />
          ))
        ) : (
          <Typography color="text.secondary" align="center" sx={{ pt: 2 }}>
            No {title.toLowerCase()} added
          </Typography>
        )}
      </Paper>
    </>
  );
};

export default ItemsList;