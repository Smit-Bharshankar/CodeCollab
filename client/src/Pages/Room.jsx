import React, { useState } from 'react';
import CodeMirror, { oneDark } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';

const Room = () => {
  const [toggleSidebar, setToggleSidebar] = useState(true);

  return (
    <div className="flex flex-row items-center ">
      {/* Sidebar  */}
      {toggleSidebar == true ? (
        <GoSidebarExpand className="size-5" />
      ) : (
        <GoSidebarCollapse className="size-5" />
      )}
      {toggleSidebar == true ? (
        <div className="w-[15%]">
          {/* {toggleSidebar == true ? <GoSidebarCollapse /> : <GoSidebarExpand />} */}
          <span>Joined Users</span>
        </div>
      ) : null}
      <div className="w-[85%]">
        <CodeMirror
          value="// Write your code here"
          minHeight="600px"
          theme={oneDark}
          extensions={[javascript()]}
        />
      </div>
    </div>
  );
};

export default Room;
