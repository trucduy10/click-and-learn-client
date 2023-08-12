import { SearchOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import authorImage from "../../assets/images/author.jpg";
import { HeadingFormH1Com } from "../../components/heading";
import RankingAuthorsCardMuiCom from "../../components/mui/RankingAuthorsCardMuiCom";
import { selectUser } from "../../store/auth/authSelector";
import { selectAllAuthorsState } from "../../store/author/authorSelector";
import {
  onAuthorInitialState,
  onGetAuthors,
  onLoadAuthor,
  onLoadAuthorsPagination,
  onLoadSubcribesByUserId,
  onLoadTop3Authors,
} from "../../store/author/authorSlice";
import { selectAllCategoriesState } from "../../store/category/categorySelector";
import { onLoadCategories } from "../../store/category/categorySlice";
import SpinAntCom from "../../components/ant/SpinAntCom";

const AuthorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pagiAuthor, top3, isLoading } = useSelector(selectAllAuthorsState);
  const { categories } = useSelector(selectAllCategoriesState);
  const user = useSelector(selectUser);

  const [searchValue, setSearchValue] = useState({
    categoryId: 0,
    sortKey: "ASC",
    searchKey: "name",
    searchValue: "",
    pageNo: 0,
    pageSize: 2,
    isFilter: false,
  });

  const [filter, setFilter] = useState(false);
  const [isSubcribed, setIsSubcribed] = useState(false);

  const location = useLocation();

  useEffect(() => {
    dispatch(onAuthorInitialState());
    dispatch(onGetAuthors());
  }, [dispatch, location]);

  // useEffect(() => {
  //   console.log(searchValue);
  //   if (searchValue.categoryId !== 0 || searchValue.searchValue.trim() !== "") {
  //     setFilter(true);
  //   } else {
  //     setFilter(false);
  //   }
  // }, [searchValue]);

  useEffect(() => {
    handleClickSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, searchValue.categoryId, searchValue.sortKey]);

  useEffect(() => {
    dispatch(onLoadTop3Authors());
    dispatch(onLoadCategories());
  }, [dispatch]);

  console.log("TOP3[1]", top3);

  useEffect(() => {
    if (user && user.id > 0) {
      dispatch(onLoadSubcribesByUserId({ userId: user.id }));
    }
  }, [dispatch, user]);

  const handleSearch = (event) => {
    console.log(event.target);
    setFilter(true);
    setSearchValue((prev) => {
      return {
        ...prev,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      };
    });
  };

  const handleClickSearch = () => {
    dispatch(onLoadAuthorsPagination({ ...searchValue, isFilter: filter }));
  };

  const handleClickAuthor = (authorId) => {
    return navigate(`/authors/${authorId}`);
  };

  const handleLoadMore = () => {
    console.log(searchValue);
    if (pagiAuthor) {
      dispatch(
        onLoadAuthorsPagination({
          ...searchValue,
          pageNo: pagiAuthor.number + 1,
        })
      );
    }
  };

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} sm={12} md={12}>
          <img
            src={authorImage}
            alt={authorImage}
            className="w-full h-60 object-cover"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} mt={10}>
          <HeadingFormH1Com>Meet our authors</HeadingFormH1Com>
          <Typography align="center" gutterBottom>
            Get to know the brilliant minds behind our courses, assessments and
            more
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} mt={10}>
          <Grid container spacing={1} justifyContent="center">
            <Grid item xs={12} sm={12} md={4}>
              {/* Display the top 2 author */}

              <RankingAuthorsCardMuiCom
                top3={top3.length > 0 && top3[1]}
                rank={2}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <RankingAuthorsCardMuiCom
                top3={top3.length > 0 && top3[0]}
                rank={1}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <RankingAuthorsCardMuiCom
                top3={top3.length > 0 && top3[2]}
                rank={3}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={12} mt={10}>
          <HeadingFormH1Com>Find your expert</HeadingFormH1Com>
          <Typography align="center" gutterBottom>
            Get to know the brilliant minds behind our courses, assessments and
            more
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} mt={10}>
          <Grid container spacing={1} justifyContent="center">
            <Grid item xs={12} sm={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  Filter by Categories
                </InputLabel>
                <Select
                  name="categoryId"
                  labelId="demo-simple-select-label"
                  value={searchValue.categoryId}
                  onChange={handleSearch}
                  displayEmpty
                  label="Filter by Categories"
                >
                  <MenuItem value={0}>
                    <em>All Categories</em>
                  </MenuItem>
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label-2">
                  Sort by Joined Date
                </InputLabel>
                <Select
                  name="sortKey"
                  labelId="demo-simple-select-label-2"
                  value={searchValue.sortKey}
                  onChange={handleSearch}
                  defaultValue="ASC"
                  displayEmpty
                  label="Sort by Joined Date"
                >
                  <MenuItem value="ASC">
                    <em>Oldest</em>
                  </MenuItem>
                  <MenuItem value="DESC">Newest</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                fullWidth
                name="searchValue"
                id="standard-bare"
                variant="outlined"
                placeholder="Search authors"
                size="small"
                onChange={handleSearch}
                InputProps={{
                  endAdornment: (
                    <IconButton size="small" onClick={handleClickSearch}>
                      <SearchOutlined />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={12} mt={10}>
          <Grid container spacing={1} justifyContent="center">
            {pagiAuthor.content.map((a) => (
              <Grid key={a.id} item xs={12} sm={12} md={3}>
                <Grid container direction="column" alignItems="center">
                  <Grid item xs={12} sm={12} md={12}>
                    <Button
                      sx={{
                        borderRadius: "50%",
                        boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
                        "&:hover": {
                          background:
                            "linear-gradient(0deg, rgba(101,121,220,1) 20%, rgba(100,235,191,1) 60%, rgba(231,138,254,1) 90%)",
                          opacity: 1.1,
                        },
                      }}
                      onClick={() => handleClickAuthor(a.id)}
                      disabled={!a.id}
                    >
                      <Avatar
                        alt={a.name}
                        src={a.image}
                        sx={{ width: 120, height: 120 }}
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography
                      gutterBottom
                      variant="h7"
                      component="div"
                      sx={{
                        color: "#333",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      {a.name !== null ? a.name : "Unknown"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={12} mt={10}>
          <Typography align="center">
            <Button
              size="medium"
              variant="contained"
              color="warning"
              disabled={pagiAuthor.last || isLoading}
              onClick={handleLoadMore}
            >
              {isLoading ? <SpinAntCom /> : "View more authors"}
            </Button>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuthorPage;
