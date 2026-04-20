import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import usersService from "../services/users";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
} from "@mui/material";

const User = ({ user }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {user.username}
      </Typography>

      <Typography variant="h6" sx={{ mb: 1, color: "Chocolate" }}>
        Added blogs
      </Typography>

      <Paper elevation={3}>
        <List>
          {user.blogs.map((blog, index) => (
            <Box key={blog.id}>
              <ListItem>
                <ListItemText primary={blog.title} />
              </ListItem>
              {index < user.blogs.length - 1 && <Divider />}
            </Box>
          ))}
          {user.blogs.length === 0 && (
            <ListItem>
              <ListItemText secondary="No blogs added yet" />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
};

const OneUserView = () => {
  const { id } = useParams();

  const result = useQuery({
    queryKey: ["users", id],
    queryFn: () => usersService.getOne(id),
    enabled: !!id,
  });

  if (result.isLoading) {
    return (
      <Typography sx={{ mt: 4 }} variant="body1">
        loading user...
      </Typography>
    );
  }

  const user = result.data;

  if (!user) {
    return (
      <Typography sx={{ mt: 4 }} variant="body1" color="error">
        user not found
      </Typography>
    );
  }

  return <User user={user} />;
};

export default OneUserView;
