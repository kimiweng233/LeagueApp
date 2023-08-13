import Alert from "react-bootstrap/Alert";

function CustomAlert(props) {
    return (
        <Alert
            variant={props.alertType}
            dismissible
            onClose={props.setShowAlert}
        >
            {props.children}
        </Alert>
    );
}

export default CustomAlert;
