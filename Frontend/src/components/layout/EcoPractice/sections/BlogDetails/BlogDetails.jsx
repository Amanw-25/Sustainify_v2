import React, { useState, useEffect } from "react";
import { FaHeart, FaShare, FaHandsClapping, FaBookmark } from "react-icons/fa6";
import { Typography, IconButton, Divider } from "@mui/material";
import { BASE_URL } from "../../../../../config.js";
import { FaStar } from "react-icons/fa";
import CommentSection from "./comment";
import Disclamier from "./Disclamier";
import { useParams } from "react-router-dom";

const BlogDetails = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [likes, setLikes] = useState(0);
  const [claps, setClaps] = useState(0);

  useEffect(() => {
    const fetchArticleDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/blog/getSingleBlogPost/${id}`);
        const data = await response.json();
        if (data.success && data.data) {
          const articleData = data.data;
          setArticle(articleData);
          setLikes(articleData.likes || 0);
          setClaps(0); // Reset claps if no initial data available
        }
      } catch (err) {
        console.error("Error fetching article", err);
      }
    };
    if (id) {
      fetchArticleDetails();
    }
  }, [id]);

  const handleLike = () => {
    setLikes((prev) => prev + 1);
  };

  const handleClap = () => {
    setClaps((prev) => prev + 1);
  };

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <section style={{ background: "white", padding: "60px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {article.isMemberOnly && (
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            <FaStar style={{ color: "#F6BE14", fontSize: "24px", marginRight: "8px" }} />
            Member only story
          </span>
        )}

        <Divider style={{ margin: "16px 0" }} />
        <div style={{ textAlign: "left", marginBottom: "32px" }}>
          <Typography variant="h1" style={{ fontWeight: "bold", marginBottom: "8px" }}>
            {article.title || "No title available"}
          </Typography>
          <Typography variant="h3" style={{ color: "#6b7280", marginBottom: "16px" }}>
            {article.kicker || "No subtitle available"}
          </Typography>
          <Typography variant="subtitle1" style={{ color: "#6b7280" }}>
            By {article.author.name || "Unknown author"} | {new Date(article.createdAt).toLocaleDateString() || "Unknown date"} | {article.readTime || "N/A"} min read
          </Typography>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            {article.tags && article.tags.length > 0 ? (
              article.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    background: "#B9B1AF",
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    fontSize: "14px",
                    color: "#374151",
                    marginRight: "8px",
                  }}
                >
                  {tag}
                </span>
              ))
            ) : (
              <span>No tags available</span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", marginTop: "16px" }}>
          <div style={{ display: "flex", gap: "16px" }}>
            <IconButton color="primary" onClick={handleLike} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FaHeart style={{ color: "#ef4444" }} />
              <Typography variant="body1">{likes}</Typography>
            </IconButton>
            <IconButton color="primary" onClick={handleClap} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FaHandsClapping style={{ color: "#3b82f6" }} />
              <Typography variant="body1">{claps}</Typography>
            </IconButton>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <IconButton color="primary">
              <FaShare style={{ color: "#6b7280" }} />
            </IconButton>
            <IconButton color="primary">
              <FaBookmark style={{ color: "#6b7280" }} />
            </IconButton>
          </div>
        </div>

        <div style={{ marginBottom: "32px" }}>
          {article.previewImage ? (
            <img
              src={article.previewImage}
              alt="Preview"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                marginBottom: "24px",
              }}
            />
          ) : (
            <div>No preview image available</div>
          )}
        </div>

        <div style={{ lineHeight: "1.6", fontSize: "18px", maxHeight: article.isMemberOnly ? "100px" : "none", overflow: article.isMemberOnly ? "hidden" : "visible", position: "relative" }}>
          <div dangerouslySetInnerHTML={{ __html: article.content || "No content available" }} />
          {article.isMemberOnly && (
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
            ></div>
          )}
        </div>

        {article.isMemberOnly && <Disclamier />}
        <CommentSection />
      </div>
    </section>
  );
};

export default BlogDetails;
