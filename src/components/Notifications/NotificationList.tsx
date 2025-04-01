import { useNotifications } from "@/context/NotificationContext";
import styles from "./Notifications.module.css";

interface NotificationListProps {
  target?: string;
}

const NotificationList: React.FC<NotificationListProps> = ({
  target = "global",
}) => {
  const { notifications, removeNotification } = useNotifications();

  const filteredNotifications = notifications.filter(
    (notif) => notif.target === target || notif.target === "global"
  );

  return (
    <>
      {filteredNotifications.length !== 0 ? (
        <div className={styles.container}>
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`${styles.notification} ${styles[notif.type]}`}
            >
              {notif.message}
              <button onClick={() => removeNotification(notif.id)}>✖</button>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};

export default NotificationList;
