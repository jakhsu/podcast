export const cropAudio = async (
  audioElement: HTMLAudioElement | null,
  startTime: number,
  durationInSeconds: number,
  onCropComplete: (audioBlob: Blob) => void,
) => {
  if (!audioElement) {
    console.warn("No audio element provided for cropping");
    return;
  }

  const audioCtx = new window.AudioContext();
  const response = await fetch(audioElement.src);
  const audioData = await response.arrayBuffer();
  const decodedData = await audioCtx.decodeAudioData(audioData);

  const sampleRate = decodedData.sampleRate;
  const startSample = startTime * sampleRate;
  const endSample = (startTime + durationInSeconds) * sampleRate;

  const croppedBuffer = audioCtx.createBuffer(
    decodedData.numberOfChannels,
    endSample - startSample,
    sampleRate,
  );

  for (let channel = 0; channel < decodedData.numberOfChannels; channel++) {
    const channelData = decodedData.getChannelData(channel);
    const croppedChannelData = croppedBuffer.getChannelData(channel);
    croppedChannelData.set(channelData.subarray(startSample, endSample));
  }

  const offlineCtx = new OfflineAudioContext(
    decodedData.numberOfChannels,
    croppedBuffer.length,
    sampleRate,
  );

  const source = offlineCtx.createBufferSource();
  source.buffer = croppedBuffer;
  source.connect(offlineCtx.destination);
  source.start();

  const renderedBuffer = await offlineCtx.startRendering();
  const wavBlob = await bufferToWaveBlob(renderedBuffer);

  onCropComplete(wavBlob);
};

const bufferToWaveBlob = (buffer: AudioBuffer): Blob => {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const bufferArray = new ArrayBuffer(length);
  const view = new DataView(bufferArray);

  // Write the WAV container header
  writeString(view, 0, "RIFF"); // RIFF identifier
  view.setUint32(4, 36 + buffer.length * numOfChan * 2, true); // file length minus RIFF identifier length and file description length
  writeString(view, 8, "WAVE"); // RIFF type
  writeString(view, 12, "fmt "); // format chunk identifier
  view.setUint32(16, 16, true); // format chunk length
  view.setUint16(20, 1, true); // sample format (raw)
  view.setUint16(22, numOfChan, true); // channel count
  view.setUint32(24, buffer.sampleRate, true); // sample rate
  view.setUint32(28, buffer.sampleRate * numOfChan * 2, true); // byte rate (sample rate * block align)
  view.setUint16(32, numOfChan * 2, true); // block align (channel count * bytes per sample)
  view.setUint16(34, 16, true); // bits per sample
  writeString(view, 36, "data"); // data chunk identifier
  view.setUint32(40, buffer.length * numOfChan * 2, true); // data chunk length

  // Write the PCM samples
  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numOfChan; channel++) {
      const sample = buffer.getChannelData(channel)[i];
      const s = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: "audio/wav" });
};

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
