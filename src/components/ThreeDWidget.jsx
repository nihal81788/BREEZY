import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeDWidget = ({ type, condition = 'clear-day', value = 0, angle = 0 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 150;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    
    // Transparent scene to blend with card bg
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xFFFAF3, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xFFFAF3, 0.8);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    // Light reflecting accent color
    const accentLight = new THREE.PointLight(0xF0731E, 1.2, 15);
    accentLight.position.set(-3, -2, 2);
    scene.add(accentLight);

    // Track active resources for clean destruction
    const objectsToCleanup = [];
    const animationFrameIds = [];

    // Helper to track objects
    const track = (obj) => {
      objectsToCleanup.push(obj);
      return obj;
    };

    // 3. Render Specific Visualizers based on 'type'
    if (type === 'hero-weather') {
      camera.position.z = 7;
      
      // Let's create meshes matching the condition
      if (condition === 'clear-day') {
        // Glowing Sun Orb with orbiting rings
        const sunGeo = new THREE.SphereGeometry(1.4, 32, 32);
        const sunMat = new THREE.MeshPhongMaterial({
          color: 0xffaa00,
          emissive: 0xff5500,
          shininess: 100,
          flatShading: true
        });
        const sunMesh = new THREE.Mesh(sunGeo, sunMat);
        scene.add(track(sunMesh));

        // Orbit ring
        const ringGeo = new THREE.RingGeometry(2.0, 2.05, 64);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 3;
        ringMesh.rotation.y = Math.PI / 6;
        scene.add(track(ringMesh));

        // Animation Loop
        const animate = (time) => {
          sunMesh.rotation.y += 0.005;
          sunMesh.rotation.x += 0.002;
          sunMesh.scale.setScalar(1 + Math.sin(time * 0.002) * 0.05); // Pulsing
          ringMesh.rotation.z -= 0.008; // Increased rotation speed for more 3D feel
          renderer.render(scene, camera);
          animationFrameIds.push(requestAnimationFrame(animate));
        };
        animate(0);

      } else if (condition === 'clear-night') {
        // Glowing Crescent / Moon
        const moonGeo = new THREE.SphereGeometry(1.3, 32, 32);
        const moonMat = new THREE.MeshPhongMaterial({
          color: 0xFFFAF3,
          emissive: 0x2B2420,
          shininess: 30,
          flatShading: true
        });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        // Offset so it looks like a crescent or has cool shadowed angle
        moonMesh.position.set(-0.2, 0, 0);
        scene.add(track(moonMesh));

        // Twinkling stars particles
        const starsGeo = new THREE.BufferGeometry();
        const starsCount = 40;
        const starPositions = new Float32Array(starsCount * 3);
        for (let i = 0; i < starsCount * 3; i += 3) {
          starPositions[i] = (Math.random() - 0.5) * 8;
          starPositions[i+1] = (Math.random() - 0.5) * 4;
          starPositions[i+2] = (Math.random() - 0.5) * 4 - 2;
        }
        starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starsMat = new THREE.PointsMaterial({
          color: 0xFFFAF3,
          size: 0.08,
          transparent: true,
          opacity: 0.8
        });
        const starPoints = new THREE.Points(starsGeo, starsMat);
        scene.add(track(starPoints));

        const animate = (time) => {
          moonMesh.rotation.y += 0.003;
          
          // Twinkle opacity oscillation
          starsMat.opacity = 0.4 + Math.sin(time * 0.004) * 0.4;
          
          renderer.render(scene, camera);
          animationFrameIds.push(requestAnimationFrame(animate));
        };
        animate(0);

      } else if (condition === 'cloudy' || condition === 'fog') {
        // Volumetric drifting clumpy clouds
        const cloudGroup = new THREE.Group();
        const cloudCount = 4;
        const cloudMat = new THREE.MeshLambertMaterial({
          color: condition === 'fog' ? 0xF3DDBF : 0xFDF6EE,
          transparent: true,
          opacity: condition === 'fog' ? 0.6 : 0.95,
          flatShading: true
        });

        for (let i = 0; i < cloudCount; i++) {
          const sphereGeo = new THREE.SphereGeometry(0.8 + Math.random() * 0.4, 8, 8);
          const sphere = new THREE.Mesh(sphereGeo, cloudMat);
          sphere.position.set(
            (i - cloudCount / 2) * 0.9,
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.3
          );
          cloudGroup.add(track(sphere));
        }
        scene.add(cloudGroup);

        const animate = (time) => {
          // Slow floating and rotating
          cloudGroup.position.y = Math.sin(time * 0.0015) * 0.15;
          cloudGroup.rotation.y = Math.sin(time * 0.0005) * 0.1;
          
          // Floating individual puffs slightly
          cloudGroup.children.forEach((puff, idx) => {
            puff.position.y += Math.sin(time * 0.002 + idx) * 0.002;
          });
          
          renderer.render(scene, camera);
          animationFrameIds.push(requestAnimationFrame(animate));
        };
        animate(0);

      } else if (condition === 'rain' || condition === 'storm') {
        // Dark clouds with falling rain particles
        const cloudGroup = new THREE.Group();
        const cloudMat = new THREE.MeshLambertMaterial({
          color: 0x9A8A7A, // warm taupe
          flatShading: true
        });

        for (let i = 0; i < 3; i++) {
          const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), cloudMat);
          sphere.position.set((i - 1) * 0.8, 0.8, 0);
          cloudGroup.add(track(sphere));
        }
        scene.add(cloudGroup);

        // Rain Particles
        const rainCount = 80;
        const rainGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(rainCount * 3);
        const velocities = new Float32Array(rainCount);

        for (let i = 0; i < rainCount * 3; i += 3) {
          positions[i] = (Math.random() - 0.5) * 4; // x
          positions[i+1] = Math.random() * 2 - 1.5; // y (between -1.5 and 0.5)
          positions[i+2] = (Math.random() - 0.5) * 2; // z
          velocities[i/3] = 0.08 + Math.random() * 0.08;
        }

        rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const rainMat = new THREE.PointsMaterial({
          color: 0xA8978A,
          size: 0.06,
          transparent: true,
          opacity: 0.8
        });
        const rainPoints = new THREE.Points(rainGeo, rainMat);
        scene.add(track(rainPoints));

        const animate = (time) => {
          // Cloud drift
          cloudGroup.position.x = Math.sin(time * 0.001) * 0.15;
          
          // Update rain particle positions
          const positionsArr = rainGeo.attributes.position.array;
          for (let i = 0; i < rainCount; i++) {
            positionsArr[i * 3 + 1] -= velocities[i]; // move down
            // Reset to top
            if (positionsArr[i * 3 + 1] < -2.0) {
              positionsArr[i * 3 + 1] = 0.8;
              positionsArr[i * 3] = (Math.random() - 0.5) * 4;
            }
          }
          rainGeo.attributes.position.needsUpdate = true;

          // Storm lightning flash simulation
          if (condition === 'storm' && Math.random() > 0.985) {
            ambientLight.intensity = 2.5;
            setTimeout(() => {
              ambientLight.intensity = 0.7;
            }, 50 + Math.random() * 150);
          }

          renderer.render(scene, camera);
          animationFrameIds.push(requestAnimationFrame(animate));
        };
        animate(0);

      } else if (condition === 'snow') {
        // Clouds with floating snowflake particles
        const cloudGroup = new THREE.Group();
        const cloudMat = new THREE.MeshLambertMaterial({
          color: 0xFFFAF3,
          flatShading: true
        });

        for (let i = 0; i < 3; i++) {
          const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), cloudMat);
          sphere.position.set((i - 1) * 0.7, 0.8, 0);
          cloudGroup.add(track(sphere));
        }
        scene.add(cloudGroup);

        // Snow particles
        const snowCount = 60;
        const snowGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(snowCount * 3);
        const angles = new Float32Array(snowCount);

        for (let i = 0; i < snowCount * 3; i += 3) {
          positions[i] = (Math.random() - 0.5) * 4; // x
          positions[i+1] = Math.random() * 2 - 1.5; // y
          positions[i+2] = (Math.random() - 0.5) * 2; // z
          angles[i/3] = Math.random() * Math.PI * 2;
        }

        snowGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const snowMat = new THREE.PointsMaterial({
          color: 0xFFFAF3,
          size: 0.08,
          transparent: true,
          opacity: 0.9
        });
        const snowPoints = new THREE.Points(snowGeo, snowMat);
        scene.add(track(snowPoints));

        const animate = (time) => {
          cloudGroup.position.x = Math.sin(time * 0.0008) * 0.1;
          
          const positionsArr = snowGeo.attributes.position.array;
          for (let i = 0; i < snowCount; i++) {
            positionsArr[i * 3 + 1] -= 0.015; // slow drop
            // drift left/right
            angles[i] += 0.02;
            positionsArr[i * 3] += Math.sin(angles[i]) * 0.005;

            // Reset
            if (positionsArr[i * 3 + 1] < -2.0) {
              positionsArr[i * 3 + 1] = 0.8;
              positionsArr[i * 3] = (Math.random() - 0.5) * 4;
            }
          }
          snowGeo.attributes.position.needsUpdate = true;

          renderer.render(scene, camera);
          animationFrameIds.push(requestAnimationFrame(animate));
        };
        animate(0);
      }

    } else if (type === 'wind-flow') {
      camera.position.z = 6;
      
      // Wind flow vector simulation
      // We create floating streak lines
      const lineCount = 20;
      const lines = [];
      const speedFactor = Math.max(2, value) / 10; // Speed dynamic
      const radAngle = (angle * Math.PI) / 180; // convert angle to radians

      // Create lines
      for (let i = 0; i < lineCount; i++) {
        const length = 0.8 + Math.random() * 1.2;
        const lineGeo = new THREE.BufferGeometry();
        const pts = new Float32Array([
          -length / 2, 0, 0,
          length / 2, 0, 0
        ]);
        lineGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3));

        // Muted white/accent glow
        const lineMat = new THREE.LineBasicMaterial({
          color: 0xF0731E,
          transparent: true,
          opacity: 0.15 + Math.random() * 0.4,
          linewidth: 2
        });
        const line = new THREE.Line(lineGeo, lineMat);
        
        // Random starting positions
        line.position.set(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 3.5,
          (Math.random() - 0.5) * 2
        );
        // Rotate matching angle
        line.rotation.z = radAngle;
        
        scene.add(track(line));
        lines.push({
          mesh: line,
          speed: (0.02 + Math.random() * 0.03) * speedFactor,
          length
        });
      }

      const animate = () => {
        // Move lines along their rotation vectors
        lines.forEach(l => {
          const moveX = Math.cos(l.mesh.rotation.z) * l.speed;
          const moveY = Math.sin(l.mesh.rotation.z) * l.speed;
          
          l.mesh.position.x += moveX;
          l.mesh.position.y += moveY;

          // Wrap boundaries
          if (l.mesh.position.x > 4.5) {
            l.mesh.position.x = -4.5;
            l.mesh.position.y = (Math.random() - 0.5) * 3.5;
          } else if (l.mesh.position.x < -4.5) {
            l.mesh.position.x = 4.5;
            l.mesh.position.y = (Math.random() - 0.5) * 3.5;
          }
          if (l.mesh.position.y > 3) {
            l.mesh.position.y = -3;
            l.mesh.position.x = (Math.random() - 0.5) * 6;
          } else if (l.mesh.position.y < -3) {
            l.mesh.position.y = 3;
            l.mesh.position.x = (Math.random() - 0.5) * 6;
          }
        });

        renderer.render(scene, camera);
        animationFrameIds.push(requestAnimationFrame(animate));
      };
      animate();

    } else if (type === 'solar-arc') {
      camera.position.z = 6.5;

      // Draw wireframe path (solar arc)
      const curve = new THREE.EllipseCurve(
        0, -1.0,            // ax, ay (center of ellipse)
        2.5, 2.0,           // xRadius, yRadius
        0, Math.PI,         // aStartAngle, aEndAngle (half circle)
        false,              // aClockwise
        0                   // aRotation
      );

      const points = curve.getPoints(50);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineDashedMaterial({
        color: 0x9A8A7A,
        dashSize: 0.1,
        gapSize: 0.1,
        transparent: true,
        opacity: 0.4
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      arcLine.computeLineDistances(); // Needed for dashed lines
      scene.add(track(arcLine));

      // Current Sun position orb
      const sunGeo = new THREE.SphereGeometry(0.25, 16, 16);
      const sunMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
      const sunOrb = new THREE.Mesh(sunGeo, sunMat);
      scene.add(track(sunOrb));

      // Calculate position based on value (0 to 1 representing sunrise to sunset progress)
      const progress = Math.min(Math.max(value, 0), 1);
      const sunPoint = curve.getPointAt(progress);
      sunOrb.position.set(sunPoint.x, sunPoint.y, 0);

      // Simple rotation of orb for shine effect
      const animate = (time) => {
        sunOrb.scale.setScalar(1 + Math.sin(time * 0.005) * 0.08);
        renderer.render(scene, camera);
        animationFrameIds.push(requestAnimationFrame(animate));
      };
      animate(0);

    } else if (type === 'uv-index' || type === 'generic-orb') {
      camera.position.z = 5.5;

      // Abstract glowing wireframe orb
      const geom = new THREE.IcosahedronGeometry(1.6, 1);
      const mat = new THREE.MeshPhongMaterial({
        color: 0xF0731E,
        wireframe: true,
        wireframeLinewidth: 2,
        transparent: true,
        opacity: 0.8
      });
      const orb = new THREE.Mesh(geom, mat);
      scene.add(track(orb));

      // Inner solid core
      const coreGeom = new THREE.SphereGeometry(0.7, 16, 16);
      const coreMat = new THREE.MeshPhongMaterial({
        color: 0xF0731E,
        emissive: 0xF0731E,
        shininess: 50,
        transparent: true,
        opacity: 0.3
      });
      const core = new THREE.Mesh(coreGeom, coreMat);
      scene.add(track(core));

      // Update color based on UV value (low is green, high is red/purple)
      let orbColor = 0x10b981; // Low
      if (value > 2 && value <= 5) orbColor = 0xeab308; // Mod
      else if (value > 5 && value <= 7) orbColor = 0xf97316; // High
      else if (value > 7) orbColor = 0xef4444; // Very high / purple
      
      mat.color.setHex(orbColor);
      coreMat.color.setHex(orbColor);
      coreMat.emissive.setHex(orbColor);

      const rotateSpeed = 0.002 + (value * 0.001);

      const animate = (time) => {
        orb.rotation.y += rotateSpeed;
        orb.rotation.x += rotateSpeed * 0.5;
        
        // Inner core breathing
        core.scale.setScalar(1 + Math.sin(time * 0.003) * 0.1);
        
        renderer.render(scene, camera);
        animationFrameIds.push(requestAnimationFrame(animate));
      };
      animate(0);
    }

    // 4. Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 150;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 5. Cleanup Resources on Unmount/Re-run
    return () => {
      window.removeEventListener('resize', handleResize);
      animationFrameIds.forEach(cancelAnimationFrame);
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      objectsToCleanup.forEach(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, [type, condition, value, angle]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[120px] max-h-[400px] overflow-hidden flex items-center justify-center pointer-events-none" 
    />
  );
};
