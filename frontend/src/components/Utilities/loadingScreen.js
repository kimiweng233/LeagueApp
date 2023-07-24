import "../../assets/css/loadingAnimation.css";

const LoadingScreen = () => {
    return (
        <div className="loadingScreen">
            <div className="lds-ripple">
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default LoadingScreen;
