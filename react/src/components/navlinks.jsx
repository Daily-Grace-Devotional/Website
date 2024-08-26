import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/solid";

function NavLinks() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('AdminDevotion');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };


  return (
    <>
      <div style={{width: '100%', height: 'auto', display: 'flex', marginBottom: '10px', justifyContent: 'right'}}>
        <Bars3Icon id="mobile-menu-button" className="h-8 w-8 cursor-pointer" onClick={toggleMobileMenu} />
      </div>  
      <nav id={`${isMobileMenuOpen ? "mobile-menu-open" : "mobile-menu-close"}`} className="grid grid-cols-4 md:grid-cols-7 text-cs md:text-sm gap-4 pb-10 max-w-6xl mx-auto border-b nav-links">
        <Link id="navlink" to={`/`} className={"navlink font-bold text-lg"}>
          Home
        </Link>
        <Link id="navlink" to="/#todaysDevotion" className={"navlink font-bold text-lg"}>
          Today's Devotion
        </Link>
        <Link id="navlink" to="/general-devotion" className={"navlink font-bold text-lg"}>
          General Devotion
        </Link>
        <Link id="navlink" to="/about" className={"navlink font-bold text-lg"}>
          About Us
        </Link>
        {isLoggedIn && 
          <>
            <Link id="navlink" to={`/add-devotion`} className={"navlink font-bold text-lg"}>
              Add Devotion
            </Link>
            <Link id="navlink" to={`/update-list`} className={"navlink font-bold text-lg"}>
              Update Devotion
            </Link>
          </>
        }
      </nav>
    </>
  );
}

export default NavLinks;
