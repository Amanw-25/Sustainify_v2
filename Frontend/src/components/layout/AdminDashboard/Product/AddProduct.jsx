import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Stack,
} from "@mui/material";
import { Delete, Edit, Add, CloudUpload } from "@mui/icons-material";
import Sidebar from "../Global/Sidebar";
import { BASE_URL } from "../../../../config.js";

const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    shortdescription: "",
    description: "",
    specifications: "",
    price: "",
    carbonFootprint: "",
    stock: "",
    category: "",
    deliveryEstimate: "2-3 Business Days",
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/product/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to fetch products");
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
  
    if (files.length + previewImages.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
  
    const newPreviews = files.map(file => URL.createObjectURL(file));
  
    setForm(prev => ({
      ...prev,
      images: [...prev.images, ...files], // Append new images instead of replacing
    }));
  
    setPreviewImages(prev => [...prev, ...newPreviews]); // Append previews
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEdit = async (product) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/product/update/${product._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch product details");
  
      setForm({
        name: data.product.name,
        shortdescription: data.product.shortdescription,
        description: data.product.description,
        specifications: Array.isArray(data.product.specifications)
          ? data.product.specifications.join("\n") // ✅ Convert array to multi-line string
          : "",
        price: data.product.price,
        carbonFootprint: data.product.carbonFootprint,
        stock: data.product.stock,
        category: data.product.category,
        deliveryEstimate: data.product.deliveryEstimate,
        images: data.images || [],
      });
  
      setPreviewImages(data.product.images?.map((img) => img.url) || []);
  
      setEditingProduct(data.product);
      setOpenModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const handleDelete = async () => {
    if (!deleteConfirmation.id) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/product/delete/${deleteConfirmation.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to delete product");

      setProducts(
        products.filter((product) => product._id !== deleteConfirmation.id)
      );
      setDeleteConfirmation({ open: false, id: null });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!form.name || !form.shortdescription || !form.description || !form.price || !form.category) {
      setError("All required fields must be filled!");
      return;
    }
  
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "images") {
          form.images.forEach((image) => {
            formData.append("images", image);
          });
        } else if (key === "specifications") {
          // ✅ Convert multi-line text into an array
          const specs = form.specifications.split("\n").map((spec) => spec.trim()).filter(Boolean);
          formData.append("specifications", JSON.stringify(specs));
        } else {
          formData.append(key, form[key]);
        }
      });
  
      const response = await fetch(
        editingProduct ? `${BASE_URL}/product/update/${editingProduct._id}` : `${BASE_URL}/product/create`,
        {
          method: editingProduct ? "PUT" : "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Operation failed");
  
      fetchProducts();
      resetForm();
      setOpenModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  const resetForm = () => {
    setForm({
      name: "",
      shortdescription: "",
      description: "",
      specifications: "",
      price: "",
      carbonFootprint: "",
      stock: "",
      category: "",
      deliveryEstimate: "2-3 Business Days",
      images: [],
    });
    setPreviewImages([]);
    setEditingProduct(null);
    setError(null);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f6f9" }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h2" fontWeight="bold" color="primary">
            Products
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpenModal(true)}
          >
            Add Product
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper} sx={{borderRadius: 3}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{backgroundColor: "#3B82F6" ,color:"white"}}>Images</TableCell>
                  <TableCell sx={{backgroundColor: "#3B82F6" ,color:"white"}}>Name</TableCell>
                  <TableCell sx={{backgroundColor: "#3B82F6" ,color:"white"}}>Price</TableCell>
                  <TableCell sx={{backgroundColor: "#3B82F6" ,color:"white"}}>Stock</TableCell>
                  <TableCell sx={{backgroundColor: "#3B82F6" ,color:"white"}}>Category</TableCell>
                  <TableCell sx={{backgroundColor: "#3B82F6" ,color:"white"}}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {product.images.slice(0, 3).map((image, index) => (
                          <img
                            key={index}
                            src={image.url}
                            alt={`${product.name}-${index}`}

                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "cover",
                            }}
                          />
                        ))}
                        {product.images.length > 3 && (
                          <Typography variant="caption">
                            +{product.images.length - 3}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(product)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() =>
                            setDeleteConfirmation({
                              open: true,
                              id: product._id,
                            })
                          }
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  fullWidth
                >
                  Upload Images (Max 5)
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Grid>

              {previewImages.length > 0 && (
                <Grid item xs={12}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ overflowX: "auto", py: 2 }}
                  >
                    {previewImages.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{ width: 100, height: 100, objectFit: "cover" }}
                      />
                    ))}
                  </Stack>
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock"
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Short Description"
                  name="shortdescription"
                  value={form.shortdescription}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Specifications (one per line)"
                  name="specifications"
                  value={form.specifications}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  placeholder="Enter each specification on a new line"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Carbon Footprint"
                  name="carbonFootprint"
                  type="number"
                  value={form.carbonFootprint}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Delivery Estimate"
                  name="deliveryEstimate"
                  value={form.deliveryEstimate}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : editingProduct ? (
                "Update"
              ) : (
                "Add"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteConfirmation.open}
          onClose={() => setDeleteConfirmation({ open: false, id: null })}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this product?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteConfirmation({ open: false, id: null })}
            >
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AddProduct;
