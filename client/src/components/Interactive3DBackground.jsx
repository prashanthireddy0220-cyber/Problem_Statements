import React, { useEffect, useRef } from 'react';

export default function Interactive3DBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates and target parallax angles
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      rx: 0,
      ry: 0,
      targetRx: 0,
      targetRy: 0
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.targetRx = (e.clientX / width - 0.5) * 0.8; // Max tilt angle
      mouse.targetRy = (e.clientY / height - 0.5) * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate 3D Nodes Constellation
    const nodeCount = 90;
    const nodes = [];
    const radius = Math.min(width, height) * 0.35;

    for (let i = 0; i < nodeCount; i++) {
      // Uniform spherical point distribution
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      nodes.push({
        origX: radius * Math.cos(theta) * Math.sin(phi),
        origY: radius * Math.sin(theta) * Math.sin(phi),
        origZ: radius * Math.cos(phi),
        x: 0, y: 0, z: 0,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2.5 + 1.5,
        pulse: Math.random() * Math.PI * 2
      });
    }

    // 3D Polyhedron Ring Nodes
    const polyNodes = [];
    const polySides = 12;
    for (let i = 0; i < polySides; i++) {
      const angle = (i / polySides) * Math.PI * 2;
      polyNodes.push({
        origX: radius * 1.25 * Math.cos(angle),
        origY: radius * 1.25 * Math.sin(angle),
        origZ: (i % 2 === 0 ? 60 : -60),
        x: 0, y: 0, z: 0
      });
    }

    let globalRotationY = 0;
    let globalRotationX = 0;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth Lerp Mouse Positions & Angles
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      mouse.rx += (mouse.targetRx - mouse.rx) * 0.05;
      mouse.ry += (mouse.targetRy - mouse.ry) * 0.05;

      globalRotationY += 0.003;
      globalRotationX += 0.001;

      const rotX = globalRotationX + mouse.ry;
      const rotY = globalRotationY + mouse.rx;

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

      const fov = 450;
      const centerX = width / 2;
      const centerY = height / 2;

      // Cursor Light Glow Field
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 350);
      gradient.addColorStop(0, 'rgba(0, 242, 254, 0.15)');
      gradient.addColorStop(0.5, 'rgba(79, 172, 254, 0.05)');
      gradient.addColorStop(1, 'rgba(5, 11, 20, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Project and Transform 3D Nodes
      const projectedNodes = [];

      nodes.forEach((node) => {
        node.pulse += 0.03;

        // Apply 3D Rotation Matrix (Rotation around Y then X)
        let x1 = node.origX * cosY - node.origZ * sinY;
        let z1 = node.origZ * cosY + node.origX * sinY;

        let y1 = node.origY * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.origY * sinX;

        // Perspective 3D -> 2D projection
        const scale = fov / (fov + z2 + 300);
        const projectedX = centerX + x1 * scale;
        const projectedY = centerY + y1 * scale;

        // Mouse Cursor Repulsion Force
        const dx = projectedX - mouse.x;
        const dy = projectedY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let pushX = 0, pushY = 0;

        if (dist < 180) {
          const force = (180 - dist) / 180;
          pushX = (dx / dist) * force * 35;
          pushY = (dy / dist) * force * 35;
        }

        projectedNodes.push({
          px: projectedX + pushX,
          py: projectedY + pushY,
          pz: z2,
          scale,
          size: node.size * scale * (1 + Math.sin(node.pulse) * 0.3)
        });
      });

      // Render 3D Connecting Wireframe Lines
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const p1 = projectedNodes[i];
          const p2 = projectedNodes[j];
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.35 * Math.min(p1.scale, p2.scale);
            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // Render Outer Polyhedron Geometry Lines
      const projPoly = polyNodes.map(node => {
        let x1 = node.origX * cosY - node.origZ * sinY;
        let z1 = node.origZ * cosY + node.origX * sinY;
        let y1 = node.origY * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.origY * sinX;

        const scale = fov / (fov + z2 + 300);
        return {
          px: centerX + x1 * scale,
          py: centerY + y1 * scale,
          scale
        };
      });

      ctx.strokeStyle = 'rgba(255, 215, 0, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i < projPoly.length; i++) {
        const next = projPoly[(i + 1) % projPoly.length];
        ctx.moveTo(projPoly[i].px, projPoly[i].py);
        ctx.lineTo(next.px, next.py);
      }
      ctx.stroke();

      // Render Glowing 3D Node Spheres
      projectedNodes.forEach((node) => {
        const alpha = Math.max(0.1, Math.min(1, (node.pz + 400) / 600));
        ctx.fillStyle = `rgba(0, 242, 254, ${alpha})`;
        ctx.beginPath();
        ctx.arc(node.px, node.py, node.size, 0, Math.PI * 2);
        ctx.fill();

        // Node halo
        ctx.fillStyle = `rgba(79, 172, 254, ${alpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(node.px, node.py, node.size * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
}
