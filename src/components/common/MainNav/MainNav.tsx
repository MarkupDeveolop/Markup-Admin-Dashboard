"use client";
import { cn } from "@/lib/utils/utils";
import React, { useState } from "react";
import {
  IoBagCheckOutline,
  IoChevronDown,
  IoListOutline,
  IoHomeOutline,
} from "react-icons/io5";
import { PiBrandyLight, PiExport, PiQuestionLight, PiUsersThreeLight, PiUsersThreeThin } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { Link, usePathname } from "@/i18n/routing";
import { BoxIcon } from "lucide-react";
import { HiOutlineClipboard, HiOutlineClipboardDocumentCheck, HiOutlineSwatch } from "react-icons/hi2";
import { PiQrCodeThin } from "react-icons/pi";



const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathName = usePathname();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const routes = [
    {
      href: `/`,
      label: "Overview",
      icon: <IoBagCheckOutline />,
    },

    {
      href: `/users`,
      label: "Users",
      icon: <PiUsersThreeLight />,
    },

    {
      href: `/brandQrCode`,
      label: "BrndQR",
      active: pathName === `/brandQrCode`,
      icon: <PiQrCodeThin />,
    },

    {
      label: "Activity",
      icon: <HiOutlineClipboard />,
      isMenu: true,
      key: "Feature",
      children: [
        {
          href: `/home/brand`,
          label: "Brands",
          icon: <PiBrandyLight />,
        },
        {
          href: `/home/categories`,
          label: "Categories",
          icon: <IoListOutline />,
        },

      ],
    },


    {
      label: "Home",
      icon: <IoHomeOutline />,
      isMenu: true,
      key: "home",
      children: [
        {
          href: `/home/brand`,
          label: "Brands",
          icon: <PiBrandyLight />,
        },
        {
          href: `/home/categories`,
          label: "Categories",
          icon: <IoListOutline />,
        },

        // { href: `/home/productDetails`, label: "ProductDetails" },

        {
          href: `/home/products`,
          label: "Products",
          icon: <BoxIcon />,
        },
      ],
    },


    {
      label: "Brands",
      icon: <HiOutlineSwatch />,
      isMenu: true,
      key: "Brands",
      children: [
        {
          href: `/brands/brand`,
          label: "Brands",
          icon: <PiBrandyLight />,
        },
        {
          href: `/brands/allBrands`,
          label: "AllBrands",
          icon: <IoListOutline />,
        },

      ],
    },

   
    {
      label: "Services",
      icon: <PiExport />,
      isMenu: true,
      key: "Services",
      children: [
        { href: `/services`, label: "Services" },
        // { href: `/products`, label: "Section3" },
      ],
    },

    {
      label: "FAQ",
      icon: <PiQuestionLight />,
      isMenu: true,
      key: "FAQ",
      children: [
        { href: `/FAQ/FAQ`, label: "A.Category" },
        { href: `/news/newsArticale`, label: "Articale" },
        // { href: `/products`, label: "Section3" },
      ],
    },

    {
      label: "News",
      icon: <HiOutlineClipboardDocumentCheck />,
      isMenu: true,
      key: "news",
      children: [
        { href: `/news/articaleCategory`, label: "A.Category" },
        { href: `/news/newsArticale`, label: "Articale" },
        // { href: `/products`, label: "Section3" },
      ],
    },

    {
      label: "Teamwork",
      icon: <PiUsersThreeThin  />,
      isMenu: true,
      key: "Teamwork",
      children: [
        { href: `/news/articaleCategory`, label: "A.Category" },
        { href: `/news/newsArticale`, label: "Articale" },
        // { href: `/products`, label: "Section3" },
      ],
    },

  ];




  return (
    <nav className={cn("w-full space-y-2", className)} {...props}>
      {routes.map((route) => {
        if (route.isMenu) {
          return (
            <div key={route.key} className="w-full">
              <button
                onClick={() => toggleMenu(route.key!)}
                className={cn(
                  "flex items-center  justify-between w-full px-4 py-2 text-sm font-medium rounded-lg",
                  openMenus[route.key]
                    ? "bg-[#FFD500] text-blue-700"
                    : "text-blue-950 dark:text-white hover:bg-gray-100"
                )}
              >
                <span className="flex items-center gap-2">
                  {route.icon} {route.label}
                </span>
                <IoChevronDown
                  className={cn(
                    "transition-transform duration-300",
                    openMenus[route.key] ? "rotate-180" : ""
                  )}
                />
              </button>
              <AnimatePresence>
                {openMenus[route.key] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-6 mt-1 overflow-hidden"
                  >
                    {route.children?.map((subRoute) => (
                      <Link
                        key={subRoute.href}
                        href={subRoute.href}
                        className={cn(
                          "block px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                          pathName === subRoute.href
                            ? "bg-[#FFD500] text-blue-700"
                            : "text-blue-950 dark:text-white hover:bg-gray-100"
                        )}
                      >
                        {subRoute.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }

        return (
          <Link
            key={route.href}
            href={route.href as string}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              pathName === route.href
                ? "bg-[#FFD500] text-blue-700"
                : "text-blue-950 dark:text-white hover:bg-gray-100"
            )}
          >
            {route.icon} {route.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default MainNav;
