import React, { useState, useEffect } from "react";
import {
  Typography,
  IconButton,
  Divider,
  Button,
  useMediaQuery,
} from "@mui/material";
import {
  FaHeart,
  FaShare,
  FaHandsClapping,
  FaBookmark,
  FaStar,
  FaArrowLeft,
} from "react-icons/fa6";
import { BASE_URL } from "../../../../../config.js";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../../../../Loader/Loading.jsx";
import CommentSection from "./comment";
import SubscriptionPlans from "./SubscriptionPlans.jsx";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 960px)");
  const [article, setArticle] = useState(null);
  const [likes, setLikes] = useState(0);
  const [claps, setClaps] = useState(0);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${BASE_URL}/user/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setIsMember(data.user.isMember);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchArticleDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/blog/getSingleBlogPost/${id}`);
        const data = await response.json();
        if (data.success && data.data) {
          setArticle(data.data);
          setLikes(data.data.likes || 0);
          setClaps(0);
        }
      } catch (err) {
        console.error("Error fetching article", err);
      }
    };

    fetchUserData();
    if (id) fetchArticleDetails();
  }, [id]);

  const handleLike = () => setLikes((prev) => prev + 1);
  const handleClap = () => setClaps((prev) => prev + 1);

  const handleShareClick = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success("Blog URL copied to clipboard!"))
      .catch(() => toast.error("Failed to copy URL"));
  };

  const handleSavedClick = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to save this blog");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/blog/saveBlog?blogId=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      data.success ? toast.success(data.message) : toast.error(data.message);
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("Error saving blog");
    }
  };

  if (!article) return <Loader />;

  return (
    <section style={{ background: "white", padding: "60px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {isSmallScreen && (
          <Button
            startIcon={<FaArrowLeft />}
            onClick={() => navigate("/blog")}
            sx={{ marginBottom: 2 }}
          >
            Back
          </Button>
        )}

        {article.isMemberOnly && (
          <Typography
            variant="body1"
            sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}
          >
            <FaStar color="#F6BE14" size={20} style={{ marginRight: 8 }} />
            Member only story
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h1" fontWeight="bold" >
          {article.title || "No title available"}
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
          {article.kicker || "No subtitle available"}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          By {article.author.name || "Unknown author"} |{" "}
          {new Date(article.createdAt).toLocaleDateString() || "Unknown date"} |{" "}
          {article.readTime || "N/A"} min read
        </Typography>

        {article.tags?.length > 0 && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            {article.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  background: "#e0e0e0",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  color: "#555",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", gap: "16px" }}>
            <IconButton color="primary" onClick={handleLike}>
              <FaHeart color="#ef4444" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {likes}
              </Typography>
            </IconButton>
            <IconButton color="primary" onClick={handleClap}>
              <FaHandsClapping color="#3b82f6" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {claps}
              </Typography>
            </IconButton>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <IconButton color="primary" onClick={handleShareClick}>
              <FaShare color="#6b7280" />
            </IconButton>
            <IconButton color="primary" onClick={handleSavedClick}>
              <FaBookmark color="#6b7280" />
            </IconButton>
          </div>
        </div>

        {article.previewImage && (
          <img
            src={article.previewImage}
            alt="Preview"
            style={{
              width: "100%",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              marginBottom: "24px",
            }}
          />
        )}

        <div
          style={{
            lineHeight: "1.6",
            fontSize: "18px",
            position: "relative",
            maxHeight: article.isMemberOnly && !isMember ? "600px" : "none",
            overflow: article.isMemberOnly && !isMember ? "hidden" : "visible",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: article.content || "No content available" }} />
          {article.isMemberOnly && !isMember && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "200px",
                background: "linear-gradient(to bottom, transparent, white)",
                textAlign: "center",
              }}
            />
          )}
        </div>

        {article.isMemberOnly && !isMember && <SubscriptionPlans />}
        <CommentSection blogId={id}/>
      </div>
    </section>
  );
};

export default BlogDetails;
