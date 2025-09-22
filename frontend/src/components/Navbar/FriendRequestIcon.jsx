import styles from "./Icons.module.css";
import FriendRequestsSVG from "../../assets/icons/friend_requests.svg?react";

const FriendRequestIcon = () => {
  return (
    <button type="button" className={styles["friends__button"]}>
      <FriendRequestsSVG className={styles["friends__button-icon"]} />
    </button>
  );
};

export default FriendRequestIcon;
