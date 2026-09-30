import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import auth from '../../config/firebase';

function Navbar() {
  const navigate = useNavigate();
  const [log, setLog] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLog(Boolean(user));
    });

    return () => unsubscribe();
  }, []);

  function logout() {
    signOut(auth)
      .then(() => navigate('/login'))
      .catch((error) => console.error('Logout failed:', error));
  }

  return (
    <div className='py-5 flex justify-between items-center'>
      <h2 className='text-2xl font-bold'>Personal</h2>
      <div className='flex items-center'>
        <Link className='list-none px-5' to={'/home'}>Home</Link>
        <Link className='list-none px-5' to={'/blogs'}>Blogs</Link>
        <Link className='list-none px-5' to={'/about'}>About</Link>
        <Link className='list-none px-5' to={'/contact'}>Contact</Link>
        {log ? (
          <button className='button-style hidden md:block' onClick={logout}>Logout</button>
        ) : (
          <button className='button-style hidden md:block' onClick={() => navigate('/login')}>Login</button>
        )}
      </div>
    </div>
  );
}

export default Navbar;