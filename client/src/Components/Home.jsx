import React from 'react';
import { NavLink } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center">
      Hey this is home for my project Code Collab
      <h3>And support this project by giving stars in my Git-Hub repo</h3>
      <span>Create a New Room or Join an Existing One </span>
      <NavLink to={'/room'}>
        <div className="m-4  flex items-center justify-center w-auto">
          <span className="bg-gray-300 text-2xl p-2 rounded-md">Go to Room </span>
        </div>
      </NavLink>
    </div>
  );
};

export default Home;
