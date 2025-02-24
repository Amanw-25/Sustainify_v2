import {Badge} from "../../models/index.js";

export const getUserBadges = async (req, res) => {
  const userId=req.userId;
  try {
    const badges = await Badge.find({ user: userId});
    if(!badges){
      return res.status(404).json({error:"Badges not found"});
    }
    res.status(200).json({ badges });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch badges" });
  }
};

export const getBadgeById = async (req, res) => {
  const badgeId=req.params.badgeId;
  try{
    const badge = await Badge.findById(badgeId);
    if(!badge){
      return res.status(404).json({error:"Badge not found"});
    }
    res.status(200).json({ badge });

  }
  catch(error){
    res.status(500).json({ error: "Failed to fetch badge" });
  }
}