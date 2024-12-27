import { useState } from 'react'
import {  Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'; 
import { logout } from '../../../store/authSlice.js';
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  ArrowPathIcon, 
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'

const products = [
  { name: 'All Subjects', icon: ChartPieIcon },
  { name: 'Math', icon: CursorArrowRaysIcon },
  { name: 'Chemistry',  icon: FingerPrintIcon },
  { name: 'Physics', icon: SquaresPlusIcon },
  { name: 'English', icon: ArrowPathIcon },
]
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dispatch = useDispatch();
  const handleLogout = () => {
    console.log("Logging out...");
     
   
    localStorage.removeItem('token'); 
    localStorage.removeItem('user')
    localStorage.setItem('isAuthenticated', 'false');
   
    dispatch(logout());
  
  };
  return (
    <div className="bg-white shadow-sm shadow-slate-400">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link to='/home' className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              alt=""
              src="data:image/jpeg;base64,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"
              className="h-14 w-auto"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Link to="/parent/dashboard" className="text-sm font-semibold text-white bg-red-800 p-3 rounded-md hover:bg-red-700">
            Dashboard
          </Link>
          
         
          
        </PopoverGroup>
        <div className=" lg:flex lg:flex-1 lg:justify-end gap-x-5">
        <Menu as="div" className="relative ml-6">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src=""
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                <MenuItem>
                  <button
                   onClick={handleLogout}
                    className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
         
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to='/home' className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
              alt=""
              src="data:image/jpeg;base64,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"
              className="h-14 w-auto"
            />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                
                <Link
                  to='/parent/dashboard'
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                    Dashboard
                </Link>
                
                
                
              </div>
             
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
}

