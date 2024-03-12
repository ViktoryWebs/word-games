const Navbar = () => {
  return (
    <nav className="bg-slate-200 dark:bg-slate-900 border-b border-gray-700 flex flex-row justify-center p-3">
      <a href="/">
        <span className="dark:text-white self-center text-3xl font-semibold whitespace-nowrap">
          Word Games
        </span>
      </a>
    </nav>
  );
};

export default Navbar;
