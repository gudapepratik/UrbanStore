import { Store } from "react-notifications-component";

// notification triggerer helper function
export const triggerNotification = ({type, title, message}) => {
    // dummy notification to handle notifications
    const notification = {
        title: "Add title message",
        message: "Configurable",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated animate__fadeIn"], // `animate.css v4` classes
        animationOut: ["animate__animated animate__fadeOut"] // `animate.css v4` classes
    };
    
    Store.addNotification({
        ...notification,
        type: type,
        title: title,
        message: message,
        container: 'top-right',
        dismiss: {
            duration: 2000,
            pauseOnHover: true,
        }
    });
};