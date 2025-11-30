'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function AuthPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = () => {
    if (name && email) {
      dispatch(login({ name, email }));
      router.push('/');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-2">
      <div className="absolute inset-0 z-[-1]">
        <Image
          src="https://images.pexels.com/photos/1004584/pexels-photo-1004584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Background"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black opacity-50" />
      </div>
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Your Journey Begins Here
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            Sign in to access your flight bookings and more.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/20 border-gray-600 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/20 border-gray-600 focus:ring-blue-500"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
          >
            Embark
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
