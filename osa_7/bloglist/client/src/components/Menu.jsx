import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <div>
      <Link to="/">blogs</Link> <Link to="/users">users</Link>{" "}
      <Link to="/users/:id">Profile</Link>
    </div>
  );
};

export default Menu;
