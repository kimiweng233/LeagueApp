function NoDataFallback(props) {
    return (
        <div className="tournamentMenuWrapper">
            <h1 className="fallbackMessage">{props.children}</h1>
        </div>
    );
}

export default NoDataFallback;
