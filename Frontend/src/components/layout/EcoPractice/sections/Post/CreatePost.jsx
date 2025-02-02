import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button, Box, TextField, FormControlLabel, Checkbox, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { editorModules, editorFormats } from './editorConfig';
import { styles } from './styles.jsx';
const CreatePost = () => {
  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    title: '',
    kicker: '',
    content: '',
    isMemberOnly: false,
    tags: [],
    previewImage: null
  });
  const [tagInput, setTagInput] = useState('');

  const handleEditorChange = (value) => {
    setPostData(prev => ({ ...prev, content: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setPostData(prev => ({
        ...prev,
        tags: [...new Set([...prev.tags, tagInput.trim()])]
      }));
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
    }));
  };

  const handleDraft = async () => {
    const postId = uuidv4().substring(0, 12);
    localStorage.setItem(`draft-${postId}`, JSON.stringify(postData));
    navigate(`/post-article/${postId}/edit`);
  };

  return (
    <Box sx={styles.container}>
      <TextField
        fullWidth
        name="title"
        placeholder="Title"
        value={postData.title}
        onChange={handleInputChange}
        variant="standard"
        sx={styles.titleInput}
      />

      <TextField
        fullWidth
        name="kicker"
        placeholder="Kicker - A brief attention-grabbing subtitle"
        value={postData.kicker}
        onChange={handleInputChange}
        variant="standard"
        sx={styles.kickerInput}
      />

      <Box sx={styles.tagsContainer}>
        {postData.tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onDelete={() => handleDeleteTag(tag)}
            sx={styles.tag}
          />
        ))}
        <TextField
          placeholder="Add tags (press Enter)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={handleTagInputKeyPress}
          variant="standard"
          sx={styles.tagInput}
        />
      </Box>

      <ReactQuill
        value={postData.content}
        onChange={handleEditorChange}
        modules={editorModules}
        formats={editorFormats}
        placeholder="Start writing your story..."
        style={styles.editor}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={postData.isMemberOnly}
            onChange={(e) => setPostData(prev => ({ 
              ...prev, 
              isMemberOnly: e.target.checked 
            }))}
          />
        }
        label="Member-only content"
        sx={styles.memberOnlyToggle}
      />

      <Box sx={styles.publishButtonContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDraft}
          sx={styles.publishButton}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default CreatePost;