import Search from "../Search/Search";
import styles from "./Navbar.module.css";
import NotificationIcon from "./NotificationIcon";
import FriendRequestIcon from "./FriendRequestIcon";

const Navbar = () => {
  return (
    <nav>
      <div className={styles["navbar"]}>
        <div className={styles["navbar__left-side"]}>
          <Search />
        </div>
        <div className={styles["navbar__right-side"]}>
          <div className={styles["navbar__right-icons"]}>
            <NotificationIcon />
            <FriendRequestIcon />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
