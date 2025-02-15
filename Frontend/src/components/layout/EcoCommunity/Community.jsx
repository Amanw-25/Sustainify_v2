import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  CircularProgress,
} from "@mui/material";
import {
  Home,
  Search,
  NotificationsNone,
  Mail,
  BookmarkBorder,
  Person,
  MoreHoriz,
  Twitter,
  PostAdd,
  Explore,
  Group,
  Verified,
  Favorite,
  ChatBubble,
  Repeat,
  Share,
} from "@mui/icons-material";
import { BASE_URL } from "../../../config.js";
import { useTheme, useMediaQuery } from "@mui/material";

const socket = io("http://localhost:5130");

const Community = () => {
  const [selectedTab, setSelectedTab] = useState("For you");
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [user] = useState({
    id: "user123", // This should come from your auth system
    name: "Current User",
    handle: "@currentuser",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
  });

  const sidebarItems = [
    { icon: <Home />, text: "Home", count: null },
    { icon: <Explore />, text: "Explore", count: null },
    { icon: <NotificationsNone />, text: "Notifications", count: 15 },
    { icon: <Mail />, text: "Messages", count: null },
    { icon: <BookmarkBorder />, text: "Bookmarks", count: null },
    { icon: <Group />, text: "Communities", count: null },
    { icon: <Verified />, text: "Premium", count: null },
    { icon: <Person />, text: "Profile", count: null },
    { icon: <MoreHoriz />, text: "More", count: null },
  ];

  const [posts, setPosts] = useState([]);

  const trends = [
    {
      category: "Trending in India",
      tag: "#नमामि_माँ_सदकलेश्वरी",
      posts: "15K posts",
    },
    { category: "Politics · Trending", tag: "F-35", posts: "31.3K posts" },
    {
      category: "Trending in India",
      tag: "#DisasterLaila",
      posts: "61.3K posts",
    },
    { category: "Trending in India", tag: "#CancerVaccine", posts: null },
  ];

  useEffect(() => {
    // Join community room
    socket.emit("join-community", user.id);

    // Fetch initial posts
    fetch(`${BASE_URL}/community/getallpost`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });

    // Socket event listeners
    socket.on("new-post", (data) => {
      setPosts((prevPosts) => [data.post, ...prevPosts]);
    });

    socket.on("post-like-update", (data) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === data.postId ? { ...post, likes: data.likes } : post
        )
      );
    });

    socket.on("new-comment", (data) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === data.postId ? { ...post, comments: data.comments } : post
        )
      );
    });

    return () => {
      socket.off("new-post");
      socket.off("post-like-update");
      socket.off("new-comment");
    };
  }, [user.id]);

  const handleSubmitPost = async () => {
    if (newPost.trim()) {
      try {
        const response = await fetch(
          `${BASE_URL}/community/createpost`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: newPost,
              userId: user.id,
            }),
          }
        );

        if (!response.ok) throw new Error("Failed to create post");

        setNewPost("");
      } catch (error) {
        console.error("Error creating post:", error);
        console.log(error.message);
      }
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await fetch("http://localhost:3030/api/v1/sustainify/community/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userId: user.id,
        }),
      });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCommentPost = async (postId, comment) => {
    try {
      await fetch("http://localhost:3030/api/v1/sustainify/community/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userId: user.id,
          comment,
        }),
      });
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "white",
        maxWidth: "1440px",
        mx: "auto",
        overflow: "hidden",
      }}
    >
      {!isMobile && (
        <Box
          sx={{
            width: isTablet ? 80 : 275,
            height: "100vh",
            borderRight: 1,
            borderColor: "divider",
            position: "sticky",
            top: 0,
            left: 0,
            p: 2,
            overflowY: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <IconButton sx={{ mb: 2 }}>
            <Twitter color="primary" />
          </IconButton>

          <List>
            {sidebarItems.map((item, index) => (
              <ListItem
                button
                key={index}
                sx={{
                  borderRadius: 28,
                  mb: 1,
                  "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
                  transition: "all 0.2s",
                }}
              >
                <ListItemIcon>
                  {item.count ? (
                    <Badge badgeContent={item.count} color="primary">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                {!isTablet && (
                  <ListItemText
                    primary={<Typography variant="h6">{item.text}</Typography>}
                  />
                )}
              </ListItem>
            ))}
          </List>

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              borderRadius: 28,
              p: 1.5,
              textTransform: "none",
              fontSize: "1.1rem",
              boxShadow: 2,
              "&:hover": { boxShadow: 4 },
            }}
          >
            {isTablet ? <PostAdd /> : "Post"}
          </Button>
        </Box>
      )}

      {/* Rest of the JSX remains exactly the same */}
      <Box
        sx={{
          flexGrow: 1,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          borderRight: 1,
          borderLeft: 1,
          borderColor: "divider",
        }}
      >
        {/* Header section */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "white",
            position: "sticky",
            top: 0,
            zIndex: 10,
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
          }}
        >
          {/* Tabs */}
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
              <Button
                onClick={() => setSelectedTab("For you")}
                sx={{
                  color:
                    selectedTab === "For you"
                      ? "text.primary"
                      : "text.secondary",
                  borderBottom: selectedTab === "For you" ? 2 : 0,
                  borderColor: "primary.main",
                  borderRadius: 0,
                  px: 4,
                  transition: "all 0.2s",
                }}
              >
                For you
              </Button>
              <Button
                onClick={() => setSelectedTab("Following")}
                sx={{
                  color:
                    selectedTab === "Following"
                      ? "text.primary"
                      : "text.secondary",
                  borderBottom: selectedTab === "Following" ? 2 : 0,
                  borderColor: "primary.main",
                  borderRadius: 0,
                  px: 4,
                  transition: "all 0.2s",
                }}
              >
                Following
              </Button>
            </Box>
          </Box>

          {/* New post input */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Avatar src={user.avatar} sx={{ width: 48, height: 48 }} />
              <Box sx={{ flexGrow: 1 }}>
                <TextField
                  fullWidth
                  placeholder="What is happening?!"
                  variant="standard"
                  multiline
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size="small"
                      sx={{ "&:hover": { color: "primary.main" } }}
                    >
                      <PostAdd />
                    </IconButton>
                  </Box>
                  <Button
                    variant="contained"
                    sx={{
                      borderRadius: 28,
                      textTransform: "none",
                      px: 4,
                      "&:disabled": {
                        bgcolor: "rgba(0, 0, 0, 0.08)",
                      },
                    }}
                    onClick={handleSubmitPost}
                    disabled={!newPost.trim()}
                  >
                    Post
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Posts feed */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <Box sx={{ p: 2 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              posts.map((post) => (
                <Card
                  key={post._id || post.id}
                  sx={{
                    mb: 2,
                    boxShadow: "none",
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.01)",
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <Avatar
                        src={post.userId?.avatar || user.avatar}
                        sx={{ width: 48, height: 48 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          component="span"
                          sx={{
                            fontWeight: "bold",
                            mr: 1,
                            "&:hover": {
                              textDecoration: "underline",
                              cursor: "pointer",
                            },
                          }}
                        >
                          {post.userId?.name || post.user}
                        </Typography>
                        <Typography
                          variant="body2"
                          component="span"
                          color="text.secondary"
                        >
                          {post.userId?.handle || post.handle} · {post.time}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {post.content}
                    </Typography>
                    {post.image && (
                      <CardMedia
                        component="img"
                        image={post.image}
                        alt="Post image"
                        sx={{
                          borderRadius: 2,
                          mb: 2,
                          height: 300,
                          objectFit: "cover",
                          transition: "all 0.3s",
                          "&:hover": {
                            filter: "brightness(0.95)",
                          },
                        }}
                      />
                    )}
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 1 }}>
                    <IconButton
                      size="small"
                      sx={{ "&:hover": { color: "primary.main" } }}
                    >
                      <ChatBubble />
                      <Typography sx={{ ml: 1 }}>
                        {post.comments?.length || post.comments || 0}
                      </Typography>
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ "&:hover": { color: "green" } }}
                    >
                      <Repeat />
                      <Typography sx={{ ml: 1 }}>
                        {post.retweets?.length || post.retweets || 0}
                      </Typography>
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ "&:hover": { color: "red" } }}
                      onClick={() => handleLikePost(post._id || post.id)}
                    >
                      <Favorite />
                      <Typography sx={{ ml: 1 }}>
                        {post.likes?.length || post.likes || 0}
                      </Typography>
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ "&:hover": { color: "primary.main" } }}
                    >
                      <Share />
                    </IconButton>
                  </CardActions>
                </Card>
              ))
            )}
          </Box>
        </Box>
      </Box>

      {/* Right sidebar */}
      {!isMobile && (
        <Box
          sx={{
            width: 350,
            height: "100vh",
            position: "sticky",
            top: 0,
            right: 0,
            p: 2,
            overflowY: "auto",
            mr: 2,
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <TextField
            fullWidth
            placeholder="Search"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 28,
                bgcolor: "grey.100",
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "grey.200",
                },
              },
            }}
          />

          <Paper
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 4,
              transition: "all 0.2s",
              "&:hover": { boxShadow: 2 },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Subscribe to Premium
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Subscribe to unlock new features and if eligible, receive a share
              of revenue.
            </Typography>
            <Button
              variant="contained"
              sx={{
                borderRadius: 28,
                textTransform: "none",
                boxShadow: 2,
                "&:hover": { boxShadow: 4 },
              }}
            >
              Subscribe
            </Button>
          </Paper>

          <Paper
            sx={{
              p: 2,
              borderRadius: 4,
              transition: "all 0.2s",
              "&:hover": { boxShadow: 2 },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Trends for you
            </Typography>
            {trends.map((trend, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {trend.category}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {trend.tag} · {trend.posts}
                </Typography>
              </Box>
            ))}

            <Button
              variant="text"
              sx={{
                textTransform: "none",
                color: "primary.main",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Show more
            </Button>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default Community;
