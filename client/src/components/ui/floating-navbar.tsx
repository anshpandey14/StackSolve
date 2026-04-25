import { useState, useEffect, type JSX } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { IconLogout, IconUser } from "@tabler/icons-react";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const { user, logout } = useAuthStore();
  const { pathname } = useLocation();

  const [visible, setVisible] = useState(true);

  // Ensure navbar is visible on page change
  useEffect(() => {
    setVisible(true);
  }, [pathname]);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.01) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: 0,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/20 rounded-full dark:bg-black/80 bg-white/80 backdrop-blur-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-5000 pr-2 pl-4 py-2 items-center justify-center space-x-4",
          className
        )}
      >
        <Link to="/" className="flex items-center space-x-2 mr-4">
          <span className="text-sm font-bold bg-linear-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Stack Solve
          </span>
        </Link>

        {navItems.map((navItem: any, idx: number) => (
          <Link
            key={`link=${idx}`}
            to={navItem.link}
            className={cn(
              "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-sm">{navItem.name}</span>
          </Link>
        ))}

        {user ? (
          <div className="flex items-center space-x-4">
            <Link 
              to={`/users/${user._id}/${user.name.toLowerCase().replace(/ /g, "-")}`}
              className="text-neutral-600 dark:text-neutral-300 hover:text-orange-500"
            >
              <IconUser className="h-5 w-5" />
            </Link>
            <button
              onClick={() => logout()}
              className="text-neutral-600 dark:text-neutral-300 hover:text-red-500"
            >
              <IconLogout className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full no-underline">
            <span>Login</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-linear-to-r from-transparent via-orange-500 to-transparent h-px" />
          </Link>
        )}
      </motion.div>
    </AnimatePresence>
  );
};





