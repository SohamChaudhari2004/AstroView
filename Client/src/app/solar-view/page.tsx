'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';

interface DeviceOrientation {
  alpha: number; // Z axis rotation (0-360)
  beta: number; // X axis rotation (-180 to 180)
  gamma: number; // Y axis rotation (-90 to 90)
}

export default function SolarViewPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [isNightMode, setIsNightMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [deviceSupported, setDeviceSupported] = useState(false);

  // Request device orientation permission (iOS 13+)
  useEffect(() => {
    const checkDeviceOrientation = () => {
      if (typeof DeviceOrientationEvent !== 'undefined') {
        if (
          typeof (DeviceOrientationEvent as any).requestPermission === 'function'
        ) {
          // iOS 13+ requires explicit permission
          (DeviceOrientationEvent as any)
            .requestPermission()
            .then((permission: string) => {
              if (permission === 'granted') {
                window.addEventListener('deviceorientation', handleDeviceOrientation);
                setDeviceSupported(true);
              }
            })
            .catch(() => {
              // User denied permission, fall back to mouse
              setDeviceSupported(false);
            });
        } else {
          // Non-iOS devices
          window.addEventListener('deviceorientation', handleDeviceOrientation);
          setDeviceSupported(true);
        }
      }
    };

    checkDeviceOrientation();
  }, []);

  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    setOrientation({
      alpha: event.alpha || 0,
      beta: event.beta || 0,
      gamma: event.gamma || 0,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setMousePos({ x, y });
    setOrientation({
      alpha: x * 360,
      beta: (y - 0.5) * 180,
      gamma: 0,
    });
  };

  // Draw constellation view
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Clear canvas
    ctx.fillStyle = isNightMode ? '#0a0e1a' : '#0b0f1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
      const x = (Math.sin(i * 12.9898 + orientation.alpha) * 0.5 + 0.5) * canvas.width;
      const y = (Math.cos(i * 78.233 + orientation.beta) * 0.5 + 0.5) * canvas.height;
      const size = Math.random() * 1.5;
      const brightness = isNightMode ? 0.8 : 0.5;

      ctx.fillStyle = `rgba(255, 255, 255, ${brightness * Math.random()})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw ISS marker
    const issX = 0.5 * canvas.width;
    const issY = 0.5 * canvas.height;

    // Glow effect
    const gradient = ctx.createRadialGradient(issX, issY, 0, issX, issY, 30);
    gradient.addColorStop(0, 'rgba(0, 217, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(0, 217, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(issX - 30, issY - 30, 60, 60);

    // ISS marker
    ctx.fillStyle = '#00D9FF';
    ctx.beginPath();
    ctx.arc(issX, issY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();

      const x = (i / 4) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Draw coordinates
    ctx.fillStyle = 'rgba(176, 176, 176, 0.7)';
    ctx.font = '12px monospace';
    ctx.fillText(`α: ${orientation.alpha.toFixed(0)}°`, 10, 20);
    ctx.fillText(`β: ${orientation.beta.toFixed(0)}°`, 10, 35);
    ctx.fillText(`ISS`, issX - 10, issY + 25);
  }, [orientation, isNightMode]);

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gradient">Solar View</h1>
                <p className="text-text-secondary mt-1">
                  {deviceSupported
                    ? 'Rotate your device to view the sky'
                    : 'Drag to view the sky'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={isNightMode ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setIsNightMode(!isNightMode)}
                >
                  {isNightMode ? '🌙 Night' : '⭐ Day'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Canvas */}
        <motion.div
          className="cursor-move"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-96 rounded-2xl border border-white/10 glass"
          />
        </motion.div>

        {/* Controls and Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <Card>
            <h3 className="text-lg font-bold text-text-primary mb-4">Controls</h3>
            <div className="space-y-3 text-sm text-text-secondary">
              {deviceSupported ? (
                <>
                  <p>📱 Rotate your device to explore the sky</p>
                  <p>🔄 The view updates in real-time with device orientation</p>
                  <p>🌙 Toggle night/day mode for better visibility</p>
                </>
              ) : (
                <>
                  <p>🖱️ Click and drag to rotate the view</p>
                  <p>↔️ Horizontal movement controls azimuth (left-right)</p>
                  <p>↕️ Vertical movement controls altitude (up-down)</p>
                </>
              )}
            </div>
          </Card>

          {/* ISS Info */}
          <Card glow="cyan">
            <h3 className="text-lg font-bold text-text-primary mb-4">ISS Position</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Latitude</span>
                <span className="text-accent-cyan font-mono">45.5231°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Longitude</span>
                <span className="text-accent-cyan font-mono">-122.6765°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Altitude</span>
                <span className="text-accent-cyan font-mono">408 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Velocity</span>
                <span className="text-accent-cyan font-mono">27,600 km/h</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="bg-blue-900/10 border-blue-500/20">
          <h4 className="text-lg font-bold text-text-primary mb-2">ℹ️ About This View</h4>
          <p className="text-text-secondary text-sm">
            This is a real-time constellation and satellite viewer. On mobile devices with
            motion sensors, the view rotates with your device. On desktop, use mouse drag.
            The bright cyan marker indicates the International Space Station (ISS) position.
          </p>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
