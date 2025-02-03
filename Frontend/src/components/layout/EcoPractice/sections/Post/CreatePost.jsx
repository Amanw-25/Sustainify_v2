import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Button,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Chip,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { editorModules, editorFormats } from "./editorConfig";
import { styles } from "./styles.jsx";

const CreatePost = () => {
  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    title: "",
    kicker: "",
    content: "",
    isMemberOnly: false,
    tags: [],
    previewImage: null,
  });
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  let draftId = localStorage.getItem("draft-id");

  useEffect(() => {
    if (draftId) {
      const savedDraft = JSON.parse(localStorage.getItem(draftId));
      if (savedDraft) {
        setPostData(savedDraft);
      }
    }
  }, []);

  const validateFields = () => {
    const newErrors = {};
    let errorMessage = [];

    if (!postData.title.trim()) {
      newErrors.title = true;
      errorMessage.push("Title");
    }
    if (!postData.kicker.trim()) {
      newErrors.kicker = true;
      errorMessage.push("Kicker");
    }
    if (!postData.content.trim() || postData.content === '<p><br></p>') {
      newErrors.content = true;
      errorMessage.push("Content");
    }
    if (postData.tags.length === 0) {
      newErrors.tags = true;
      errorMessage.push("Tags");
    }

    setErrors(newErrors);
    return { isValid: errorMessage.length === 0, errorMessage };
  };

  const handleEditorChange = (value) => {
    setPostData((prev) => ({ ...prev, content: value }));
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setPostData((prev) => ({
        ...prev,
        tags: [...new Set([...prev.tags, tagInput.trim()])],
      }));
      setTagInput("");
      if (errors.tags) {
        setErrors((prev) => ({ ...prev, tags: false }));
      }
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setPostData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const handleSaveDraft = () => {
    draftId = localStorage.getItem("draft-id");
    if (!draftId) {
      draftId = uuidv4().substring(0, 12);
      localStorage.setItem("draft-id", draftId);
    }
    localStorage.setItem(draftId, JSON.stringify(postData));
  };

  const handleNext = () => {
    const { isValid, errorMessage } = validateFields();
    
    if (isValid) {
      navigate(`/post-article/${draftId}/preview`);
    } else {
      setShowValidationAlert(true);
      setTimeout(() => setShowValidationAlert(false), 5000);
    }
  };

  return (
    <Box sx={styles.container}>
      {showValidationAlert && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Please fill in all required fields: {errors && Object.keys(errors).length > 0 && 
          Object.keys(errors).filter(key => errors[key]).join(", ")}
        </Alert>
      )}

      <TextField
        required
        fullWidth
        name="title"
        placeholder="Title"
        value={postData.title}
        onChange={handleInputChange}
        variant="standard"
        error={errors.title}
        helperText={errors.title ? "Title is required" : ""}
        sx={styles.titleInput}
      />

      <TextField
        required
        fullWidth
        name="kicker"
        placeholder="Kicker - A brief attention-grabbing subtitle"
        value={postData.kicker}
        onChange={handleInputChange}
        variant="standard"
        error={errors.kicker}
        helperText={errors.kicker ? "Kicker is required" : ""}
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
          required
          placeholder="Add tags (press Enter)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={handleTagInputKeyPress}
          variant="standard"
          error={errors.tags}
          helperText={errors.tags ? "At least one tag is required" : ""}
          sx={styles.tagInput}
        />
      </Box>

      <Box sx={{ border: errors.content ? '1px solid #d32f2f' : 'none', borderRadius: 1, mb: 1 }}>
        <ReactQuill
          value={postData.content}
          onChange={handleEditorChange}
          modules={editorModules}
          formats={editorFormats}
          placeholder="Start writing your story... (required)"
          style={styles.editor}
        />
      </Box>
      {errors.content && (
        <Box sx={{ color: '#d32f2f', fontSize: '0.75rem', ml: 2, mt: 0.5 }}>
          Content is required
        </Box>
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={postData.isMemberOnly}
            onChange={(e) =>
              setPostData((prev) => ({
                ...prev,
                isMemberOnly: e.target.checked,
              }))
            }
          />
        }
        label="Member-only content"
        sx={styles.memberOnlyToggle}
      />

      <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2}}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveDraft}
          sx={styles.saveDraftButton}
        >
          Save Draft
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          sx={styles.publishButton}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default CreatePost;