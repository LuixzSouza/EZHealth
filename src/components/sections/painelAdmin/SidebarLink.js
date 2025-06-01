// src/components/layout/SidebarLink.js
import Image from "next/image";

export function SidebarLink({ icon, title, tab, activeTab, onClick }) {
  const isActive = activeTab === tab;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-md w-full text-left transition group
        ${isActive ? 'bg-orange dark:bg-orange text-white' : 'hover:bg-orange/80 dark:hover:bg-gray-700 text-blue-900 dark:text-white'}
        text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
    >
      <Image src={icon} alt={title} width={20} height={20} className={`filter dark:invert ${isActive ? 'invert' : 'group-hover:invert'}`} />
      <span>{title}</span>
    </button>
  );
}