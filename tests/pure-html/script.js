window.addEventListener('message', function (event) {
  if (event.origin !== document.location.origin)
    return;
  
  if (event.data.type !== 'videobrew.init')
    return;
  
  parent.postMessage({
    type: 'videobrew.setup',
    width: 360,
    height: 640,
    framerate: 30,
    estimatedFrameCount: 2 * 30, // 2 seconds
  }, document.location.origin);
});