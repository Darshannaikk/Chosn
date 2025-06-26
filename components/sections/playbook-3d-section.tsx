"use client";

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Html, ContactShadows, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Code2, Briefcase } from 'lucide-react';
import Link from 'next/link';

function Book({ position, rotation, color, title, content, isRecruiter, onClick, isOpen, ...props }) {
  const group = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Animate the book rotation and position
  useFrame((state) => {
    if (!group.current) return;
    
    // Hover animation
    if (hovered && !isOpen) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + rotation[1];
      group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
    
    // Open animation
    if (isOpen) {
      group.current.rotation.y = rotation[1] + Math.PI * 0.25;
      group.current.position.x = position[0] + (isRecruiter ? -0.5 : 0.5);
      group.current.position.z = position[2] + 0.5;
    } else {
      group.current.rotation.y = rotation[1];
      group.current.position.x = position[0];
      group.current.position.z = position[2];
    }
  });

  return (
    <group 
      ref={group} 
      position={position} 
      rotation={rotation} 
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      {...props}
    >
      {/* Book cover */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Book spine */}
      <mesh position={[-0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.05, 1.5, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Book title */}
      <Text 
        position={[0, 0, 0.06]}
        fontSize={0.1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.8}
        textAlign="center"
      >
        {title}
      </Text>

      {/* Book content when open */}
      {isOpen && (
        <Html
          position={[0.6, 0, 0]}
          rotation={[0, -Math.PI * 0.5, 0]}
          transform
          occlude
          distanceFactor={1.5}
        >
          <div className="w-64 h-72 bg-white rounded-lg p-4 shadow-lg">
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <div className="text-sm overflow-y-auto h-[200px]">
              {content}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export function Playbook3DSection() {
  const [activeBook, setActiveBook] = useState(null);

  const recruiterContent = (
    <div className="space-y-3">
      <h4 className="font-semibold">For Recruiters:</h4>
      <ul className="space-y-2">
        <li className="flex items-start space-x-2">
          <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
          <span>Find pre-verified developers with validated GitHub skills</span>
        </li>
        <li className="flex items-start space-x-2">
          <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
          <span>Browse detailed developer profiles with real projects</span>
        </li>
        <li className="flex items-start space-x-2">
          <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
          <span>Set up job alerts for specific skill sets</span>
        </li>
        <li className="flex items-start space-x-2">
          <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
          <span>Direct message qualified candidates</span>
        </li>
        <li className="flex items-start space-x-2">
          <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
          <span>Track hiring progress with analytics</span>
        </li>
      </ul>
      <Button className="w-full mt-2" size="sm" asChild>
        <Link href="/companies">
          <Briefcase className="w-4 h-4 mr-2" />
          Join as Recruiter
        </Link>
      </Button>
    </div>
  );

  const developerContent = (
    <div className="space-y-3">
      <h4 className="font-semibold">For Developers:</h4>
      <ul className="space-y-2">
        <li className="flex items-start space-x-2">
          <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
          <span>Connect GitHub to automatically validate your skills</span>
        </li>
        <li className="flex items-start space-x-2">
          <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
          <span>Create a compelling profile that showcases your abilities</span>
        </li>
        <li className="flex items-start space-x-2">
          <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
          <span>Get discovered by top companies</span>
        </li>
        <li className="flex items-start space-x-2">
          <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
          <span>Receive job offers that match your skills</span>
        </li>
        <li className="flex items-start space-x-2">
          <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
          <span>Skip traditional job applications</span>
        </li>
      </ul>
      <Button className="w-full mt-2" size="sm" asChild>
        <Link href="/developers">
          <Code2 className="w-4 h-4 mr-2" />
          Join as Developer
        </Link>
      </Button>
    </div>
  );

  return (
    <section className="py-16 relative">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Choose Your Path</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're looking for talent or showcasing your skills, we have a playbook for you.
          </p>
        </div>
        
        <div className="relative h-[500px] w-full">
          <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              intensity={1}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            <Book 
              position={[-1.5, 0, 0]} 
              rotation={[0, Math.PI * 0.1, 0]} 
              color="#5469d4" 
              title="Recruiter Playbook"
              content={recruiterContent}
              isRecruiter={true}
              onClick={() => setActiveBook(activeBook === 'recruiter' ? null : 'recruiter')}
              isOpen={activeBook === 'recruiter'}
            />
            
            <Book 
              position={[1.5, 0, 0]} 
              rotation={[0, -Math.PI * 0.1, 0]} 
              color="#10b981" 
              title="Developer Playbook"
              content={developerContent}
              isRecruiter={false}
              onClick={() => setActiveBook(activeBook === 'developer' ? null : 'developer')}
              isOpen={activeBook === 'developer'}
            />
            
            <ContactShadows position={[0, -1.5, 0]} opacity={0.75} scale={10} blur={1} far={4} />
            <Environment preset="city" />
          </Canvas>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Button 
              size="lg" 
              className="bg-[#5469d4] hover:bg-[#4a5fc4]"
              onClick={() => setActiveBook('recruiter')}
            >
              <Briefcase className="w-5 h-5 mr-2" />
              For Recruiters
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <Button 
              size="lg" 
              className="bg-[#10b981] hover:bg-[#0ea271]"
              onClick={() => setActiveBook('developer')}
            >
              <Code2 className="w-5 h-5 mr-2" />
              For Developers
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}