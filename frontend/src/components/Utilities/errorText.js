function ErrorText({ children }) {
    return (
        <div className="loginInputWrapper">
            <h1 className="bracketDescriptionTitle dashboardHighlight">
                {children}
            </h1>
        </div>
    );
}

export default ErrorText;
