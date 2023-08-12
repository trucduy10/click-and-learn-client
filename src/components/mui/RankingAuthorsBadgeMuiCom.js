import Badge from "@mui/material/Badge";
import React from "react";

const myColor = {
  MVP: "error",
  "2nd": "warning",
  "3rd": "primary",
};
const RankingAuthorsBadgeMuiCom = ({ children, top3, rank }) => {
  const getBadgeContent = (rank) => {
    switch (rank) {
      case 0:
        return "MVP";
      case 1:
        return "2nd";
      case 2:
        return "3rd";
      default:
        return null;
    }
  };

  const badgeContent = getBadgeContent(rank - 1);
  const myStyle = myColor[badgeContent];

  return (
    <React.Fragment>
      <Badge
        color={myStyle}
        badgeContent={badgeContent}
        sx={{
          top: 30,
          right: 0,
          "& .MuiBadge-badge": {
            width: badgeContent === "MVP" ? "60px" : "40px",
            height: badgeContent === "MVP" ? "40px" : "30px",
            fontSize: badgeContent === "MVP" ? "24px" : "18px", // set the font size of the badge content
            fontWeight: badgeContent === "MVP" ? 900 : 600, // set the font weight of the badge content
            lineHeight: 1.2,
            boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
            "&::after": {
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "30%",
              animation: "ripple 1.2s infinite ease-in-out",
              border: "1px solid currentColor",
              content: '""',
            },
          },
          "@keyframes ripple": {
            "0%": {
              transform: "scale(.8)",
              opacity: 1,
            },
            "100%": {
              transform: "scale(1.4)",
              opacity: 0,
            },
          },
        }}
      />
      {children}
    </React.Fragment>
  );
};

export default RankingAuthorsBadgeMuiCom;
