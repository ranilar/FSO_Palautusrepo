import { useQuery } from "@tanstack/react-query";
import usersService from "../services/users";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

const Users = () => {
  const result = useQuery({
    queryKey: ["users"],
    queryFn: usersService.getAll,
  });

  if (result.isLoading) {
    return <Typography sx={{ mt: 2 }}>loading users...</Typography>;
  }

  const users = result.data;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Users
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>User</strong>
              </TableCell>
              <TableCell>
                <strong>Blogs created</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Link
                    to={`/users/${user.id}`}
                    style={{
                      textDecoration: "none",
                      color: "Chocolate",
                      fontWeight: "bold",
                    }}
                  >
                    {user.username}
                  </Link>
                </TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Users;
