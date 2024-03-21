const Navbar = () => {
  return (
    <nav className="bg-slate-200 dark:bg-slate-800 border-b border-gray-300 dark:border-gray-700 flex flex-row justify-center p-2">
      <a href="/">
        <span className="dark:text-white self-center text-3xl font-extrabold font-serif whitespace-nowrap">
          WORDLE
        </span>
      </a>
    </nav>
  );
};

export default Navbar;
