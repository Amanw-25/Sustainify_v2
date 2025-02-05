import {Meeting} from '../../models/index.js';
// Create a new meeting
export const createMeeting = async (req, res) => {
  try {
    const { topic, description } = req.body;
    const meetingId = `meeting-${Date.now()}`; // Generate unique meeting ID
    const newMeeting = new Meeting({
      meetingId,
      topic,
      description,
      status: 'pending',
      startTime: null,
      endTime: null,
    });

    await newMeeting.save();
    res.status(201).json({ meetingId, message: 'Meeting created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating meeting', error });
  }
};

// Join a meeting (add participant)
export const joinMeeting = async (req, res) => {
  try {
    const { meetingId, userId, userName } = req.body;
    const meeting = await Meeting.findOne({ meetingId });
    
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    
    // Check if user is already in the meeting
    const isUserAlreadyJoined = meeting.participants.some(participant => participant.userId.toString() === userId.toString());
    if (isUserAlreadyJoined) {
      return res.status(400).json({ message: 'User already in the meeting' });
    }

    // Add participant
    const newParticipant = {
      userId,
      userName,
      joinedAt: new Date(),
      isHost: meeting.participants.length === 0, // First user becomes the host
    };
    meeting.participants.push(newParticipant);
    await meeting.save();

    res.status(200).json({ message: 'Joined the meeting', meeting });
  } catch (error) {
    res.status(500).json({ message: 'Error joining the meeting', error });
  }
};

// Start a meeting
export const startMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const meeting = await Meeting.findOne({ meetingId });

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Check if there are participants
    if (meeting.participants.length === 0) {
      return res.status(400).json({ message: 'Cannot start a meeting without participants' });
    }

    // Update meeting status and start time
    meeting.status = 'ongoing';
    meeting.startTime = new Date();
    await meeting.save();

    res.status(200).json({ message: 'Meeting started successfully', meeting });
  } catch (error) {
    res.status(500).json({ message: 'Error starting the meeting', error });
  }
};

// End a meeting
export const endMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const meeting = await Meeting.findOne({ meetingId });

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Update meeting status and end time
    meeting.status = 'ended';
    meeting.endTime = new Date();

    // Mark participants who left
    meeting.participants.forEach(participant => {
      if (!participant.leftAt) {
        participant.leftAt = new Date();
      }
    });

    await meeting.save();
    res.status(200).json({ message: 'Meeting ended successfully', meeting });
  } catch (error) {
    res.status(500).json({ message: 'Error ending the meeting', error });
  }
};

// Get meeting details
export const getMeetingDetails = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const meeting = await Meeting.findOne({ meetingId });

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    res.status(200).json({ meeting });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meeting details', error });
  }
};
