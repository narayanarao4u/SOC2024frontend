import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
  const selectedMember = useSelector(state => state.memdata.selected);
  return (
    <nav className="bg-blue-600 text-white px-4 py-3 shadow-md">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">My App</div>
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded-md">{selectedMember?.name}</Link>
          <Link to="/members" className="hover:bg-blue-700 px-3 py-2 rounded-md">Members</Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;