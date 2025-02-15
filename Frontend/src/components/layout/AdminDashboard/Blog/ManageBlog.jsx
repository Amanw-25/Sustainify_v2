import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Tooltip,
  IconButton,
  Drawer,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import Sidebar from "../Global/Sidebar";
import { BASE_URL } from "../../../../config.js";

const ManageBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  const token = localStorage.getItem("token");
  const isMobile = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    if (token) fetchBlogs();
  }, [token]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${BASE_URL}/blog/getBlogPosts`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || "Failed to fetch blogs");

      setBlogs(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (blogId) => {
    setSelectedBlogId(blogId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    if (!selectedBlogId) return;

    try {
      const response = await fetch(`${BASE_URL}/blog/deleteBlogPost/${selectedBlogId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete blog");

      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== selectedBlogId));
      toast.success("Blog deleted successfully");
    } catch (err) {
      toast.error(err.message);
      console.log("Error deleting blog:", err);
    } finally {
      setSelectedBlogId(null);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f6f9" }}>
      {isMobile && (
        <IconButton
          onClick={() => setSidebarOpen(true)}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 10,
            backgroundColor: "white",
            boxShadow: 2,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {!isMobile && (
        <Box sx={{ width: "250px" }}>
          <Sidebar />
        </Box>
      )}

      <Drawer anchor="left" open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <Sidebar />
      </Drawer>

      <Box sx={{ flex: 1, p: 3, width: "100%" }}>
        <Typography
          variant={isMobile ? "h4" : "h2"}
          fontWeight="bold"
          color="primary"
          sx={{ mb: 3, textAlign: isMobile ? "center" : "left" }}
        >
          Manage Blogs
        </Typography>

        {error && <Typography color="error">{error}</Typography>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : blogs.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: "center", mt: 5, color: "gray" }}>
            No blogs found.
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: 2,
              boxShadow: 3,
              overflowX: "auto",
            }}
          >
            <Table stickyHeader>
              <TableHead sx={{ backgroundColor: "#3B82F6" }}>
                <TableRow>
                  {["Title", "Author", "Date", "Actions"].map((head) => (
                    <TableCell
                      key={head}
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#3B82F6",
                        zIndex: 2,
                        minWidth: isMobile ? "150px" : "auto",
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {blogs.map(({ _id, title, author, createdAt }) => (
                  <TableRow key={_id} hover>
                    <TableCell>
                      <Tooltip title={title}>
                        <span>{title.length > 30 ? `${title.slice(0, 30)}...` : title}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{author.name}</TableCell>
                    <TableCell>{new Date(createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDeleteClick(_id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this blog? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageBlog;
