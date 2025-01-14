import React from 'react'
import { Link } from 'react-router-dom'
import parentLogin from '../../assests/parentLogin.jpeg';
import tutorLogin from '../../assests/tutorLogin.jpg'
function LoginFormCards() {
  return (
    <>
    <div class="flex items-center justify-center min-h-screen bg-rose-50">
  <div class="grid gap-8 md:grid-cols-2">
    
    <div class="w-10/12 bg-rose-100 shadow-md rounded-lg overflow-hidden shadow-slate-400">
      <img
        src={tutorLogin}
        alt="Tutor"
        class="w-full h-52 object-cover"
      />
      <div class="p-6 text-center">
        <h2 class="text-xl font-bold text-gray-800">Tutor</h2>
        <p class="mt-2 text-gray-600">Access your teaching dashboard</p>
        <Link to='/loginTutor'>
        <button
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login as Tutor
        </button>
        </Link>
      </div>
    </div>

    
    <div class="w-10/12 bg-rose-100 shadow-md rounded-lg overflow-hidden shadow-slate-400">
      <img
        src={parentLogin}
        alt="Parent"
        class="w-full h-52 object-cover"
      />
      <div class="p-6 text-center">
        <h2 class="text-xl font-bold text-gray-800">Parent</h2>
        <p class="mt-2 text-gray-600">Access your parent portal</p>
        <Link to='/loginParent'>
        <button
          class="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Login as Parent
        </button>
        </Link>
      </div>
    </div>
  </div>
</div>

    </>
  )
}

export default LoginFormCards