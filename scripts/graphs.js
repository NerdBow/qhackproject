export function createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

export function generateGraph(canvas, rotTime, productiveTime) {
    const totalTime = rotTime + productiveTime;
    const rotPrecent = rotTime / totalTime;
    const productivePrecent = productiveTime / totalTime;

    const ctx = canvas.getContext("2d");
    
    // Draw the circle graph
    const xPos = canvas.width / 2;
    const yPos = canvas.height / 2;
    const rotAngle = Math.PI * 2 * rotPrecent;
    const productiveAngle = Math.PI * 2 * productivePrecent;

    // Background
    ctx.fillStyle = "rgb(36, 39, 58)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title Text
    ctx.font = "" + (canvas.width / 500) * 40 + "px Arial";
    ctx.fillStyle = "rgb(202, 211, 245)";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Daily Rot Chart", canvas.width / 2, canvas.height / 10);

    // Legend Symbols
    ctx.font = "" + (canvas.width / 500) * 20 + "px Arial";
    ctx.textAlign = "left";

    const padding = canvas.width / 50;
    const sqaureSize = canvas.width / 20;

    ctx.fillStyle = "rgb(237, 135, 150)";
    ctx.fillRect(padding, canvas.height - padding - sqaureSize, sqaureSize, sqaureSize);
    ctx.fillText("Rot Time", padding * 2 + sqaureSize, canvas.height - padding - sqaureSize);

    ctx.fillStyle = "rgb(166, 218, 149)";
    ctx.fillRect(padding, canvas.height - sqaureSize * 2 - padding * 2, sqaureSize, sqaureSize);
    ctx.fillText("Productive Time", padding * 2 + sqaureSize, canvas.height - padding * 2 - sqaureSize * 2);

    // Stroke settings
    ctx.lineWidth = (canvas.width / 10);
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)"; 
    ctx.shadowBlur = 10; 
    ctx.shadowOffsetX = 5; 
    ctx.shadowOffsetY = 5;

    ctx.strokeStyle = "rgb(237, 135, 150)"

    const radius = canvas.width / 5;

    ctx.beginPath();
    ctx.arc(xPos, yPos, radius, 0, rotAngle);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "rgb(166, 218, 149)"
    ctx.arc(xPos, yPos, radius, rotAngle, rotAngle + productiveAngle);
    ctx.stroke();
}
export function getClipboardImage(rotTime, productiveTime) {

    const width = 500;
    const height = 500;

    const canvas = createCanvas(width, height);

    generateGraph(canvas, rotTime, productiveTime);

    canvas.toBlob(async (blob) => {
        const chartImage= new ClipboardItem({"image/png": blob});
        await navigator.clipboard.write([chartImage]);
    });
}