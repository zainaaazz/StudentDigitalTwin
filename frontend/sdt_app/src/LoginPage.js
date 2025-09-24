// import React, { useState } from 'react';

// const LoginPage = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('http://localhost:5000/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Save JWT token to localStorage
//         localStorage.setItem('token', data.token);

//         // Redirect to dashboard
//         window.location.href = '/dashboard';
//       } else {
//         setError(data.message || 'Login failed');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Server error. Please try again.');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

//         {error && (
//           <div className="mb-4 text-red-600 text-center">{error}</div>
//         )}

//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label className="block text-gray-700">Username</label>
//             <input
//               type="username"
//               className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700">Password</label>
//             <input
//               type="password"
//               className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState } from 'react';

const LoginPage = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentNumber, password }), // changed here
      });

      const data = await response.json();

      if (response.ok) {
        // Save JWT token to localStorage
        localStorage.setItem('token', data.token);

        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900 sdt-dark px-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-700">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-slate-100">Login</h2>

        {error && (
          <div className="mb-4 text-red-600 text-center">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm sm:text-base text-gray-700">Student Number</label>
            <input
              type="text"
              className="app-input w-full px-3 sm:px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)} // changed here
              required
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base text-gray-700">Password</label>
            <input
              type="password"
              className="app-input w-full px-3 sm:px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full text-white py-2.5 sm:py-2 rounded-lg transition shadow-sm text-sm sm:text-base"
            style={{ backgroundColor: '#8b57d4' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3E46B6')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#8b57d4')}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
