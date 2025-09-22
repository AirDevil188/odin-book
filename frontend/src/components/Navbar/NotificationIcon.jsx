import styles from "./Icons.module.css";
import NotificationSVG from "../../assets/icons/notifications.svg?react";

const NotificationIcon = () => {
  return (
    <button type={"button"} className={styles["notification_button"]}>
      <NotificationSVG className={styles["notification_button-icon"]} />
    </button>
  );
};

export default NotificationIcon;
