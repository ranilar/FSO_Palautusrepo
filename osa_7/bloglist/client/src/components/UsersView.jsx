import { useQuery } from "@tanstack/react-query";
import usersService from "../services/users";

const Users = () => {
  const result = useQuery({
    queryKey: ["users"],
    queryFn: usersService.getAll,
  });

  if (result.isLoading) {
    return <div>loading users...</div>;
  }

  const users = result.data;

  return (
    <div>
      <h2>Users</h2>

      <table>
        <thead>
          <tr>
            <th> user |</th>

            <th> blogs created </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td> {user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
