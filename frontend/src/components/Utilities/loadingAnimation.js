import "../../assets/css/loadingAnimation.css";

const LoadingAnimation = () => {
    return (
        <div className="loadingAnimationWrapper">
            <div className="lds-ripple">
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default LoadingAnimation;
