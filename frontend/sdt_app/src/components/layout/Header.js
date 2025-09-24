// import React from 'react';

// const Header = ({ title, subtitle, rightContent, onLogout }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">
//             {title}
//           </h1>
//           {subtitle && (
//             <p className="text-gray-600">{subtitle}</p>
//           )}
//         </div>
//          <div className="flex items-center space-x-4">
//           {/* Right content passed from props */}
//           {rightContent && rightContent}

          
//         </div>
//         {rightContent && (
//           <div className="flex items-center">
//             {rightContent}
            
//           </div>
          
//         )}

        
//       </div>
      
//     </div>
    
//   );
// };

// export default Header;

import React from 'react';

const Header = ({ title, subtitle, rightContent, onLogout }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        {/* Left side: title + subtitle */}
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>
          )}
        </div>

        {/* Right side: rightContent + Logout button */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
          {rightContent && rightContent}

          {onLogout && (
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-red-600 transition text-sm sm:text-base"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
