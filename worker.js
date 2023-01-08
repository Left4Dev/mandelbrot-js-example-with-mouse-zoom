onmessage = (event) => {
    const { minReal, maxReal, minImag, maxImag, width, height, maxIter, y0, y1 } = event.data;
    const imageData = new ImageData(width, y1 - y0);
    for (let x = 0; x < width; x++) {
      for (let y = y0; y < y1; y++) {
        const i = (y - y0) * width + x;
        const iter = getIter(x, y, minReal, maxReal, minImag, maxImag, width, height, maxIter);
        if (iter === maxIter) {
          imageData.data[i * 4 + 0] = 0;
          imageData.data[i * 4 + 1] = 0;
          imageData.data[i * 4 + 2] = 0;
        } else {
          imageData.data[i * 4 + 0] = iter;
          imageData.data[i * 4 + 1] = iter;
          imageData.data[i * 4 + 2] = iter;
        }
        imageData.data[i * 4 + 3] = 255;
      }
    }
    postMessage(imageData);
  };
  
  function getIter(x, y, minReal, maxReal, minImag, maxImag, width, height, maxIter) {
    const cReal = minReal + x * (maxReal - minReal) / width;
    const cImag = minImag + y * (maxImag - minImag) / height;
    let zReal = 0;
    let zImag = 0;
    let iter = 0;
    while (iter < maxIter && zReal * zReal + zImag * zImag < 4) {
      const tmpReal = zReal * zReal - zImag * zImag + cReal;
      const tmpImag = 2 * zReal * zImag + cImag;
      zReal = tmpReal;
      zImag = tmpImag;
      iter++;
    }
    return iter;
  }
  