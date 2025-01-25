export function drawLines(rotTime, productiveTime) {
    let totalTime = rotTime + productiveTime;
    let rotPrecent = rotTime / totalTime;
    let productivePrecent = productiveTime / totalTime;

    const width = 500;
    const height = 500;

    // Create a canvas
    const canvas = document.createElement("canvas");
    canvas.width = width; // Set desired width
    canvas.height = height; // Set desired height
    let ctx = canvas.getContext("2d");
    
    // Draw the circle graph
    const xPos = width / 2;
    const yPos = height / 2;
    const rotAngle = Math.PI * 2 * rotPrecent;
    const productiveAngle = Math.PI * 2 * productivePrecent;

    // Stroke settings
    ctx.lineWidth = 50;
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)"; 
    ctx.shadowBlur = 10; 
    ctx.shadowOffsetX = 5; 
    ctx.shadowOffsetY = 5;

    ctx.strokeStyle = "rgb(255,120,120)"

    ctx.beginPath();
    ctx.arc(xPos, yPos, 100, 0, rotAngle);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "rgb(154,208,112)"
    ctx.arc(xPos, yPos, 100, rotAngle, rotAngle + productiveAngle);
    ctx.stroke();

    // Convert the canvas to a PNG file
    canvas.toBlob((blob) => {
      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      let date = new Date();
      a.href = url;
      a.download = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-rot-meter.png"; // File name
      a.click();
  
      // Clean up
      URL.revokeObjectURL(url);
    }, "image/png");
}