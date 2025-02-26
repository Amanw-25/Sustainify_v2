import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Avatar,
  useMediaQuery,
  useTheme,
  CardMedia,
} from "@mui/material";
import {
  MdBookmark,
  MdAccessTime,
  MdDelete,
  MdShare,
  MdRefresh,
  MdChevronRight,
  MdClose,
  MdNavigateBefore,
  MdNavigateNext,
  MdCategory,
  MdDescription,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../../config";
import { toast } from "react-toastify";

const SavedBlogs = () => {
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const scrollRef = useRef(null);

  const getItemsPerPage = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  const itemsPerPage = getItemsPerPage();
  const totalPages = Math.ceil(savedBlogs.length / itemsPerPage);

  useEffect(() => {
    fetchSavedBlogs();
  }, []);

  useEffect(() => {
    function handleResize() {
      const newItemsPerPage = getItemsPerPage();
      if (newItemsPerPage !== itemsPerPage) {
        const newTotalPages = Math.ceil(savedBlogs.length / newItemsPerPage);
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1);
        }
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [savedBlogs, currentPage, itemsPerPage]);

  const fetchSavedBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/blog/getSavedBlog`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch saved blogs");
      }

      const data = await response.json();

      if (data.success && data.data) {
        setSavedBlogs(data.data || []);
      } else {
        throw new Error(data.message || "Failed to load saved blogs");
      }
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load saved blogs: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (savedBlog) => {
    setSelectedBlog({
      ...savedBlog.blogId,
      savedAt: savedBlog.savedAt,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const navigateToBlogPage = (blogId) => {
    if (blogId) {
      navigate(`/blog/${blogId}`);
      handleCloseDialog();
    } else {
      toast.error("Cannot navigate to blog: Blog ID not found");
    }
  };

  const handleRemoveSaved = async (savedBlogId, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(
        `${BASE_URL}/blog/deleteSavedBlog/${savedBlogId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove blog from saved list");
      }

      const data = await response.json();
      
      setSavedBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog._id !== savedBlogId)
      );

      setOpenDialog(false);
      
      const remainingBlogs = savedBlogs.length - 1;
      const newTotalPages = Math.ceil(remainingBlogs / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages || 1);
      }

      toast.success(data.message || "Blog removed from saved list");
    } catch (err) {
      toast.error("Failed to remove blog: " + err.message);
    }
  };

  const handleShareBlog = (blogId, e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/blog/${blogId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Blog link copied to clipboard"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const handlePageChange = (value) => {
    setCurrentPage(value);
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const getCategoryChip = (category) => {
    const categoryColors = {
      Technology: { bg: "#e3f2fd", color: "#1565c0" },
      Health: { bg: "#e8f5e9", color: "#2e7d32" },
      Lifestyle: { bg: "#fff3e0", color: "#e65100" },
      Business: { bg: "#ede7f6", color: "#4527a0" },
      Science: { bg: "#f3e5f5", color: "#7b1fa2" },
      Travel: { bg: "#e0f7fa", color: "#00796b" },
      Food: { bg: "#fff8e1", color: "#ff8f00" },
      default: { bg: "#f5f5f5", color: "#616161" },
    };

    const style = categoryColors[category] || categoryColors.default;

    return (
      <Chip
        icon={<MdCategory style={{ color: style.color }} />}
        label={category || "General"}
        size="small"
        sx={{
          bgcolor: style.bg,
          color: style.color,
          fontWeight: 500,
          "& .MuiChip-icon": { color: style.color },
        }}
      />
    );
  };

  const getCurrentPageBlogs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return savedBlogs.slice(startIndex, endIndex);
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
          <Button
            variant="contained"
            startIcon={<MdRefresh />}
            onClick={fetchSavedBlogs}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, boxShadow: 3, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ bgcolor: "#3f51b5", mr: 2 }}>
              <MdBookmark />
            </Avatar>
            <Typography
              variant="h4"
              component="h1"
              sx={{ 
                fontWeight: 600, 
                m: 0,
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" } 
              }}
            >
              My Saved Blogs
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<MdRefresh />}
            onClick={fetchSavedBlogs}
            sx={{ 
              bgcolor: "#3f51b5", 
              "&:hover": { bgcolor: "#303f9f" },
              alignSelf: { xs: "flex-end", sm: "auto" }
            }}
          >
            Refresh
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {savedBlogs.length === 0 ? (
          <Paper
            sx={{
              p: { xs: 3, sm: 4 },
              textAlign: "center",
              borderRadius: 2,
              bgcolor: "#f5f5f5",
            }}
          >
            <MdBookmark
              style={{ fontSize: 48, color: "#9e9e9e", marginBottom: 16 }}
            />
            <Typography variant="h6" gutterBottom>
              No saved blogs found
            </Typography>
            <Typography variant="body1" color="textSecondary">
              You haven't saved any blogs yet. Browse our blog section to find
              interesting articles!
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate("/blog")}
            >
              Explore Blogs
            </Button>
          </Paper>
        ) : (
          <Box>
            <Box
              ref={scrollRef}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {(currentPage - 1) * itemsPerPage + 1} -
                {Math.min(currentPage * itemsPerPage, savedBlogs.length)} of{" "}
                {savedBlogs.length} saved blogs
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", alignSelf: { xs: "center", sm: "auto" } }}>
                <IconButton
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    bgcolor: currentPage === 1 ? "#f5f5f5" : "#e3f2fd",
                    color: currentPage === 1 ? "#bdbdbd" : "#1976d2",
                    "&:hover": { bgcolor: "#bbdefb" },
                  }}
                >
                  <MdNavigateBefore />
                </IconButton>

                <Box sx={{ mx: 2, minWidth: "80px", textAlign: "center" }}>
                  <Typography variant="body1" fontWeight={500}>
                    {currentPage} / {totalPages}
                  </Typography>
                </Box>

                <IconButton
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    bgcolor: currentPage === totalPages ? "#f5f5f5" : "#e3f2fd",
                    color: currentPage === totalPages ? "#bdbdbd" : "#1976d2",
                    "&:hover": { bgcolor: "#bbdefb" },
                  }}
                >
                  <MdNavigateNext />
                </IconButton>
              </Box>
            </Box>

            <Grid container spacing={{ xs: 2, md: 3 }}>
              {getCurrentPageBlogs().map((savedBlog) => {
                const blog = savedBlog.blogId;
                const publishDate = blog.publishDate
                  ? new Date(blog.publishDate)
                  : null;
                const isOldPost =
                  publishDate &&
                  new Date() - publishDate > 90 * 24 * 60 * 60 * 1000;

                return (
                  <Grid item xs={12} md={isTablet ? 6 : 4} key={savedBlog._id}>
                    <Card
                      variant="outlined"
                      onClick={() => handleViewDetails(savedBlog)}
                      sx={{
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                          cursor: "pointer",
                        },
                        opacity: isOldPost ? 0.8 : 1,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {blog.previewImage && (
                        <CardMedia
                          component="img"
                          height={isMobile ? "140" : "160"}
                          image={blog.previewImage}
                          alt={blog.title}
                          sx={{ objectFit: "cover" }}
                        />
                      )}

                      <CardContent sx={{ pt: 2, flexGrow: 1 }}>
                        <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {blog.category && getCategoryChip(blog.category)}
                          {isOldPost && (
                            <Chip
                              label="Older Post"
                              size="small"
                              sx={{
                                bgcolor: "#e0e0e0",
                                fontWeight: 500,
                              }}
                            />
                          )}
                        </Box>

                        <Typography
                          variant="h6"
                          component="div"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            minHeight: { xs: "auto", sm: "48px" },
                            fontSize: { xs: "1rem", sm: "1.25rem" }
                          }}
                        >
                          {blog.title || "Untitled Blog"}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            mb: 2,
                            minHeight: { xs: "auto", sm: "4.5em" }
                          }}
                        >
                          {blog.summary || "No summary available"}
                        </Typography>

                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          <MdAccessTime
                            style={{ marginRight: "8px", color: "#666" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {savedBlog.savedAt
                              ? new Date(savedBlog.savedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "Unknown date"}
                          </Typography>
                        </Box>
                      </CardContent>

                      <CardActions
                        sx={{ 
                          justifyContent: "space-between", 
                          px: { xs: 1, sm: 2 }, 
                          pb: { xs: 1, sm: 2 },
                          pt: 0 
                        }}
                      >
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(savedBlog);
                          }}
                          startIcon={<MdDescription />}
                          sx={{ color: "#3f51b5" }}
                        >
                          Preview
                        </Button>

                        <Box>
                          <IconButton
                            size="small"
                            onClick={(e) => handleShareBlog(blog._id, e)}
                            sx={{ color: "#3f51b5", mr: 1 }}
                          >
                            <MdShare />
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={(e) => handleRemoveSaved(savedBlog._id, e)}
                            sx={{ color: "#f44336" }}
                          >
                            <MdDelete />
                          </IconButton>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {!isMobile && savedBlogs.length > itemsPerPage && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    sx={{
                      bgcolor: currentPage === 1 ? "#f5f5f5" : "#e3f2fd",
                      color: currentPage === 1 ? "#bdbdbd" : "#1976d2",
                      "&:hover": { bgcolor: "#bbdefb" },
                      mr: 2,
                    }}
                  >
                    <MdNavigateBefore />
                  </IconButton>

                  <Typography variant="body1" fontWeight={500} sx={{ mx: 3 }}>
                    {currentPage} / {totalPages}
                  </Typography>

                  <IconButton
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    sx={{
                      bgcolor:
                        currentPage === totalPages ? "#f5f5f5" : "#e3f2fd",
                      color: currentPage === totalPages ? "#bdbdbd" : "#1976d2",
                      "&:hover": { bgcolor: "#bbdefb" },
                      ml: 2,
                    }}
                  >
                    <MdNavigateNext />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: { borderRadius: isMobile ? 0 : 2 },
        }}
      >
        {selectedBlog && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: 600, pr: 6 }}
              >
                {selectedBlog.title || "Blog Preview"}
              </Typography>
              <IconButton
                aria-label="close"
                onClick={handleCloseDialog}
                sx={{ position: "absolute", right: 8, top: 8 }}
              >
                <MdClose />
              </IconButton>
            </DialogTitle>

            <Box sx={{ px: 3, pb: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedBlog.category && getCategoryChip(selectedBlog.category)}
              {selectedBlog.publishDate &&
                new Date(selectedBlog.publishDate) <
                  new Date() - 90 * 24 * 60 * 60 * 1000 && (
                  <Chip
                    label="Older Post"
                    size="small"
                    sx={{ bgcolor: "#e0e0e0", fontWeight: 500 }}
                  />
                )}
            </Box>

            {(selectedBlog.previewImage || selectedBlog.coverImage) && (
              <Box sx={{ px: 3, py: 2 }}>
                <img
                  src={selectedBlog.coverImage || selectedBlog.previewImage}
                  alt={selectedBlog.title}
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            )}

            <DialogContent>
              <DialogContentText component="div">
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", mr: 2 }}>
                    <MdAccessTime />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Saved
                    </Typography>
                    <Typography variant="body1">
                      {selectedBlog.savedAt
                        ? new Date(selectedBlog.savedAt).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "Unknown date"}
                    </Typography>
                  </Box>
                </Box>

                {selectedBlog.summary && (
                  <Box
                    sx={{
                      mt: 2,
                      p: { xs: 2, sm: 3 },
                      bgcolor: "#f5f5f5",
                      borderRadius: 2,
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 500, mb: 1 }}
                    >
                      Summary
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedBlog.summary}
                    </Typography>
                  </Box>
                )}

                {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Tags
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {selectedBlog.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{ bgcolor: "#f5f5f5" }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ 
              p: { xs: 2, sm: 3 },
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: { xs: 1, sm: 0 }
            }}>
              <Button
                onClick={(e) => handleRemoveSaved(selectedBlog._id, e)}
                startIcon={<MdDelete />}
                color="error"
                variant="outlined"
                fullWidth={isMobile}
                sx={{ mb: { xs: 1, sm: 0 } }}
              >
                Remove
              </Button>

              <Button
                onClick={(e) => handleShareBlog(selectedBlog._id, e)}
                startIcon={<MdShare />}
                variant="outlined"
                fullWidth={isMobile}
                sx={{ 
                  ml: { xs: 0, sm: 1 }, 
                  mr: { xs: 0, sm: 'auto' },
                  mb: { xs: 1, sm: 0 } 
                }}
              >
                Share
              </Button>

              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                fullWidth={isMobile}
                sx={{ 
                  mr: { xs: 0, sm: 1 },
                  mb: { xs: 1, sm: 0 } 
                }}
              >
                Close
              </Button>

              <Button
                onClick={() => navigateToBlogPage(selectedBlog._id)}
                variant="contained"
                fullWidth={isMobile}
                sx={{ bgcolor: "#3f51b5", "&:hover": { bgcolor: "#303f9f" } }}
                endIcon={<MdChevronRight />}
              >
                Read Full Blog
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default SavedBlogs;