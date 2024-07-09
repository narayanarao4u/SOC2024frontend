import { Link } from "react-router-dom";

const Sidebar = () => {
  const linkStyles = "block py-2.5 px-1 rounded transition duration-200 hover:bg-gray-700 hover:text-white";
  return (
    <div className="bg-gray-800 text-white w-32 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <nav>
        <a href="#" className={linkStyles}>
          Dashboard
        </a>
        <Link to="/" className={linkStyles}>Home</Link>
        <Link to="/members" className={linkStyles}>Members</Link>
        <Link to="/accounts" className={linkStyles}>Accounts</Link>
        <Link to="/trans/ACID/1" className={linkStyles}>Transactions</Link>


      </nav>
    </div>
  );
};

export default Sidebar;