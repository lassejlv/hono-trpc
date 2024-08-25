import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Code, Database, Zap, Server, Globe, Layout, Palette, FileCode, Boxes } from 'lucide-react';

function Index() {
  const githubRepo = 'https://github.com/lassejlv/hono-trpc';
  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <header className='px-4 lg:px-6 h-14 flex items-center'>
          <Link className='flex items-center justify-center' to='#'>
            <Zap className='h-6 w-6' />
            <span className='sr-only'>Full Stack Website</span>
          </Link>
          <nav className='ml-auto flex gap-4 sm:gap-6'>
            <Link className='text-sm font-medium hover:underline underline-offset-4' to='#features'>
              Features
            </Link>
            <Link className='text-sm font-medium hover:underline underline-offset-4' to={githubRepo}>
              Documentation
            </Link>
            <Link className='text-sm font-medium hover:underline underline-offset-4' to={githubRepo}>
              GitHub
            </Link>
          </nav>
        </header>
        <main className='flex-1'>
          <section className='w-full py-12 md:py-24 lg:py-32 xl:py-48'>
            <div className='container px-4 md:px-6'>
              <div className='flex flex-col items-center space-y-4 text-center'>
                <div className='space-y-2'>
                  <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none'>Modern Full Stack Development</h1>
                  <p className='mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400'>
                    Hono, tRPC, React, TypeScript, Tailwind CSS, Turso, and Drizzle. Build scalable, type-safe applications with ease.
                  </p>
                </div>
                <div className='space-x-4'>
                  <Button>
                    <Link to={'/login'} className='items-center'>
                      Get Started
                      <ArrowRight className='inline ml-2 h-4 w-4' />
                    </Link>
                  </Button>
                  <Button variant='outline'>
                    <Link to={'/login'}>Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section className='w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800'>
            <div className='container px-4 md:px-6'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12'>Our Tech Stack</h2>
              <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12' id='features'>
                <Card>
                  <CardHeader>
                    <Server className='h-14 w-14 mb-4 text-primary' />
                    <CardTitle>Hono</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-gray-500 dark:text-gray-400'>Ultra-fast web framework for the Edges. Simple, lightweight, and flexible.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Code className='h-14 w-14 mb-4 text-primary' />
                    <CardTitle>tRPC</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-gray-500 dark:text-gray-400'>
                      End-to-end typesafe APIs made easy. Automatic type inference for your entire API.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Layout className='h-14 w-14 mb-4 text-primary' />
                    <CardTitle>React</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-gray-500 dark:text-gray-400'>A JavaScript library for building user interfaces with reusable components.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <FileCode className='h-14 w-14 mb-4 text-primary' />
                    <CardTitle>TypeScript</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-gray-500 dark:text-gray-400'>
                      Strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Palette className='h-14 w-14 mb-4 text-primary' />
                    <CardTitle>Tailwind CSS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-gray-500 dark:text-gray-400'>
                      A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Database className='h-14 w-14 mb-4 text-primary' />
                    <CardTitle>Turso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-gray-500 dark:text-gray-400'>
                      Distributed database built on libSQL, offering scalable and efficient data storage solutions.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Boxes className='h-14 w-14 mb-4 text-primary' />
                    <CardTitle>Drizzle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-gray-500 dark:text-gray-400'>
                      TypeScript ORM for SQL databases, providing a type-safe and intuitive way to interact with your data.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Globe className='h-14 w-14 mb-4 text-primary' />
                    <CardTitle>File-based Routing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-gray-500 dark:text-gray-400'>
                      Intuitive and efficient routing system based on your file structure, simplifying navigation in your app.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          <section className='w-full py-12 md:py-24 lg:py-32'>
            <div className='container px-4 md:px-6'>
              <div className='flex flex-col items-center justify-center space-y-4 text-center'>
                <div className='space-y-2'>
                  <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>Ready to Get Started?</h2>
                  <p className='mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400'>
                    Join the growing community of developers using our full-stack solution to build amazing applications.
                  </p>
                </div>
                <div className='w-full max-w-sm space-y-2'>
                  <Button className='w-full'>
                    Start Building
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className='flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t'>
          <p className='text-xs text-gray-500 dark:text-gray-400'>© 2024 Hono x TRPC. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}

export default Index;
