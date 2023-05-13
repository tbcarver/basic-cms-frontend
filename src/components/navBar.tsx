import Link from "next/link";
import type { FC } from "react";

function NavBar(): JSX.Element {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-none">
        <Link href="/" className="btn btn-ghost normal-case text-xl">LTM</Link>
      </div>
      <div className="flex-auto">
        <div className="form-control w-full mx-8">
          <input type="text" placeholder="Search" className="input input-bordered" />
        </div>
      </div>

      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/about">About</Link></li>
          <li tabIndex={0}>
            <Link href="/help">Help
              <span className="material-icons">
                expand_more
              </span>
            </Link>
            <ul className="p-2 bg-base-100">
              <li><a>Submenu 1</a></li>
              <li><a>Submenu 2</a></li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 h-10 rounded-full bg-neutral flex">
              <span className="material-icons text-center w-full leading-10">
                person
              </span>
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default NavBar as FC;
