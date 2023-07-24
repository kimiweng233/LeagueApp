function Test(props) {
    const hmph = () => {
        return (
            <div>
                <button onClick={() => console.log("meow meow")}>
                    meow meow button
                </button>
            </div>
        );
    };

    return (
        <div
            style={{
                backgroundColor: "#4287f5",
            }}
        >
            <svg width={500} height={500} viewBox={`0 0 500 500`}>
                <foreignObject width="300" height="300">
                    <button
                        onClick={() => console.log("meow meow")}
                        style={{ width: "100%", height: "100%" }}
                    >
                        meow meow button
                    </button>
                </foreignObject>
            </svg>
        </div>
    );
}

export default Test;
