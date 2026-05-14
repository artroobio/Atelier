
async function checkSize() {
  try {
    const res = await fetch('https://assets.zyrosite.com/AGBzPMBJDQiwDGny/grey-home-interior-design-video-M13Xi8TTbaVTMRqP.mp4', { method: 'HEAD' });
    console.log(res.headers.get('content-length'));
  } catch (e) {
    console.error(e);
  }
}
checkSize();
