import { Container, Grid } from "@mui/material";
import React from "react";
import { HeadingH3Com } from "../../components/heading";
import { TabsMuiCom } from "../../components/mui";

const UserPurchaseHistoryPage = () => {
  return (
    <Container>
      <Grid container>
        <Grid item xs={12} sm={12} md={12} mt={4}>
          <HeadingH3Com>Purchase History</HeadingH3Com>
        </Grid>
        <Grid item xs={12} sm={12} md={12} mt={4}>
          <TabsMuiCom></TabsMuiCom>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserPurchaseHistoryPage;
