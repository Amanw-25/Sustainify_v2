import React, { useState } from 'react';
import { FaHeart, FaShare, FaHandsClapping, FaBookmark } from 'react-icons/fa6'; // Corrected icons
import { Typography, IconButton, Divider } from '@mui/material';
import { FaStar } from 'react-icons/fa'; 
const ArticleDetails = () => {
  const [likes, setLikes] = useState(124); // Dummy likes count
  const [claps, setClaps] = useState(89); // Dummy claps count

  // Modified static article data
  const article = {
    title: "The Future of Sustainability in Tech",
    subtitle: "Innovative Solutions for a Greener Tomorrow",
    kicker: "How technology is shaping a sustainable future.",
    author: "John Doe",
    publishedDate: "2025-01-27",
    images: [
      "https://images.unsplash.com/photo-1506748686215-33b1bcd8a9e6?w=800",
      "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*0hbbA5oYhu17VDnUc7Ff-g.gif"
    ],
    content: `
      <p>The tech industry is making significant strides toward sustainability. From the shift to renewable energy sources to the creation of more efficient devices, the future of sustainability in tech is bright. In this article, we explore the role of technology in promoting a sustainable future.</p>
      <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*0hbbA5oYhu17VDnUc7Ff-g.gif" alt="Renewable Energy" style="width: 100%; height: auto; margin: 24px 0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" />
      <h2>Why Sustainability Matters</h2>
      <p>As the global population continues to grow, the demand for energy, food, and resources increases. The technology industry plays a pivotal role in addressing these challenges by creating innovations that reduce waste and conserve energy.</p>
      <h3>Technological Innovations Driving Change</h3>
      <ul>
        <li>Renewable Energy Solutions</li>
        <li>Energy-Efficient Devices</li>
        <li>Sustainable Manufacturing Practices</li>
      </ul>
      <blockquote style="background: #f9fafb; padding: 16px; border-left: 4px solid #3b82f6; font-style: italic; margin: 24px 0;">
        "Technology can either be the problem or part of the solution for sustainability."
      </blockquote>
      <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*0hbbA5oYhu17VDnUc7Ff-g.gif" alt="Sustainable Tech" style="width: 100%; height: auto; margin: 24px 0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" />
      <p>As we move forward, the integration of sustainable practices into tech development will be essential to ensure a greener tomorrow. With continued innovation, we can achieve a balance between technology and sustainability.</p>
    `,
    tags: ['Sustainability', 'Technology', 'Innovation'],
    rating: 4.8,
  };

  // Handle like button click
  const handleLike = () => {
    setLikes((prev) => prev + 1);
  };

  // Handle clap button click
  const handleClap = () => {
    setClaps((prev) => prev + 1);
  };

  return (
    <section style={{ background: '#f9fafb', padding: '60px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Article Header */}
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
  <FaStar style={{ color: '#F6BE14', fontSize: '24px', marginRight: '8px' }} />
  Member only story
</span>

        <Divider style={{ margin: '16px 0' }} />
        <div style={{ textAlign: 'left', marginBottom: '32px' }}>
          <Typography variant="h1" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            
            {article.title}
          </Typography>
          <Typography variant="h3" style={{ color: '#6b7280', marginBottom: '16px' }}>
            {article.subtitle}
          </Typography>
          <Typography variant="subtitle1" style={{ color: '#6b7280' }}>
            By {article.author} | {article.publishedDate}
          </Typography>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            {article.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  background: '#e5e7eb',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '14px',
                  color: '#374151',
                  marginRight: '8px',
                  
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Social Actions at the Top */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', marginTop: '16px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <IconButton color="primary" onClick={handleLike} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaHeart style={{ color: '#ef4444' }} />
              <Typography variant="body1">{likes}</Typography>
            </IconButton>
            <IconButton color="primary" onClick={handleClap} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaHandsClapping style={{ color: '#3b82f6' }} />
              <Typography variant="body1">{claps}</Typography>
            </IconButton>
          </div>




          <div style={{ display: 'flex', gap: '16px' }}>
            <IconButton color="primary">
              <FaShare style={{ color: '#6b7280' }} />
            </IconButton>
            <IconButton color="primary">
              <FaBookmark style={{ color: '#6b7280' }} />
            </IconButton>
          </div>
          
        </div>

        {/* Article Images */}
        <div style={{ marginBottom: '32px' }}>
          {article.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Article Image ${index + 1}`}
              style={{ width: '50%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '24px' }}
            />
          ))}
        </div>

        {/* Article Content */}
        <div
          dangerouslySetInnerHTML={{ __html: article.content }}
          style={{ lineHeight: '1.6', fontSize: '18px' }}
        />

        {/* Social Sharing and Tags */}

      </div>
    </section>
  );
};

export default ArticleDetails;
