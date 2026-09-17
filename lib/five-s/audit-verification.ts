export function stopCameraStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

export function verificationIsComplete(photo: string | null, signature: string | null) {
  return Boolean(photo && signature);
}
