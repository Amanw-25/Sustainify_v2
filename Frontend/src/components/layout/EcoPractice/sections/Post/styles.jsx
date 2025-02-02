// src/components/blog/styles.js
export const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '"Georgia", serif',
    borderRadius: '8px',
  },
  titleInput: {
    '& input': {
      fontSize: '40px',
      fontWeight: 'bold',
      fontFamily: '"Georgia", serif',
    },
    marginBottom: '20px',
  },
  kickerInput: {
    '& input': {
      fontSize: '24px',
      fontFamily: '"Georgia", serif',
    },
    marginBottom: '20px',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '20px',
  },
  tag: {
    borderRadius: '16px',
  },
  tagInput: {
    minWidth: '200px',
  },
  editor: {
    height: '500px',
    marginBottom: '20px',
    '& .ql-container': {
      fontSize: '18px',
      lineHeight: '1.8',
    },
  },
  memberOnlyToggle: {
    marginTop: '20px',
  },
  publishButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
  publishButton: {
    borderRadius: '20px',
    padding: '10px 30px',
    fontWeight: 'bold',
    textTransform: 'none',
    fontSize: '16px',
  },
  previewContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  previewTitle: {
    marginBottom: '24px',
  },
  previewContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  imageSection: {
    marginBottom: '24px',
  },
  previewImg: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  imageButton: {
    marginTop: '12px',
  },
  topicsSection: {
    marginTop: '24px',
  },
  topicsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '12px',
  },
  topicChip: {
    borderRadius: '16px',
  },
  topicInput: {
    minWidth: '150px',
  },
};
