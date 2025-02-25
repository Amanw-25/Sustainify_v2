import React from "react";
import { Card, CardContent, Typography, Box, Grid, Paper, Fade } from "@mui/material";
import { useTheme } from "@mui/material";

import AgendaSection from "./sections/AgendaSection";
import PrizesSection from "./sections/PrizesSection";
import TakeawaysSection from "./sections/TakeawaysSection";
import SpecialNotesSection from "./sections/SpecialNotesSection";
import LocationSection from "./sections/LocationSection";

const EventDetailsCard = ({ event }) => {
  const theme = useTheme();
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.06)",
        bgcolor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        {/* About Section */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: "#1a73e8",
              display: "flex",
              alignItems: "center",
              "&::after": {
                content: '""',
                display: "block",
                height: "2px",
                width: "60px",
                backgroundColor: "#1a73e8",
                marginLeft: "12px",
                borderRadius: "2px",
              },
            }}
          >
            About This Event
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#424242",
              fontSize: "1.1rem",
              lineHeight: 1.7,
              mt: 2,
            }}
          >
            {event.description}
          </Typography>
        </Box>

        {/* Agenda Section */}
        <AgendaSection agenda={event.agenda} theme={theme} />

        {/* Prizes Section */}
        {event.prizes?.length > 0 && <PrizesSection prizes={event.prizes} />}

        {/* Key Takeaways */}
        {event.keyTakeaways?.length > 0 && <TakeawaysSection takeaways={event.keyTakeaways} />}

        {/* Special Notes */}
        {event.specialNotes && <SpecialNotesSection notes={event.specialNotes} />}

        {/* Location Section */}
        <LocationSection location={event.location} />
      </CardContent>
    </Card>
  );
};

export default EventDetailsCard;