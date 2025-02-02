import React, { useState } from 'react';
import { Box, Typography, TextField, Chip } from '@mui/material';
import { styles } from './styles.jsx';


const TopicSelector = ({ postData, setPostData }) => {
  const [topicInput, setTopicInput] = useState('');

  const handleTopicAdd = (e) => {
    if (e.key === 'Enter' && topicInput.trim() && (!postData.topics || postData.topics.length < 5)) {
      setPostData(prev => ({
        ...prev,
        topics: [...(prev.topics || []), topicInput.trim()]
      }));
      setTopicInput('');
    }
  };

  const handleTopicDelete = (topicToDelete) => {
    setPostData(prev => ({
      ...prev,
      topics: prev.topics.filter(topic => topic !== topicToDelete)
    }));
  };

  return (
    <Box sx={styles.topicsSection}>
      <Typography variant="h3" sx={styles.topicsHeading}>
        Add or change topics (up to 5) so readers know what your story is about
      </Typography>
      <Box sx={styles.topicsContainer}>
        {postData.topics?.map((topic) => (
          <Chip
            key={topic}
            label={topic}
            onDelete={() => handleTopicDelete(topic)}
            sx={styles.topicChip}
          />
        ))}
        {(!postData.topics || postData.topics.length < 5) && (
          <TextField
            placeholder="Add a topic..."
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            onKeyPress={handleTopicAdd}
            variant="standard"
            sx={styles.topicInput}
          />
        )}
      </Box>
    </Box>
  );
};

export default TopicSelector;