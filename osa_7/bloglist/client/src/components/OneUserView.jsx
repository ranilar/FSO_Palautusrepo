import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"; // 👈 Import useParams
import usersService from "../services/users";

const User = ({ user }) => {
  return (
    <div>
      <h2>{user.username}</h2>

      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
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
    return <div>loading user...</div>;
  }

  const user = result.data;

  if (!user) {
    return <div>user not found</div>;
  }

  return <User user={user} />;
};

export default OneUserView;
